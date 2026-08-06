import { createRouter } from '@tanstack/react-router';
import { Route as RootRoute } from './__root';
import { Route as IndexRoute } from './index';
import { Route as CategoryRoute } from './category.$categorySlug';
import { Route as SubcategoryRoute } from './category.$categorySlug.$subcategorySlug';
import { Route as ServiceDetailRoute } from './service.$serviceId';
import { Route as SearchRoute } from './search';
import { Route as CartRoute } from './cart';
import { Route as LoginRoute } from './login';
import { Route as RegisterRoute } from './register';
import { Route as ForgotPasswordRoute } from './forgot-password';
import { Route as ResetPasswordRoute } from './reset-password';
import { Route as CheckoutRoute } from './checkout';
import { Route as OrderConfirmationRoute } from './order-confirmation.$orderNumber';

const routeTree = RootRoute.addChildren([
  IndexRoute,
  CategoryRoute,
  SubcategoryRoute,
  ServiceDetailRoute,
  SearchRoute,
  CartRoute,
  LoginRoute,
  RegisterRoute,
  ForgotPasswordRoute,
  ResetPasswordRoute,
  CheckoutRoute,
  OrderConfirmationRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
