import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Server } from './server.entity';

@Entity('server_metrics')
export class ServerMetric {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float' })
    cpuUsage: number;

    @Column({ type: 'float' })
    memoryUsage: number;

    @Column({ type: 'float' })
    diskUsage: number;

    @Column({ type: 'float', nullable: true })
    networkIn: number;

    @Column({ type: 'float', nullable: true })
    networkOut: number;

    @Column({ nullable: true })
    loadAverage: string;

    @Column({ nullable: true })
    activeProcesses: number;

    @Column('uuid')
    serverId: string;

    @ManyToOne(() => Server, (server) => server.metrics)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @CreateDateColumn()
    recordedAt: Date;
}
