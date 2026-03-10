import { Controller, Get, Param, Query, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MonitoringService } from './monitoring.service';

@ApiTags('Monitoring')
@Controller('monitoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MonitoringController {
    constructor(private monitoringService: MonitoringService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get dashboard overview stats' })
    getDashboardStats(@CurrentUser() user) {
        return this.monitoringService.getDashboardStats(user.id);
    }

    @Get('servers/:id/metrics')
    @ApiOperation({ summary: 'Get server metrics history' })
    getMetrics(@Param('id') id: string, @Query('hours') hours?: number) {
        return this.monitoringService.getServerMetrics(id, hours || 24);
    }

    @Get('servers/:id/realtime')
    @ApiOperation({ summary: 'Get real-time server metrics' })
    getRealtimeMetrics(@Param('id') id: string) {
        return this.monitoringService.getRealtimeMetrics(id);
    }

    @Get('servers/:id/prometheus')
    @ApiOperation({ summary: 'Get server metrics in Prometheus format' })
    @Header('Content-Type', 'text/plain')
    getPrometheusMetrics(@Param('id') id: string) {
        return this.monitoringService.getPrometheusMetrics(id);
    }
}
