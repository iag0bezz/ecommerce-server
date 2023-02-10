import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountUpdateAddressUseCase } from './AccountUpdateAddressUseCase';

export class AccountUpdateAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const accountUpdateAddressUseCase = container.resolve(
      AccountUpdateAddressUseCase,
    );

    const data = await accountUpdateAddressUseCase.execute({
      cod_conta: request.user.id,
      cod_endereco: request.body.cod_endereco,
      data: request.body,
    });

    return response.json(data);
  }
}
