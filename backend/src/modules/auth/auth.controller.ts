import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Request() req, @Body() dto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Post('verify-2fa')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify 2FA code' })
    async verifyTwoFactor(@Body() body: { userId: string; code: string }) {
        return this.authService.verifyTwoFactor(body.userId, body.code);
    }

    @Post('enable-2fa')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Enable 2FA for current user' })
    async enableTwoFactor(@Request() req) {
        return this.authService.enableTwoFactor(req.user.id);
    }

    @Post('confirm-2fa')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Confirm 2FA setup with code' })
    async confirmTwoFactor(@Request() req, @Body() body: { code: string }) {
        return this.authService.confirmTwoFactor(req.user.id, body.code);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }
}
