/**
 * DTOs mirrored from service-hub-backend (plain JS, no shared .d.ts to import —
 * see Mongoose models under src/features/*\/models and Zod validators under
 * src/features/*\/validators). Keep in sync manually; field names/shapes here are
 * traced directly against backend source, not guessed.
 */

// ---------- Shared ----------

export interface ImageRef {
  key: string;
  url: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiSuccessEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
  success: true;
}

export interface ApiErrorEnvelope {
  success: false;
  status: number;
  message: string;
  errors?: { field: string; message: string }[];
}

// ---------- Auth ----------

export type Identity = 'user' | 'vendor' | 'admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CustomerProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  avatar?: ImageRef | null;
  isVerified: boolean;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  defaultAddress?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignupPayload {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

// ---------- Catalog ----------

export type DisplayType = 'navigate' | 'modal';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: ImageRef | null;
  displayType: DisplayType;
  sortOrder: number;
  isActive: boolean;
  /** Only present on GET /categories list responses, computed via aggregation — absent on getById. */
  hasChildren?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: ImageRef | null;
  category: string;
  displayType: DisplayType;
  sortOrder: number;
  isActive: boolean;
  /** Only present on GET /subcategories list responses — absent on getById. */
  hasChildren?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceGroup {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: ImageRef | null;
  subcategory: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogRating {
  average: number;
  count: number;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  mrp?: number;
  durationMins: number;
  bullets: string[];
  unitPriceLabel?: string;
  images: ImageRef[];
  rating: CatalogRating;
  serviceGroup: string;
  subcategory: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddOn {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: ImageRef | null;
  service: string | null;
  serviceGroup: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListCatalogParams {
  page?: number;
  limit?: number;
  isActive?: 'true' | 'false';
}

// ---------- Address ----------

export type AddressLabel = 'Home' | 'Work' | 'Other';

export interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  label: AddressLabel;
  landmark?: string | null;
  country: string;
  completeAddress: string;
  geolocation?: { lat: number; lng: number } | null;
  isDefault: boolean;
}

export interface AddressPayload {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  label?: AddressLabel;
  landmark?: string;
  country?: string;
  geolocation?: { lat: number; lng: number };
}

// ---------- Cart ----------

export type CartItemType = 'service' | 'product';

export interface CartAddOnLine {
  _id: string;
  name: string | null;
  price: number | null;
  unavailable: boolean;
}

export interface CartLineItem {
  _id: string;
  itemType: CartItemType;
  refId: string;
  quantity: number;
  addedAt: string;
  unavailable: boolean;
  name: string | null;
  price: number | null;
  image: ImageRef | null;
  durationMins?: number | null;
  selectedAddons?: CartAddOnLine[];
}

export interface CartDocument {
  _id: string;
  user: string;
  items: {
    _id: string;
    itemType: CartItemType;
    refId: string;
    quantity: number;
    selectedAddons: string[];
    addedAt: string;
  }[];
}

export interface PopulatedCart {
  cart: CartDocument;
  items: CartLineItem[];
}

export interface AddCartItemPayload {
  itemType: CartItemType;
  refId: string;
  quantity?: number;
  selectedAddons?: string[];
}

export interface UpdateCartItemPayload {
  quantity?: number;
  selectedAddons?: string[];
}

// ---------- Checkout / Orders ----------

export interface CheckoutPayload {
  addressId: string;
  scheduledDate?: string;
  scheduledSlot?: string;
  paymentMethod: 'razorpay';
}

export interface CheckoutResult {
  serviceOrder?: { orderNumber: string; totalAmount: number };
  productOrder?: { orderNumber: string; totalAmount: number };
  payment: {
    gatewayOrderId: string;
    keyId: string;
    amount: number;
    currency: string;
  };
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type ServiceOrderStatus = 'pending' | 'confirmed' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';

export interface AddressSnapshot {
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  geolocation?: { lat: number; lng: number };
  label?: string;
}

export interface ServiceOrderItem {
  serviceId: string;
  serviceNameSnapshot: string;
  priceSnapshot: number;
  durationSnapshot: number;
  addonsSnapshot: { name: string; price: number }[];
}

export interface CustomerOrder {
  _id: string;
  orderNumber: string;
  orderType: 'service' | 'product';
  user: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  addressSnapshot: AddressSnapshot;
  createdAt: string;
  updatedAt: string;
  // ServiceOrder-only fields (present when orderType === 'service')
  items?: ServiceOrderItem[];
  scheduledDate?: string;
  scheduledSlot?: string;
  status?: ServiceOrderStatus;
}

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  type?: 'service' | 'product';
}
