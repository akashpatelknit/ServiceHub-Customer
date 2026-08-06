/** scheduledSlot has no fixed enum server-side (checkoutSchema just requires a non-empty string) — these labels are a client-side choice, not mirrored from a backend constant. */
export const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
  '07:00 PM - 09:00 PM',
];

export const INSTANT_SLOT_LABEL = 'Instant (within 60-90 mins)';

export interface DateOption {
  date: Date;
  label: string;
}

/** Today + next 6 days for the "Later" date-chip row. */
export function getUpcomingDateOptions(days = 7): DateOption[] {
  const options: DateOption[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    let label: string;
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else label = date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    options.push({ date, label });
  }

  return options;
}

export function isSameDate(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}
