import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SslCertificate, SslStatus } from '../../entities/ssl-certificate.entity';

@Injectable()
export class SslService {
    constructor(
        @InjectRepository(SslCertificate)
        private sslRepository: Repository<SslCertificate>,
    ) { }

    async requestCertificate(data: Partial<SslCertificate>): Promise<SslCertificate> {
        const cert = this.sslRepository.create({
            ...data,
            status: SslStatus.PENDING,
            issuer: "Let's Encrypt",
            autoRenew: true,
        });
        const saved = await this.sslRepository.save(cert);

        // Simulate async certificate issuance
        setTimeout(async () => {
            const now = new Date();
            const expires = new Date(now);
            expires.setDate(expires.getDate() + 90);
            await this.sslRepository.update(saved.id, {
                status: SslStatus.ACTIVE,
                issuedAt: now,
                expiresAt: expires,
                certificatePath: `/etc/letsencrypt/live/${data.domain}/fullchain.pem`,
                privateKeyPath: `/etc/letsencrypt/live/${data.domain}/privkey.pem`,
            });
        }, 2000);

        return saved;
    }

    async findAll(serverId?: string): Promise<SslCertificate[]> {
        const where = serverId ? { serverId } : {};
        return this.sslRepository.find({ where, order: { createdAt: 'DESC' } });
    }

    async findById(id: string): Promise<SslCertificate> {
        const cert = await this.sslRepository.findOne({ where: { id } });
        if (!cert) throw new NotFoundException('Certificate not found');
        return cert;
    }

    async uploadCertificate(data: Partial<SslCertificate>): Promise<SslCertificate> {
        const cert = this.sslRepository.create({
            ...data,
            status: SslStatus.ACTIVE,
            issuer: 'Manual Upload',
            issuedAt: new Date(),
        });
        return this.sslRepository.save(cert);
    }

    async renewCertificate(id: string): Promise<SslCertificate> {
        const cert = await this.findById(id);
        const now = new Date();
        const expires = new Date(now);
        expires.setDate(expires.getDate() + 90);
        cert.issuedAt = now;
        cert.expiresAt = expires;
        cert.status = SslStatus.ACTIVE;
        return this.sslRepository.save(cert);
    }

    async delete(id: string): Promise<void> {
        const cert = await this.findById(id);
        await this.sslRepository.remove(cert);
    }

    async getExpiringCertificates(daysUntilExpiry = 30): Promise<SslCertificate[]> {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysUntilExpiry);
        return this.sslRepository
            .createQueryBuilder('cert')
            .where('cert.expiresAt <= :targetDate', { targetDate })
            .andWhere('cert.status = :status', { status: SslStatus.ACTIVE })
            .andWhere('cert.autoRenew = true')
            .getMany();
    }
}
