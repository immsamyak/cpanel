import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SecurityService } from './security.service';
import { IsString, IsOptional, IsEnum, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FirewallAction } from '../../entities/firewall-rule.entity';

class CreateFirewallRuleDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty({ enum: FirewallAction }) @IsEnum(FirewallAction) action: FirewallAction;
    @ApiProperty() @IsUUID() serverId: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() sourceIp?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsNumber() port?: number;
    @ApiProperty({ required: false }) @IsOptional() @IsString() protocol?: string;
}

@ApiTags('Security')
@Controller('security')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SecurityController {
    constructor(private securityService: SecurityService) { }

    @Post('firewall')
    @ApiOperation({ summary: 'Create firewall rule' })
    createRule(@Body() dto: CreateFirewallRuleDto) {
        return this.securityService.createRule(dto);
    }

    @Get('firewall')
    @ApiOperation({ summary: 'List firewall rules' })
    getRules(@Query('serverId') serverId: string) {
        return this.securityService.findAllRules(serverId);
    }

    @Patch('firewall/:id/toggle')
    @ApiOperation({ summary: 'Toggle firewall rule' })
    toggleRule(@Param('id') id: string) {
        return this.securityService.toggleRule(id);
    }

    @Delete('firewall/:id')
    @ApiOperation({ summary: 'Delete firewall rule' })
    deleteRule(@Param('id') id: string) {
        return this.securityService.deleteRule(id);
    }

    @Get('fail2ban/:serverId')
    @ApiOperation({ summary: 'Get Fail2ban status' })
    getFail2banStatus(@Param('serverId') serverId: string) {
        return this.securityService.getFail2banStatus(serverId);
    }
}
