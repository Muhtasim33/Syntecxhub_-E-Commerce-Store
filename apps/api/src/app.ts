import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { apiV1Routes } from './routes';
import { errorHandler } from './common/middleware/errorHandler';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mount API v1
app.use('/api/v1', apiV1Routes);

// Error Handler
app.use(errorHandler);
