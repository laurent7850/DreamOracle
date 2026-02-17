import jsPDF from "jspdf";

// ─── Theme colors (RGB) ─────────────────────────────────────
const NIGHT = [15, 14, 30] as const;
const DEEP_PURPLE = [25, 23, 55] as const;
const GOLD = [212, 175, 55] as const;
const INDIGO = [99, 102, 241] as const;
const LUNAR = [232, 228, 240] as const;
const MYSTIC_300 = [180, 175, 200] as const;
const MYSTIC_500 = [120, 115, 140] as const;
const MYSTIC_700 = [60, 56, 80] as const;
const RED = [239, 68, 68] as const;
const BLUE = [59, 130, 246] as const;
const AMBER = [245, 158, 11] as const;

type RGB = readonly [number, number, number];

interface DreamData {
  title: string;
  content: string;
  dreamDate: string | Date;
  emotions: string;
  symbols: string;
  lucidity: number;
  interpretation: string | null;
  tags: string;
  isRecurring: boolean;
  mood: string | null;
  sleepQuality: number | null;
}

interface SymbolData {
  name: string;
  meaning: string;
  personalNote: string | null;
  occurrences: number;
}

interface BackupData {
  user: { name: string | null; email: string | null; createdAt: string | Date };
  dreams: DreamData[];
  symbols: SymbolData[];
  settings?: Record<string, unknown> | null;
  stats: { totalDreams: number; totalSymbols: number };
}

// ─── Helper: safe JSON parse ─────────────────────────────────
function safeParseArray(str: string): string[] {
  try {
    const parsed = JSON.parse(str || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─── Helper: sanitize text for jsPDF (Latin-1 only) ─────────
// Strips emojis and characters outside Latin-1, replaces bullets
function sanitizeForPDF(text: string): string {
  return text
    // Remove emoji and symbols outside Latin-1 (U+0100+)
    // This regex matches surrogate pairs (4-byte emoji) and chars > U+00FF
    .replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{2B50}-\u{2BFF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[\u{2702}-\u{27B0}]|[\u{200D}]|[\u{20E3}]|[\u{FE0F}]/gu, "")
    // Replace bullet character with dash
    .replace(/\u2022/g, "-")
    // Replace en-dash, em-dash with simple dash
    .replace(/[\u2013\u2014]/g, "-")
    // Replace smart quotes with simple quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    // Replace ellipsis character
    .replace(/\u2026/g, "...")
    // Remove any remaining non-Latin-1 characters (keep U+0000-U+00FF)
    .replace(/[^\u0000-\u00FF]/g, "")
    // Clean up multiple spaces left by removed emojis
    .replace(/  +/g, " ")
    .trim();
}

// ─── Interpretation section types ───────────────────────────
interface InterpSection {
  icon: "sparkle" | "moon" | "star" | "crystal" | "shine";
  title: string;
  content: string;
}

// Parse stored interpretation text into structured sections
function parseInterpretation(text: string): InterpSection[] {
  const sections: InterpSection[] = [];

  // Split by emoji markers using Unicode code points (robust across encodings)
  // ✨ = U+2728, 🌙 = U+1F319, 💫 = U+1F4AB, 🔮 = U+1F52E, 🌟 = U+1F31F
  const emojiSplitRegex = /(?:\u2728|\u{1F319}|\u{1F4AB}|\u{1F52E}|\u{1F31F})\s*/gu;
  const rawSections = text.split(emojiSplitRegex);

  const iconMap: Array<InterpSection["icon"]> = ["sparkle", "moon", "star", "crystal", "shine"];

  let iconIdx = 0;
  for (const raw of rawSections) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Extract **Title** from beginning
    const titleMatch = trimmed.match(/^\*\*([^*]+)\*\*\s*\n?([\s\S]*)/);
    if (titleMatch) {
      const title = sanitizeForPDF(titleMatch[1]);
      let content = titleMatch[2].trim();
      // Remove ** from inline bold in content
      content = content.replace(/\*\*([^*]+)\*\*/g, "$1");
      content = sanitizeForPDF(content);

      sections.push({
        icon: iconMap[iconIdx % iconMap.length],
        title,
        content,
      });
      iconIdx++;
    } else {
      // No title found, just content
      let content = trimmed.replace(/\*\*([^*]+)\*\*/g, "$1");
      content = sanitizeForPDF(content);
      if (content) {
        sections.push({
          icon: iconMap[iconIdx % iconMap.length],
          title: "",
          content,
        });
        iconIdx++;
      }
    }
  }

  return sections;
}

// ─── Helper: format date (ASCII-safe) ────────────────────────
function formatDate(d: string | Date): string {
  const date = new Date(d);
  const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const months = [
    "janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin",
    "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatShortDate(d: string | Date): string {
  const date = new Date(d);
  const months = [
    "jan.", "f\u00e9v.", "mars", "avr.", "mai", "juin",
    "juil.", "ao\u00fbt", "sept.", "oct.", "nov.", "d\u00e9c.",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ─── PDF Generator ───────────────────────────────────────────
export function generateBackupPDF(data: BackupData): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = 210;
  const pageH = 297;
  const marginL = 18;
  const marginR = 18;
  const contentW = pageW - marginL - marginR;
  let y = 0;

  // ─── Utility functions ──────────────────────────────────────
  function setColor(rgb: RGB) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }

  function setDrawColor(rgb: RGB) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  }

  function setFillColor(rgb: RGB) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  }

  function fillPage() {
    setFillColor(NIGHT);
    doc.rect(0, 0, pageW, pageH, "F");
  }

  function newPage() {
    addFooter();
    doc.addPage();
    fillPage();
    y = 18;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > pageH - 20) {
      newPage();
    }
  }

  function addFooter() {
    setColor(MYSTIC_700);
    doc.setFontSize(7);
    doc.text(
      `DreamOracle - Sauvegarde du ${formatShortDate(new Date())}`,
      pageW / 2,
      pageH - 8,
      { align: "center" }
    );
    doc.text(
      `Page ${doc.getNumberOfPages()}`,
      pageW - marginR,
      pageH - 8,
      { align: "right" }
    );
  }

  // Write wrapped text line by line, handling page breaks correctly.
  // Returns the final y position (not delta) so the caller can track it.
  function wrappedText(
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    fontSize: number,
    color: RGB,
    lineHeight: number = 1.4
  ): number {
    doc.setFontSize(fontSize);
    setColor(color);
    const lines: string[] = doc.splitTextToSize(text, maxWidth);
    const lineSpacing = fontSize * 0.353 * lineHeight;
    let curY = startY;

    for (const line of lines) {
      if (curY + lineSpacing > pageH - 20) {
        newPage();
        curY = y;
        doc.setFontSize(fontSize);
        setColor(color);
      }
      doc.text(line, x, curY);
      curY += lineSpacing;
    }

    return curY;
  }

  // Draw a rounded rect card
  function drawCard(x: number, cardY: number, w: number, h: number) {
    setFillColor(DEEP_PURPLE);
    setDrawColor(MYSTIC_700);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cardY, w, h, 3, 3, "FD");
  }

  // Draw a pill/badge (ASCII-safe text only)
  function drawBadge(text: string, x: number, badgeY: number, color: RGB): number {
    doc.setFontSize(7);
    const textWidth = doc.getTextWidth(text);
    const padX = 3;
    const padY = 1.5;
    const w = textWidth + padX * 2;
    const h = 4.5;

    setFillColor([color[0], color[1], color[2]]);
    doc.roundedRect(x, badgeY - h + padY, w, h, 1.5, 1.5, "F");
    doc.setTextColor(15, 14, 30);
    doc.text(text, x + padX, badgeY);

    return w + 2;
  }

  // Draw a small decorative circle (replaces unicode symbols)
  function drawCircle(cx: number, cy: number, r: number, color: RGB, filled = true) {
    if (filled) {
      setFillColor(color);
      doc.circle(cx, cy, r, "F");
    } else {
      setDrawColor(color);
      doc.setLineWidth(0.3);
      doc.circle(cx, cy, r, "S");
    }
  }

  // ─── Cover page ─────────────────────────────────────────────
  fillPage();

  // Decorative top gradient bar
  for (let i = 0; i < 6; i++) {
    const alpha = 1 - i / 6;
    doc.setFillColor(
      Math.round(GOLD[0] * alpha + NIGHT[0] * (1 - alpha)),
      Math.round(GOLD[1] * alpha + NIGHT[1] * (1 - alpha)),
      Math.round(GOLD[2] * alpha + NIGHT[2] * (1 - alpha))
    );
    doc.rect(0, i * 1.5, pageW, 1.5, "F");
  }

  // Moon symbol — draw a crescent with circles instead of unicode
  y = 65;
  setFillColor(GOLD);
  doc.circle(pageW / 2, y, 12, "F");
  setFillColor(NIGHT);
  doc.circle(pageW / 2 + 6, y - 2, 11, "F");

  // Title
  y += 25;
  doc.setFontSize(32);
  setColor(LUNAR);
  doc.text("DreamOracle", pageW / 2, y, { align: "center" });

  // Subtitle
  y += 12;
  doc.setFontSize(14);
  setColor(GOLD);
  doc.text("Journal de R\u00eaves", pageW / 2, y, { align: "center" });

  // Decorative line
  y += 10;
  setDrawColor(GOLD);
  doc.setLineWidth(0.5);
  doc.line(pageW / 2 - 30, y, pageW / 2 + 30, y);

  // User info
  y += 15;
  doc.setFontSize(11);
  setColor(MYSTIC_300);
  if (data.user.name) {
    doc.text(sanitizeForPDF(data.user.name), pageW / 2, y, { align: "center" });
    y += 6;
  }
  if (data.user.email) {
    doc.setFontSize(9);
    setColor(MYSTIC_500);
    doc.text(data.user.email, pageW / 2, y, { align: "center" });
    y += 6;
  }

  // Export date
  y += 8;
  doc.setFontSize(9);
  setColor(MYSTIC_500);
  doc.text(
    `Sauvegarde du ${formatDate(new Date())}`,
    pageW / 2, y,
    { align: "center" }
  );

  // Stats boxes
  y += 20;
  const statBoxW = 50;
  const statBoxH = 22;
  const statsStartX = pageW / 2 - (statBoxW * 2 + 10) / 2;

  drawCard(statsStartX, y, statBoxW, statBoxH);
  doc.setFontSize(18);
  setColor(GOLD);
  doc.text(String(data.stats.totalDreams), statsStartX + statBoxW / 2, y + 11, { align: "center" });
  doc.setFontSize(8);
  setColor(MYSTIC_300);
  doc.text("R\u00eaves", statsStartX + statBoxW / 2, y + 17, { align: "center" });

  const symBoxX = statsStartX + statBoxW + 10;
  drawCard(symBoxX, y, statBoxW, statBoxH);
  doc.setFontSize(18);
  setColor(INDIGO);
  doc.text(String(data.stats.totalSymbols), symBoxX + statBoxW / 2, y + 11, { align: "center" });
  doc.setFontSize(8);
  setColor(MYSTIC_300);
  doc.text("Symboles", symBoxX + statBoxW / 2, y + 17, { align: "center" });

  // Member since
  y += 38;
  doc.setFontSize(8);
  setColor(MYSTIC_500);
  doc.text(
    `Membre depuis le ${formatShortDate(data.user.createdAt)}`,
    pageW / 2, y,
    { align: "center" }
  );

  addFooter();

  // ─── Dreams section ─────────────────────────────────────────
  if (data.dreams.length > 0) {
    doc.addPage();
    fillPage();
    y = 20;

    // Section header with drawn crescent
    setFillColor(GOLD);
    doc.circle(marginL + 5, y - 2.5, 3, "F");
    setFillColor(NIGHT);
    doc.circle(marginL + 6.5, y - 3.5, 2.8, "F");

    doc.setFontSize(18);
    setColor(GOLD);
    doc.text("Journal de R\u00eaves", marginL + 14, y);
    y += 3;
    setDrawColor(GOLD);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, marginL + 65, y);
    y += 10;

    for (let i = 0; i < data.dreams.length; i++) {
      const dream = data.dreams[i];
      const emotions = safeParseArray(dream.emotions);
      const symbols = safeParseArray(dream.symbols);
      const tags = safeParseArray(dream.tags);

      // Estimate minimum height needed for dream header
      checkPageBreak(30);

      // Dream number + date
      y += 6;
      doc.setFontSize(7);
      setColor(MYSTIC_500);
      doc.text(`R\u00eave ${i + 1}/${data.dreams.length}`, marginL + 8, y);
      doc.text(formatDate(dream.dreamDate), pageW - marginR - 8, y, { align: "right" });

      // Title (sanitized)
      y += 7;
      doc.setFontSize(13);
      setColor(LUNAR);
      const titleLines: string[] = doc.splitTextToSize(sanitizeForPDF(dream.title), contentW - 16);
      for (const line of titleLines) {
        checkPageBreak(8);
        doc.setFontSize(13);
        setColor(LUNAR);
        doc.text(line, marginL + 8, y);
        y += 5.5;
      }

      // Badges (lucidity, recurring, mood, sleep) — ASCII-safe
      y += 1;
      let badgeX = marginL + 8;

      if (dream.lucidity > 0) {
        const lucText = `Lucidit\u00e9 ${dream.lucidity}/5`;
        badgeX += drawBadge(lucText, badgeX, y, INDIGO);
      }
      if (dream.isRecurring) {
        badgeX += drawBadge("R\u00e9current", badgeX, y, AMBER);
      }
      if (dream.mood) {
        badgeX += drawBadge(sanitizeForPDF(dream.mood), badgeX, y, MYSTIC_300);
      }
      if (dream.sleepQuality) {
        const sqText = `Sommeil ${dream.sleepQuality}/5`;
        drawBadge(sqText, badgeX, y, BLUE);
      }

      y += 5;

      // Separator line
      setDrawColor(MYSTIC_700);
      doc.setLineWidth(0.15);
      doc.line(marginL + 8, y, pageW - marginR - 8, y);
      y += 4;

      // Dream content (sanitized for Latin-1)
      y = wrappedText(
        sanitizeForPDF(dream.content),
        marginL + 8,
        y,
        contentW - 16,
        9,
        MYSTIC_300,
        1.5
      );
      y += 3;

      // Interpretation — parsed into styled sections
      if (dream.interpretation) {
        checkPageBreak(15);

        const interpStartY = y;
        y += 5;

        // Interpretation header
        drawCircle(marginL + 11, y - 1.2, 1.2, INDIGO);
        doc.setFontSize(8);
        setColor(INDIGO);
        doc.text("Interpr\u00e9tation Oracle", marginL + 15, y);
        y += 6;

        const sections = parseInterpretation(dream.interpretation);
        const sectionColors: Record<InterpSection["icon"], RGB> = {
          sparkle: GOLD,
          moon: BLUE,
          star: INDIGO,
          crystal: AMBER,
          shine: GOLD,
        };

        if (sections.length > 0) {
          for (const section of sections) {
            checkPageBreak(12);

            // Section icon (small colored circle)
            const sColor = sectionColors[section.icon];
            drawCircle(marginL + 14, y - 1, 0.8, sColor);

            // Section title (bold-like, larger)
            if (section.title) {
              doc.setFontSize(8);
              setColor(sColor);
              doc.text(section.title, marginL + 18, y);
              y += 4;
            }

            // Section content
            if (section.content) {
              // Handle bullet lines
              const lines = section.content.split("\n");
              for (const line of lines) {
                const trimLine = line.trim();
                if (!trimLine) continue;

                checkPageBreak(6);

                if (trimLine.startsWith("- ")) {
                  // Bullet item: draw small dot + text
                  drawCircle(marginL + 16, y - 0.8, 0.5, MYSTIC_500);
                  y = wrappedText(
                    trimLine.substring(2),
                    marginL + 19,
                    y,
                    contentW - 34,
                    8,
                    LUNAR,
                    1.3
                  );
                  y += 1;
                } else {
                  y = wrappedText(
                    trimLine,
                    marginL + 15,
                    y,
                    contentW - 28,
                    8,
                    LUNAR,
                    1.3
                  );
                  y += 1;
                }
              }
              y += 2;
            }
          }
        } else {
          // Fallback: no sections parsed, render sanitized raw text
          const cleanText = sanitizeForPDF(
            dream.interpretation.replace(/\*\*([^*]+)\*\*/g, "$1")
          );
          y = wrappedText(
            cleanText,
            marginL + 15,
            y,
            contentW - 28,
            8.5,
            LUNAR,
            1.4
          );
          y += 3;
        }

        // Left accent bar spanning the entire interpretation block
        setFillColor(INDIGO);
        doc.rect(marginL + 8, interpStartY, 1.5, y - interpStartY, "F");
      }

      // Emotions / Symbols / Tags
      if (emotions.length > 0 || symbols.length > 0 || tags.length > 0) {
        checkPageBreak(10);
        y += 2;

        if (emotions.length > 0) {
          doc.setFontSize(7.5);
          drawCircle(marginL + 9.5, y - 1, 1, RED);
          setColor(MYSTIC_300);
          doc.text(sanitizeForPDF(emotions.join("  ")), marginL + 14, y);
          y += 5;
        }

        if (symbols.length > 0) {
          doc.setFontSize(7.5);
          drawCircle(marginL + 9.5, y - 1, 1, AMBER);
          setColor(MYSTIC_300);
          const symbolText: string[] = doc.splitTextToSize(sanitizeForPDF(symbols.join("  /  ")), contentW - 20);
          for (const line of symbolText) {
            doc.text(line, marginL + 14, y);
            y += 4;
          }
          y += 1;
        }

        if (tags.length > 0) {
          doc.setFontSize(7.5);
          setColor(MYSTIC_500);
          const tagStr = tags.map((t: string) => `#${sanitizeForPDF(t)}`).join("  ");
          const tagLines: string[] = doc.splitTextToSize(tagStr, contentW - 16);
          for (const line of tagLines) {
            doc.text(line, marginL + 8, y);
            y += 4;
          }
        }
      }

      y += 3;

      // Dashed divider between dreams
      if (i < data.dreams.length - 1) {
        setDrawColor(MYSTIC_700);
        doc.setLineWidth(0.15);
        const lineY = y + 2;
        doc.setLineDashPattern([2, 2], 0);
        doc.line(marginL + 20, lineY, pageW - marginR - 20, lineY);
        doc.setLineDashPattern([], 0);
        y += 8;
      }
    }

    addFooter();
  }

  // ─── Symbols section ────────────────────────────────────────
  if (data.symbols.length > 0) {
    doc.addPage();
    fillPage();
    y = 20;

    // Section header with drawn diamond
    drawCircle(marginL + 5, y - 2.5, 2.5, AMBER);
    doc.setFontSize(18);
    setColor(GOLD);
    doc.text("Dictionnaire de Symboles", marginL + 12, y);
    y += 3;
    setDrawColor(GOLD);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, marginL + 75, y);
    y += 10;

    doc.setFontSize(9);
    setColor(MYSTIC_500);
    doc.text(`${data.symbols.length} symbole${data.symbols.length > 1 ? "s" : ""} personnels`, marginL, y);
    y += 8;

    const sortedSymbols = [...data.symbols].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

    for (const symbol of sortedSymbols) {
      checkPageBreak(18);

      // Symbol name (sanitized)
      doc.setFontSize(11);
      setColor(AMBER);
      doc.text(sanitizeForPDF(symbol.name), marginL + 4, y);

      // Occurrences
      if (symbol.occurrences > 0) {
        doc.setFontSize(7);
        setColor(MYSTIC_500);
        doc.text(
          `${symbol.occurrences}x`,
          pageW - marginR - 4, y,
          { align: "right" }
        );
      }

      y += 5;

      // Meaning (sanitized)
      y = wrappedText(
        sanitizeForPDF(symbol.meaning),
        marginL + 4,
        y,
        contentW - 8,
        8.5,
        MYSTIC_300,
        1.3
      );

      // Personal note (sanitized)
      if (symbol.personalNote) {
        y += 1;
        doc.setFontSize(7.5);
        setColor(MYSTIC_500);
        doc.text("Note :", marginL + 4, y);
        y += 3.5;
        y = wrappedText(
          sanitizeForPDF(symbol.personalNote),
          marginL + 4,
          y,
          contentW - 8,
          7.5,
          MYSTIC_500,
          1.3
        );
      }

      y += 3;

      // Separator
      setDrawColor(MYSTIC_700);
      doc.setLineWidth(0.1);
      doc.line(marginL + 4, y, pageW - marginR - 4, y);
      y += 5;
    }

    addFooter();
  }

  // ─── Final page ─────────────────────────────────────────────
  doc.addPage();
  fillPage();
  y = pageH / 2 - 30;

  // Crescent moon
  setFillColor(GOLD);
  doc.circle(pageW / 2, y, 10, "F");
  setFillColor(NIGHT);
  doc.circle(pageW / 2 + 5, y - 2, 9.5, "F");

  y += 22;
  doc.setFontSize(12);
  setColor(LUNAR);
  doc.text("Fin de la sauvegarde", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(9);
  setColor(MYSTIC_500);
  doc.text(
    `${data.stats.totalDreams} r\u00eaves - ${data.stats.totalSymbols} symboles`,
    pageW / 2, y,
    { align: "center" }
  );
  y += 6;
  doc.text(
    `G\u00e9n\u00e9r\u00e9 le ${formatDate(new Date())}`,
    pageW / 2, y,
    { align: "center" }
  );
  y += 12;

  doc.setFontSize(7);
  setColor(MYSTIC_700);
  doc.text("dreamoracle.eu", pageW / 2, y, { align: "center" });

  addFooter();

  return Buffer.from(doc.output("arraybuffer"));
}
