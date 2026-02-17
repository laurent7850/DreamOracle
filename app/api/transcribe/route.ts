import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkCredits, logUsage } from "@/lib/credits";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 }
    );
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Rate limiting
    const rateLimit = checkRateLimit(`transcribe:${session.user.id}`, RATE_LIMITS.transcription);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez patienter." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
      );
    }

    // Check credits before processing
    const creditCheck = await checkCredits(session.user.id, 'transcription');

    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message,
        code: 'CREDITS_EXHAUSTED',
        tier: creditCheck.tier,
        used: creditCheck.used,
        limit: creditCheck.limit,
        upgradeRecommendation: creditCheck.upgradeRecommendation,
      }, { status: 403 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (audioFile.size === 0) {
      return NextResponse.json(
        { error: "Audio file is empty" },
        { status: 400 }
      );
    }

    // Validate file size (max 25MB for ElevenLabs)
    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    if (audioFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Le fichier audio est trop volumineux (max 25MB)" },
        { status: 400 }
      );
    }

    // Validate MIME type
    const allowedMimeTypes = [
      'audio/webm',
      'audio/mp3',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'audio/m4a',
      'audio/x-m4a',
    ];
    const fileType = audioFile.type || 'audio/webm';
    if (!allowedMimeTypes.some(mime => fileType.startsWith(mime.split('/')[0]))) {
      return NextResponse.json(
        { error: "Format audio non supporté" },
        { status: 400 }
      );
    }

    // Convert File to Blob for ElevenLabs
    const arrayBuffer = await audioFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: audioFile.type || 'audio/webm' });

    // Create form data for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("model_id", "scribe_v1");
    elevenLabsFormData.append("file", blob, audioFile.name || "recording.webm");
    elevenLabsFormData.append("language_code", "fra");

    // Call ElevenLabs API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: elevenLabsFormData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Transcription failed", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    const transcript = result.text || "";

    // Log usage after successful transcription
    await logUsage(session.user.id, 'transcription');

    return NextResponse.json({
      transcript,
      credits: {
        used: creditCheck.used + 1,
        limit: creditCheck.limit,
        remaining: creditCheck.remaining - 1,
        isUnlimited: creditCheck.isUnlimited,
      },
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
