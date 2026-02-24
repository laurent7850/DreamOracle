"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Sparkles,
  TrendingUp,
  Crown,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Pencil,
  Trash2,
  Eye,
  X,
  Check,
  Loader2,
  LayoutDashboard,
  AlertCircle,
  Mic,
  FileText,
  DollarSign,
  Percent,
  UserMinus,
} from "lucide-react";
import { formatPrice, TIERS, type SubscriptionTier } from "@/lib/subscription";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  role: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionEnds: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  _count: {
    dreams: number;
    usageLogs: number;
    sessions: number;
  };
  monthlyUsage: Record<string, number>;
  interpretedDreams: number;
}

interface Stats {
  users: {
    total: number;
    newToday: number;
    newWeek: number;
    newMonth: number;
    activeToday: number;
    activeWeek: number;
  };
  subscriptions: {
    byTier: Record<string, number>;
    byStatus: Record<string, number>;
  };
  dreams: {
    total: number;
    today: number;
    week: number;
    month: number;
  };
  interpretations: {
    total: number;
    month: number;
  };
  usage: Record<string, number>;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    subscriptionTier: string;
    _count: { dreams: number };
  }>;
  revenue: {
    mrr: number;
    conversionRate: number;
    paidUsers: number;
    churnedThisMonth: number;
  };
}

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onUpdate: (userId: string, data: Partial<User>) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}

function UserModal({ user, onClose, onUpdate, onDelete }: UserModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    subscriptionTier: user?.subscriptionTier || "FREE",
    subscriptionStatus: user?.subscriptionStatus || "active",
    role: user?.role || "user",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(user.id, editData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(user.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? "Modifier l'utilisateur" : "Détails de l'utilisateur"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User info */}
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                {(user.name || user.email)[0].toUpperCase()}
              </div>
            )}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white w-full"
                  placeholder="Nom"
                />
              ) : (
                <h3 className="text-lg font-medium text-white">
                  {user.name || "Sans nom"}
                </h3>
              )}
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {user._count.dreams}
              </p>
              <p className="text-sm text-slate-400">Rêves</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {user.interpretedDreams}
              </p>
              <p className="text-sm text-slate-400">Interprétés</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {user._count.sessions}
              </p>
              <p className="text-sm text-slate-400">Sessions</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Abonnement
                </label>
                {isEditing ? (
                  <select
                    value={editData.subscriptionTier}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        subscriptionTier: e.target.value,
                      })
                    }
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white w-full"
                  >
                    <option value="FREE">Rêveur (Gratuit)</option>
                    <option value="ESSENTIAL">Explorateur</option>
                    <option value="PREMIUM">Oracle+</option>
                  </select>
                ) : (
                  <p className="text-white font-medium">
                    {TIERS[user.subscriptionTier as SubscriptionTier]?.displayName || user.subscriptionTier}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Statut
                </label>
                {isEditing ? (
                  <select
                    value={editData.subscriptionStatus}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        subscriptionStatus: e.target.value,
                      })
                    }
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white w-full"
                  >
                    <option value="active">Actif</option>
                    <option value="canceled">Annulé</option>
                    <option value="past_due">En retard</option>
                    <option value="expired">Expiré</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.subscriptionStatus === "active"
                        ? "bg-green-500/20 text-green-400"
                        : user.subscriptionStatus === "canceled"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.subscriptionStatus}
                  </span>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">Rôle</label>
                {isEditing ? (
                  <select
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white w-full"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {user.role}
                  </span>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Inscrit le
                </label>
                <p className="text-white">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-1">
                  Dernière connexion
                </label>
                <p className="text-white">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Jamais"}
                </p>
              </div>

              {user.stripeCustomerId && (
                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    Stripe Customer
                  </label>
                  <p className="text-white font-mono text-sm">
                    {user.stripeCustomerId}
                  </p>
                </div>
              )}
            </div>

            {/* Monthly usage details */}
            {Object.keys(user.monthlyUsage).length > 0 && (
              <div>
                <label className="text-sm text-slate-400 block mb-2">
                  Utilisation ce mois
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(user.monthlyUsage).map(([action, count]) => (
                    <span
                      key={action}
                      className="bg-slate-800 px-3 py-1 rounded-full text-sm text-white"
                    >
                      {action}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700">
          <div>
            {!isEditing && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  confirmDelete
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-red-400 hover:bg-red-500/20"
                }`}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : confirmDelete ? (
                  "Confirmer la suppression"
                ) : (
                  "Supprimer"
                )}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Enregistrer
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sortBy,
        sortOrder,
      });
      if (search) params.set("search", search);
      if (tierFilter) params.set("tier", tierFilter);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Users error:", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setUsersLoading(false);
    }
  }, [page, search, tierFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers()]);
      setLoading(false);
    };
    load();
  }, [fetchStats, fetchUsers]);

  const handleUpdateUser = async (userId: string, data: Partial<User>) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update user");
    await fetchUsers();
    await fetchStats();
  };

  const handleDeleteUser = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
    await fetchUsers();
    await fetchStats();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin CRM</h1>
                <p className="text-sm text-slate-400">DreamOracle</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  fetchStats();
                  fetchUsers();
                }}
                className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="p-2 bg-blue-500/20 rounded-lg w-fit mb-3">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.users.total}
              </p>
              <p className="text-sm text-slate-400">Utilisateurs</p>
              <p className="mt-2 text-xs text-slate-500">
                +{stats.users.newWeek} cette semaine
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="p-2 bg-purple-500/20 rounded-lg w-fit mb-3">
                <BookOpen className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.dreams.total}
              </p>
              <p className="text-sm text-slate-400">Rêves</p>
              <p className="mt-2 text-xs text-slate-500">
                +{stats.dreams.week} cette semaine
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="p-2 bg-amber-500/20 rounded-lg w-fit mb-3">
                <Sparkles className="h-5 w-5 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.interpretations.month}
              </p>
              <p className="text-sm text-slate-400">Interprétations/mois</p>
              <p className="mt-2 text-xs text-slate-500">
                {stats.interpretations.total} total
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="p-2 bg-green-500/20 rounded-lg w-fit mb-3">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.users.activeWeek}
              </p>
              <p className="text-sm text-slate-400">Actifs cette semaine</p>
              <p className="mt-2 text-xs text-slate-500">
                {stats.users.activeToday} aujourd&apos;hui
              </p>
            </div>
          </div>
        )}

        {/* Subscription breakdown */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Répartition par abonnement
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.subscriptions.byTier).map(([tier, count]) => (
                  <div key={tier} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          tier === "FREE"
                            ? "bg-slate-500"
                            : tier === "ESSENTIAL"
                              ? "bg-indigo-500"
                              : "bg-amber-500"
                        }`}
                      />
                      <span className="text-slate-300">
                        {TIERS[tier as SubscriptionTier]?.displayName || tier}
                      </span>
                    </div>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Utilisation ce mois
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.usage).map(([action, count]) => (
                  <div key={action} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {action === "interpretation" && (
                        <Sparkles className="h-4 w-4 text-indigo-400" />
                      )}
                      {action === "transcription" && (
                        <Mic className="h-4 w-4 text-blue-400" />
                      )}
                      {action === "export" && (
                        <FileText className="h-4 w-4 text-green-400" />
                      )}
                      {action === "dream" && (
                        <BookOpen className="h-4 w-4 text-purple-400" />
                      )}
                      <span className="text-slate-300 capitalize">{action}</span>
                    </div>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Revenue & Subscription Performance */}
        {stats?.revenue && (
          <div className="space-y-6 mb-8">
            {/* Revenue KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-950/50 to-slate-900/50 border border-emerald-800/30 rounded-xl p-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg w-fit mb-3">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {(stats.revenue.mrr / 100).toFixed(2)}€
                </p>
                <p className="text-sm text-slate-400">MRR</p>
                <p className="mt-2 text-xs text-slate-500">
                  {stats.revenue.paidUsers} abonné{stats.revenue.paidUsers > 1 ? "s" : ""} payant{stats.revenue.paidUsers > 1 ? "s" : ""}
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <div className="p-2 bg-amber-500/20 rounded-lg w-fit mb-3">
                  <Percent className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.revenue.conversionRate}%
                </p>
                <p className="text-sm text-slate-400">Taux conversion</p>
                <p className="mt-2 text-xs text-slate-500">
                  {stats.revenue.paidUsers} payants / {stats.users.total} total
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 col-span-2 sm:col-span-1">
                <div className="p-2 bg-red-500/20 rounded-lg w-fit mb-3">
                  <UserMinus className="h-5 w-5 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.revenue.churnedThisMonth}
                </p>
                <p className="text-sm text-slate-400">Churn ce mois</p>
                <p className="mt-2 text-xs text-slate-500">
                  Annulations ce mois
                </p>
              </div>
            </div>

            {/* Stripe Info */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <p className="text-slate-400 text-sm">
                Les factures et l&apos;historique des paiements sont gérés directement par Stripe.
                Consultez le{" "}
                <a
                  href="https://dashboard.stripe.com/invoices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  tableau de bord Stripe
                </a>
                {" "}pour les détails de facturation.
              </p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher par email ou nom..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tous les abonnements</option>
                <option value="FREE">Rêveur (Gratuit)</option>
                <option value="ESSENTIAL">Explorateur</option>
                <option value="PREMIUM">Oracle+</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="canceled">Annulé</option>
                <option value="past_due">En retard</option>
                <option value="expired">Expiré</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Utilisateur
                  </th>
                  <th
                    className="text-left py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white"
                    onClick={() => handleSort("subscriptionTier")}
                  >
                    <div className="flex items-center gap-1">
                      Abonnement
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">
                    Statut
                  </th>
                  <th
                    className="text-left py-3 px-4 text-slate-400 font-medium text-sm cursor-pointer hover:text-white"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Inscrit
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">
                    Rêves
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">
                    Interprétés
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {usersLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mx-auto" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-slate-500"
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                              {(user.name || user.email)[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-medium text-sm">
                              {user.name || "Sans nom"}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {user.email}
                            </p>
                          </div>
                          {user.role === "admin" && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscriptionTier === "PREMIUM"
                              ? "bg-amber-500/20 text-amber-400"
                              : user.subscriptionTier === "ESSENTIAL"
                                ? "bg-indigo-500/20 text-indigo-400"
                                : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {TIERS[user.subscriptionTier as SubscriptionTier]?.displayName || user.subscriptionTier}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscriptionStatus === "active"
                              ? "bg-green-500/20 text-green-400"
                              : user.subscriptionStatus === "canceled"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4 text-center text-white">
                        {user._count.dreams}
                      </td>
                      <td className="py-3 px-4 text-center text-white">
                        {user.interpretedDreams}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Page {page} sur {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}
