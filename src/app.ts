import express from 'express';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from "./modules/auth/auth.routes";

export const app = express();

app.use(express.json());
app.use(requestLogger);



app.use("/auth", authRoutes);


// --- Health Route ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});


app.use(errorHandler);
