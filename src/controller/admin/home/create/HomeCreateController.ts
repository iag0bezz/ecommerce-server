import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IHomeCreateDTO } from './dto/IHomeCreateDTO';
import { HomeCreateUseCase } from './HomeCreateUseCase';

export class HomeCreateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const homeCreateUseCase = container.resolve(HomeCreateUseCase);

    const data = await homeCreateUseCase.execute({
      ...(request.body as IHomeCreateDTO),
    });

    return response.json(data);
  }
}
