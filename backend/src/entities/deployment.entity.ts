import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Server } from './server.entity';

export enum DeploymentType {
    NODEJS = 'nodejs',
    LARAVEL = 'laravel',
    STATIC = 'static',
    DOCKER = 'docker',
}

export enum DeploymentStatus {
    RUNNING = 'running',
    STOPPED = 'stopped',
    DEPLOYING = 'deploying',
    FAILED = 'failed',
    QUEUED = 'queued',
}

@Entity('deployments')
export class Deployment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: DeploymentType })
    type: DeploymentType;

    @Column({ type: 'enum', enum: DeploymentStatus, default: DeploymentStatus.QUEUED })
    status: DeploymentStatus;

    @Column({ nullable: true })
    repositoryUrl: string;

    @Column({ nullable: true })
    branch: string;

    @Column({ nullable: true })
    directory: string;

    @Column({ nullable: true })
    buildCommand: string;

    @Column({ nullable: true })
    startCommand: string;

    @Column({ nullable: true })
    dockerImage: string;

    @Column({ nullable: true })
    dockerComposeFile: string;

    @Column({ type: 'jsonb', nullable: true })
    envVariables: Record<string, string>;

    @Column({ nullable: true })
    port: number;

    @Column({ nullable: true })
    domainId: string;

    @Column('uuid')
    userId: string;

    @ManyToOne(() => User, (user) => user.deployments)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid')
    serverId: string;

    @ManyToOne(() => Server, (server) => server.deployments)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
