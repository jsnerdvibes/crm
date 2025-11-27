import express from 'express';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import { setupSwagger } from './core/swagger';
import { RegisterSchema } from './modules/auth/dto';
import { validate } from './middlewares/validate';

export const app = express();

app.use(express.json());
app.use(requestLogger);

setupSwagger(app);

app.use('/auth', validate(RegisterSchema), authRoutes);

// --- Health Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);
