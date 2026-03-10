import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SslService } from './ssl.service';
import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RequestSslDto {
    @ApiProperty() @IsString() domain: string;
    @ApiProperty() @IsUUID() serverId: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() domainId?: string;
}

@ApiTags('SSL')
@Controller('ssl')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SslController {
    constructor(private sslService: SslService) { }

    @Post('request')
    @ApiOperation({ summary: 'Request SSL certificate from Let\'s Encrypt' })
    request(@Body() dto: RequestSslDto) {
        return this.sslService.requestCertificate(dto);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload custom SSL certificate' })
    upload(@Body() dto: any) {
        return this.sslService.uploadCertificate(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all SSL certificates' })
    findAll(@Query('serverId') serverId?: string) {
        return this.sslService.findAll(serverId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get certificate details' })
    findOne(@Param('id') id: string) {
        return this.sslService.findById(id);
    }

    @Post(':id/renew')
    @ApiOperation({ summary: 'Renew SSL certificate' })
    renew(@Param('id') id: string) {
        return this.sslService.renewCertificate(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete SSL certificate' })
    remove(@Param('id') id: string) {
        return this.sslService.delete(id);
    }
}
