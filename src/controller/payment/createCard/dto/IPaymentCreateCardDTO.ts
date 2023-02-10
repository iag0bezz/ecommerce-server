interface IBilling {
  name: string;
  address: string;
  complement: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

export interface IPaymentCreateCardDTO {
  label?: string;

  customer_id: string;
  credit_card: string;
  expiration_month: string;
  expiration_year: string;
  billing: IBilling;
}
