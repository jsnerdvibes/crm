import express from 'express';
import { requestLogger } from './middlewares/requestLogger';

export const app = express();

app.use(express.json());
app.use(requestLogger);

// --- Health Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});
