import { MaxiPagoSDK } from 'maxipago-sdk-js';

export default MaxiPagoSDK(
  {
    merchantId: process.env.MAXIPAGO_MERCHANT_ID,
    merchantKey: process.env.MAXIPAGO_MERCHANT_KEY,
  },
  'development',
);
