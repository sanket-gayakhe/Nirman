export function RiskBadge({ level }) {
  const norm = String(level || "low").toLowerCase();

  let styles = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  let dotStyle = "bg-emerald-500";
  let label = "Low Risk";

  if (norm === "high" || norm === "critical") {
    styles = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse";
    dotStyle = "bg-rose-500";
    label = norm === "critical" ? "Critical Risk" : "High Risk";
  } else if (norm === "medium" || norm === "moderate") {
    styles = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    dotStyle = "bg-amber-500";
    label = "Medium Risk";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles} backdrop-blur-sm transition-all duration-200`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
      {label}
    </span>
  );
}

export default RiskBadge;
