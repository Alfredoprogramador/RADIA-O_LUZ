import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { Cliente } from './cliente.entity';
import { Lead } from './lead.entity';
import { Interacao } from './interacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Lead, Interacao])],
  controllers: [CrmController],
  providers: [CrmService],
  exports: [CrmService],
})
export class CrmModule {}
