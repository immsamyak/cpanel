import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ServerMetric } from '../../entities/server-metric.entity';
import { Server } from '../../entities/server.entity';

@Injectable()
export class MonitoringService {
    constructor(
        @InjectRepository(ServerMetric)
        private metricsRepository: Repository<ServerMetric>,
        @InjectRepository(Server)
        private serversRepository: Repository<Server>,
    ) { }

    async getDashboardStats(userId: string) {
        const servers = await this.serversRepository.find({ where: { userId } });
        const totalServers = servers.length;
        const onlineServers = servers.filter(s => s.status === 'online').length;

        return {
            totalServers,
            onlineServers,
            offlineServers: totalServers - onlineServers,
            summary: {
                avgCpu: Math.random() * 50 + 10,
                avgMemory: Math.random() * 60 + 20,
                avgDisk: Math.random() * 40 + 30,
                totalBandwidth: Math.floor(Math.random() * 100) + 'GB',
            },
        };
    }

    async getServerMetrics(serverId: string, hours = 24): Promise<ServerMetric[]> {
        const since = new Date();
        since.setHours(since.getHours() - hours);
        return this.metricsRepository.find({
            where: { serverId, recordedAt: MoreThan(since) },
            order: { recordedAt: 'ASC' },
        });
    }

    async getRealtimeMetrics(serverId: string) {
        // Simulate real-time metrics (in production, fetched from agent)
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            networkIn: Math.random() * 1000,
            networkOut: Math.random() * 1000,
            loadAverage: `${(Math.random() * 2).toFixed(2)} ${(Math.random() * 1.5).toFixed(2)} ${(Math.random()).toFixed(2)}`,
            activeProcesses: Math.floor(Math.random() * 200) + 50,
            uptime: '42 days, 7 hours',
            timestamp: new Date().toISOString(),
        };
    }

    async getPrometheusMetrics(serverId: string): Promise<string> {
        const metrics = await this.getRealtimeMetrics(serverId);
        return `
# HELP server_cpu_usage CPU usage percentage
# TYPE server_cpu_usage gauge
server_cpu_usage{server_id="${serverId}"} ${metrics.cpu}

# HELP server_memory_usage Memory usage percentage
# TYPE server_memory_usage gauge
server_memory_usage{server_id="${serverId}"} ${metrics.memory}

# HELP server_disk_usage Disk usage percentage
# TYPE server_disk_usage gauge
server_disk_usage{server_id="${serverId}"} ${metrics.disk}

# HELP server_network_in Network incoming bytes
# TYPE server_network_in gauge
server_network_in{server_id="${serverId}"} ${metrics.networkIn}

# HELP server_network_out Network outgoing bytes
# TYPE server_network_out gauge
server_network_out{server_id="${serverId}"} ${metrics.networkOut}
`.trim();
    }
}
