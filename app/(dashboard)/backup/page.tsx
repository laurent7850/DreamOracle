"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Cloud,
  Download,
  Upload,
  Loader2,
  Lock,
  Crown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileJson,
  FileText,
  Calendar,
  BookOpen,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ImportResult {
  dreamsImported: number;
  dreamsSkipped: number;
  symbolsImported: number;
  symbolsSkipped: number;
  settingsUpdated: boolean;
}

export default function BackupPage() {
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch("/api/usage");
        const data = await res.json();
        setHasAccess(data.tier === "PREMIUM");

        // Check localStorage for last backup date
        const lastBackupDate = localStorage.getItem("dreamoracle-last-backup");
        if (lastBackupDate) {
          setLastBackup(lastBackupDate);
        }
      } catch {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, []);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/backup?format=pdf");
      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dreamoracle-sauvegarde-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save last backup date
      const now = new Date().toISOString();
      localStorage.setItem("dreamoracle-last-backup", now);
      setLastBackup(now);

      toast({
        title: "Export PDF réussi",
        description: "Ta sauvegarde PDF a été téléchargée.",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExportingJson(true);
    try {
      const res = await fetch("/api/backup?format=json");
      if (!res.ok) {
        throw new Error("Export failed");
      }

      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dreamoracle-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export JSON réussi",
        description: `${data.stats.totalDreams} rêves et ${data.stats.totalSymbols} symboles exportés.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les données.",
        variant: "destructive",
      });
    } finally {
      setIsExportingJson(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Import failed");
      }

      const result = await res.json();
      setImportResult(result.results);

      toast({
        title: "Import réussi",
        description: `${result.results.dreamsImported} rêves importés.`,
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof SyntaxError
            ? "Fichier JSON invalide."
            : "Impossible d'importer les données.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-mystic-400" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-0">
        <Card className="glass-card border-mystic-700/30 overflow-hidden">
          <div className="bg-gradient-to-br from-gold/20 via-mystic-800/50 to-purple-900/30 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
              <Lock className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-display text-3xl text-lunar mb-3">
              Sauvegarde Cloud
            </h1>
            <p className="text-mystic-300 mb-6 max-w-md mx-auto">
              Exporte et importe tes données pour les sauvegarder ou les
              transférer. Disponible avec l&apos;abonnement Oracle+.
            </p>

            <div className="bg-mystic-900/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Fonctionnalités :
              </h3>
              <ul className="space-y-2 text-mystic-300">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-mystic-400" />
                  Sauvegarde complète en PDF
                </li>
                <li className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-mystic-400" />
                  Exporte tous tes rêves et symboles
                </li>
                <li className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-mystic-400" />
                  Importe tes données sur un autre compte
                </li>
              </ul>
            </div>

            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-gold to-amber-500 text-night font-semibold hover:from-gold/90 hover:to-amber-500/90">
                <Crown className="w-4 h-4 mr-2" />
                Passer à Oracle+
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-3 sm:px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-lunar mb-2 flex items-center gap-3">
          <Cloud className="w-8 h-8 text-gold" />
          Sauvegarde Cloud
        </h1>
        <p className="text-mystic-400">
          Exporte et importe tes données DreamOracle
        </p>
      </div>

      {/* Export PDF Card */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="text-lg text-lunar flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            Exporter en PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300 text-sm">
            Télécharge un PDF complet et agréable à lire de ton journal de rêves :
            couverture, rêves avec interprétations, symboles personnels.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-gold hover:bg-gold/90 text-night"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Télécharger le PDF
            </Button>

            {lastBackup && (
              <div className="flex items-center gap-2 text-sm text-mystic-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Dernière sauvegarde :{" "}
                  {new Date(lastBackup).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import / Export JSON Card */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="text-lg text-lunar flex items-center gap-2">
            <Upload className="w-5 h-5 text-gold" />
            Import & Export JSON
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-mystic-300 text-sm">
            Le format JSON permet de réimporter tes données sur un autre compte
            ou après une réinitialisation. Les rêves en double (même titre et date) seront ignorés.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleExportJSON}
              disabled={isExportingJson}
              variant="outline"
              className="border-mystic-600 text-mystic-200 hover:bg-mystic-800/50"
            >
              {isExportingJson ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileJson className="w-4 h-4 mr-2" />
              )}
              Exporter JSON
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              variant="outline"
              className="border-mystic-600 text-mystic-200 hover:bg-mystic-800/50"
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Importer JSON
            </Button>
          </div>

          {/* Import Result */}
          {importResult && (
            <div className="mt-4 p-4 bg-mystic-900/50 rounded-lg border border-mystic-700/30">
              <h4 className="font-medium text-lunar mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Résultat de l&apos;import
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-mystic-400" />
                  <span className="text-mystic-300">
                    {importResult.dreamsImported} rêves importés
                  </span>
                </div>
                {importResult.dreamsSkipped > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-mystic-400">
                      {importResult.dreamsSkipped} rêves ignorés (doublons)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-mystic-400" />
                  <span className="text-mystic-300">
                    {importResult.symbolsImported} symboles importés
                  </span>
                </div>
                {importResult.settingsUpdated && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-mystic-300">Paramètres mis à jour</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="glass-card border-mystic-700/30 bg-mystic-900/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-mystic-400">
              <p className="mb-2">
                <strong className="text-mystic-300">Conseil :</strong> Exporte
                régulièrement tes données pour garder une copie de sauvegarde.
              </p>
              <p>
                Le <strong className="text-mystic-300">PDF</strong> offre une
                mise en page agréable pour la lecture et l&apos;archivage. Le{" "}
                <strong className="text-mystic-300">JSON</strong> permet de
                réimporter tes données.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
