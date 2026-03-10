import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(data: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'isTwoFactorEnabled', 'lastLoginAt', 'createdAt'],
        });
    }

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        await this.usersRepository.update(id, data);
        return this.findById(id);
    }

    async updateLastLogin(id: string): Promise<void> {
        await this.usersRepository.update(id, { lastLoginAt: new Date() });
    }

    async setTwoFactorSecret(id: string, secret: string): Promise<void> {
        await this.usersRepository.update(id, { twoFactorSecret: secret });
    }

    async enableTwoFactor(id: string): Promise<void> {
        await this.usersRepository.update(id, { isTwoFactorEnabled: true });
    }

    async disableTwoFactor(id: string): Promise<void> {
        await this.usersRepository.update(id, { isTwoFactorEnabled: false, twoFactorSecret: null });
    }

    async delete(id: string): Promise<void> {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
    }

    async toggleActive(id: string): Promise<User> {
        const user = await this.findById(id);
        user.isActive = !user.isActive;
        return this.usersRepository.save(user);
    }

    async changeRole(id: string, role: UserRole): Promise<User> {
        await this.usersRepository.update(id, { role });
        return this.findById(id);
    }
}
