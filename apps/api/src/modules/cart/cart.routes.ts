import { Router } from 'express';
import { authenticate } from '../../common/middleware/authenticate';
import { validate } from '../../common/middleware/validate';
import { addToCartSchema, mergeCartSchema } from '@ecommerce/shared';

export const cartRoutes = Router();

const userCarts = new Map<string, any[]>(); // userId -> items

// GET /cart
cartRoutes.get('/', authenticate, (req, res) => {
  const userId = req.user?.id || 'guest';
  const items = userCarts.get(userId) || [];
  const subtotalCents = items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

  res.json({
    data: {
      items,
      subtotalCents,
      totalCents: subtotalCents,
    },
  });
});

// POST /cart/items
cartRoutes.post('/items', authenticate, validate(addToCartSchema), (req, res) => {
  const userId = req.user?.id || 'guest';
  const { variantId, quantity } = req.body;

  let current = userCarts.get(userId) || [];
  const existingIdx = current.findIndex((i) => i.variantId === variantId);

  if (existingIdx > -1) {
    current[existingIdx].quantity += quantity;
  } else {
    current.push({
      variantId,
      quantity,
      priceCents: 125000,
    });
  }

  userCarts.set(userId, current);
  res.status(201).json({ data: { message: 'Item added to server cart', items: current } });
});

// POST /cart/merge (Guest to user on login per TRD 7.3)
cartRoutes.post('/merge', authenticate, validate(mergeCartSchema), (req, res) => {
  const userId = req.user!.id;
  const { items } = req.body;

  let current = userCarts.get(userId) || [];

  for (const item of items) {
    const existing = current.find((i) => i.variantId === item.variantId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      current.push({
        variantId: item.variantId,
        quantity: item.quantity,
        priceCents: 125000,
      });
    }
  }

  userCarts.set(userId, current);
  res.json({ data: { message: 'Cart merged successfully', items: current } });
});
