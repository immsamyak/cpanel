import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirewallRule, FirewallAction } from '../../entities/firewall-rule.entity';

@Injectable()
export class SecurityService {
    constructor(
        @InjectRepository(FirewallRule)
        private firewallRepository: Repository<FirewallRule>,
    ) { }

    async createRule(data: Partial<FirewallRule>): Promise<FirewallRule> {
        const rule = this.firewallRepository.create(data);
        return this.firewallRepository.save(rule);
    }

    async findAllRules(serverId: string): Promise<FirewallRule[]> {
        return this.firewallRepository.find({
            where: { serverId },
            order: { createdAt: 'DESC' },
        });
    }

    async findRuleById(id: string): Promise<FirewallRule> {
        const rule = await this.firewallRepository.findOne({ where: { id } });
        if (!rule) throw new NotFoundException('Firewall rule not found');
        return rule;
    }

    async toggleRule(id: string): Promise<FirewallRule> {
        const rule = await this.findRuleById(id);
        rule.isActive = !rule.isActive;
        return this.firewallRepository.save(rule);
    }

    async deleteRule(id: string): Promise<void> {
        const rule = await this.findRuleById(id);
        await this.firewallRepository.remove(rule);
    }

    async getFail2banStatus(serverId: string) {
        // Simulated Fail2ban status
        return {
            enabled: true,
            jails: [
                { name: 'sshd', currentlyBanned: 3, totalBanned: 47, bannedIps: ['192.168.1.100', '10.0.0.50', '172.16.0.22'] },
                { name: 'nginx-http-auth', currentlyBanned: 1, totalBanned: 12, bannedIps: ['192.168.1.200'] },
                { name: 'nginx-botsearch', currentlyBanned: 5, totalBanned: 89, bannedIps: ['10.0.0.1', '10.0.0.2', '10.0.0.3', '10.0.0.4', '10.0.0.5'] },
            ],
        };
    }
}
