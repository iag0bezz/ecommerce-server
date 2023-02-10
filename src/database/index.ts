import knex from 'knex';

export const connection = knex({
  client: 'mssql',
  debug: true,
  connection: {
    host: 'DAGSRV06',
    port: 1433,
    user: 'ecommerce_exalla',
    password: 'Exalla@2022',
    database: 'ecommerce_exalla_dev',
    options: {
      trustedConnection: true,
      encrypt: true,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
});
