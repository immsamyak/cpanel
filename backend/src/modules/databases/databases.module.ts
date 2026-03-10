import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagedDatabase } from '../../entities/database.entity';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ManagedDatabase])],
    controllers: [DatabasesController],
    providers: [DatabasesService],
    exports: [DatabasesService],
})
export class DatabasesModule { }
