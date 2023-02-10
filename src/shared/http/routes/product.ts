import { ProductAllController } from 'controller/product/all/ProductAllController';
import { ProductFindController } from 'controller/product/find/ProductFindController';
import { ProductOfferController } from 'controller/product/offer/ProductOfferController';
import { Router } from 'express';

const productRoutes = Router();

productRoutes.get('/:id', new ProductFindController().handle);
productRoutes.post('/', new ProductAllController().handle);
productRoutes.post('/offer', new ProductOfferController().handle);

export { productRoutes };
