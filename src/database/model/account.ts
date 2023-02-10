import { connection } from 'database';

export interface IAccount {
  cod_conta: number;
  nome: string;
  email: string;
  senha: string;
  cpf_cnpj: string;
  telefone: string;
}

export interface IAccountProvider {
  uid: string;
  provedor: string;
  cod_conta: number;
}

export const Account = connection<IAccount>('CONTA');
export const AccountProvider = connection<IAccountProvider>('CONTA_PROVEDORES');
