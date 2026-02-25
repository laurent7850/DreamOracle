"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Moon, Mail, Lock, Eye, EyeOff, User, Loader2, Crown, Sparkles, Brain, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { trackRegistration, trackStartTrial } from "@/lib/meta-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-mystic-400" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [utmParams, setUtmParams] = useState<{
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
  }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Capture UTM params from URL on page load
  useEffect(() => {
    const source = searchParams.get("utm_source") || sessionStorage.getItem("utm_source") || undefined;
    const campaign = searchParams.get("utm_campaign") || sessionStorage.getItem("utm_campaign") || undefined;
    const medium = searchParams.get("utm_medium") || sessionStorage.getItem("utm_medium") || undefined;

    // Store in sessionStorage so they survive navigation
    if (searchParams.get("utm_source")) sessionStorage.setItem("utm_source", searchParams.get("utm_source")!);
    if (searchParams.get("utm_campaign")) sessionStorage.setItem("utm_campaign", searchParams.get("utm_campaign")!);
    if (searchParams.get("utm_medium")) sessionStorage.setItem("utm_medium", searchParams.get("utm_medium")!);

    setUtmParams({ utm_source: source, utm_campaign: campaign, utm_medium: medium });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          ...utmParams,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de la création du compte");
        return;
      }

      toast.success("Compte créé avec succès !");
      trackRegistration('credentials');
      trackStartTrial('PREMIUM');

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard?welcome=google" });
    } catch {
      toast.error("Erreur de connexion avec Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6">
          <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-mystic-400" />
          <span className="font-display text-xl sm:text-2xl text-lunar">DreamOracle</span>
        </Link>
        <h1 className="font-display text-xl sm:text-2xl text-lunar mb-2">Créez votre compte</h1>
        <p className="text-sm sm:text-base text-mystic-400">7 jours d&apos;Oracle+ offerts — Accès complet, sans engagement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-lunar">Nom</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mystic-400" />
            <Input
              id="name"
              type="text"
              placeholder="Votre nom"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10 bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-lunar">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mystic-400" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10 bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-lunar">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mystic-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 caractères"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="pl-10 pr-10 bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mystic-400 hover:text-mystic-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-lunar">Confirmer</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mystic-400" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirmez le mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="pl-10 bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-mystic btn-gold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Création...
            </>
          ) : (
            "Créer mon compte"
          )}
        </Button>
      </form>

      <div className="divider-ornament my-6">
        <span className="text-sm">ou</span>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full border-mystic-600/30 text-lunar hover:bg-mystic-900/30"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        S&apos;inscrire avec Google
      </Button>

      {/* Oracle+ trial features */}
      <div className="mt-5 sm:mt-6 p-3 rounded-lg bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20">
        <div className="flex items-center gap-1.5 mb-2">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-amber-300">Inclus dans votre essai Oracle+</span>
        </div>
        <ul className="grid grid-cols-2 gap-1.5 text-xs text-mystic-400">
          <li className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
            Interprétations illimitées
          </li>
          <li className="flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
            Dream Coach personnel
          </li>
          <li className="flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
            Dictionnaire de symboles
          </li>
          <li className="flex items-center gap-1.5">
            <Moon className="w-3 h-3 text-amber-400/70 flex-shrink-0" />
            Biorythme détaillé
          </li>
        </ul>
      </div>

      <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-mystic-400">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-mystic-300 hover:text-gold">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
