import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/queries/useAuthQueries';
import { registerSchema, type RegisterFormValues } from '@/validators/authSchemas';
import { Route as RootRoute } from './__root';

const registerSearchSchema = z.object({
  returnTo: z.string().optional(),
});

function RegisterPage() {
  const { returnTo } = Route.useSearch();
  const navigate = useNavigate();
  const register_ = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (values: RegisterFormValues) => {
    register_.mutate(
      { firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password },
      { onSuccess: () => void navigate({ to: returnTo ?? '/' }) },
    );
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-ink-primary">Create account</h1>
      <p className="mt-1 text-sm text-ink-secondary">Book trusted home services in minutes.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <Input id="firstName" autoComplete="given-name" {...register('firstName')} />
          </FormField>
          <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <Input id="lastName" autoComplete="family-name" {...register('lastName')} />
          </FormField>
        </div>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
        </FormField>

        <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register('confirmPassword')} />
        </FormField>

        {register_.isError && (
          <p className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger-subtle-text">
            {(register_.error as { message?: string })?.message ?? 'Could not create your account. Please try again.'}
          </p>
        )}

        <Button type="submit" size="lg" disabled={register_.isPending}>
          {register_.isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Already have an account?{' '}
        <Link to="/login" search={{ returnTo }} className="font-medium text-ink-link hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/register',
  validateSearch: registerSearchSchema,
  component: RegisterPage,
});
