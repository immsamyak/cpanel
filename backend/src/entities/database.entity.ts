import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
    ManyToOne, JoinColumn,
} from 'typeorm';
import { Server } from './server.entity';

export enum DatabaseType {
    MYSQL = 'mysql',
    POSTGRESQL = 'postgresql',
}

@Entity('managed_databases')
export class ManagedDatabase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: DatabaseType })
    type: DatabaseType;

    @Column({ nullable: true })
    dbUser: string;

    @Column({ nullable: true })
    dbPassword: string;

    @Column({ nullable: true })
    host: string;

    @Column({ nullable: true })
    port: number;

    @Column({ nullable: true, type: 'bigint' })
    size: number;

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
