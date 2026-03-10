import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogsService } from './logs.service';

@ApiTags('Logs')
@Controller('logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogsController {
    constructor(private logsService: LogsService) { }

    @Get(':serverId/system')
    @ApiOperation({ summary: 'Get system logs' })
    getSystemLogs(@Param('serverId') serverId: string, @Query('lines') lines?: number) {
        return this.logsService.getSystemLogs(serverId, lines || 100);
    }

    @Get(':serverId/nginx/access')
    @ApiOperation({ summary: 'Get Nginx access logs' })
    getNginxAccessLogs(@Param('serverId') serverId: string, @Query('lines') lines?: number) {
        return this.logsService.getNginxAccessLogs(serverId, lines || 100);
    }

    @Get(':serverId/nginx/error')
    @ApiOperation({ summary: 'Get Nginx error logs' })
    getNginxErrorLogs(@Param('serverId') serverId: string, @Query('lines') lines?: number) {
        return this.logsService.getNginxErrorLogs(serverId, lines || 100);
    }

    @Get(':serverId/app/:appName')
    @ApiOperation({ summary: 'Get application logs' })
    getAppLogs(@Param('serverId') serverId: string, @Param('appName') appName: string, @Query('lines') lines?: number) {
        return this.logsService.getApplicationLogs(serverId, appName, lines || 100);
    }
}
