import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { MeUseCase } from './MeUseCase';

export class MeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const meUseCase = container.resolve(MeUseCase);

    const data = await meUseCase.execute({ id });

    return response.json(data);
  }
}
