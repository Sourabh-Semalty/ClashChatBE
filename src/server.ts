import express, { Application } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { connectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import { setupSocketHandlers } from './socket/socketHandler';
import { errorHandler, notFound } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import friendRoutes from './routes/friendRoutes';
import messageRoutes from './routes/messageRoutes';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8081',
  'http://localhost:5000',
  process.env.CORS_ORIGIN
].filter((origin): origin is string => Boolean(origin));

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    message: 'ClashChat API Server',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ClashChat API Documentation',
}));

app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);


app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    setupSocketHandlers(io);

    httpServer.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 ClashChat Server Running                        ║
║                                                       ║
║   📡 Server:        http://localhost:${PORT}           ║
║   📚 API Docs:      http://localhost:${PORT}/api-docs ║
║   🔌 Socket.io:     Connected                         ║
║   💾 Database:      MongoDB Connected                 ║
║                                                       ║
║   Environment:      ${process.env.NODE_ENV || 'development'}                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
