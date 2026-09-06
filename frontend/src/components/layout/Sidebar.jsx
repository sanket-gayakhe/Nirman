import {
  CalendarDays,
  Database,
  LayoutDashboard,
  ShieldAlert,
  X,
  Building2
} from "lucide-react";

export function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "risk",
      label: "Risk Monitor",
      icon: ShieldAlert,
      badge: "AI",
    },
    {
      id: "explorer",
      label: "Project Directory",
      icon: Database,
      badge: null,
    },
    {
      id: "timeline",
      label: "Milestones",
      icon: CalendarDays,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/25">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide leading-none">
              NIRMAN
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              GovTech Infra AI
            </p>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    isActive
                      ? "bg-indigo-700 text-indigo-100"
                      : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 m-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">System Status</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          Monitoring infrastructure delays & overrun risks in real time.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
