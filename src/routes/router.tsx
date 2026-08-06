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
import { Route as AccountIndexRoute } from './account';
import { Route as AccountProfileRoute } from './account.profile';
import { Route as AccountAddressesRoute } from './account.addresses';
import { Route as AccountOrdersRoute } from './account.orders';
import { Route as AccountOrderDetailRoute } from './account.orders.$orderNumber';
import { Route as AccountSettingsRoute } from './account.settings';
import { Route as AboutRoute } from './about';
import { Route as BlogRoute } from './blog';
import { Route as BlogPostRoute } from './blog.$slug';
import { Route as CareersRoute } from './careers';
import { Route as PressRoute } from './press';
import { Route as HelpRoute } from './help';
import { Route as TermsRoute } from './terms';
import { Route as PrivacyRoute } from './privacy';
import { Route as CancellationRefundsRoute } from './cancellation-refunds';
import { Route as RegisterProfessionalRoute } from './register-professional';
import { Route as PartnerAppRoute } from './partner-app';
import { Route as VendorResourcesRoute } from './vendor-resources';

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
  AccountIndexRoute,
  AccountProfileRoute,
  AccountAddressesRoute,
  AccountOrdersRoute,
  AccountOrderDetailRoute,
  AccountSettingsRoute,
  AboutRoute,
  BlogRoute,
  BlogPostRoute,
  CareersRoute,
  PressRoute,
  HelpRoute,
  TermsRoute,
  PrivacyRoute,
  CancellationRefundsRoute,
  RegisterProfessionalRoute,
  PartnerAppRoute,
  VendorResourcesRoute,
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
