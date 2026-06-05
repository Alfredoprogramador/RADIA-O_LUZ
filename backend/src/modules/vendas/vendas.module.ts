import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';
import { Simulacao } from './simulacao.entity';
import { Contrato } from './contrato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Simulacao, Contrato])],
  controllers: [VendasController],
  providers: [VendasService],
  exports: [VendasService],
})
export class VendasModule {}
