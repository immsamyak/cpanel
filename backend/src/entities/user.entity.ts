import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Server } from './server.entity';
import { Domain } from './domain.entity';
import { Deployment } from './deployment.entity';
import { Backup } from './backup.entity';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    twoFactorSecret: string;

    @Column({ default: false })
    isTwoFactorEnabled: boolean;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    lastLoginAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Server, (server) => server.user)
    servers: Server[];

    @OneToMany(() => Domain, (domain) => domain.user)
    domains: Domain[];

    @OneToMany(() => Deployment, (deployment) => deployment.user)
    deployments: Deployment[];

    @OneToMany(() => Backup, (backup) => backup.user)
    backups: Backup[];
}
