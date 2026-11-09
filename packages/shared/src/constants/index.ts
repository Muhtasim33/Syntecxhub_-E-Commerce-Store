// Brand Colors matching PRD 4.10.2 & TRD 8.1
export const BRAND_COLORS = {
  emerald950: '#02110c', // Dark Emerald Green: header, footer, dark sections, text
  olive800: '#1a422f',   // Olive Green: primary buttons, links, active states
  cream100: '#f3ebd6',   // Cream Beige: page background, cards, text on dark
  olive700: '#25593f',   // Hover state
  cream300: '#e2d7bb',   // Borders, dividers
  muted: '#4a5a50',      // Secondary text
  gold400: '#c9a96e',    // Luxury highlights, ratings, sale badges
  success: '#2f7d4f',
  warning: '#b7791f',
  danger: '#b3402f',
} as const;

// Order Status Labels & Badges
export const ORDER_STATUS_DETAILS = {
  pending: {
    label: 'Pending',
    color: 'warning',
    description: 'Awaiting payment or confirmation',
  },
  paid: {
    label: 'Paid',
    color: 'success',
    description: 'Payment confirmed, preparing for fulfillment',
  },
  processing: {
    label: 'Processing',
    color: 'info',
    description: 'Order being packed and prepared for shipping',
  },
  shipped: {
    label: 'Shipped',
    color: 'info',
    description: 'Order has been handed over to the courier',
  },
  delivered: {
    label: 'Delivered',
    color: 'success',
    description: 'Order successfully delivered to customer',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'danger',
    description: 'Order has been cancelled',
  },
  refunded: {
    label: 'Refunded',
    color: 'muted',
    description: 'Payment has been refunded',
  },
} as const;

// Business limits matching PRD / TRD
export const BUSINESS_RULES = {
  ORDER_EXPIRY_MINUTES: 30,
  PASSWORD_RESET_EXPIRY_HOURS: 1,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 48,
  CURRENCY: 'USD',
  FREE_SHIPPING_THRESHOLD_CENTS: 15000, // $150.00
  STANDARD_SHIPPING_CENTS: 1000, // $10.00
  EXPRESS_SHIPPING_CENTS: 2500, // $25.00
  TAX_RATE: 0.08, // 8% default tax
} as const;
