import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ServersService } from './servers.service';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateServerDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty() @IsString() ipAddress: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() hostname?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsNumber() sshPort?: number;
}

class UpdateServerDto {
    @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() hostname?: string;
}

@ApiTags('Servers')
@Controller('servers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServersController {
    constructor(private serversService: ServersService) { }

    @Post()
    @ApiOperation({ summary: 'Register a new server' })
    create(@CurrentUser() user, @Body() dto: CreateServerDto) {
        return this.serversService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all servers' })
    findAll(@CurrentUser() user) {
        return this.serversService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get server details' })
    findOne(@Param('id') id: string, @CurrentUser() user) {
        return this.serversService.findById(id, user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update server' })
    update(@Param('id') id: string, @CurrentUser() user, @Body() dto: UpdateServerDto) {
        return this.serversService.update(id, user.id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove a server' })
    remove(@Param('id') id: string, @CurrentUser() user) {
        return this.serversService.delete(id, user.id);
    }

    @Get(':id/metrics')
    @ApiOperation({ summary: 'Get server metrics history' })
    getMetrics(@Param('id') id: string, @Query('limit') limit?: number) {
        return this.serversService.getMetrics(id, limit || 60);
    }

    @Get(':id/stats')
    @ApiOperation({ summary: 'Get latest server stats' })
    getStats(@Param('id') id: string) {
        return this.serversService.getServerStats(id);
    }
}
