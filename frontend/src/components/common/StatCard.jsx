export function StatCard({ title, value, subtext, icon: Icon, trend, color = "indigo" }) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      glow: "hover:border-indigo-500/30",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "hover:border-emerald-500/30",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      glow: "hover:border-amber-500/30",
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      glow: "hover:border-rose-500/30",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      glow: "hover:border-blue-500/30",
    },
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group ${currentTheme.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${currentTheme.bg} ${currentTheme.text} transition-transform group-hover:scale-110 duration-200`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          {subtext && <span className="text-slate-500 dark:text-slate-400">{subtext}</span>}
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;
