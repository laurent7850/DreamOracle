import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Moon, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DreamCard } from "@/components/dream/DreamCard";
import type { Dream } from "@/types";

export const metadata = {
  title: "Mes rêves",
};

export default async function DreamsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const limit = 10;

  const where = {
    userId: session?.user?.id,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { content: { contains: search } },
      ],
    }),
  };

  const [dreamsRaw, total] = await Promise.all([
    prisma.dream.findMany({
      where,
      orderBy: { dreamDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.dream.count({ where }),
  ]);

  // Parse JSON fields
  const dreams: Dream[] = dreamsRaw.map((dream) => ({
    ...dream,
    emotions: JSON.parse(dream.emotions),
    symbols: JSON.parse(dream.symbols),
    tags: JSON.parse(dream.tags),
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-lunar mb-1 sm:mb-2">Mes rêves</h1>
          <p className="text-mystic-400 text-sm sm:text-base">
            {total} rêve{total !== 1 ? "s" : ""} enregistré{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dreams/new" className="w-full sm:w-auto">
          <Button className="btn-mystic btn-gold w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Nouveau rêve
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mystic-400" />
        <Input
          name="search"
          defaultValue={search}
          placeholder="Rechercher dans vos rêves..."
          className="pl-10 bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500"
        />
      </form>

      {/* Dreams List */}
      {dreams.length === 0 ? (
        <div className="text-center py-10 sm:py-16 glass-card px-4">
          <Moon className="w-14 h-14 sm:w-20 sm:h-20 text-mystic-600 mx-auto mb-4 sm:mb-6" />
          {search ? (
            <>
              <p className="text-mystic-400 text-sm sm:text-lg mb-2">
                Aucun rêve trouvé pour &quot;{search}&quot;
              </p>
              <Link href="/dreams">
                <Button variant="ghost" className="text-mystic-300 text-sm">
                  Voir tous les rêves
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-mystic-400 text-sm sm:text-lg mb-2 sm:mb-4">
                Votre journal de rêves est vide
              </p>
              <p className="text-mystic-500 mb-4 sm:mb-6 text-xs sm:text-base">
                Commencez à enregistrer vos rêves pour explorer leur signification
              </p>
              <Link href="/dreams/new">
                <Button className="btn-mystic text-sm sm:text-base">
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Enregistrer mon premier rêve</span>
                  <span className="sm:hidden">Premier rêve</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
          {page > 1 && (
            <Link href={`/dreams?page=${page - 1}${search ? `&search=${search}` : ""}`}>
              <Button
                variant="outline"
                className="border-mystic-600/30 text-mystic-300 text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Précédent</span>
                <span className="sm:hidden">←</span>
              </Button>
            </Link>
          )}

          <span className="flex items-center px-2 sm:px-4 text-mystic-400 text-xs sm:text-sm">
            {page}/{totalPages}
          </span>

          {page < totalPages && (
            <Link href={`/dreams?page=${page + 1}${search ? `&search=${search}` : ""}`}>
              <Button
                variant="outline"
                className="border-mystic-600/30 text-mystic-300 text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Suivant</span>
                <span className="sm:hidden">→</span>
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
