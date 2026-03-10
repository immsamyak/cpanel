import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Server } from './server.entity';

export enum DomainStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
}

export enum DomainType {
    PRIMARY = 'primary',
    SUBDOMAIN = 'subdomain',
    ADDON = 'addon',
}

@Entity('domains')
export class Domain {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: DomainType, default: DomainType.PRIMARY })
    type: DomainType;

    @Column({ type: 'enum', enum: DomainStatus, default: DomainStatus.PENDING })
    status: DomainStatus;

    @Column({ nullable: true })
    documentRoot: string;

    @Column({ default: false })
    sslEnabled: boolean;

    @Column({ nullable: true })
    sslCertificateId: string;

    @Column({ default: false })
    isReverseProxy: boolean;

    @Column({ nullable: true })
    reverseProxyUrl: string;

    @Column({ nullable: true, type: 'text' })
    nginxConfig: string;

    @Column('uuid')
    userId: string;

    @ManyToOne(() => User, (user) => user.domains)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid')
    serverId: string;

    @ManyToOne(() => Server, (server) => server.domains)
    @JoinColumn({ name: 'serverId' })
    server: Server;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
