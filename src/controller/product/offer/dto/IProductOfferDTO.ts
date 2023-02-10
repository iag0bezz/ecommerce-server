import { IBaseSearchDTO } from '@shared/dtos/IBaseSearchDTO';

export interface IProductOfferDTO extends IBaseSearchDTO {
  account_id?: bigint | number;

  descricao?: string;
  descricao_marca?: string;
  origem_produto?: string;
  detalhe_produto?: string;
  cod_grupo?: string;
  cod_subgrupo?: string;
  descricao_subgrupo?: string;
  descricao_grupo?: string;
  cod_campanha?: string;

  sort?: string;
}
