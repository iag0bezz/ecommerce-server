/* eslint-disable no-return-assign */
import { ProductOfferUseCase } from 'controller/product/offer/ProductOfferUseCase';
import { connection } from 'database';
import { container, inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { normalize } from '@shared/util/string';

import { IHomeOfferDTO } from './dto/IHomeOfferDTO';

type IRequest = IHomeOfferDTO;

@injectable()
export class HomeOfferUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({
    page = 0,
    limit = 20,
    id_home = 0,
    offers = false,
  }: IRequest) {
    if (offers) {
      const productOfferUseCase = container.resolve(ProductOfferUseCase);

      return productOfferUseCase.execute({
        limit,
        page,
      });
    }

    const result = await connection.raw(`
      SELECT 
        *
      FROM
        HOME_PRODUTO HP
        
      INNER JOIN (
        SELECT
          P.cod_produto cod_produto_ref,
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
          PE.qt_estoque estoque,
          PA.detalhe_produto,
          PP.preco_venda preco_tabela,
          CP.desconto,
          CP.tipo_campanha,
          CP.qt_brinde,
          CP.cod_campanha,
          CP.descricao campanha_descricao,
          CP.mecanica campanha_mecanica,
          PG.cod_subgrupo,
          PG.descricao_subgrupo,
          PG.cod_grupo,
          PG.descricao_grupo
        FROM
          PRODUTO P
        
        INNER JOIN PRODUTO_PRECO PP
          ON P.cod_produto = PP.cod_produto 
        
        INNER JOIN PRODUTO_ESTOQUE PE
          ON P.cod_produto = PE.cod_produto 
          
        LEFT JOIN PRODUTO_AUXILIAR PA
              ON P.cod_produto = PA.cod_produto	
          
        LEFT JOIN (
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
        
        LEFT JOIN (
          SELECT 
            CP.cod_produto,
            CP.valor desconto,
            CP.tipo_campanha,
            CP.qt_brinde,
            CP.cod_campanha,
            C.descricao ,
            C.mecanica 
          FROM
            CAMPANHA_PRODUTO CP
            
          INNER JOIN CAMPANHA C
            ON CP.cod_campanha = C.cod_campanha 
        ) CP
          ON P.cod_produto = CP.cod_produto
      
        LEFT JOIN (
          SELECT
            cod_produto,
            STRING_AGG(imagem, ', ') WITHIN GROUP (ORDER BY imagem) AS imagenS
          FROM 
            PRODUTO_IMAGEM
            
          GROUP BY
            cod_produto
        ) PI
          ON P.cod_produto = PI.cod_produto
      ) P
        ON HP.cod_produto = P.cod_produto_ref
        
      WHERE
        id_home = ${id_home}

      ORDER BY
        cod_produto
      OFFSET ${page === 0 ? 0 : page * limit} rows FETCH NEXT ${limit} ROWS ONLY
    `);

    return result.map(value => {
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

      normalize(value);

      return {
        ...value,
        imagens: value.imagens.split(', '),
        preco_venda: price,
        desconto: Math.floor(value.desconto),
      };
    });
  }
}
