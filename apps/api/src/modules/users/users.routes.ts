import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate } from '../../common/middleware/authenticate';
import { validate } from '../../common/middleware/validate';
import { changePasswordSchema, addressSchema } from '@ecommerce/shared';
import { BadRequestError, NotFoundError } from '../../common/errors/AppError';

export const userRoutes = Router();

userRoutes.use(authenticate);

const userAddresses = new Map<string, any[]>();
const userWishlists = new Map<string, string[]>(); // userId -> productIds

// GET /users/me
userRoutes.get('/me', (req, res) => {
  res.json({ data: req.user });
});

// POST /users/me/change-password
userRoutes.post('/me/change-password', validate(changePasswordSchema), async (req, res) => {
  res.json({ data: { message: 'Password updated successfully' } });
});

// GET /users/me/addresses
userRoutes.get('/me/addresses', (req, res) => {
  const addresses = userAddresses.get(req.user!.id) || [
    {
      id: 'addr-1',
      fullName: 'Lady Genevieve Vance',
      phone: '+1 (555) 349-8201',
      line1: '740 Park Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'US',
      isDefault: true,
    },
  ];
  res.json({ data: addresses });
});

// POST /users/me/addresses
userRoutes.post('/me/addresses', validate(addressSchema), (req, res) => {
  const userId = req.user!.id;
  const current = userAddresses.get(userId) || [];
  const newAddr = {
    id: `addr-${Date.now()}`,
    userId,
    ...req.body,
  };
  current.push(newAddr);
  userAddresses.set(userId, current);
  res.status(201).json({ data: newAddr });
});

// GET /users/me/wishlist
userRoutes.get('/me/wishlist', (req, res) => {
  const items = userWishlists.get(req.user!.id) || ['prod-1', 'prod-2'];
  res.json({ data: items });
});
