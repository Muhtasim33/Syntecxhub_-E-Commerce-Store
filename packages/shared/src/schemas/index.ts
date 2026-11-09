import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Address Schema
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(6, 'Valid phone number is required').max(20),
  line1: z.string().min(3, 'Address line 1 is required').max(255),
  line2: z.string().max(255).optional().nullable(),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State or province is required').max(100),
  postalCode: z.string().min(2, 'Postal code is required').max(20),
  country: z.string().min(2, 'Country code is required').max(100).default('US'),
  isDefault: z.boolean().default(false),
});
export type AddressInput = z.infer<typeof addressSchema>;

// Cart Schemas
export const addToCartSchema = z.object({
  variantId: z.string().uuid('Invalid variant ID'),
  quantity: z.number().int().positive('Quantity must be at least 1').default(1),
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

export const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ),
});
export type MergeCartInput = z.infer<typeof mergeCartSchema>;

export const couponSchema = z.object({
  code: z.string().min(2, 'Coupon code is required').max(50),
});
export type CouponInput = z.infer<typeof couponSchema>;

// Checkout & Order Schemas
export const checkoutQuoteSchema = z.object({
  shippingAddress: addressSchema,
  shippingMethodId: z.string().optional(),
  couponCode: z.string().optional().nullable(),
});
export type CheckoutQuoteInput = z.infer<typeof checkoutQuoteSchema>;

export const createOrderSchema = z.object({
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  paymentMethod: z.enum(['card', 'cod']),
  couponCode: z.string().optional().nullable(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]),
  note: z.string().max(500).optional(),
  trackingNumber: z.string().max(100).optional(),
  courier: z.string().max(100).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Product Schemas (Admin)
export const productVariantSchema = z.object({
  sku: z.string().min(2).max(100),
  optionValues: z.record(z.string()),
  priceCents: z.number().int().nonnegative('Price cannot be negative'),
  compareAtPriceCents: z.number().int().nonnegative().optional().nullable(),
  stockQuantity: z.number().int().nonnegative('Stock cannot be negative').default(0),
  lowStockThreshold: z.number().int().nonnegative().default(5),
});

export const productSchema = z.object({
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional().nullable(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(250),
  description: z.string().min(10),
  basePriceCents: z.number().int().positive(),
  status: z.enum(['draft', 'active', 'archived']).default('active'),
  metaTitle: z.string().max(100).optional().nullable(),
  metaDescription: z.string().max(255).optional().nullable(),
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: z.string().optional().nullable(),
      sortOrder: z.number().int().default(0),
    })
  ).min(1, 'At least one image is required'),
  variants: z.array(productVariantSchema).min(1, 'At least one variant is required'),
});
export type ProductInput = z.infer<typeof productSchema>;

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(120),
  parentId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// Query Filters
export const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'popularity']).default('newest'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
