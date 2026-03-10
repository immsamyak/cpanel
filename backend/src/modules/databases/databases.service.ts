import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagedDatabase, DatabaseType } from '../../entities/database.entity';

@Injectable()
export class DatabasesService {
    constructor(
        @InjectRepository(ManagedDatabase)
        private dbRepository: Repository<ManagedDatabase>,
    ) { }

    async create(data: Partial<ManagedDatabase>): Promise<ManagedDatabase> {
        const defaultPort = data.type === DatabaseType.MYSQL ? 3306 : 5432;
        const db = this.dbRepository.create({
            ...data,
            port: data.port || defaultPort,
            host: data.host || 'localhost',
        });
        return this.dbRepository.save(db);
    }

    async findAll(serverId?: string): Promise<ManagedDatabase[]> {
        const where = serverId ? { serverId } : {};
        return this.dbRepository.find({ where, relations: ['server'], order: { createdAt: 'DESC' } });
    }

    async findById(id: string): Promise<ManagedDatabase> {
        const db = await this.dbRepository.findOne({ where: { id }, relations: ['server'] });
        if (!db) throw new NotFoundException('Database not found');
        return db;
    }

    async update(id: string, data: Partial<ManagedDatabase>): Promise<ManagedDatabase> {
        const db = await this.findById(id);
        Object.assign(db, data);
        return this.dbRepository.save(db);
    }

    async delete(id: string): Promise<void> {
        const db = await this.findById(id);
        await this.dbRepository.remove(db);
    }
}
