import express from 'express';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './core/swagger';
import { apiRoutes } from './routes/api.routes';

export const app = express();

app.use(express.json());
app.use(requestLogger);

setupSwagger(app);

app.use('/api/v1', apiRoutes);

// --- Health Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);
