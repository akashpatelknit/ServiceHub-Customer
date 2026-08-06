/**
 * Static placeholder posts — there's no blog/CMS backend yet. Shape is intentionally
 * flat and self-contained (like a Paginated<T> item) so swapping this for a real
 * useBlogPosts() query hook later is a drop-in replacement, not a rewrite.
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  author: string;
  /** Left undefined on purpose for a couple of posts so <ImageWithFallback /> is actually exercised. */
  thumbnailUrl?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: '5-signs-your-ac-needs-servicing-before-summer',
    title: '5 Signs Your AC Needs Servicing Before Summer',
    excerpt: "Weak airflow and strange noises aren't just annoying — they're early warnings. Here's what to watch for before the heat hits.",
    content: [
      "Air conditioners rarely fail without warning. Most of the time, there are small signs weeks before a breakdown — you just have to know what to look for.",
      'Weak or uneven airflow is usually the first clue. If one room feels noticeably warmer than the rest, it could mean a clogged filter, low refrigerant, or a duct issue.',
      'Unusual noises — rattling, grinding, or a high-pitched whine — almost always mean a mechanical problem that gets worse (and more expensive) the longer it runs.',
      "A musty smell when the AC kicks on is often mold or mildew buildup in the unit, which is a health issue as much as a mechanical one.",
      "Higher electricity bills without a change in usage usually means your AC is working harder than it should to hit the same temperature.",
      "If any of these sound familiar, a routine service visit before peak summer is a lot cheaper than an emergency repair mid-heatwave.",
    ],
    date: '2026-02-18',
    author: 'ServiceHub Editorial',
  },
  {
    slug: 'monsoon-home-prep-checklist',
    title: 'Your Monsoon Home-Prep Checklist',
    excerpt: 'From roof leaks to electrical safety, a few hours of prep now can save you a very soggy month later.',
    content: [
      'Monsoon season is hard on homes in ways that are easy to miss until it’s too late. A little prep goes a long way.',
      'Start with the roof and terrace — check for cracks, clogged drains, and standing water spots. These are the most common source of leaks once the rain starts.',
      "Get your electrical points inspected, especially anything near windows, balconies, or exposed walls. Water and wiring are a genuinely dangerous combination.",
      "Waterproof any wooden furniture or fittings that sit near doors and windows, and check window seals while you're at it.",
      "If you have a sump pump or any drainage system, test it now — not during the first heavy downpour.",
      'Booking a pre-monsoon home inspection is usually faster and cheaper than dealing with water damage after the fact.',
    ],
    date: '2026-01-30',
    author: 'ServiceHub Editorial',
  },
  {
    slug: 'deep-cleaning-checklist-kitchen-edition',
    title: 'Deep Cleaning Checklist: Kitchen Edition',
    excerpt: 'The places a regular wipe-down always misses — and why they matter more than you think.',
    content: [
      "A kitchen can look spotless and still have months of buildup in places a daily wipe-down never reaches.",
      'Behind and under appliances is the big one — refrigerators, stoves, and microwaves all trap grease and crumbs that regular cleaning never touches.',
      'Exhaust fans and chimney filters collect oil residue that, left long enough, becomes a fire hazard as well as a smell problem.',
      'Cabinet interiors, especially near the sink and stove, are worth emptying and wiping down every few months — spills happen even when you’re careful.',
      'Grout lines between tiles hold onto grease and discoloration that no amount of surface mopping will fix.',
      "A proper deep clean once a quarter, on top of your regular routine, keeps all of this from ever becoming a bigger job.",
    ],
    date: '2026-01-12',
    author: 'ServiceHub Editorial',
  },
  {
    slug: 'electrician-vs-diy-when-to-call-a-pro',
    title: 'When to Call an Electrician vs. When It’s Okay to DIY',
    excerpt: "Changing a bulb is fine. Rewiring a switchboard isn't. Here's a practical line between the two.",
    content: [
      'Home electrical work sits on a spectrum — some of it is genuinely fine to do yourself, and some of it isn’t worth the risk.',
      'Safe to DIY: replacing bulbs, resetting a tripped circuit breaker once, swapping a switch or socket plate (with the power off), or replacing a battery-powered device.',
      "Call a professional for: any work involving the main switchboard, persistent tripped breakers, flickering lights across multiple rooms, or any exposed or scorched wiring.",
      "A good rule of thumb: if a problem keeps coming back after you've addressed the obvious cause, that's a sign of a deeper wiring issue, not a one-off fix.",
      'Electrical problems rarely stay small if ignored, and the cost of a professional visit is almost always lower than the cost of the alternative.',
    ],
    date: '2025-12-20',
    author: 'ServiceHub Editorial',
  },
  {
    slug: 'how-servicehub-vets-professionals',
    title: 'How ServiceHub Vets the Professionals on Our Platform',
    excerpt: "A look at what happens before a professional's profile ever shows up in your search results.",
    content: [
      "Trust is the whole product for a home-services marketplace, so we get asked a lot about how professionals get onboarded.",
      'Every professional goes through an identity verification step before they can accept a single booking — this is non-negotiable regardless of category or experience.',
      'Skill and background checks vary by category — the bar for an electrician or plumber is understandably different from a home-cleaning specialist, but every category has one.',
      'Once active, ongoing service quality is tracked through customer ratings, and consistent low ratings trigger a review, not just a quiet drop in visibility.',
      "This process isn't perfect and we're always refining it, but it's the foundation everything else on the platform is built on.",
    ],
    date: '2025-12-02',
    author: 'ServiceHub Editorial',
  },
  {
    slug: 'salon-at-home-first-booking-guide',
    title: 'Salon at Home: What to Expect on Your First Booking',
    excerpt: "New to booking salon services at home? Here's exactly how it works, from booking to cleanup.",
    content: [
      "Booking a salon service to your doorstep feels different from a salon visit, and knowing what to expect makes the first time a lot smoother.",
      'Professionals bring their own kit — sanitized tools, professional-grade products, and any disposable items needed for the service.',
      'You’ll get a scheduled time slot rather than a walk-in queue, and most professionals will message ahead if they’re running early or late.',
      'A clean, well-lit space with access to a power outlet and water is usually all that’s needed on your end — no special setup required.',
      "Payment and any add-ons are handled through the app, so there's no cash negotiation or upselling at your door.",
    ],
    date: '2025-11-15',
    author: 'ServiceHub Editorial',
  },
];
