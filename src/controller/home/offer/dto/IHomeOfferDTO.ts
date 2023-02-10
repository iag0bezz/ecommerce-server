import { IBaseSearchDTO } from '@shared/dtos/IBaseSearchDTO';

export interface IHomeOfferDTO extends IBaseSearchDTO {
  id_home: number;
  offers?: boolean;
}
