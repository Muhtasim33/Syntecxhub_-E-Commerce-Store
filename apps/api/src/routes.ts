import { Router } from 'express';
import { healthRoutes } from './modules/health/health.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { productRoutes } from './modules/products/products.routes';
import { categoryRoutes } from './modules/categories/categories.routes';
import { cartRoutes } from './modules/cart/cart.routes';
import { orderRoutes } from './modules/orders/orders.routes';
import { userRoutes } from './modules/users/users.routes';
import { paymentRoutes } from './modules/payments/payments.routes';
import { adminRoutes } from './modules/admin/admin.routes';

export const apiV1Routes = Router();

apiV1Routes.use('/health', healthRoutes);
apiV1Routes.use('/auth', authRoutes);
apiV1Routes.use('/products', productRoutes);
apiV1Routes.use('/categories', categoryRoutes);
apiV1Routes.use('/cart', cartRoutes);
apiV1Routes.use('/orders', orderRoutes);
apiV1Routes.use('/users', userRoutes);
apiV1Routes.use('/payments', paymentRoutes);
apiV1Routes.use('/admin', adminRoutes);
