import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountListAddressUseCase } from './AccountListAddressUseCase';

export class AccountListAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const accountListAddressUseCase = container.resolve(
      AccountListAddressUseCase,
    );

    const data = await accountListAddressUseCase.execute({
      cod_conta: request.user.id,
    });

    return response.json(data);
  }
}
