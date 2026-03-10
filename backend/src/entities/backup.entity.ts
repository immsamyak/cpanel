import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Server } from './server.entity';

export enum BackupStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum BackupStorageType {
    LOCAL = 'local',
    S3 = 's3',
}

@Entity('backups')
export class Backup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: BackupStatus, default: BackupStatus.PENDING })
    status: BackupStatus;

    @Column({ type: 'enum', enum: BackupStorageType, default: BackupStorageType.LOCAL })
    storageType: BackupStorageType;

    @Column({ nullable: true })
    filePath: string;

    @Column({ nullable: true, type: 'bigint' })
    size: number;

    @Column({ default: false })
    isScheduled: boolean;

    @Column({ nullable: true })
    schedule: string;

    @Column({ nullable: true })
    completedAt: Date;

    @Column('uuid')
    userId: string;

    @ManyToOne(() => User, (user) => user.backups)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid')
    serverId: string;

    @ManyToOne(() => Server)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @CreateDateColumn()
    createdAt: Date;
}
