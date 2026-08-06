import { Check } from 'lucide-react';
import { stepLabel } from '@/lib/orderDerivations';
import { cn } from '@/lib/utils';

interface OrderStatusStepperProps {
  steps: string[];
  currentStep: string;
}

/** Linear "happy path" progress — see SERVICE_ORDER_STEPS/PRODUCT_ORDER_STEPS in orderDerivations.ts. Callers handle cancelled/returned as a separate terminal state, not a step on this path. */
export function OrderStatusStepper({ steps, currentStep }: OrderStatusStepperProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={step} className="flex flex-1 flex-col items-center text-center last:flex-none last:items-end">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                  isComplete || isCurrent ? 'border-primary bg-primary text-primary-foreground' : 'border-line bg-card text-ink-muted',
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : i + 1}
              </span>
              {i < steps.length - 1 && <span className={cn('mx-1 h-0.5 flex-1', isComplete ? 'bg-primary' : 'bg-line')} />}
            </div>
            <span className={cn('mt-1.5 text-[11px] leading-tight', isComplete || isCurrent ? 'font-medium text-ink-primary' : 'text-ink-muted')}>
              {stepLabel(step)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
