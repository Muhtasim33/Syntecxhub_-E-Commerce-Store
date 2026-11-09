// Enums matching PostgreSQL schema in TRD.md
export type Role = 'customer' | 'staff' | 'admin';

export type ProductStatus = 'draft' | 'active' | 'archived';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'card' | 'cod';

export type CouponType = 'percent' | 'fixed';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

// User & Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerifiedAt: string | null;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Address Types
export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Category & Brand
export interface Category {
  id: string;
  parentId?: string | null;
  name: string;
  slug: string;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

// Product & Variants
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  optionValues: Record<string, string>; // e.g. { size: "M", color: "Emerald" }
  priceCents: number;
  compareAtPriceCents?: number | null;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
}

export interface Product {
  id: string;
  categoryId: string;
  brandId?: string | null;
  name: string;
  slug: string;
  description: string;
  basePriceCents: number;
  status: ProductStatus;
  avgRating: number;
  reviewCount: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  brand?: Brand | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

// Cart Types
export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: ProductVariant & {
    product: Pick<Product, 'id' | 'name' | 'slug'> & {
      images: Pick<ProductImage, 'id' | 'url' | 'alt'>[];
    };
  };
}

export interface Cart {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  items: CartItem[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  couponCode?: string | null;
}

// Order Types
export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note?: string | null;
  changedBy?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  email: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  shippingAddress: Address;
  billingAddress?: Address;
  couponCode?: string | null;
  trackingNumber?: string | null;
  courier?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  statusHistory?: OrderStatusHistory[];
}

// Review
export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId?: string | null;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  createdAt: string;
  user?: Pick<User, 'id' | 'name'>;
}

// Wishlist
export interface WishlistItem {
  userId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

// API Standard Responses
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Admin Stats
export interface AdminDashboardStats {
  todaySalesCents: number;
  todayOrdersCount: number;
  periodSalesCents: number;
  periodOrdersCount: number;
  newCustomersCount: number;
  ordersByStatus: Record<OrderStatus, number>;
  topProducts: Array<{
    id: string;
    name: string;
    totalSold: number;
    revenueCents: number;
  }>;
  lowStockItems: Array<{
    variantId: string;
    productName: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
  }>;
}
