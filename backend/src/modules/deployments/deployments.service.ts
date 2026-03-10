import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deployment, DeploymentStatus } from '../../entities/deployment.entity';

@Injectable()
export class DeploymentsService {
    constructor(
        @InjectRepository(Deployment)
        private deploymentsRepository: Repository<Deployment>,
    ) { }

    async create(userId: string, data: Partial<Deployment>): Promise<Deployment> {
        const deployment = this.deploymentsRepository.create({
            ...data,
            userId,
            status: DeploymentStatus.QUEUED,
        });
        const saved = await this.deploymentsRepository.save(deployment);

        // Simulate deployment process
        setTimeout(async () => {
            await this.deploymentsRepository.update(saved.id, { status: DeploymentStatus.DEPLOYING });
            setTimeout(async () => {
                await this.deploymentsRepository.update(saved.id, { status: DeploymentStatus.RUNNING });
            }, 3000);
        }, 1000);

        return saved;
    }

    async findAll(userId: string): Promise<Deployment[]> {
        return this.deploymentsRepository.find({
            where: { userId },
            relations: ['server'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string, userId?: string): Promise<Deployment> {
        const where: any = { id };
        if (userId) where.userId = userId;
        const deployment = await this.deploymentsRepository.findOne({ where, relations: ['server'] });
        if (!deployment) throw new NotFoundException('Deployment not found');
        return deployment;
    }

    async update(id: string, userId: string, data: Partial<Deployment>): Promise<Deployment> {
        const deployment = await this.findById(id, userId);
        Object.assign(deployment, data);
        return this.deploymentsRepository.save(deployment);
    }

    async updateStatus(id: string, status: DeploymentStatus): Promise<void> {
        await this.deploymentsRepository.update(id, { status });
    }

    async stop(id: string, userId: string): Promise<Deployment> {
        const deployment = await this.findById(id, userId);
        deployment.status = DeploymentStatus.STOPPED;
        return this.deploymentsRepository.save(deployment);
    }

    async restart(id: string, userId: string): Promise<Deployment> {
        const deployment = await this.findById(id, userId);
        deployment.status = DeploymentStatus.DEPLOYING;
        const saved = await this.deploymentsRepository.save(deployment);

        setTimeout(async () => {
            await this.deploymentsRepository.update(saved.id, { status: DeploymentStatus.RUNNING });
        }, 2000);

        return saved;
    }

    async delete(id: string, userId: string): Promise<void> {
        const deployment = await this.findById(id, userId);
        await this.deploymentsRepository.remove(deployment);
    }
}
