"use client";

import { useState } from "react";
import { FileDown, Loader2, FileText, FileJson, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  dreamIds: string[];
  disabled?: boolean;
  hasAccess: boolean;
}

export function ExportButton({ dreamIds, disabled, hasAccess }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: "pdf" | "json") => {
    if (!hasAccess) {
      toast({
        title: "Fonctionnalité Premium",
        description: "L'export est disponible à partir de l'abonnement Explorateur.",
        variant: "destructive",
      });
      return;
    }

    if (dreamIds.length === 0) {
      toast({
        title: "Aucun rêve sélectionné",
        description: "Sélectionnez au moins un rêve à exporter.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamIds, format }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.upgradeRequired) {
          toast({
            title: "Limite atteinte",
            description: `Vous avez utilisé ${error.used}/${error.limit} exports ce mois. Passez à Oracle+ pour des exports illimités.`,
            variant: "destructive",
          });
          return;
        }
        throw new Error(error.error || "Erreur d'export");
      }

      if (format === "json") {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        downloadBlob(blob, `dreamoracle-export-${new Date().toISOString().split("T")[0]}.json`);
      } else {
        // HTML/PDF - download and open for print
        const html = await response.text();
        const blob = new Blob([html], { type: "text/html" });

        // Open in new window for printing as PDF
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
          };
        } else {
          // Fallback: download HTML
          downloadBlob(blob, `dreamoracle-export-${new Date().toISOString().split("T")[0]}.html`);
        }
      }

      toast({
        title: "Export réussi",
        description: `${dreamIds.length} rêve${dreamIds.length > 1 ? "s" : ""} exporté${dreamIds.length > 1 ? "s" : ""}.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter les rêves.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!hasAccess) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="border-mystic-700 text-mystic-500"
      >
        <Lock className="w-4 h-4 mr-2" />
        Export PDF
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isExporting || dreamIds.length === 0}
          className="border-mystic-700 text-mystic-300 hover:bg-mystic-800"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4 mr-2" />
          )}
          Exporter ({dreamIds.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-mystic-900 border-mystic-700">
        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="text-mystic-200 focus:bg-mystic-800 cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export PDF (imprimer)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("json")}
          className="text-mystic-200 focus:bg-mystic-800 cursor-pointer"
        >
          <FileJson className="w-4 h-4 mr-2" />
          Export JSON (données)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
