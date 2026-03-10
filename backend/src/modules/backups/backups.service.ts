import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Backup, BackupStatus, BackupStorageType } from '../../entities/backup.entity';

@Injectable()
export class BackupsService {
    constructor(
        @InjectRepository(Backup)
        private backupsRepository: Repository<Backup>,
    ) { }

    async create(userId: string, data: Partial<Backup>): Promise<Backup> {
        const backup = this.backupsRepository.create({
            ...data,
            userId,
            status: BackupStatus.PENDING,
        });
        const saved = await this.backupsRepository.save(backup);

        // Simulate backup process
        setTimeout(async () => {
            await this.backupsRepository.update(saved.id, { status: BackupStatus.IN_PROGRESS });
            setTimeout(async () => {
                await this.backupsRepository.update(saved.id, {
                    status: BackupStatus.COMPLETED,
                    completedAt: new Date(),
                    size: Math.floor(Math.random() * 1000000000),
                    filePath: `/backups/${saved.id}.tar.gz`,
                });
            }, 3000);
        }, 1000);

        return saved;
    }

    async findAll(userId: string): Promise<Backup[]> {
        return this.backupsRepository.find({
            where: { userId },
            relations: ['server'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string, userId?: string): Promise<Backup> {
        const where: any = { id };
        if (userId) where.userId = userId;
        const backup = await this.backupsRepository.findOne({ where, relations: ['server'] });
        if (!backup) throw new NotFoundException('Backup not found');
        return backup;
    }

    async delete(id: string, userId: string): Promise<void> {
        const backup = await this.findById(id, userId);
        await this.backupsRepository.remove(backup);
    }

    async restore(id: string, userId: string): Promise<Backup> {
        const backup = await this.findById(id, userId);
        // In production, would trigger restore via agent
        return backup;
    }
}
