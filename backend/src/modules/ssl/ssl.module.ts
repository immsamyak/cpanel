import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SslCertificate } from '../../entities/ssl-certificate.entity';
import { SslService } from './ssl.service';
import { SslController } from './ssl.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SslCertificate])],
    controllers: [SslController],
    providers: [SslService],
    exports: [SslService],
})
export class SslModule { }
