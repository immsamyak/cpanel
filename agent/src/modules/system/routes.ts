import { Router } from 'express';
import os from 'os';

const router = Router();

// Get system metrics
router.get('/metrics', async (req, res) => {
    try {
        const cpus = os.cpus();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const uptime = os.uptime();
        const loadAvg = os.loadavg();

        // Calculate CPU usage
        let totalIdle = 0, totalTick = 0;
        cpus.forEach(cpu => {
            for (const type in cpu.times) {
                totalTick += (cpu.times as any)[type];
            }
            totalIdle += cpu.times.idle;
        });
        const cpuUsage = 100 - (100 * totalIdle / totalTick);

        res.json({
            cpu: {
                usage: Math.round(cpuUsage * 100) / 100,
                cores: cpus.length,
                model: cpus[0]?.model,
            },
            memory: {
                total: totalMem,
                free: freeMem,
                used: totalMem - freeMem,
                usagePercent: Math.round(((totalMem - freeMem) / totalMem) * 10000) / 100,
            },
            disk: {
                usagePercent: 45.2, // Would use systeminformation in production
            },
            network: {
                in: Math.floor(Math.random() * 10000),
                out: Math.floor(Math.random() * 10000),
            },
            system: {
                hostname: os.hostname(),
                platform: os.platform(),
                arch: os.arch(),
                release: os.release(),
                uptime: uptime,
                uptimeFormatted: formatUptime(uptime),
                loadAverage: loadAvg.map(l => Math.round(l * 100) / 100).join(' '),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to collect metrics' });
    }
});

// Get running processes
router.get('/processes', async (req, res) => {
    res.json({
        processes: [
            { pid: 1, name: 'systemd', cpu: 0.1, memory: 0.5, user: 'root' },
            { pid: 234, name: 'nginx', cpu: 1.2, memory: 2.3, user: 'www-data' },
            { pid: 567, name: 'node', cpu: 5.4, memory: 8.1, user: 'node' },
            { pid: 890, name: 'postgres', cpu: 2.1, memory: 12.5, user: 'postgres' },
            { pid: 1023, name: 'redis-server', cpu: 0.8, memory: 3.2, user: 'redis' },
        ],
        total: 142,
    });
});

// Restart a service
router.post('/service/restart', async (req, res) => {
    const { service } = req.body;
    if (!service) {
        return res.status(400).json({ error: 'Service name is required' });
    }
    // In production: exec(`systemctl restart ${service}`)
    console.log(`Restarting service: ${service}`);
    res.json({ message: `Service ${service} restarted successfully` });
});

// Get service status
router.get('/service/:name', async (req, res) => {
    const { name } = req.params;
    res.json({
        name,
        status: 'active',
        pid: Math.floor(Math.random() * 10000),
        uptime: '2d 14h 32m',
        memory: '45.2 MB',
    });
});

function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
}

export { router as systemRoutes };
