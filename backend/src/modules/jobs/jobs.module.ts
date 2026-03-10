import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobsService } from './jobs.service';
import { JobsProcessor } from './jobs.processor';

@Module({
    imports: [
        BullModule.registerQueue(
            { name: 'ssl-renewal' },
            { name: 'backups' },
            { name: 'deployments' },
            { name: 'server-tasks' },
        ),
    ],
    providers: [JobsService, JobsProcessor],
    exports: [JobsService],
})
export class JobsModule { }
