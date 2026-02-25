import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sendNewRegistrationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  // UTM tracking (optional)
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(`register:${ip}`, RATE_LIMITS.register);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives d'inscription. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, utm_source, utm_campaign, utm_medium } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Essai Oracle+ 7 jours pour tout nouvel inscrit
        subscriptionTier: "PREMIUM",
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        trialUsed: true,
        // Acquisition tracking
        acquisitionSource: utm_source || null,
        acquisitionCampaign: utm_campaign || null,
        acquisitionMedium: utm_medium || null,
      },
    });

    // Create default user settings
    await prisma.userSettings.create({
      data: {
        userId: user.id,
      },
    });

    // Log trial started event
    await prisma.trialEvent.create({
      data: {
        userId: user.id,
        event: "trial_started",
        metadata: JSON.stringify({
          tier: "PREMIUM",
          source: utm_source || "organic",
          campaign: utm_campaign || null,
          medium: utm_medium || null,
        }),
      },
    });

    // Notify admin (fire-and-forget)
    sendNewRegistrationEmail(name, email, 'credentials').catch(() => {});

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
