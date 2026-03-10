import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BackupsService } from './backups.service';
import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BackupStorageType } from '../../entities/backup.entity';

class CreateBackupDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty() @IsUUID() serverId: string;
    @ApiProperty({ enum: BackupStorageType, required: false }) @IsOptional() @IsEnum(BackupStorageType) storageType?: BackupStorageType;
    @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isScheduled?: boolean;
    @ApiProperty({ required: false }) @IsOptional() @IsString() schedule?: string;
}

@ApiTags('Backups')
@Controller('backups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BackupsController {
    constructor(private backupsService: BackupsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new backup' })
    create(@CurrentUser() user, @Body() dto: CreateBackupDto) {
        return this.backupsService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all backups' })
    findAll(@CurrentUser() user) {
        return this.backupsService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get backup details' })
    findOne(@Param('id') id: string, @CurrentUser() user) {
        return this.backupsService.findById(id, user.id);
    }

    @Post(':id/restore')
    @ApiOperation({ summary: 'Restore backup' })
    restore(@Param('id') id: string, @CurrentUser() user) {
        return this.backupsService.restore(id, user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete backup' })
    remove(@Param('id') id: string, @CurrentUser() user) {
        return this.backupsService.delete(id, user.id);
    }
}
