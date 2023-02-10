import { HomeBrandController } from 'controller/home/brand/HomeBrandController';
import { HomeListController } from 'controller/home/list/HomeListController';
import { HomeOfferController } from 'controller/home/offer/HomeOfferController';
import { HomeSliderController } from 'controller/home/slider/HomeSliderController';
import { Router } from 'express';

const homeRoutes = Router();

homeRoutes.get('/', new HomeListController().handle);
homeRoutes.get('/slider', new HomeSliderController().handle);
homeRoutes.post('/brand', new HomeBrandController().handle);
homeRoutes.post('/offer', new HomeOfferController().handle);

export { homeRoutes };
