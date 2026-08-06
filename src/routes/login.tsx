import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/queries/useAuthQueries';
import { loginSchema, type LoginFormValues } from '@/validators/authSchemas';
import { Route as RootRoute } from './__root';

const loginSearchSchema = z.object({
  returnTo: z.string().optional(),
});

function LoginPage() {
  const { returnTo } = Route.useSearch();
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => void navigate({ to: returnTo ?? '/' }),
    });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-ink-primary">Log in</h1>
      <p className="mt-1 text-sm text-ink-secondary">Welcome back to ServiceHub.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <FormField label="Email or phone number" htmlFor="identifier" error={errors.identifier?.message}>
          <Input id="identifier" autoComplete="username" {...register('identifier')} />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="current-password" {...register('password')} />
        </FormField>

        <div className="-mt-2 text-right">
          <Link to="/forgot-password" className="text-xs font-medium text-ink-link hover:underline">
            Forgot password?
          </Link>
        </div>

        {login.isError && (
          <p className="rounded-md bg-danger-subtle px-3 py-2 text-sm text-danger-subtle-text">
            {(login.error as { message?: string })?.message ?? 'Could not log in. Please try again.'}
          </p>
        )}

        <Button type="submit" size="lg" disabled={login.isPending}>
          {login.isPending ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" search={{ returnTo }} className="font-medium text-ink-link hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/login',
  validateSearch: loginSearchSchema,
  component: LoginPage,
});
