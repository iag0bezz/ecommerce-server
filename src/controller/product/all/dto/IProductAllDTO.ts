import { IBaseSearchDTO } from '@shared/dtos/IBaseSearchDTO';

export interface IProductAllDTO extends IBaseSearchDTO {
  account_id?: bigint | number;

  descricao?: string;
  descricao_marca?: string;
  origem_produto?: string;
  detalhe_produto?: string;
  cod_grupo?: string | string[];
  cod_subgrupo?: string;
  descricao_subgrupo?: string;
  descricao_grupo?: string;
  cod_marca?: string;
  cod_campanha?: string;
  estoque?: boolean;
  desconto?: boolean;

  sort?: string;

  cod_produto?: string;
  codigo_barras?: string;
}
