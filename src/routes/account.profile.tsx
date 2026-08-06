import { createRoute, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { AccountPage } from '@/components/account/AccountPage';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { RequireAuth } from '@/components/shared/RequireAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '@/queries/useAuthQueries';
import { useUpdateProfile } from '@/queries/useUserQueries';
import { useAuthStore } from '@/store/authStore';
import { changePasswordSchema, profileSchema, type ChangePasswordFormValues, type ProfileFormValues } from '@/validators/profileSchemas';
import { Route as RootRoute } from './__root';

function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '' },
  });

  const emailChanged = watch('email') !== user?.email;

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(
      { firstName: values.firstName, lastName: values.lastName || undefined, email: values.email },
      {
        onSuccess: () => toast.success('Profile updated'),
        onError: (error: unknown) => {
          const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined;
          toast.error(message ?? 'Could not update your profile. Please try again.');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <ImageWithFallback src={user?.avatar?.url} alt="" className="size-16 shrink-0 rounded-full object-cover" />
          <div>
            <CardTitle>Profile details</CardTitle>
            {!user?.isEmailVerified && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-pill bg-status-pending-bg px-2 py-0.5 text-xs font-medium text-status-pending-text">
                <AlertTriangle className="size-3" />
                Email not verified
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
          {emailChanged && (
            <p className="-mt-2 text-xs text-status-pending-text">Changing your email will require re-verification.</p>
          )}

          <FormField label="Phone number" htmlFor="phoneNumber">
            <Input id="phoneNumber" value={user?.phoneNumber ?? 'Not added'} disabled readOnly />
          </FormField>
          <p className="-mt-2 text-xs text-ink-muted">Phone number can't be changed from this page.</p>

          <div>
            <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
              {updateProfile.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangePasswordForm() {
  const navigate = useNavigate();
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(
      { oldPassword: values.oldPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          reset();
          toast.success('Password changed. Please log in again — other sessions have been signed out.');
          void navigate({ to: '/login' });
        },
        onError: (error: unknown) => {
          const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : undefined;
          toast.error(message ?? 'Could not change your password. Please try again.');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Current password" htmlFor="oldPassword" error={errors.oldPassword?.message}>
            <PasswordInput id="oldPassword" autoComplete="current-password" {...register('oldPassword')} />
          </FormField>
          <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
            <PasswordInput id="newPassword" autoComplete="new-password" {...register('newPassword')} />
          </FormField>
          <FormField label="Confirm new password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
            <PasswordInput id="confirmPassword" autoComplete="new-password" {...register('confirmPassword')} />
          </FormField>

          <div>
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? 'Changing…' : 'Change password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ProfilePage() {
  return (
    <RequireAuth returnTo="/account/profile">
      <AccountPage title="Profile">
        <div className="flex flex-col gap-6">
          <ProfileForm />
          <ChangePasswordForm />
        </div>
      </AccountPage>
    </RequireAuth>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/account/profile',
  component: ProfilePage,
});
