import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServersModule } from './modules/servers/servers.module';
import { DomainsModule } from './modules/domains/domains.module';
import { SslModule } from './modules/ssl/ssl.module';
import { DatabasesModule } from './modules/databases/databases.module';
import { FilesModule } from './modules/files/files.module';
import { DeploymentsModule } from './modules/deployments/deployments.module';
import { BackupsModule } from './modules/backups/backups.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { LogsModule } from './modules/logs/logs.module';
import { SecurityModule } from './modules/security/security.module';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST', 'localhost'),
                port: config.get<number>('DB_PORT', 5432),
                username: config.get('DB_USERNAME', 'cpanel'),
                password: config.get('DB_PASSWORD', 'cpanel_secret_password'),
                database: config.get('DB_NAME', 'cpanel_db'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') === 'development',
            }),
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                redis: {
                    host: config.get('REDIS_HOST', 'localhost'),
                    port: config.get<number>('REDIS_PORT', 6379),
                },
            }),
        }),
        AuthModule,
        UsersModule,
        ServersModule,
        DomainsModule,
        SslModule,
        DatabasesModule,
        FilesModule,
        DeploymentsModule,
        BackupsModule,
        MonitoringModule,
        LogsModule,
        SecurityModule,
        JobsModule,
    ],
})
export class AppModule { }
