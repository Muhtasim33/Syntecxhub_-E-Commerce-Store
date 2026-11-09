import { Router } from 'express';
import { authenticate, authorize } from '../../common/middleware/authenticate';
import { validate } from '../../common/middleware/validate';
import { categorySchema } from '@ecommerce/shared';

export const categoryRoutes = Router();

const categories = [
  {
    id: 'cat-1',
    name: 'Fine Jewelry',
    slug: 'fine-jewelry',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-2',
    name: 'Luxury Apparel',
    slug: 'luxury-apparel',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    sortOrder: 2,
    isActive: true,
  },
];

// GET /categories
categoryRoutes.get('/', (req, res) => {
  res.json({ data: categories });
});

// POST /categories (Admin)
categoryRoutes.post('/', authenticate, authorize('admin', 'staff'), validate(categorySchema), (req, res) => {
  const newCat = {
    id: `cat-${Date.now()}`,
    ...req.body,
  };
  categories.push(newCat);
  res.status(201).json({ data: newCat });
});
