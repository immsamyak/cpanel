import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authMiddleware } from './middleware/auth';
import { systemRoutes } from './modules/system/routes';
import { nginxRoutes } from './modules/nginx/routes';
import { sslRoutes } from './modules/ssl/routes';
import { databaseRoutes } from './modules/database/routes';
import { dockerRoutes } from './modules/docker/routes';
import { fileRoutes } from './modules/files/routes';
import { backupRoutes } from './modules/backup/routes';

const app = express();
const port = process.env.AGENT_PORT || 3002;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check (unauthenticated)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// All other routes require agent token authentication
app.use(authMiddleware);

app.use('/api/system', systemRoutes);
app.use('/api/nginx', nginxRoutes);
app.use('/api/ssl', sslRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/docker', dockerRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/backup', backupRoutes);

app.listen(port, () => {
    console.log(`🔧 Server Agent running on port ${port}`);
});

export default app;
