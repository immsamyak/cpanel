import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabasesService } from './databases.service';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DatabaseType } from '../../entities/database.entity';

class CreateDatabaseDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty({ enum: DatabaseType }) @IsEnum(DatabaseType) type: DatabaseType;
    @ApiProperty() @IsUUID() serverId: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() dbUser?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() dbPassword?: string;
}

@ApiTags('Databases')
@Controller('databases')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DatabasesController {
    constructor(private databasesService: DatabasesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new database' })
    create(@Body() dto: CreateDatabaseDto) {
        return this.databasesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all databases' })
    findAll(@Query('serverId') serverId?: string) {
        return this.databasesService.findAll(serverId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get database details' })
    findOne(@Param('id') id: string) {
        return this.databasesService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update database' })
    update(@Param('id') id: string, @Body() dto: Partial<CreateDatabaseDto>) {
        return this.databasesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete database' })
    remove(@Param('id') id: string) {
        return this.databasesService.delete(id);
    }
}
