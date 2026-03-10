import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class JobsService {
    constructor(
        @InjectQueue('ssl-renewal') private sslQueue: Queue,
        @InjectQueue('backups') private backupsQueue: Queue,
        @InjectQueue('deployments') private deploymentsQueue: Queue,
        @InjectQueue('server-tasks') private serverTasksQueue: Queue,
    ) { }

    async addSslRenewalJob(certificateId: string) {
        return this.sslQueue.add('renew', { certificateId }, { attempts: 3, backoff: 60000 });
    }

    async addBackupJob(backupId: string, serverId: string) {
        return this.backupsQueue.add('create', { backupId, serverId }, { attempts: 2 });
    }

    async addDeploymentJob(deploymentId: string, serverId: string) {
        return this.deploymentsQueue.add('deploy', { deploymentId, serverId }, { attempts: 3 });
    }

    async addServerTask(serverId: string, task: string, params: any) {
        return this.serverTasksQueue.add(task, { serverId, ...params });
    }

    async getQueueStats() {
        const [sslWaiting, backupsWaiting, deploymentsWaiting, tasksWaiting] = await Promise.all([
            this.sslQueue.getWaitingCount(),
            this.backupsQueue.getWaitingCount(),
            this.deploymentsQueue.getWaitingCount(),
            this.serverTasksQueue.getWaitingCount(),
        ]);
        return {
            sslRenewal: { waiting: sslWaiting },
            backups: { waiting: backupsWaiting },
            deployments: { waiting: deploymentsWaiting },
            serverTasks: { waiting: tasksWaiting },
        };
    }
}
