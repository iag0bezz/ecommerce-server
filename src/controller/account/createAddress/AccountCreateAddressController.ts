import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountCreateAddressUseCase } from './AccountCreateAddressUseCase';

export class AccountCreateAddressController {
  async handle(request: Request, response: Response): Promise<Response> {
    const accountCreateAddressUseCase = container.resolve(
      AccountCreateAddressUseCase,
    );

    const data = await accountCreateAddressUseCase.execute({
      account_id: request.user.id,
      data: request.body,
    });

    return response.json(data);
  }
}
