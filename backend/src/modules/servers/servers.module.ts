import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from '../../entities/server.entity';
import { ServerMetric } from '../../entities/server-metric.entity';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Server, ServerMetric])],
    controllers: [ServersController],
    providers: [ServersService],
    exports: [ServersService],
})
export class ServersModule { }
