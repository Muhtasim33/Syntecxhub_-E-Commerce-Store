import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres123@localhost:5432/ecommerce_db?schema=public',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'aurelia-super-secret-access-token-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'aurelia-super-secret-refresh-token-key-2026',
  ACCESS_TTL: '15m',
  REFRESH_TTL_DAYS: 7,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
