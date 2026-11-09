import { Router } from 'express';
import { NotFoundError } from '../../common/errors/AppError';

export const productRoutes = Router();

// Products Catalog Data matching TRD & Seed
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
  {
    id: 'cat-3',
    name: 'Organic Fragrances',
    slug: 'organic-fragrances',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-4',
    name: 'Artisanal Home',
    slug: 'artisanal-home',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    sortOrder: 4,
    isActive: true,
  },
];

const products = [
  {
    id: 'prod-1',
    categoryId: 'cat-1',
    name: 'Emerald & 18k Gold Solitaire Ring',
    slug: 'emerald-18k-gold-solitaire-ring',
    description:
      'Handcrafted in Colombia with an ethically sourced deep-emerald cut natural beryl, set in recycled 18k yellow gold with satin brushed finish. Designed for timeless luxury.',
    basePriceCents: 125000,
    status: 'active',
    avgRating: 4.9,
    reviewCount: 38,
    images: [
      {
        id: 'img-1a',
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: 'var-1a',
        sku: 'RNG-EM-06',
        optionValues: { size: '6', metal: '18k Gold' },
        priceCents: 125000,
        compareAtPriceCents: 140000,
        stockQuantity: 4,
        reservedQuantity: 0,
        lowStockThreshold: 2,
      },
      {
        id: 'var-1b',
        sku: 'RNG-EM-07',
        optionValues: { size: '7', metal: '18k Gold' },
        priceCents: 125000,
        compareAtPriceCents: 140000,
        stockQuantity: 8,
        reservedQuantity: 0,
        lowStockThreshold: 2,
      },
    ],
  },
  {
    id: 'prod-2',
    categoryId: 'cat-2',
    name: 'Tailored Olive Silk Trench Coat',
    slug: 'tailored-olive-silk-trench-coat',
    description:
      'Crafted from 100% heavyweight mulberry silk twill with double-breasted horn buttons, a structured storm flap, and a detachable waist tie in rich botanical olive.',
    basePriceCents: 68000,
    status: 'active',
    avgRating: 4.8,
    reviewCount: 22,
    images: [
      {
        id: 'img-2a',
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80',
        sortOrder: 0,
      },
    ],
    variants: [
      {
        id: 'var-2a',
        sku: 'TRN-OLV-S',
        optionValues: { size: 'S', color: 'Olive Green' },
        priceCents: 68000,
        stockQuantity: 5,
        reservedQuantity: 0,
        lowStockThreshold: 2,
      },
    ],
  },
];

// GET /products
productRoutes.get('/', (req, res) => {
  const { q, category, minPrice, maxPrice, sort, page = '1', limit = '20' } = req.query;

  let result = products.filter((p) => p.status === 'active');

  if (category) {
    const cat = categories.find((c) => c.slug === category);
    if (cat) {
      result = result.filter((p) => p.categoryId === cat.id);
    }
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  if (minPrice) {
    result = result.filter((p) => p.basePriceCents >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.basePriceCents <= Number(maxPrice));
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.basePriceCents - b.basePriceCents);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.basePriceCents - a.basePriceCents);
  }

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 20;
  const total = result.length;
  const paginated = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    data: paginated,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /products/:slug
productRoutes.get('/:slug', (req, res, next) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) {
    return next(new NotFoundError('Product creation not found'));
  }
  res.json({ data: product });
});

// GET /categories
productRoutes.get('/categories/all', (req, res) => {
  res.json({ data: categories });
});
