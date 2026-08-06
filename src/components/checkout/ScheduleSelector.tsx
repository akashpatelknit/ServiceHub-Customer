import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUpcomingDateOptions, INSTANT_SLOT_LABEL, isSameDate, TIME_SLOTS } from '@/lib/checkoutDerivations';
import { cn } from '@/lib/utils';

export type ScheduleMode = 'instant' | 'later';

export interface ScheduleValue {
  mode: ScheduleMode;
  date: Date;
  slot: string;
}

interface ScheduleSelectorProps {
  value: ScheduleValue;
  onChange: (value: ScheduleValue) => void;
}

const dateOptions = getUpcomingDateOptions();

export function ScheduleSelector({ value, onChange }: ScheduleSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={value.mode}
        onValueChange={(mode) =>
          onChange(
            mode === 'instant'
              ? { mode: 'instant', date: dateOptions[0].date, slot: INSTANT_SLOT_LABEL }
              : { mode: 'later', date: dateOptions[0].date, slot: TIME_SLOTS[0] },
          )
        }
      >
        <TabsList>
          <TabsTrigger value="instant">Instant</TabsTrigger>
          <TabsTrigger value="later">Later</TabsTrigger>
        </TabsList>
      </Tabs>

      {value.mode === 'instant' ? (
        <p className="text-sm text-ink-secondary">
          A professional will be assigned right away — service typically starts within <strong>60-90 minutes</strong>.
        </p>
      ) : (
        <>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {dateOptions.map((option) => (
              <button
                key={option.date.toISOString()}
                type="button"
                onClick={() => onChange({ ...value, date: option.date })}
                className={cn(
                  'shrink-0 rounded-pill border px-3.5 py-2 text-sm font-medium',
                  isSameDate(value.date, option.date)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-line text-ink-primary hover:bg-surface-hover',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onChange({ ...value, slot })}
                className={cn(
                  'rounded-md border px-3 py-2 text-sm font-medium',
                  value.slot === slot
                    ? 'border-primary bg-primary-subtle text-primary-subtle-text'
                    : 'border-line text-ink-primary hover:bg-surface-hover',
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
