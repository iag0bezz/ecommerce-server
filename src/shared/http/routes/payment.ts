import { PaymentCreateCardController } from 'controller/payment/createCard/PaymentCreateCardController';
import { PaymentCreateCheckoutController } from 'controller/payment/createCheckout/PaymentCreateCheckoutController';
import { PaymentCreateClientController } from 'controller/payment/createClient/PaymentCreateClientController';
import { PaymentListCardController } from 'controller/payment/listCard/PaymentListCardController';
import { Router } from 'express';

const paymentRoutes = Router();

paymentRoutes.post(
  '/create-customer',
  new PaymentCreateClientController().handle,
);

paymentRoutes.get('/list-card', new PaymentListCardController().handle);

paymentRoutes.post('/create-card', new PaymentCreateCardController().handle);

paymentRoutes.post(
  '/create-checkout',
  new PaymentCreateCheckoutController().handle,
);

export { paymentRoutes };
