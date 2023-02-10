import { container } from 'tsyringe';

import { CredentialsProvider } from './CredentialsProvider';
import { HashProvider } from './HashProvider';
import { LogProvider } from './LogProvider';
import { PixPaymentProvider } from './payment/implementations/PixPaymentProvider';
import { IPaymentProvider } from './payment/IPaymentProvider';
import { TokenProvider } from './TokenProvider';

container.registerSingleton<HashProvider>('HashProvider', HashProvider);
container.registerSingleton<TokenProvider>('TokenProvider', TokenProvider);
container.registerSingleton<CredentialsProvider>(
  'CredentialsProvider',
  CredentialsProvider,
);
container.registerSingleton<LogProvider>('LogProvider', LogProvider);

container.registerSingleton<IPaymentProvider>(
  'pixPaymentProvider',
  PixPaymentProvider,
);
