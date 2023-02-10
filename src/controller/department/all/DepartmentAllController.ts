import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DepartmentAllUseCase } from './DepartmentAllUseCase';

export class DepartmentAllController {
  async handle(request: Request, response: Response): Promise<Response> {
    const departmentAllUseCase = container.resolve(DepartmentAllUseCase);

    const data = await departmentAllUseCase.execute();

    return response.json(data);
  }
}
