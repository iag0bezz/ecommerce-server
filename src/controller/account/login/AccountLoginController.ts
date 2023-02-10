import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AccountLoginUseCase } from './AccountLoginUseCase';
import { IAccountLoginDTO } from './dto/IAccountLoginDTO';

type IRequest = IAccountLoginDTO;

export class AccountLoginController {
  async handle(request: Request, response: Response): Promise<Response> {
    const body = request.body as IRequest;

    const accountLoginUseCase = container.resolve(AccountLoginUseCase);

    const data = await accountLoginUseCase.execute(body);

    return response.json(data);
  }
}
