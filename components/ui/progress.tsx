export function Progress({
  value,
  tone = "teal",
}: {
  value: number;
  tone?: "teal" | "amber" | "red";
}) {
  const barTone =
    tone === "amber"
      ? "from-amber-400 to-orange-500"
      : tone === "red"
        ? "from-red-400 to-red-600"
        : "from-teal-400 to-teal-600";

  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/8 dark:bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${barTone} transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
