import { connection } from 'database';
import { ICart, ICartProduct } from 'database/model/cart';
import { container, inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

import { CartIndexUseCase } from '../index/CartIndexUseCase';
import { ICartControlProductDTO } from './dto/ICartControlDTO';

type IRequest = ICartControlProductDTO;

interface IResponse extends ICart {
  products: ICartProduct[];
}

@injectable()
export class CartControlProductUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({
    cod_carrinho,
    cod_conta,
    cod_produto,
    quantity = 0,
    operation,
  }: IRequest): Promise<IResponse> {
    if (operation !== '+' && operation !== '-') {
      throw new HttpError('cart/control-product.invalid-operation');
    }

    if (quantity <= 0) {
      throw new HttpError('cart/control-product.invalid-operation');
    }

    const result = await container
      .resolve(CartIndexUseCase)
      .execute({ cod_carrinho, cod_conta });

    const product = await connection.raw(`
      SELECT * FROM PRODUTO WHERE cod_produto = '${cod_produto}'
    `);

    if (product.length <= 0) {
      throw new HttpError('cart/control-product.invalid-product');
    }

    await connection.raw(`
      MERGE INTO [CARRINHO_PRODUTO] A 

      USING (
        SELECT  
          [cod_carrinho],
          [cod_produto],
          [quantidade] ${operation} ${quantity} [quantidade],
          [ordem]
          FROM 
              [ecommerce_exalla_dev].[dbo].[CARRINHO_PRODUTO]
          
          WHERE 
            [cod_carrinho] = '${cod_carrinho}'
            AND                   
            [cod_produto] = '${cod_produto}'
      
        UNION ALL 
      
        SELECT 
          '${cod_carrinho}' [cod_carrinho],
          '${cod_produto}' [cod_produto], 
          ${quantity} [quantidade],
          0 [ordem]
        
        WHERE NOT EXISTS (
          SELECT
            1
          FROM  
            [ecommerce_exalla_dev].[dbo].[CARRINHO_PRODUTO]
            
          WHERE 
            [cod_carrinho] = '${cod_carrinho}'
            AND 
            [cod_produto] = '${cod_produto}' 
          )
      ) B 
      
      ON ( 
        A.[cod_carrinho] = b.[cod_carrinho] 
          AND 
          A.[cod_produto] = b.[cod_produto]  
      )
      
      WHEN MATCHED THEN 
        UPDATE SET A.[quantidade] = B.[quantidade] 
      WHEN NOT MATCHED THEN 
        INSERT (
          [cod_carrinho],
          [cod_produto],
          [quantidade],
          [ordem] 
        ) 
          VALUES ( 
          b.[cod_carrinho],
          b.[cod_produto],
          b.[quantidade],
          b.[ordem] 
        );
        
      DELETE FROM CARRINHO_PRODUTO WHERE quantidade <= 0;
    `);

    const cart_items = await connection.raw(`
      SELECT * FROM CARRINHO_PRODUTO WHERE cod_carrinho = '${cod_carrinho}'
    `);

    return {
      ...result,
      products: cart_items,
    };
  }
}
