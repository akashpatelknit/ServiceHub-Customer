import { useState } from 'react';
import { createRoute, Link } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForgotPassword } from '@/queries/useAuthQueries';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/validators/authSchemas';
import { Route as RootRoute } from './__root';

function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword.mutate(values.email, { onSuccess: () => setSubmitted(true) });
  };

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary-subtle">
          <MailCheck className="size-7 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-ink-primary">Check your email</h1>
        <p className="text-sm text-ink-secondary">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
        <Link to="/login" className="mt-2 text-sm font-medium text-ink-link hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-ink-primary">Forgot password</h1>
      <p className="mt-1 text-sm text-ink-secondary">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>

        <Button type="submit" size="lg" disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        <Link to="/login" className="font-medium text-ink-link hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});
