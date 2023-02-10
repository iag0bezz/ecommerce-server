import { AccountChangeDefaultAddressController } from 'controller/account/changeDefaultAddress/AccountChangeDefaultAddressController';
import { AccountCreateAddressController } from 'controller/account/createAddress/AccountCreateAddressController';
import { AccountDeleteAddressController } from 'controller/account/deleteAddress/AccountDeleteAddressController';
import { AccountListAddressController } from 'controller/account/listAddress/AccountListAddressController';
import { AccountLoginController } from 'controller/account/login/AccountLoginController';
import { MeController } from 'controller/account/me/MeController';
import { AccountRegisterController } from 'controller/account/register/AccountRegisterController';
import { AccountUpdateAddressController } from 'controller/account/updateAddress/AccountUpdateAddressController';
import { Router } from 'express';

import { ensureAuthenticated } from '../middleware/ensureAuthenticated';

const accountRoutes = Router();

accountRoutes.post('/register', new AccountRegisterController().handle);
accountRoutes.post('/login', new AccountLoginController().handle);

accountRoutes.get(
  '/address',
  ensureAuthenticated,
  new AccountListAddressController().handle,
);
accountRoutes.post(
  '/address',
  ensureAuthenticated,
  new AccountCreateAddressController().handle,
);
accountRoutes.delete(
  '/address',
  ensureAuthenticated,
  new AccountDeleteAddressController().handle,
);
accountRoutes.patch(
  '/address',
  ensureAuthenticated,
  new AccountUpdateAddressController().handle,
);
accountRoutes.put(
  '/address',
  ensureAuthenticated,
  new AccountChangeDefaultAddressController().handle,
);

accountRoutes.get('/me', ensureAuthenticated, new MeController().handle);

export { accountRoutes };
