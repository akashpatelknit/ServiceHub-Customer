interface StatCardProps {
  value: string;
  label: string;
}

/** Same presentation TrustStrip uses for the homepage trust row — extracted so About (and anywhere else) can reuse it. */
export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-xl font-bold text-ink-primary sm:text-2xl">{value}</p>
      <p className="text-xs text-ink-secondary sm:text-sm">{label}</p>
    </div>
  );
}
