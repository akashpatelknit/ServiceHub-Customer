import { TRUST_STATS } from '@/lib/config';

export function TrustStrip() {
  return (
    <div className="border-y border-border bg-surface-sunken">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4">
        {TRUST_STATS.map((stat) => (
          <div key={stat.id} className="text-center sm:text-left">
            <p className="text-xl font-bold text-ink-primary sm:text-2xl">{stat.value}</p>
            <p className="text-xs text-ink-secondary sm:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
