import { Router } from 'express';

const router = Router();

// List containers
router.get('/containers', (req, res) => {
    res.json({
        containers: [
            { id: 'abc123', name: 'web-app', image: 'node:20-alpine', status: 'running', ports: '3000:3000', created: '2 days ago' },
            { id: 'def456', name: 'redis', image: 'redis:7-alpine', status: 'running', ports: '6379:6379', created: '5 days ago' },
            { id: 'ghi789', name: 'postgres', image: 'postgres:16', status: 'running', ports: '5432:5432', created: '5 days ago' },
        ],
    });
});

// Run container
router.post('/run', (req, res) => {
    const { image, name, ports, env, volumes } = req.body;
    if (!image) return res.status(400).json({ error: 'Image is required' });

    console.log(`Starting container: ${name || 'unnamed'} from ${image}`);
    // In production: exec docker run command
    res.json({
        message: `Container ${name} started`,
        containerId: `container_${Date.now()}`,
        image,
        status: 'running',
    });
});

// Stop container
router.post('/stop/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Stopping container: ${id}`);
    res.json({ message: `Container ${id} stopped` });
});

// Start container
router.post('/start/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Starting container: ${id}`);
    res.json({ message: `Container ${id} started` });
});

// Remove container
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Removing container: ${id}`);
    res.json({ message: `Container ${id} removed` });
});

// Container logs
router.get('/:id/logs', (req, res) => {
    const { id } = req.params;
    res.json({
        containerId: id,
        logs: [
            `[${new Date().toISOString()}] Container started`,
            `[${new Date().toISOString()}] Listening on port 3000`,
            `[${new Date().toISOString()}] Connected to database`,
        ],
    });
});

// Docker compose up
router.post('/compose/up', (req, res) => {
    const { composeFile, projectName } = req.body;
    console.log(`Docker compose up for project: ${projectName}`);
    res.json({ message: `Docker compose up executed for ${projectName}` });
});

export { router as dockerRoutes };
