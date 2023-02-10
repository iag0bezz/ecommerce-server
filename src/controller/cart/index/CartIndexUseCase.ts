import { connection } from 'database';
import { Cart, ICart, ICartProduct } from 'database/model/cart';
import { container, inject, injectable } from 'tsyringe';

import { HashProvider } from '@shared/container/provider/HashProvider';
import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  cod_carrinho: string;
  cod_conta?: number;
}

interface IResponse extends ICart {
  products: ICartProduct[];
}

@injectable()
export class CartIndexUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ cod_carrinho, cod_conta }: IRequest): Promise<IResponse> {
    if (cod_carrinho === undefined && cod_conta === -1) {
      throw new HttpError('cart/index.invalid-provided-values');
    }

    const conditional =
      cod_conta > 0
        ? `cod_conta = ${cod_conta}`
        : `cod_carrinho = '${cod_carrinho}'`;

    let result = await connection.raw(
      `SELECT * FROM CARRINHO WHERE ${conditional} AND status = 'A'`,
    );

    if (
      result.length > 0 &&
      result[0].cod_conta &&
      result[0].cod_conta !== cod_conta
    ) {
      throw new HttpError('cart/index.invalid-permission');
    }

    if (result.length > 0 && !result[0].cod_conta && cod_conta) {
      /*
        Attach and empty cart to a authenticated account if doesn't have "cod_conta" on cart object. 
      */
      await connection.raw(
        `UPDATE CARRINHO SET cod_conta = '${cod_conta}' WHERE cod_carrinho = '${cod_carrinho}'`,
      );
    }

    if (result.length <= 0) {
      const hashProvider = container.resolve(HashProvider);

      result = await Cart.insert({
        cod_carrinho: hashProvider.random(),
        status: 'A',
        ...(cod_conta !== -1 && {
          cod_conta,
        }),
      }).returning('*');
    }

    if (result.length <= 0) {
      throw new HttpError('cart/index.invalid-parameters');
    }

    const cart = result[0];

    const cart_items = await connection.raw(
      `SELECT * FROM CARRINHO_PRODUTO WHERE cod_carrinho = '${cart.cod_carrinho}'`,
    );

    return {
      ...cart,
      products: cart_items,
    };
  }
}
