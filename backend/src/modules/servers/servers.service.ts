import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Server, ServerStatus } from '../../entities/server.entity';
import { ServerMetric } from '../../entities/server-metric.entity';

@Injectable()
export class ServersService {
    constructor(
        @InjectRepository(Server)
        private serversRepository: Repository<Server>,
        @InjectRepository(ServerMetric)
        private metricsRepository: Repository<ServerMetric>,
    ) { }

    async create(userId: string, data: Partial<Server>): Promise<Server> {
        const server = this.serversRepository.create({
            ...data,
            userId,
            agentToken: uuidv4(),
            status: ServerStatus.PROVISIONING,
        });
        return this.serversRepository.save(server);
    }

    async findAll(userId: string): Promise<Server[]> {
        return this.serversRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string, userId?: string): Promise<Server> {
        const where: any = { id };
        if (userId) where.userId = userId;
        const server = await this.serversRepository.findOne({
            where,
            relations: ['domains', 'deployments'],
        });
        if (!server) throw new NotFoundException('Server not found');
        return server;
    }

    async update(id: string, userId: string, data: Partial<Server>): Promise<Server> {
        const server = await this.findById(id, userId);
        Object.assign(server, data);
        return this.serversRepository.save(server);
    }

    async delete(id: string, userId: string): Promise<void> {
        const server = await this.findById(id, userId);
        await this.serversRepository.remove(server);
    }

    async updateStatus(id: string, status: ServerStatus): Promise<void> {
        await this.serversRepository.update(id, { status, lastHeartbeat: new Date() });
    }

    async recordMetrics(serverId: string, metrics: Partial<ServerMetric>): Promise<ServerMetric> {
        const metric = this.metricsRepository.create({ ...metrics, serverId });
        return this.metricsRepository.save(metric);
    }

    async getMetrics(serverId: string, limit = 60): Promise<ServerMetric[]> {
        return this.metricsRepository.find({
            where: { serverId },
            order: { recordedAt: 'DESC' },
            take: limit,
        });
    }

    async getServerStats(serverId: string) {
        const latestMetric = await this.metricsRepository.findOne({
            where: { serverId },
            order: { recordedAt: 'DESC' },
        });
        return latestMetric || { cpuUsage: 0, memoryUsage: 0, diskUsage: 0, networkIn: 0, networkOut: 0 };
    }
}
