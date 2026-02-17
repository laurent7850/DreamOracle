export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 bg-mystic-800/50 rounded-lg w-48 mb-2" />
          <div className="h-4 bg-mystic-800/30 rounded w-64" />
        </div>
        <div className="h-10 bg-mystic-800/50 rounded-lg w-32" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-mystic-900/30 border border-mystic-700/20 rounded-xl p-4"
          >
            <div className="h-4 bg-mystic-800/40 rounded w-20 mb-3" />
            <div className="h-8 bg-mystic-800/50 rounded w-16 mb-1" />
            <div className="h-3 bg-mystic-800/30 rounded w-24" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-mystic-900/30 border border-mystic-700/20 rounded-xl p-5">
          <div className="h-5 bg-mystic-800/50 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 bg-mystic-800/40 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-mystic-800/40 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-mystic-800/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-mystic-900/30 border border-mystic-700/20 rounded-xl p-5">
          <div className="h-5 bg-mystic-800/50 rounded w-40 mb-4" />
          <div className="h-40 bg-mystic-800/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
