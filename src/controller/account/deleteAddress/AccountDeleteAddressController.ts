import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountDeleteAddressUseCase } from './AccountDeleteAddressUseCase';

export class AccountDeleteAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const accountDeleteAddressUseCase = container.resolve(
      AccountDeleteAddressUseCase,
    );

    const data = await accountDeleteAddressUseCase.execute({
      cod_conta: request.user.id,
      cod_endereco: request.body.cod_endereco ?? '',
    });

    return response.json(data);
  }
}
