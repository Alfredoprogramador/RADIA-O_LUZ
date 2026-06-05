import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstalacaoController } from './instalacao.controller';
import { InstalacaoService } from './instalacao.service';
import { OrdemInstalacao } from './ordem-instalacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdemInstalacao])],
  controllers: [InstalacaoController],
  providers: [InstalacaoService],
  exports: [InstalacaoService],
})
export class InstalacaoModule {}
