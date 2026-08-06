/** Static placeholder press mentions — no real coverage to link yet, urls are '#' until there is. */
export interface PressMention {
  id: string;
  outlet: string;
  title: string;
  date: string;
  url: string;
}

export const PRESS_MENTIONS: PressMention[] = [
  { id: 'press-1', outlet: 'The Daily Ledger', title: 'How on-demand home services are reshaping urban convenience', date: '2026-01-22', url: '#' },
  { id: 'press-2', outlet: 'Business Weekly', title: 'ServiceHub expands verified-professional network across new cities', date: '2025-11-08', url: '#' },
  { id: 'press-3', outlet: 'TechScene', title: 'Inside the vendor vetting process behind India’s home-services marketplaces', date: '2025-09-14', url: '#' },
];
