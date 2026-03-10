import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-agent-token'] || req.headers.authorization?.replace('Bearer ', '');
    const agentSecret = process.env.AGENT_SECRET || 'agent-secret';

    if (!token || token !== agentSecret) {
        return res.status(401).json({ error: 'Unauthorized: Invalid agent token' });
    }

    next();
}
