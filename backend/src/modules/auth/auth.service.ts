import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.usersService.create({
            ...dto,
            password: hashedPassword,
        });

        const tokens = await this.generateTokens(user);
        return { user: this.sanitizeUser(user), ...tokens };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(user: User) {
        if (user.isTwoFactorEnabled) {
            return {
                requiresTwoFactor: true,
                userId: user.id,
            };
        }

        await this.usersService.updateLastLogin(user.id);
        const tokens = await this.generateTokens(user);
        return { user: this.sanitizeUser(user), ...tokens };
    }

    async verifyTwoFactor(userId: string, code: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.twoFactorSecret) {
            throw new UnauthorizedException('Invalid 2FA setup');
        }

        const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
        if (!isValid) {
            throw new UnauthorizedException('Invalid 2FA code');
        }

        await this.usersService.updateLastLogin(user.id);
        const tokens = await this.generateTokens(user);
        return { user: this.sanitizeUser(user), ...tokens };
    }

    async enableTwoFactor(userId: string) {
        const user = await this.usersService.findById(userId);
        const secret = authenticator.generateSecret();
        const appName = this.configService.get('TWO_FA_APP_NAME', 'ServerPanel');
        const otpauthUrl = authenticator.keyuri(user.email, appName, secret);
        const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

        await this.usersService.setTwoFactorSecret(userId, secret);

        return { secret, qrCodeDataUrl };
    }

    async confirmTwoFactor(userId: string, code: string) {
        const user = await this.usersService.findById(userId);
        const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
        if (!isValid) {
            throw new UnauthorizedException('Invalid 2FA code');
        }

        await this.usersService.enableTwoFactor(userId);
        return { message: '2FA enabled successfully' };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user) throw new UnauthorizedException();

            const tokens = await this.generateTokens(user);
            return { user: this.sanitizeUser(user), ...tokens };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    private async generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
        });

        return { accessToken, refreshToken };
    }

    private sanitizeUser(user: User) {
        const { password, twoFactorSecret, refreshToken, ...result } = user;
        return result;
    }
}
