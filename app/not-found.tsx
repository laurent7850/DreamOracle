import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#12122a] to-[#0a0a1a] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🌙</div>
        <h1 className="text-4xl font-cinzel text-gold mb-4">404</h1>
        <h2 className="text-xl font-philosopher text-lunar mb-4">
          Page introuvable
        </h2>
        <p className="text-mystic-400 mb-8">
          Cette page semble s&apos;être perdue dans les limbes des rêves.
          Peut-être la retrouverez-vous dans un prochain songe...
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-mystic-600 to-mystic-700 text-white rounded-lg hover:from-mystic-500 hover:to-mystic-600 transition-all font-medium"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-mystic-600/50 text-mystic-300 rounded-lg hover:bg-mystic-900/30 transition-all font-medium"
          >
            Mon journal
          </Link>
        </div>
      </div>
    </div>
  );
}
