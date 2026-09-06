import { Menu, Search, SlidersHorizontal } from "lucide-react";
import ApiStatusBadge from "../common/ApiStatusBadge";

export function Topbar({
  onMenuClick,
  searchQuery,
  setSearchQuery,
  isConnected,
  onRetryConnection,
  activeSectorFilter,
  setActiveSectorFilter,
  sectors = [],
}) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Section: Mobile toggle & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Input */}
          <div className="relative flex-1 sm:w-72 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, sectors, states..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white rounded-xl border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Section: Quick Sector Filter Pills & API Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {sectors.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sector:
              </span>
              <button
                onClick={() => setActiveSectorFilter("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeSectorFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All
              </button>
              {sectors.slice(0, 4).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setActiveSectorFilter(sec)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeSectorFilter === sec
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          )}

          <ApiStatusBadge
            isConnected={isConnected}
            onRetry={onRetryConnection}
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
