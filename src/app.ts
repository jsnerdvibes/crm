import express from 'express';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './core/swagger';
import { apiRoutes } from './routes/api.routes';
import cors from 'cors';
import helmet from 'helmet';
// import { startJobs } from './jobs/jobRunner';
import { apiLimiter } from './middlewares/rateLimiter';
import { config } from './config';
import { prisma } from './core/db';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.app.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(requestLogger);

setupSwagger(app);

app.use('/api/v1/', apiLimiter);

app.use('/api/v1', apiRoutes);

// startJobs();

// --- Health Route ---
app.get('/', (req, res) => {
  res.status(200).send('Server is up');
});

// --- Health Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRawUnsafe('SELECT 1');
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use(errorHandler);
