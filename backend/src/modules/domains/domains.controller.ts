import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DomainsService } from './domains.service';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CreateDomainDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty() @IsUUID() serverId: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() documentRoot?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() type?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isReverseProxy?: boolean;
    @ApiProperty({ required: false }) @IsOptional() @IsString() reverseProxyUrl?: string;
}

@ApiTags('Domains')
@Controller('domains')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DomainsController {
    constructor(private domainsService: DomainsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new domain' })
    create(@CurrentUser() user, @Body() dto: CreateDomainDto) {
        return this.domainsService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all domains' })
    findAll(@CurrentUser() user) {
        return this.domainsService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get domain details' })
    findOne(@Param('id') id: string, @CurrentUser() user) {
        return this.domainsService.findById(id, user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update domain' })
    update(@Param('id') id: string, @CurrentUser() user, @Body() dto: Partial<CreateDomainDto>) {
        return this.domainsService.update(id, user.id, dto);
    }

    @Patch(':id/toggle')
    @ApiOperation({ summary: 'Toggle domain status' })
    toggle(@Param('id') id: string, @CurrentUser() user) {
        return this.domainsService.toggleStatus(id, user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete domain' })
    remove(@Param('id') id: string, @CurrentUser() user) {
        return this.domainsService.delete(id, user.id);
    }
}
