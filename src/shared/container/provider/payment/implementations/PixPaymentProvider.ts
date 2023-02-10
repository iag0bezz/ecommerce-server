import axios from 'axios';

import { IPaymentProvider } from '../IPaymentProvider';

export class PixPaymentProvider implements IPaymentProvider {
  async checkout(): Promise<unknown> {
    const response = await axios.post(process.env.SERVICE_PIX_CREATE, {
      aplicacao: 'EXALLA',
      valor_cobrado: 0.05,
      cpf: '07490035376',
      nome: 'Iago Beserra de Matos Pereira',
      expiracao: 60,
    });

    return response.data;
  }
}
