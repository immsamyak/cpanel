import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Server } from './server.entity';

export enum FirewallAction {
    ALLOW = 'allow',
    DENY = 'deny',
}

@Entity('firewall_rules')
export class FirewallRule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: FirewallAction })
    action: FirewallAction;

    @Column({ nullable: true })
    sourceIp: string;

    @Column({ nullable: true })
    port: number;

    @Column({ nullable: true })
    protocol: string;

    @Column({ default: true })
    isActive: boolean;

    @Column('uuid')
    serverId: string;

    @ManyToOne(() => Server)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @CreateDateColumn()
    createdAt: Date;
}
