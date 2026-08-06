/** Static/config-driven content — flagged wherever it stands in for a backend field that doesn't exist yet. */

/** "New and noteworthy" uses createdAt recency as a proxy — Service has no isFeatured/isNew field. */
export const NEW_SERVICE_WINDOW_DAYS = 30;

export const DEFAULT_LOCATION_LABEL = 'Mumbai';

export const SEARCH_PLACEHOLDER_SUGGESTIONS = [
  "Search for 'AC service'",
  "Search for 'Salon for women'",
  "Search for 'Deep cleaning'",
  "Search for 'Electrician'",
  "Search for 'Full home painting'",
];

export interface TrustStat {
  id: string;
  value: string;
  label: string;
}

/** Static aggregate values — not modeled as real backend data yet. */
export const TRUST_STATS: TrustStat[] = [
  { id: 'rating', value: '4.8', label: 'Service rating' },
  { id: 'customers', value: '12 Lakh+', label: 'Customers served' },
  { id: 'cities', value: '30+', label: 'Cities' },
  { id: 'professionals', value: '8,000+', label: 'Verified professionals' },
];

export interface SpotlightBanner {
  _id: string;
  title: string;
  subtitle?: string;
  /** Shaped to match the backend's (currently unmounted) Banner model — swap in real imageUrl values once that API is live. */
  imageUrl?: string;
  gradientClassName: string;
  clickAction?: { type: 'category'; value: string } | { type: 'none' };
}

/** Static/config-driven for now — Banner model exists in the backend but its routes aren't mounted yet. */
export const SPOTLIGHT_BANNERS: SpotlightBanner[] = [
  {
    _id: 'spotlight-1',
    title: 'Monsoon AC service',
    subtitle: 'Flat 30% off, this week only',
    gradientClassName: 'from-primary to-primary-active',
    clickAction: { type: 'none' },
  },
  {
    _id: 'spotlight-2',
    title: 'Salon at home',
    subtitle: 'Trained professionals, sanitized tools',
    gradientClassName: 'from-violet to-violet-active',
    clickAction: { type: 'none' },
  },
  {
    _id: 'spotlight-3',
    title: 'Deep cleaning combo',
    subtitle: 'Kitchen + bathroom, starting ₹999',
    gradientClassName: 'from-secondary to-secondary-active',
    clickAction: { type: 'none' },
  },
  {
    _id: 'spotlight-4',
    title: 'New: Native smart devices',
    subtitle: 'Smart switches, cameras & more',
    gradientClassName: 'from-warning to-warning-active',
    clickAction: { type: 'none' },
  },
];
