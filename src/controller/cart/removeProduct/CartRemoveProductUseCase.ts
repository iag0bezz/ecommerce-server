import { connection } from 'database';
import { ICart, ICartProduct } from 'database/model/cart';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  cod_carrinho: string;
  cod_conta: number;
  cod_produto: string;
}

interface IResponse extends ICart {
  items: ICartProduct[];
}

@injectable()
export class CartRemoveProductUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({
    cod_carrinho,
    cod_conta,
    cod_produto,
  }: IRequest): Promise<IResponse> {
    const conditional =
      cod_conta > 0
        ? `cod_conta = ${cod_conta}`
        : `cod_carrinho = '${cod_carrinho}'`;

    const result = await connection.raw(
      `SELECT * FROM CARRINHO WHERE ${conditional} AND status = 'A'`,
    );

    if (result.length <= 0) {
      throw new HttpError('cart/remove.invalid-cart');
    }

    if (result[0].cod_conta && result[0].cod_conta !== cod_conta) {
      throw new HttpError('cart/remove.no-permission');
    }

    const deleteConditional =
      cod_produto === '*'
        ? `cod_carrinho = '${cod_carrinho}'`
        : `cod_produto = '${cod_produto}'`;

    await connection.raw(
      `DELETE FROM CARRINHO_PRODUTO WHERE ${deleteConditional}`,
    );

    const cart_items = await connection.raw(
      `SELECT * FROM CARRINHO_PRODUTO WHERE cod_carrinho = '${result[0].cod_carrinho}'`,
    );

    return {
      ...result[0],
      items: cart_items,
    };
  }
}
