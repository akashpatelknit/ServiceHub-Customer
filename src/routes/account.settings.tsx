import { createRoute, useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { AccountPage } from '@/components/account/AccountPage';
import { RequireAuth } from '@/components/shared/RequireAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLogout } from '@/queries/useAuthQueries';
import { useThemeStore, type Theme } from '@/store/themeStore';
import { Route as RootRoute } from './__root';

/**
 * Deliberately minimal — the backend has no notification-preference concept and no
 * self-service account-deletion endpoint (flagged in the account-section gap report),
 * so neither section is built here. Appearance is real and already functional
 * (useThemeStore persists to localStorage); this is just its first surfaced UI.
 */
function SettingsContent() {
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => void navigate({ to: '/' }) });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)} className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light" className="font-normal">
                Light
              </Label>
            </div>
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark" className="font-normal">
                Dark
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" className="text-danger hover:bg-danger-subtle hover:text-danger" onClick={handleLogout} disabled={logout.isPending}>
            <LogOut className="size-4" />
            {logout.isPending ? 'Logging out…' : 'Log out'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPage() {
  return (
    <RequireAuth returnTo="/account/settings">
      <AccountPage title="Settings">
        <SettingsContent />
      </AccountPage>
    </RequireAuth>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/account/settings',
  component: SettingsPage,
});
