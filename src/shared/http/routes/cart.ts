import { CartControlProductController } from 'controller/cart/controlProduct/CartControlProductController';
import { CartIndexController } from 'controller/cart/index/CartIndexController';
import { CartRemoveProductController } from 'controller/cart/removeProduct/CartRemoveProductController';
import { Router } from 'express';

const cartRoutes = Router();

cartRoutes.post('/', new CartIndexController().handle);
cartRoutes.post('/control', new CartControlProductController().handle);
cartRoutes.post('/remove', new CartRemoveProductController().handle);

export { cartRoutes };
