import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DeploymentsService } from './deployments.service';
import { IsString, IsOptional, IsEnum, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeploymentType } from '../../entities/deployment.entity';

class CreateDeploymentDto {
    @ApiProperty() @IsString() name: string;
    @ApiProperty({ enum: DeploymentType }) @IsEnum(DeploymentType) type: DeploymentType;
    @ApiProperty() @IsUUID() serverId: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() repositoryUrl?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() branch?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() buildCommand?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() startCommand?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsString() dockerImage?: string;
    @ApiProperty({ required: false }) @IsOptional() @IsNumber() port?: number;
    @ApiProperty({ required: false }) @IsOptional() envVariables?: Record<string, string>;
}

@ApiTags('Deployments')
@Controller('deployments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DeploymentsController {
    constructor(private deploymentsService: DeploymentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new deployment' })
    create(@CurrentUser() user, @Body() dto: CreateDeploymentDto) {
        return this.deploymentsService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all deployments' })
    findAll(@CurrentUser() user) {
        return this.deploymentsService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get deployment details' })
    findOne(@Param('id') id: string, @CurrentUser() user) {
        return this.deploymentsService.findById(id, user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update deployment' })
    update(@Param('id') id: string, @CurrentUser() user, @Body() dto: Partial<CreateDeploymentDto>) {
        return this.deploymentsService.update(id, user.id, dto);
    }

    @Post(':id/stop')
    @ApiOperation({ summary: 'Stop deployment' })
    stop(@Param('id') id: string, @CurrentUser() user) {
        return this.deploymentsService.stop(id, user.id);
    }

    @Post(':id/restart')
    @ApiOperation({ summary: 'Restart deployment' })
    restart(@Param('id') id: string, @CurrentUser() user) {
        return this.deploymentsService.restart(id, user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete deployment' })
    remove(@Param('id') id: string, @CurrentUser() user) {
        return this.deploymentsService.delete(id, user.id);
    }
}
