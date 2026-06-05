import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManutencaoController } from './manutencao.controller';
import { ManutencaoService } from './manutencao.service';
import { ChamadoManutencao } from './chamado-manutencao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChamadoManutencao])],
  controllers: [ManutencaoController],
  providers: [ManutencaoService],
  exports: [ManutencaoService],
})
export class ManutencaoModule {}
