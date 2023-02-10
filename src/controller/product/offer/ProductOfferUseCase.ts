import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { normalize } from '@shared/util/string';

import { IProductOfferDTO } from './dto/IProductOfferDTO';

type IRequest = IProductOfferDTO;

@injectable()
export class ProductOfferUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({
    page = 0,
    limit = 20,
    descricao = '',
    cod_campanha = '',
    descricao_marca = '',
    cod_grupo = '',
    cod_subgrupo = '',
    sort = 'cod_produto',
  }: IRequest) {
    const sortValues = {
      cod_produto: 'P.cod_produto',
      descricao: 'P.descricao',
      preco_venda: 'preco_tabela',
      qt_estoque: 'estoque',
      desconto: 'CP.desconto',
    };

    const optionalVariables = this.getOptionalVariables([
      {
        key: 'P.descricao',
        value: descricao,
      },
      {
        key: 'P.descricao_marca',
        value: descricao_marca,
      },
      {
        key: 'PG.cod_grupo',
        value: cod_grupo,
      },
      {
        key: 'PG.cod_subgrupo',
        value: cod_subgrupo,
      },
      {
        key: 'CP.cod_campanha',
        value: cod_campanha,
      },
      {
        key: 'P.descricao_marca',
        value: descricao_marca,
      },
    ]);

    const result = await connection.raw(`
      SELECT 
        P.cod_produto,
        P.descricao,
        P.agrupamento,
        P.fornecedor,
        P.descricao_marca,
        P.codigo_barras,
        P.multiplo_venda,
        P.conversao_nota,
        P.fragrancia,
        P.origem_produto,
        PI.imagens,
        PP.preco_venda preco_tabela,
        PE.qt_estoque,
        PA.detalhe_produto,
        PG.cod_subgrupo,
        PG.descricao_subgrupo,
        PG.cod_grupo,
        PG.descricao_grupo,
        CP.tipo_campanha,
        CP.qt_brinde,
        CP.cod_campanha,
        CP.descricao campanha_descricao,
        CP.mecanica campanha_mecanica,
        desconto = CASE
          WHEN tipo_campanha = 11 THEN
            100 - (100 * CP.desconto) / PP.preco_venda
          ELSE
            CP.desconto
        END,
        preco_venda = CASE
          WHEN tipo_campanha = 11 THEN
            CP.desconto
          WHEN tipo_campanha = 12 THEN
            PP.preco_venda - (PP.preco_venda * CP.desconto) / 100
          ELSE
            PP.preco_venda
        END
      FROM PRODUTO P
            
      LEFT JOIN PRODUTO_PRECO PP 
        ON P.cod_produto = PP.cod_produto
        
      INNER JOIN 
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
              
      LEFT JOIN PRODUTO_ESTOQUE PE
        ON P.cod_produto = PE.cod_produto
        
      LEFT JOIN PRODUTO_AUXILIAR PA
        ON P.cod_produto = PA.cod_produto

      WHERE
        P.cod_produto IS NOT NULL
        ${optionalVariables.trim().length > 0 ? 'AND' : ''}
        ${optionalVariables}

      ORDER BY
        ${(sort && sortValues[sort.split(' ')[0]]) ?? 'cod_produto'} ${
      (sort && sort.split(' ')[1]) ?? ''
    }
      OFFSET ${page === 0 ? 0 : page * limit} rows FETCH NEXT ${limit} ROWS ONLY
    `);

    return result.map(value => {
      normalize(value);

      return {
        ...value,
        imagens: value.imagens.split(', '),
        desconto: Math.floor(value.desconto),
      };
    });
  }
  private getOptionalVariables(
    values: { key: string; value: string | string[] }[],
  ) {
    let mandatoryVariables = '';
    let optionalVariables = '';

    const or_operation = ['P.cod_produto', 'P.descricao', 'P.codigo_barras'];

    values.forEach(data => {
      if (data.value && data.value.length > 0) {
        if (or_operation.includes(data.key)) {
          if (optionalVariables.length <= 0) {
            optionalVariables = `( ${data.key} LIKE '%${data.value}%'`;
          } else {
            optionalVariables += ` OR ${data.key} LIKE '%${data.value}%'`;
          }
        } else {
          let query = '';

          if (Array.isArray(data.value)) {
            query = `${data.key} IN (${data.value})`;
          } else {
            query += `${data.key} LIKE '%${data.value}%'`;
          }

          if (mandatoryVariables.length <= 0) {
            mandatoryVariables = query;
          } else {
            mandatoryVariables += ` AND ${query}`;
          }
        }
      }
    });

    optionalVariables += optionalVariables.length > 0 ? ')' : '';

    return `${optionalVariables} ${
      optionalVariables.length > 0 && mandatoryVariables.length > 0 ? 'AND' : ''
    } ${mandatoryVariables}`;
  }
}
