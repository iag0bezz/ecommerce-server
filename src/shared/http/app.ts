import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import metriker from 'metriker';

import 'express-async-errors';

import '@shared/container';
import { HttpError } from '@shared/error/HttpError';

import { routes } from './routes';

import '@shared/util/patch.js';

const app = express();

app.use(express.json());

app.use(
  metriker({
    format: ':method :url :status :req[body] - :response-time ms',
  }),
);

app.use(
  cors({
    origin: '*',
  }),
);

app.use('/api/v1', routes);

app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    _next: NextFunction,
  ) => {
    if (error instanceof HttpError) {
      return response.status(error.statusCode).json({
        ...error,
        timestamp: new Date(),
      });
    }

    console.log('An internal error ocurred: ', error);

    return response.status(500).json({
      message: 'internal-error',
      statusCode: 500,
      timestamp: new Date(),
      ...error,
    });
  },
);

export default app;
