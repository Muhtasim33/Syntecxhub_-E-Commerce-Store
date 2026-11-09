import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { validate } from '../../common/middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '@ecommerce/shared';
import { BadRequestError, NotFoundError } from '../../common/errors/AppError';

export const orderRoutes = Router();

// In-memory or database order repository
const orders: any[] = [];

// POST /orders
orderRoutes.post('/', authenticate, validate(createOrderSchema), (req, res, next) => {
  try {
    const { email, shippingAddress, paymentMethod, couponCode } = req.body;
    const userId = req.user?.id;

    // Generate Sovereign Order Number
    const orderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30-min expiry per TRD

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId,
      email,
      status: paymentMethod === 'card' ? 'paid' : 'processing',
      paymentStatus: paymentMethod === 'card' ? 'paid' : 'unpaid',
      paymentMethod,
      subtotalCents: 125000,
      discountCents: couponCode ? 12500 : 0,
      shippingCents: 0,
      taxCents: 10000,
      totalCents: couponCode ? 122500 : 135000,
      currency: 'USD',
      shippingAddress,
      couponCode,
      trackingNumber: `DIPL-US-${Math.floor(100000 + Math.random() * 900000)}`,
      courier: 'Armored Diplomatic Transit',
      expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}`,
          productName: 'Emerald & 18k Gold Solitaire Ring',
          variantLabel: 'Size: 7, 18k Gold',
          sku: 'RNG-EM-07',
          unitPriceCents: 125000,
          quantity: 1,
          lineTotalCents: 125000,
        },
      ],
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          fromStatus: null,
          toStatus: paymentMethod === 'card' ? 'paid' : 'processing',
          note: 'Order successfully registered and allocation reserved.',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    orders.unshift(newOrder);

    res.status(201).json({
      data: newOrder,
    });
  } catch (err) {
    next(err);
  }
});

// GET /orders
orderRoutes.get('/', authenticate, (req, res) => {
  const userOrders = orders.filter((o) => o.userId === req.user?.id);
  res.json({ data: userOrders });
});

// GET /orders/:orderNumber
orderRoutes.get('/:orderNumber', authenticate, (req, res, next) => {
  const order = orders.find((o) => o.orderNumber === req.params.orderNumber);
  if (!order) {
    return next(new NotFoundError('Order not found'));
  }
  // Ownership check
  if (req.user?.role !== 'admin' && req.user?.role !== 'staff' && order.userId !== req.user?.id) {
    return next(new NotFoundError('Order not found'));
  }
  res.json({ data: order });
});

// POST /orders/:orderNumber/cancel
orderRoutes.post('/:orderNumber/cancel', authenticate, (req, res, next) => {
  const order = orders.find((o) => o.orderNumber === req.params.orderNumber);
  if (!order) {
    return next(new NotFoundError('Order not found'));
  }

  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return next(new BadRequestError(`Cannot cancel order in ${order.status} state`));
  }

  order.status = 'cancelled';
  order.statusHistory.push({
    id: `hist-${Date.now()}`,
    fromStatus: order.status,
    toStatus: 'cancelled',
    note: 'Customer requested cancellation before shipment.',
    createdAt: new Date().toISOString(),
  });

  res.json({ data: order });
});
