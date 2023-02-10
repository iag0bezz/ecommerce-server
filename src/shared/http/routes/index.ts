import { Router } from 'express';

import { accountRoutes } from './account';
import { cartRoutes } from './cart';
import { departmentRoutes } from './department';
import { homeRoutes } from './home';
import { paymentRoutes } from './payment';
import { productRoutes } from './product';

const routes = Router();

routes.use('/account', accountRoutes);
routes.use('/product', productRoutes);
routes.use('/cart', cartRoutes);
routes.use('/department', departmentRoutes);
routes.use('/home', homeRoutes);
routes.use('/payment', paymentRoutes);

export { routes };
