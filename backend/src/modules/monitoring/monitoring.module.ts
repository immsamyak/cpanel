import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMetric } from '../../entities/server-metric.entity';
import { Server } from '../../entities/server.entity';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ServerMetric, Server])],
    controllers: [MonitoringController],
    providers: [MonitoringService],
    exports: [MonitoringService],
})
export class MonitoringModule { }
