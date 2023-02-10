import { connection } from 'database';

export interface IProduct {
  cod_produto: string;
  descricao: string;
  agrupamento: string;
  fornecedor: string;
  loja_fornecedor: string;
  tipo: string;
  grupo: string;
  marca: string;
  descricao_marca: string;
  codigo_barras: string;
  multiplo_venda: number;
  conversao_nota: number;
  unidade_venda: string;
  fragrancia: string;
  origem_produto: string;
  ultima_compra: string;
  rank_qtd_venda: number;
  rank_valor_venda: number;
}

export const Product = connection<IProduct>('PRODUTO');
