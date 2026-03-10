import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn,
} from 'typeorm';
import { Domain } from './domain.entity';
import { Server } from './server.entity';

export enum SslStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    PENDING = 'pending',
    FAILED = 'failed',
}

@Entity('ssl_certificates')
export class SslCertificate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    domain: string;

    @Column({ type: 'enum', enum: SslStatus, default: SslStatus.PENDING })
    status: SslStatus;

    @Column({ nullable: true })
    issuer: string;

    @Column({ nullable: true })
    expiresAt: Date;

    @Column({ nullable: true })
    issuedAt: Date;

    @Column({ default: false })
    autoRenew: boolean;

    @Column({ nullable: true, type: 'text' })
    certificatePath: string;

    @Column({ nullable: true, type: 'text' })
    privateKeyPath: string;

    @Column({ nullable: true })
    domainId: string;

    @ManyToOne(() => Domain, { nullable: true })
    @JoinColumn({ name: 'domainId' })
    domainEntity: Domain;

    @Column('uuid')
    serverId: string;

    @ManyToOne(() => Server)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
