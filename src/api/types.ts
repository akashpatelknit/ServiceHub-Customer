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

/**
 * PATCH /users/me only accepts these three fields (src/features/customer/validators/
 * profile.validation.js) — no phoneNumber (not editable via this endpoint) and no
 * avatar (no customer-reachable upload endpoint exists to produce a {key,url} for it).
 */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
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

// ---------- Search ----------

/**
 * GET /search results. Category and Subcategory matches are merged into one
 * `categories` array (type discriminates so the frontend can build the right link:
 * /category/:slug for 'category', /category/:categorySlug/:slug for 'subcategory').
 * `products` always ships empty today — Product has no slug/customer routes yet
 * (see src/features/search/services/search.service.js on the backend) — kept in the
 * shape so wiring real results in later is additive, not a rework.
 */
export interface SearchCategoryResult {
  id: string;
  name: string;
  slug: string;
  image: ImageRef | null;
  displayType: DisplayType;
  type: 'category' | 'subcategory';
  /** Only present when type is 'subcategory'. */
  categorySlug?: string | null;
}

export interface SearchServiceResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number | null;
  image: ImageRef | null;
  rating: CatalogRating;
  categorySlug: string | null;
  subcategorySlug: string | null;
}

export interface SearchResponse {
  query: string;
  categories: SearchCategoryResult[];
  services: SearchServiceResult[];
  products: unknown[];
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

/** src/features/product-order/constants/orderStatus.constants.js SHIPPING_STATUSES. */
export type ProductOrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'returned' | 'cancelled';

export type ShippingStatus =
  | 'pending'
  | 'shipment-created'
  | 'picked-up'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered'
  | 'failed'
  | 'rto';

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

export interface ProductOrderItem {
  productId: string;
  productNameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
}

/** Both ServiceOrder and ProductOrder push entries here on every status transition. */
export interface OrderStatusHistoryEntry {
  status: string;
  changedAt: string;
  changedBy?: string | null;
  changedByModel?: 'User' | 'Vendor' | 'Admin' | 'System';
}

interface CustomerOrderBase {
  _id: string;
  orderNumber: string;
  user: string;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  addressSnapshot: AddressSnapshot;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistoryEntry[];
}

export interface ServiceCustomerOrder extends CustomerOrderBase {
  orderType: 'service';
  items: ServiceOrderItem[];
  scheduledDate: string;
  scheduledSlot: string;
  /**
   * Raw ObjectId only — GET /orders/:orderNumber never populates this, so no vendor
   * name/contact reaches the customer. Only usable as an assigned/not-assigned flag.
   */
  assignedVendor: string | null;
  status: ServiceOrderStatus;
}

export interface ProductCustomerOrder extends CustomerOrderBase {
  orderType: 'product';
  items: ProductOrderItem[];
  shippingProvider: string;
  trackingId: string | null;
  awbNumber: string | null;
  courierName: string | null;
  shippingStatus: ShippingStatus;
  status: ProductOrderStatus;
}

export type CustomerOrder = ServiceCustomerOrder | ProductCustomerOrder;

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  type?: 'service' | 'product';
}

// ---------- Vendor leads ----------

/** POST /vendor-leads — interest-registration capture for the not-yet-built vendor onboarding flow, see src/features/vendor-leads on the backend. */
export interface VendorLeadPayload {
  name: string;
  phone: string;
  email: string;
  city: string;
  category: string;
}
