export interface IAccountLoginDTO {
  email: string;
  cpf_cnpj: string;
  provider: 'google.com' | 'facebook.com';

  password?: string;
  uid?: string;
  name?: string;
  token?: string;
}
