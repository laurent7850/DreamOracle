import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";
import { z } from "zod";

const exportSchema = z.object({
  dreamIds: z.array(z.string()).min(1).max(50),
  format: z.enum(["pdf", "json"]).default("pdf"),
});

// Generate PDF content as HTML (will be converted client-side)
function generateDreamHTML(dreams: Array<{
  title: string;
  content: string;
  dreamDate: Date;
  interpretation: string | null;
  emotions: string;
  symbols: string;
  tags: string;
}>) {
  const dreamsHTML = dreams.map((dream) => {
    const emotions = JSON.parse(dream.emotions || "[]");
    const symbols = JSON.parse(dream.symbols || "[]");
    const tags = JSON.parse(dream.tags || "[]");

    return `
      <div class="dream" style="page-break-after: always; margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4F46E5; margin-bottom: 10px;">${dream.title}</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
          ${new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
          <h3 style="font-size: 14px; color: #374151; margin-bottom: 8px;">Récit du rêve</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${dream.content}</p>
        </div>

        ${dream.interpretation ? `
          <div style="background: #EEF2FF; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #4F46E5;">
            <h3 style="font-size: 14px; color: #4F46E5; margin-bottom: 8px;">🔮 Interprétation Oracle</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${dream.interpretation}</p>
          </div>
        ` : ""}

        ${emotions.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 13px; color: #374151;">Émotions:</strong>
            <span style="color: #6B7280;"> ${emotions.join(", ")}</span>
          </div>
        ` : ""}

        ${symbols.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 13px; color: #374151;">Symboles:</strong>
            <span style="color: #D97706;"> ${symbols.join(", ")}</span>
          </div>
        ` : ""}

        ${tags.length > 0 ? `
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 13px; color: #374151;">Tags:</strong>
            <span style="color: #6B7280;"> #${tags.join(" #")}</span>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>DreamOracle - Export</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #1F2937;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4F46E5;
        }
        .header h1 {
          color: #4F46E5;
          font-size: 28px;
          margin-bottom: 5px;
        }
        .header p {
          color: #6B7280;
          font-size: 14px;
        }
        @media print {
          body { padding: 20px; }
          .dream { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌙 DreamOracle</h1>
        <p>Journal de Rêves - Export du ${new Date().toLocaleDateString("fr-FR")}</p>
        <p>${dreams.length} rêve${dreams.length > 1 ? "s" : ""}</p>
      </div>
      ${dreamsHTML}
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check usage limit
    const usageCheck = await checkUsageLimit(session.user.id, "export");
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: "Limite d'exports atteinte",
          limit: usageCheck.limit,
          used: usageCheck.used,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = exportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { dreamIds, format } = validation.data;

    // Fetch dreams belonging to user
    const dreams = await prisma.dream.findMany({
      where: {
        id: { in: dreamIds },
        userId: session.user.id,
      },
      orderBy: { dreamDate: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        dreamDate: true,
        interpretation: true,
        emotions: true,
        symbols: true,
        tags: true,
        lucidity: true,
        mood: true,
        sleepQuality: true,
        isRecurring: true,
        createdAt: true,
      },
    });

    if (dreams.length === 0) {
      return NextResponse.json(
        { error: "Aucun rêve trouvé" },
        { status: 404 }
      );
    }

    // Increment usage
    await incrementUsage(session.user.id, "export");

    if (format === "json") {
      // Return JSON export
      return NextResponse.json({
        exportDate: new Date().toISOString(),
        totalDreams: dreams.length,
        dreams: dreams.map((d) => ({
          ...d,
          emotions: JSON.parse(d.emotions || "[]"),
          symbols: JSON.parse(d.symbols || "[]"),
          tags: JSON.parse(d.tags || "[]"),
        })),
      });
    }

    // Return HTML for PDF conversion (client-side)
    const html = generateDreamHTML(dreams);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="dreamoracle-export-${new Date().toISOString().split("T")[0]}.html"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'export" },
      { status: 500 }
    );
  }
}
