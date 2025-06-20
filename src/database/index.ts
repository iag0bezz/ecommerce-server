import knex from 'knex';

export const connection = knex({
  client: 'mssql',
  debug: true,
  connection: {
    host: 'host',
    port: 1433,
    user: 'ecommerce',
    password: 'password',
    database: 'database',
    options: {
      trustedConnection: true,
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
});
