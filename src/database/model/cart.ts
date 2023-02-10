import { connection } from 'database';

export interface ICart {
  cod_carrinho: string;
  cod_conta: number;
  cod_cupom: number;
  status: string;
  data_criacao: Date;
  data_update: Date;
}

export interface ICartProduct {
  cod_carrinho: string;
  cod_produto: number;
  cod_campanha: number;
  preco_venda: number;
  preco_tabela: number;
  desconto: number;
  quantidade: number;
  ordem: number;
  data_criacao: Date;
  data_update: Date;
}

export const Cart = connection<ICart>('CARRINHO');
export const CartProduct = connection<ICartProduct>('CARRINHO_PRODUTO');
