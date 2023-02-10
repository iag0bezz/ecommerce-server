export interface IAccountRegisterDTO {
  email: string;
  name: string;
  provider: 'facebook.com' | 'google.com';

  /**
   * Optional variables
   */
  phone?: string;
  password?: string;
  cpf_cnpj: string;
  uid?: string;
  token?: string;
}
