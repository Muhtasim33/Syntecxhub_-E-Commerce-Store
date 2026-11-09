import { app } from './app';
import { ENV } from './config/env';

const server = app.listen(ENV.PORT, () => {
  console.log(`[Aurelia E-Commerce API] Server listening on port ${ENV.PORT}`);
  console.log(`[Health check] http://localhost:${ENV.PORT}/api/v1/health`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});
