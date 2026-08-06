import { StatCard } from '@/components/shared/StatCard';
import { TRUST_STATS } from '@/lib/config';

export function TrustStrip() {
  return (
    <div className="border-y border-border bg-surface-sunken">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4">
        {TRUST_STATS.map((stat) => (
          <StatCard key={stat.id} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  );
}
