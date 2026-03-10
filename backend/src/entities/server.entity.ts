import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Domain } from './domain.entity';
import { Deployment } from './deployment.entity';
import { ServerMetric } from './server-metric.entity';

export enum ServerStatus {
    ONLINE = 'online',
    OFFLINE = 'offline',
    PROVISIONING = 'provisioning',
    MAINTENANCE = 'maintenance',
}

@Entity('servers')
export class Server {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    ipAddress: string;

    @Column({ nullable: true })
    hostname: string;

    @Column({ type: 'enum', enum: ServerStatus, default: ServerStatus.PROVISIONING })
    status: ServerStatus;

    @Column({ nullable: true })
    sshPort: number;

    @Column({ nullable: true, type: 'text' })
    sshKeyPath: string;

    @Column({ nullable: true })
    agentToken: string;

    @Column({ nullable: true })
    agentPort: number;

    @Column({ nullable: true })
    os: string;

    @Column({ nullable: true })
    cpuCores: number;

    @Column({ nullable: true, type: 'bigint' })
    totalMemory: number;

    @Column({ nullable: true, type: 'bigint' })
    totalDisk: number;

    @Column({ nullable: true })
    uptime: string;

    @Column({ nullable: true })
    lastHeartbeat: Date;

    @Column('uuid')
    userId: string;

    @ManyToOne(() => User, (user) => user.servers)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Domain, (domain) => domain.server)
    domains: Domain[];

    @OneToMany(() => Deployment, (deployment) => deployment.server)
    deployments: Deployment[];

    @OneToMany(() => ServerMetric, (metric) => metric.server)
    metrics: ServerMetric[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
