import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { normalize } from '@shared/util/string';

import { IHomeBrandDTO } from './dto/IHomeBrandDTO';

type IRequest = IHomeBrandDTO;

@injectable()
export class HomeBrandUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute({ search = '', cod_grupo = '', cod_subgrupo = '' }: IRequest) {
    const haveValues = [search, cod_grupo, cod_subgrupo].some(
      v => v.length > 0,
    );

    const productConditional = `
          AND
          (
            P.descricao LIKE '%${search ?? ''}%'
            OR
            P.descricao_marca LIKE '%${search ?? ''}%'
            OR
            P.codigo_barras LIKE '%${search ?? ''}%'
          )
    `;

    const conditional = `
      INNER JOIN PRODUTO_SUBGRUPO PS 
        ON PS.cod_produto = P.cod_produto
        
      INNER JOIN SUBGRUPO SG
        ON SG.cod_subgrupo = PS.cod_subgrupo
            
      INNER JOIN GRUPO G 
        ON G.cod_grupo = SG.cod_grupo
    `;

    const groupConditional = Array.isArray(cod_grupo)
      ? `AND G.cod_grupo IN (${cod_grupo})`
      : `AND G.cod_grupo = '${cod_grupo}'`;

    const result = await connection.raw(`
      SELECT DISTINCT
        M.*
      FROM 
        MARCA M
  
      ${
        haveValues
          ? `
        INNER JOIN PRODUTO P
          ON P.marca = M.cod_marca ${productConditional}
      `
          : ''
      }
        
      ${cod_grupo.length > 0 || cod_subgrupo.length > 0 ? conditional : ''}

      WHERE 
        M.status = 1
        ${cod_grupo.length > 0 ? groupConditional : ''}
        ${
          cod_subgrupo.length > 0
            ? `AND SG.cod_subgrupo = '${cod_subgrupo}'`
            : ''
        }
        
      ORDER BY
        M.cod_marca
      OFFSET 0 rows FETCH NEXT 15 ROWS ONLY;
    `);

    return result.map(value => {
      normalize(value);

      return value;
    });
  }
}
