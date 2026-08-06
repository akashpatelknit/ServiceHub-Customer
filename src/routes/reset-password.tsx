import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { Button } from '@/components/ui/button';
import { useResetPassword } from '@/queries/useAuthQueries';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validators/authSchemas';
import { Route as RootRoute } from './__root';

// Backend's forgot-password email links to `${FRONTEND_URL}/reset-password?token=...`
// (src/features/auth/controllers/auth.controller.js) — token name must match exactly.
const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = (values: ResetPasswordFormValues) => {
    if (!token) return;
    resetPassword.mutate(
      { token, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success('Password reset — please log in with your new password.');
          void navigate({ to: '/login' });
        },
      },
    );
  };

  if (!token) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-danger-subtle">
          <ShieldAlert className="size-7 text-danger" />
        </div>
        <h1 className="text-xl font-semibold text-ink-primary">Invalid reset link</h1>
        <p className="text-sm text-ink-secondary">This password reset link is missing or invalid. Please request a new one.</p>
        <Link to="/forgot-password" className="mt-2 text-sm font-medium text-ink-link hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-ink-primary">Reset password</h1>
      <p className="mt-1 text-sm text-ink-secondary">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
          <PasswordInput id="newPassword" autoComplete="new-password" {...register('newPassword')} />
        </FormField>

        <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register('confirmPassword')} />
        </FormField>

        {resetPassword.isError && (
          <p className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger-subtle-text">
            {(resetPassword.error as { message?: string })?.message ?? 'Could not reset your password. The link may have expired.'}
          </p>
        )}

        <Button type="submit" size="lg" disabled={resetPassword.isPending}>
          {resetPassword.isPending ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/reset-password',
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
});
