import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/authenticate';

export const adminRoutes = Router();

// Protect all admin API routes
adminRoutes.use(authenticate, authorize('admin', 'staff'));

// GET /admin/stats
adminRoutes.get('/stats', (req, res) => {
  res.json({
    data: {
      todaySalesCents: 245000,
      todayOrdersCount: 4,
      periodSalesCents: 1845000,
      periodOrdersCount: 28,
      newCustomersCount: 16,
      ordersByStatus: {
        pending: 1,
        paid: 3,
        processing: 6,
        shipped: 4,
        delivered: 14,
        cancelled: 0,
        refunded: 0,
      },
      topProducts: [
        {
          id: 'prod-1',
          name: 'Emerald & 18k Gold Solitaire Ring',
          totalSold: 12,
          revenueCents: 1500000,
        },
        {
          id: 'prod-2',
          name: 'Tailored Olive Silk Trench Coat',
          totalSold: 8,
          revenueCents: 544000,
        },
      ],
      lowStockItems: [
        {
          variantId: 'var-1a',
          productName: 'Emerald & 18k Gold Solitaire Ring',
          sku: 'RNG-EM-06',
          stockQuantity: 4,
          lowStockThreshold: 2,
        },
      ],
    },
  });
});
