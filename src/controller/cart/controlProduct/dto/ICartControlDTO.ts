export interface ICartControlProductDTO {
  cod_carrinho: string;
  cod_conta?: number;

  cod_produto: number;
  quantity: number;

  operation: '+' | '-';
}
