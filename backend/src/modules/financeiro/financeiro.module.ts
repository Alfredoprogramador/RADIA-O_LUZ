import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';
import { Pagamento } from './pagamento.entity';
import { Comissao } from './comissao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pagamento, Comissao])],
  controllers: [FinanceiroController],
  providers: [FinanceiroService],
  exports: [FinanceiroService],
})
export class FinanceiroModule {}
