import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';

interface IRequest {
  value: any;
}

@injectable()
export class CartCouponUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ value }: IRequest) {
    return value;
  }
}
