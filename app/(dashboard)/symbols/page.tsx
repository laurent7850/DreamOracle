"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Loader2,
  Pencil,
  Trash2,
  Lock,
  Crown,
  Sparkles,
  X,
  Check,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Symbol {
  id: string;
  name: string;
  meaning: string;
  personalNote: string | null;
  occurrences: number;
  createdAt: string;
}

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [dreamSymbolCounts, setDreamSymbolCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSymbol, setNewSymbol] = useState({ name: "", meaning: "", personalNote: "" });
  const [editData, setEditData] = useState({ meaning: "", personalNote: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchSymbols();
  }, []);

  const fetchSymbols = async () => {
    try {
      const res = await fetch("/api/symbols");
      if (res.status === 403) {
        setHasAccess(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSymbols(data.symbols);
      setDreamSymbolCounts(data.dreamSymbolCounts || {});
      setHasAccess(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le dictionnaire.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newSymbol.name || !newSymbol.meaning) return;

    try {
      const res = await fetch("/api/symbols", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSymbol),
      });

      if (!res.ok) throw new Error("Failed to add");

      toast({ title: "Symbole ajouté" });
      setNewSymbol({ name: "", meaning: "", personalNote: "" });
      setIsAddingNew(false);
      fetchSymbols();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le symbole.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/symbols/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast({ title: "Symbole mis à jour" });
      setEditingId(null);
      fetchSymbols();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce symbole ?")) return;

    try {
      const res = await fetch(`/api/symbols/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      toast({ title: "Symbole supprimé" });
      fetchSymbols();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (symbol: Symbol) => {
    setEditingId(symbol.id);
    setEditData({ meaning: symbol.meaning, personalNote: symbol.personalNote || "" });
  };

  const filteredSymbols = symbols.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.meaning.toLowerCase().includes(search.toLowerCase())
  );

  // Get dream symbols not yet in dictionary
  const undefinedSymbols = Object.entries(dreamSymbolCounts)
    .filter(([name]) => !symbols.find((s) => s.name.toLowerCase() === name.toLowerCase()))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

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
              Dictionnaire de Symboles
            </h1>
            <p className="text-mystic-300 mb-6 max-w-md mx-auto">
              Crée ton dictionnaire personnel des symboles qui apparaissent dans
              tes rêves. Disponible avec l'abonnement Oracle+.
            </p>

            <div className="bg-mystic-900/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Fonctionnalités :
              </h3>
              <ul className="space-y-2 text-mystic-300">
                <li className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-mystic-400" />
                  Sauvegarde tes symboles récurrents
                </li>
                <li className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-mystic-400" />
                  Note leur signification personnelle
                </li>
                <li className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-mystic-400" />
                  Suis leur fréquence d'apparition
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-lunar mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-gold" />
            Dictionnaire de Symboles
          </h1>
          <p className="text-mystic-400">
            {symbols.length} symbole{symbols.length > 1 ? "s" : ""} dans ton dictionnaire
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="bg-gold hover:bg-gold/90 text-night"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mystic-500" />
        <input
          type="text"
          placeholder="Rechercher un symbole..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-mystic-900/50 border border-mystic-700/50 rounded-lg text-lunar placeholder-mystic-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      {/* Add new form */}
      {isAddingNew && (
        <Card className="glass-card border-gold/30">
          <CardHeader>
            <CardTitle className="text-lg text-lunar flex items-center gap-2">
              <Plus className="w-5 h-5 text-gold" />
              Nouveau symbole
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="Nom du symbole (ex: eau, serpent, vol...)"
              value={newSymbol.name}
              onChange={(e) => setNewSymbol({ ...newSymbol, name: e.target.value })}
              className="w-full px-4 py-2 bg-mystic-900/50 border border-mystic-700/50 rounded-lg text-lunar placeholder-mystic-500 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <textarea
              placeholder="Signification personnelle..."
              value={newSymbol.meaning}
              onChange={(e) => setNewSymbol({ ...newSymbol, meaning: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-mystic-900/50 border border-mystic-700/50 rounded-lg text-lunar placeholder-mystic-500 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
            <textarea
              placeholder="Note personnelle (optionnel)..."
              value={newSymbol.personalNote}
              onChange={(e) => setNewSymbol({ ...newSymbol, personalNote: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-mystic-900/50 border border-mystic-700/50 rounded-lg text-lunar placeholder-mystic-500 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewSymbol({ name: "", meaning: "", personalNote: "" });
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAdd}
                disabled={!newSymbol.name || !newSymbol.meaning}
                className="bg-gold hover:bg-gold/90 text-night"
              >
                <Check className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Undefined symbols from dreams */}
      {undefinedSymbols.length > 0 && !search && (
        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="text-sm text-mystic-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Symboles de tes rêves sans définition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {undefinedSymbols.map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => {
                    setNewSymbol({ ...newSymbol, name });
                    setIsAddingNew(true);
                  }}
                  className="px-3 py-1 bg-mystic-800/50 text-mystic-300 rounded-full text-sm hover:bg-mystic-700/50 transition-colors flex items-center gap-1"
                >
                  {name}
                  <span className="text-mystic-500 text-xs">({count})</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Symbols list */}
      <div className="space-y-3">
        {filteredSymbols.length === 0 ? (
          <Card className="glass-card border-mystic-700/30">
            <CardContent className="py-12 text-center text-mystic-400">
              {search
                ? "Aucun symbole trouvé pour cette recherche."
                : "Ton dictionnaire est vide. Ajoute ton premier symbole !"}
            </CardContent>
          </Card>
        ) : (
          filteredSymbols.map((symbol) => (
            <Card
              key={symbol.id}
              className="glass-card border-mystic-700/30 hover:border-mystic-600/50 transition-colors"
            >
              <CardContent className="p-4">
                {editingId === symbol.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editData.meaning}
                      onChange={(e) =>
                        setEditData({ ...editData, meaning: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 bg-mystic-900/50 border border-mystic-700/50 rounded-lg text-lunar focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                    />
                    <textarea
                      placeholder="Note personnelle..."
                      value={editData.personalNote}
                      onChange={(e) =>
                        setEditData({ ...editData, personalNote: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-2 bg-mystic-900/50 border border-mystic-700/50 rounded-lg text-lunar placeholder-mystic-500 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(symbol.id)}
                        className="bg-gold hover:bg-gold/90 text-night"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-lg text-gold capitalize">
                          {symbol.name}
                        </h3>
                        {dreamSymbolCounts[symbol.name.toLowerCase()] && (
                          <span className="text-xs text-mystic-500 bg-mystic-800/50 px-2 py-0.5 rounded-full">
                            {dreamSymbolCounts[symbol.name.toLowerCase()]}x dans tes rêves
                          </span>
                        )}
                      </div>
                      <p className="text-mystic-200 mb-2">{symbol.meaning}</p>
                      {symbol.personalNote && (
                        <p className="text-sm text-mystic-400 italic">
                          📝 {symbol.personalNote}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(symbol)}
                        className="p-2 text-mystic-400 hover:text-mystic-200 hover:bg-mystic-800/50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(symbol.id)}
                        className="p-2 text-mystic-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
