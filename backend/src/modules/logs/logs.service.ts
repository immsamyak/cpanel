import { Injectable } from '@nestjs/common';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    source: string;
}

@Injectable()
export class LogsService {
    async getSystemLogs(serverId: string, lines = 100): Promise<LogEntry[]> {
        return this.generateMockLogs('system', lines);
    }

    async getNginxAccessLogs(serverId: string, lines = 100): Promise<LogEntry[]> {
        return this.generateMockLogs('nginx-access', lines);
    }

    async getNginxErrorLogs(serverId: string, lines = 100): Promise<LogEntry[]> {
        return this.generateMockLogs('nginx-error', lines);
    }

    async getApplicationLogs(serverId: string, appName: string, lines = 100): Promise<LogEntry[]> {
        return this.generateMockLogs(`app:${appName}`, lines);
    }

    private generateMockLogs(source: string, count: number): LogEntry[] {
        const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
        const messages = {
            'system': [
                'System startup completed',
                'Service nginx restarted',
                'Cron job executed: /etc/cron.daily/backup',
                'User login: admin from 192.168.1.1',
                'Package update available: nginx 1.25.4',
                'Disk usage at 75% on /dev/sda1',
                'Memory usage normalized after cleanup',
                'SSH connection established from 10.0.0.5',
            ],
            'nginx-access': [
                '192.168.1.100 - - GET /api/health 200 52',
                '10.0.0.1 - - POST /api/auth/login 200 340',
                '172.16.0.1 - - GET /dashboard 200 8423',
                '192.168.1.50 - - GET /static/css/app.css 304 0',
                '10.0.0.5 - - PUT /api/servers/1 200 892',
            ],
            'nginx-error': [
                'upstream timed out (110: Connection timed out)',
                'directory index of "/var/www/html/" is forbidden',
                'connect() failed (111: Connection refused) to upstream',
                'open() "/var/www/html/favicon.ico" failed (2: No such file or directory)',
            ],
        };

        const logMessages = messages[source] || [
            'Application started successfully',
            'Database connection established',
            'Request processed in 245ms',
            'Cache cleared for key: user_sessions',
            'Background job completed: email_notifications',
        ];

        return Array.from({ length: Math.min(count, 50) }, (_, i) => {
            const date = new Date();
            date.setMinutes(date.getMinutes() - (count - i));
            return {
                timestamp: date.toISOString(),
                level: levels[Math.floor(Math.random() * levels.length)],
                message: logMessages[Math.floor(Math.random() * logMessages.length)],
                source,
            };
        });
    }
}
