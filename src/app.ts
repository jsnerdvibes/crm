import express from 'express';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './core/swagger';
import { apiRoutes } from './routes/api.routes';
import cors from 'cors';
import { startJobs } from './jobs/jobRunner';

export const app = express();

app.use(cors());

app.use(express.json());
app.use(requestLogger);

setupSwagger(app);

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

app.use(errorHandler);
