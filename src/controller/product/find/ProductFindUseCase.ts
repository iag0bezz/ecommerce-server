import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { HttpError } from '@shared/error/HttpError';

interface IRequest {
  id: string;
}

@injectable()
export class ProductFindUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ id }: IRequest) {
    this.logger.log(`Product/Find searching product ID: ${id}`);

    const result = await connection.raw(`
      SELECT 
        TRIM(P.cod_produto) cod_produto,
        TRIM(P.descricao) descricao,
        P.agrupamento,
        P.fornecedor,
        P.descricao_marca,
        TRIM(P.codigo_barras) codigo_barras,
        P.multiplo_venda,
        P.conversao_nota,
        TRIM(P.fragrancia) fragrancia,
        P.origem_produto,
        PI.imagens,
        PP.preco_venda preco_tabela,
        PE.qt_estoque estoque,
        PA.detalhe_produto,
        TRIM(PG.cod_subgrupo) cod_subgrupo,
        TRIM(PG.descricao_subgrupo) descricao_subgrupo,
        TRIM(PG.cod_grupo) cod_grupo,
        TRIM(PG.descricao_grupo) descricao_grupo,
        CP.desconto,
        CP.tipo_campanha,
        CP.qt_brinde,
        CP.cod_campanha,
        CP.descricao campanha_descricao,
        CP.mecanica campanha_mecanica
      FROM PRODUTO P
            
      INNER JOIN PRODUTO_PRECO PP 
        ON P.cod_produto = PP.cod_produto
        
      LEFT JOIN 
      (
        SELECT
          CP.cod_produto cod_produto,
          CP.valor desconto,
          CP.tipo_campanha,
          CP.qt_brinde,
          CP.cod_campanha,
          C.descricao,
          C.mecanica
        FROM
          CAMPANHA_PRODUTO CP
        
        INNER JOIN CAMPANHA C
          ON CP.cod_campanha = C.cod_campanha
      ) CP
        ON P.cod_produto = CP.cod_produto
        
      LEFT JOIN
      (
        SELECT
          cod_produto,
          SG.cod_subgrupo,
          SG.descricao AS descricao_subgrupo,
          G.cod_grupo,
          G.descricao AS descricao_grupo
        FROM
          PRODUTO_SUBGRUPO PS
          
        INNER JOIN SUBGRUPO SG 
          ON PS.cod_subgrupo = SG.cod_subgrupo AND SG.status = 1
        INNER JOIN GRUPO G
          ON SG.cod_grupo = G.cod_grupo AND G.status = 1
      ) PG
        ON P.cod_produto = PG.cod_produto
      
      
      LEFT JOIN
      (
        SELECT
          cod_produto,
          STRING_AGG(imagem, ', ') WITHIN GROUP (ORDER BY imagem) AS imagens
        FROM
          PRODUTO_IMAGEM
          
        GROUP BY
          cod_produto
      ) PI
        ON P.cod_produto = PI.cod_produto
              
      INNER JOIN PRODUTO_ESTOQUE PE
        ON P.cod_produto = PE.cod_produto
        
      LEFT JOIN PRODUTO_AUXILIAR PA
              ON P.cod_produto = PA.cod_produto       
      
      WHERE P.cod_produto = '${id}';
    `);

    if (result.length <= 0) {
      throw new HttpError('product/find.not-found');
    }

    const value = result[0];

    let price = value.preco_tabela;

    switch (value.tipo_campanha) {
      case '11': {
        price = value.desconto;
        value.desconto = 100 - (100 * price) / value.preco_tabela;
        break;
      }
      case '12': {
        price -= (price * value.desconto) / 100;
        break;
      }
      default: {
        break;
      }
    }

    return {
      ...value,
      imagens: value.imagens.split(', '),
      preco_venda: price,
      desconto: Math.floor(value.desconto),
    };
  }
}
