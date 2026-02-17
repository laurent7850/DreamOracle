"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#12122a] to-[#0a0a1a] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🔮</div>
        <h1 className="text-4xl font-cinzel text-gold mb-4">Oups</h1>
        <h2 className="text-xl font-philosopher text-lunar mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-mystic-400 mb-8">
          L&apos;Oracle a rencontré une perturbation dans les astres. Veuillez
          réessayer ou retourner à l&apos;accueil.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-mystic-600 to-mystic-700 text-white rounded-lg hover:from-mystic-500 hover:to-mystic-600 transition-all font-medium cursor-pointer"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-mystic-600/50 text-mystic-300 rounded-lg hover:bg-mystic-900/30 transition-all font-medium"
          >
            Retour à l&apos;accueil
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-mystic-600">
            Code erreur : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
