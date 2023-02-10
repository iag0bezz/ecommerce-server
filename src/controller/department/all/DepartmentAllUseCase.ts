import { connection } from 'database';
import { inject, injectable } from 'tsyringe';

import { LogProvider } from '@shared/container/provider/LogProvider';
import { normalize } from '@shared/util/string';

interface IGroup {
  id: string;
  description: string;
  sub_groups?: IGroup[];
}

interface IResult {
  cod_grupo: string;
  grupo_descricao: string;
  cod_subgrupo: string;
  subgrupo_descricao: string;
}

@injectable()
export class DepartmentAllUseCase {
  constructor(
    @inject('LogProvider')
    private logger: LogProvider,
  ) {}

  async execute(): Promise<IGroup[]> {
    const result = (await connection.raw(`
      SELECT
        SG.cod_grupo,
        G.descricao grupo_descricao,
        G.ordem grupo_ordem,
        SG.cod_subgrupo,
        SG.descricao subgrupo_descricao,
        SG.ordem subgrupo_ordem
      FROM SUBGRUPO SG
        
      INNER JOIN GRUPO G
        ON SG.cod_grupo = G.cod_grupo
      
      WHERE 
        SG.status = 1
        AND
        G.status = 1
        
      order BY 
        G.ordem, SG.ordem
    `)) as IResult[];

    const departments: IGroup[] = [];

    if (result.length > 0) {
      result.forEach(value => {
        normalize(value);

        const index = departments.findIndex(v => v.id === value.cod_grupo);

        if (index === -1) {
          departments.push({
            id: value.cod_grupo,
            description: value.grupo_descricao,
            sub_groups: [
              {
                id: value.cod_subgrupo,
                description: value.subgrupo_descricao,
              },
            ],
          });
        } else {
          departments[index].sub_groups.push({
            id: value.cod_subgrupo.trim(),
            description: value.subgrupo_descricao,
          });
        }
      });
    }

    return departments;
  }
}
