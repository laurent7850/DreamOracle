import jsPDF from "jspdf";

// ─── Theme colors (RGB) ─────────────────────────────────────
const NIGHT = [15, 14, 30] as const;        // dark background
const DEEP_PURPLE = [25, 23, 55] as const;  // card background
const GOLD = [212, 175, 55] as const;       // accent
const INDIGO = [99, 102, 241] as const;     // links/highlights
const LUNAR = [232, 228, 240] as const;     // main text
const MYSTIC_300 = [180, 175, 200] as const; // secondary text
const MYSTIC_500 = [120, 115, 140] as const; // dim text
const MYSTIC_700 = [60, 56, 80] as const;   // borders
const RED = [239, 68, 68] as const;
const BLUE = [59, 130, 246] as const;
const GREEN = [34, 197, 94] as const;
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

// ─── Helper: format date ─────────────────────────────────────
function formatDate(d: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(d));
}

function formatShortDate(d: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
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

  function checkPageBreak(needed: number) {
    if (y + needed > pageH - 20) {
      addFooter();
      doc.addPage();
      fillPage();
      y = 15;
    }
  }

  function addFooter() {
    setColor(MYSTIC_700);
    doc.setFontSize(7);
    doc.text(
      `DreamOracle — Sauvegarde du ${formatShortDate(new Date())}`,
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

  // Wrapped text that returns actual height used
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
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineSpacing = fontSize * 0.353 * lineHeight; // pt to mm * lineHeight
    let curY = startY;

    for (const line of lines) {
      checkPageBreak(lineSpacing + 2);
      doc.text(line, x, curY);
      curY += lineSpacing;
    }

    return curY - startY;
  }

  // Draw a rounded rect card
  function drawCard(x: number, cardY: number, w: number, h: number) {
    setFillColor(DEEP_PURPLE);
    setDrawColor(MYSTIC_700);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cardY, w, h, 3, 3, "FD");
  }

  // Draw a pill/badge
  function drawBadge(text: string, x: number, badgeY: number, color: RGB): number {
    doc.setFontSize(7);
    const textWidth = doc.getTextWidth(text);
    const padX = 3;
    const padY = 1.5;
    const w = textWidth + padX * 2;
    const h = 4.5;

    setFillColor([color[0], color[1], color[2]]);
    doc.roundedRect(x, badgeY - h + padY, w, h, 1.5, 1.5, "F");
    doc.setTextColor(15, 14, 30); // dark text on badge
    doc.text(text, x + padX, badgeY);

    return w + 2; // return width for next badge position
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

  // Moon symbol
  y = 70;
  setColor(GOLD);
  doc.setFontSize(48);
  doc.text("☽", pageW / 2, y, { align: "center" });

  // Title
  y += 25;
  doc.setFontSize(32);
  setColor(LUNAR);
  doc.text("DreamOracle", pageW / 2, y, { align: "center" });

  // Subtitle
  y += 12;
  doc.setFontSize(14);
  setColor(GOLD);
  doc.text("Journal de Rêves", pageW / 2, y, { align: "center" });

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
    doc.text(data.user.name, pageW / 2, y, { align: "center" });
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
    pageW / 2,
    y,
    { align: "center" }
  );

  // Stats
  y += 20;
  const statBoxW = 50;
  const statBoxH = 22;
  const statsStartX = pageW / 2 - (statBoxW * 2 + 10) / 2;

  // Dreams stat box
  drawCard(statsStartX, y, statBoxW, statBoxH);
  doc.setFontSize(18);
  setColor(GOLD);
  doc.text(String(data.stats.totalDreams), statsStartX + statBoxW / 2, y + 11, { align: "center" });
  doc.setFontSize(8);
  setColor(MYSTIC_300);
  doc.text("Rêves", statsStartX + statBoxW / 2, y + 17, { align: "center" });

  // Symbols stat box
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
    pageW / 2,
    y,
    { align: "center" }
  );

  addFooter();

  // ─── Dreams section ─────────────────────────────────────────
  if (data.dreams.length > 0) {
    doc.addPage();
    fillPage();
    y = 20;

    // Section header
    doc.setFontSize(20);
    setColor(GOLD);
    doc.text("☽  Journal de Rêves", marginL, y);
    y += 3;
    setDrawColor(GOLD);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, marginL + 60, y);
    y += 10;

    for (let i = 0; i < data.dreams.length; i++) {
      const dream = data.dreams[i];
      const emotions = safeParseArray(dream.emotions);
      const symbols = safeParseArray(dream.symbols);
      const tags = safeParseArray(dream.tags);

      // Estimate card height
      doc.setFontSize(9);
      const contentLines = doc.splitTextToSize(dream.content, contentW - 16);
      let estimatedH = 28 + contentLines.length * 3.8;
      if (dream.interpretation) {
        const interpLines = doc.splitTextToSize(dream.interpretation, contentW - 20);
        estimatedH += 12 + interpLines.length * 3.5;
      }
      if (emotions.length > 0) estimatedH += 8;
      if (symbols.length > 0) estimatedH += 8;
      if (tags.length > 0) estimatedH += 8;
      estimatedH += 4; // bottom padding

      // Page break if needed
      if (y + Math.min(estimatedH, 100) > pageH - 25) {
        addFooter();
        doc.addPage();
        fillPage();
        y = 15;
      }

      // Dream card background
      const cardStartY = y;

      // Dream number + date header
      y += 6;
      doc.setFontSize(7);
      setColor(MYSTIC_500);
      doc.text(`Rêve ${i + 1}/${data.dreams.length}`, marginL + 8, y);

      // Date on right
      doc.text(formatDate(dream.dreamDate), pageW - marginR - 8, y, { align: "right" });

      // Title
      y += 7;
      doc.setFontSize(13);
      setColor(LUNAR);
      const titleLines = doc.splitTextToSize(dream.title, contentW - 16);
      for (const line of titleLines) {
        checkPageBreak(8);
        doc.text(line, marginL + 8, y);
        y += 5.5;
      }

      // Lucidity + mood + sleep indicators
      y += 1;
      let badgeX = marginL + 8;

      if (dream.lucidity > 0) {
        const stars = "★".repeat(dream.lucidity) + "☆".repeat(5 - dream.lucidity);
        badgeX += drawBadge(`Lucidité ${stars}`, badgeX, y, INDIGO);
      }
      if (dream.isRecurring) {
        badgeX += drawBadge("↻ Récurrent", badgeX, y, AMBER);
      }
      if (dream.mood) {
        badgeX += drawBadge(dream.mood, badgeX, y, MYSTIC_300);
      }
      if (dream.sleepQuality) {
        const sqText = `Sommeil: ${"●".repeat(dream.sleepQuality)}${"○".repeat(5 - dream.sleepQuality)}`;
        drawBadge(sqText, badgeX, y, BLUE);
      }

      y += 5;

      // Separator
      setDrawColor(MYSTIC_700);
      doc.setLineWidth(0.15);
      doc.line(marginL + 8, y, pageW - marginR - 8, y);
      y += 4;

      // Dream content
      const contentH = wrappedText(
        dream.content,
        marginL + 8,
        y,
        contentW - 16,
        9,
        MYSTIC_300,
        1.5
      );
      y += contentH + 3;

      // Interpretation
      if (dream.interpretation) {
        checkPageBreak(20);

        // Interpretation box
        const interpStartY = y;
        y += 5;
        doc.setFontSize(8);
        setColor(INDIGO);
        doc.text("🔮  Interprétation Oracle", marginL + 12, y);
        y += 4;

        const interpH = wrappedText(
          dream.interpretation,
          marginL + 12,
          y,
          contentW - 24,
          8.5,
          LUNAR,
          1.4
        );
        y += interpH + 3;

        // Left accent line
        doc.setFillColor(INDIGO[0], INDIGO[1], INDIGO[2]);
        doc.rect(marginL + 8, interpStartY, 1.5, y - interpStartY, "F");
      }

      // Tags row
      if (emotions.length > 0 || symbols.length > 0 || tags.length > 0) {
        checkPageBreak(12);
        y += 2;

        if (emotions.length > 0) {
          doc.setFontSize(7.5);
          setColor(RED);
          doc.text("♡", marginL + 8, y);
          setColor(MYSTIC_300);
          doc.text(emotions.join("  "), marginL + 14, y);
          y += 5;
        }

        if (symbols.length > 0) {
          doc.setFontSize(7.5);
          setColor(AMBER);
          doc.text("✦", marginL + 8, y);
          setColor(MYSTIC_300);
          const symbolText = doc.splitTextToSize(symbols.join("  ·  "), contentW - 20);
          for (const line of symbolText) {
            doc.text(line, marginL + 14, y);
            y += 4;
          }
          y += 1;
        }

        if (tags.length > 0) {
          doc.setFontSize(7.5);
          setColor(MYSTIC_500);
          const tagStr = tags.map((t: string) => `#${t}`).join("  ");
          doc.text(tagStr, marginL + 8, y);
          y += 4;
        }
      }

      y += 3;

      // Draw the card background behind everything we just drew
      const cardH = y - cardStartY;
      // We need to draw the card first — use a trick: draw on the page
      // Since jsPDF draws in order, we add a semi-transparent overlay
      // Actually, let's draw dividers between dreams instead
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

    // Section header
    doc.setFontSize(20);
    setColor(GOLD);
    doc.text("✦  Dictionnaire de Symboles", marginL, y);
    y += 3;
    setDrawColor(GOLD);
    doc.setLineWidth(0.4);
    doc.line(marginL, y, marginL + 70, y);
    y += 10;

    doc.setFontSize(9);
    setColor(MYSTIC_500);
    doc.text(`${data.symbols.length} symbole${data.symbols.length > 1 ? "s" : ""} personnels`, marginL, y);
    y += 8;

    // Sort symbols alphabetically
    const sortedSymbols = [...data.symbols].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

    for (const symbol of sortedSymbols) {
      checkPageBreak(20);

      // Symbol name
      doc.setFontSize(11);
      setColor(AMBER);
      doc.text(symbol.name, marginL + 4, y);

      // Occurrences
      if (symbol.occurrences > 0) {
        doc.setFontSize(7);
        setColor(MYSTIC_500);
        doc.text(
          `${symbol.occurrences}×`,
          pageW - marginR - 4,
          y,
          { align: "right" }
        );
      }

      y += 5;

      // Meaning
      const meaningH = wrappedText(
        symbol.meaning,
        marginL + 4,
        y,
        contentW - 8,
        8.5,
        MYSTIC_300,
        1.3
      );
      y += meaningH;

      // Personal note
      if (symbol.personalNote) {
        y += 1;
        doc.setFontSize(7.5);
        setColor(MYSTIC_500);
        doc.text("Note :", marginL + 4, y);
        y += 3.5;
        const noteH = wrappedText(
          symbol.personalNote,
          marginL + 4,
          y,
          contentW - 8,
          7.5,
          MYSTIC_500,
          1.3
        );
        y += noteH;
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

  // ─── Final page with summary ────────────────────────────────
  doc.addPage();
  fillPage();
  y = pageH / 2 - 30;

  // Decorative moon
  setColor(GOLD);
  doc.setFontSize(36);
  doc.text("☽", pageW / 2, y, { align: "center" });
  y += 20;

  doc.setFontSize(12);
  setColor(LUNAR);
  doc.text("Fin de la sauvegarde", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(9);
  setColor(MYSTIC_500);
  doc.text(
    `${data.stats.totalDreams} rêves · ${data.stats.totalSymbols} symboles`,
    pageW / 2,
    y,
    { align: "center" }
  );
  y += 6;
  doc.text(
    `Généré le ${formatDate(new Date())}`,
    pageW / 2,
    y,
    { align: "center" }
  );
  y += 12;

  doc.setFontSize(7);
  setColor(MYSTIC_700);
  doc.text("dreamoracle.eu", pageW / 2, y, { align: "center" });

  addFooter();

  // Return as buffer
  return Buffer.from(doc.output("arraybuffer"));
}
