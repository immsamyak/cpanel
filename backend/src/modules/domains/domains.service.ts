import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain, DomainStatus, DomainType } from '../../entities/domain.entity';

@Injectable()
export class DomainsService {
    constructor(
        @InjectRepository(Domain)
        private domainsRepository: Repository<Domain>,
    ) { }

    async create(userId: string, data: Partial<Domain>): Promise<Domain> {
        const nginxConfig = this.generateNginxConfig(data);
        const domain = this.domainsRepository.create({
            ...data,
            userId,
            nginxConfig,
            status: DomainStatus.PENDING,
        });
        return this.domainsRepository.save(domain);
    }

    async findAll(userId: string): Promise<Domain[]> {
        return this.domainsRepository.find({
            where: { userId },
            relations: ['server'],
            order: { createdAt: 'DESC' },
        });
    }

    async findById(id: string, userId?: string): Promise<Domain> {
        const where: any = { id };
        if (userId) where.userId = userId;
        const domain = await this.domainsRepository.findOne({ where, relations: ['server'] });
        if (!domain) throw new NotFoundException('Domain not found');
        return domain;
    }

    async update(id: string, userId: string, data: Partial<Domain>): Promise<Domain> {
        const domain = await this.findById(id, userId);
        Object.assign(domain, data);
        if (data.documentRoot || data.isReverseProxy || data.reverseProxyUrl) {
            domain.nginxConfig = this.generateNginxConfig(domain);
        }
        return this.domainsRepository.save(domain);
    }

    async delete(id: string, userId: string): Promise<void> {
        const domain = await this.findById(id, userId);
        await this.domainsRepository.remove(domain);
    }

    async toggleStatus(id: string, userId: string): Promise<Domain> {
        const domain = await this.findById(id, userId);
        domain.status = domain.status === DomainStatus.ACTIVE ? DomainStatus.INACTIVE : DomainStatus.ACTIVE;
        return this.domainsRepository.save(domain);
    }

    async findByServer(serverId: string): Promise<Domain[]> {
        return this.domainsRepository.find({ where: { serverId } });
    }

    private generateNginxConfig(domain: Partial<Domain>): string {
        if (domain.isReverseProxy && domain.reverseProxyUrl) {
            return `server {
    listen 80;
    server_name ${domain.name};

    location / {
        proxy_pass ${domain.reverseProxyUrl};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`;
        }

        return `server {
    listen 80;
    server_name ${domain.name};
    root ${domain.documentRoot || `/var/www/${domain.name}/public`};
    index index.html index.htm index.php;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.ht {
        deny all;
    }
}`;
    }
}
