export interface IPaymentProvider {
  checkout(): Promise<unknown>;
}
