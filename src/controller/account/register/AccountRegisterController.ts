import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountRegisterUseCase } from './AccountRegisterUseCase';
import { IAccountRegisterDTO } from './dto/IAccountRegisterDTO';

type IRequest = IAccountRegisterDTO;

export class AccountRegisterController {
  async handle(request: Request, response: Response): Promise<Response> {
    const body = request.body as IRequest;

    const accountRegisterUseCase = container.resolve(AccountRegisterUseCase);

    const data = await accountRegisterUseCase.execute(body);

    return response.json(data);
  }
}
