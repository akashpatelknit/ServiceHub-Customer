import { createRoute } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CheckCircle2, TrendingUp, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { StaticContentPage } from '@/components/shared/StaticContentPage';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useSubmitVendorLead } from '@/queries/useVendorLeadQueries';
import { vendorLeadSchema, type VendorLeadFormValues } from '@/validators/vendorLeadSchemas';
import { Route as RootRoute } from './__root';

const BENEFITS = [
  { icon: Users, title: 'Steady demand', description: 'Get matched with customers actively looking for your service — no cold outreach.' },
  { icon: Wallet, title: 'Transparent earnings', description: "Know exactly what you'll earn on every job before you accept it." },
  { icon: TrendingUp, title: 'Grow your reputation', description: 'Build a rating history that brings you more, higher-value bookings over time.' },
];

function RegisterProfessionalPage() {
  useDocumentTitle('Register as a Professional', 'Join ServiceHub as a service professional and start getting matched with customers near you.');
  const submitLead = useSubmitVendorLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorLeadFormValues>({ resolver: zodResolver(vendorLeadSchema) });

  const onSubmit = (values: VendorLeadFormValues) => {
    submitLead.mutate(values, {
      onSuccess: () => {
        toast.success("Thanks! We've received your details and will reach out soon.");
        reset();
      },
      onError: (error: unknown) => {
        const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined;
        toast.error(message ?? 'Could not submit right now. Please try again.');
      },
    });
  };

  return (
    <StaticContentPage
      eyebrow="For professionals"
      title="Grow your business with ServiceHub"
      description="Join a network of verified professionals getting matched with customers who are ready to book."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="rounded-card border border-border bg-card p-5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-subtle text-primary-subtle-text">
              <benefit.icon className="size-4" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-ink-primary">{benefit.title}</h3>
            <p className="mt-1.5 text-sm text-ink-secondary">{benefit.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-xl rounded-card border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-ink-primary">Register your interest</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Our vendor app isn't live yet — leave your details and our team will personally reach out to help you get onboarded.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <FormField label="Full name" htmlFor="lead-name" error={errors.name?.message}>
            <Input id="lead-name" {...register('name')} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Phone number" htmlFor="lead-phone" error={errors.phone?.message}>
              <Input id="lead-phone" type="tel" placeholder="+91XXXXXXXXXX" {...register('phone')} />
            </FormField>
            <FormField label="Email" htmlFor="lead-email" error={errors.email?.message}>
              <Input id="lead-email" type="email" {...register('email')} />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="City" htmlFor="lead-city" error={errors.city?.message}>
              <Input id="lead-city" {...register('city')} />
            </FormField>
            <FormField label="Service category" htmlFor="lead-category" error={errors.category?.message}>
              <Input id="lead-category" placeholder="e.g. Electrician, Salon, Cleaning" {...register('category')} />
            </FormField>
          </div>

          <Button type="submit" disabled={submitLead.isPending}>
            {submitLead.isPending ? 'Submitting…' : 'Register interest'}
            {!submitLead.isPending && <CheckCircle2 className="size-4" />}
          </Button>
        </form>
      </div>
    </StaticContentPage>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/register-professional',
  component: RegisterProfessionalPage,
});
