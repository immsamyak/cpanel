import { Controller, Get, Post, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
    constructor(private filesService: FilesService) { }

    @Get('browse')
    @ApiOperation({ summary: 'Browse directory contents' })
    browse(
        @Query('serverIp') serverIp: string,
        @Query('agentPort') agentPort: number,
        @Query('agentToken') agentToken: string,
        @Query('path') path: string,
    ) {
        return this.filesService.browse(serverIp, agentPort || 3002, agentToken, path || '/var/www');
    }

    @Get('read')
    @ApiOperation({ summary: 'Read file contents' })
    readFile(
        @Query('serverIp') serverIp: string,
        @Query('agentPort') agentPort: number,
        @Query('agentToken') agentToken: string,
        @Query('path') path: string,
    ) {
        return this.filesService.readFile(serverIp, agentPort || 3002, agentToken, path);
    }

    @Post('write')
    @ApiOperation({ summary: 'Write file contents' })
    writeFile(@Body() body: { serverIp: string; agentPort: number; agentToken: string; path: string; content: string }) {
        return this.filesService.writeFile(body.serverIp, body.agentPort, body.agentToken, body.path, body.content);
    }

    @Post('mkdir')
    @ApiOperation({ summary: 'Create a directory' })
    createDir(@Body() body: { serverIp: string; agentPort: number; agentToken: string; path: string }) {
        return this.filesService.createDirectory(body.serverIp, body.agentPort, body.agentToken, body.path);
    }

    @Delete()
    @ApiOperation({ summary: 'Delete file or directory' })
    deleteFile(@Body() body: { serverIp: string; agentPort: number; agentToken: string; path: string }) {
        return this.filesService.deleteFile(body.serverIp, body.agentPort, body.agentToken, body.path);
    }

    @Post('rename')
    @ApiOperation({ summary: 'Rename file or directory' })
    rename(@Body() body: { serverIp: string; agentPort: number; agentToken: string; oldPath: string; newPath: string }) {
        return this.filesService.rename(body.serverIp, body.agentPort, body.agentToken, body.oldPath, body.newPath);
    }

    @Post('chmod')
    @ApiOperation({ summary: 'Change file permissions' })
    chmod(@Body() body: { serverIp: string; agentPort: number; agentToken: string; path: string; permissions: string }) {
        return this.filesService.changePermissions(body.serverIp, body.agentPort, body.agentToken, body.path, body.permissions);
    }
}
