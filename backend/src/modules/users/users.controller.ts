import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all users (admin only)' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@CurrentUser() user) {
        return this.usersService.findById(user.id);
    }

    @Patch(':id/role')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Change user role (admin only)' })
    changeRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
        return this.usersService.changeRole(id, body.role);
    }

    @Patch(':id/toggle-active')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Toggle user active status (admin only)' })
    toggleActive(@Param('id') id: string) {
        return this.usersService.toggleActive(id);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete a user (admin only)' })
    remove(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
