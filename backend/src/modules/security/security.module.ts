import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirewallRule } from '../../entities/firewall-rule.entity';
import { SecurityService } from './security.service';
import { SecurityController } from './security.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FirewallRule])],
    controllers: [SecurityController],
    providers: [SecurityService],
    exports: [SecurityService],
})
export class SecurityModule { }
