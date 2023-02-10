import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountChangeDefaultAddressUseCase } from './AccountChangeDefaultAddressUseCase';

export class AccountChangeDefaultAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const accountChangeDefaultAddressUseCase = container.resolve(
      AccountChangeDefaultAddressUseCase,
    );

    const data = await accountChangeDefaultAddressUseCase.execute({
      cod_conta: request.user.id,
      cod_endereco: request.body.cod_endereco ?? '',
    });

    return response.json(data);
  }
}
