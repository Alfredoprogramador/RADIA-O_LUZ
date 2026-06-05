import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InstalacaoService } from './instalacao.service';
import { InstalacaoStatus } from './ordem-instalacao.entity';

@ApiTags('instalacao')
@Controller('instalacao')
export class InstalacaoController {
  constructor(private readonly instalacaoService: InstalacaoService) {}

  @Post('ordens')
  @ApiOperation({ summary: 'Criar ordem de instalação' })
  @HttpCode(HttpStatus.CREATED)
  criarOrdem(@Body() body: { projetoId: string; dataAgendamento?: Date }) {
    return this.instalacaoService.criarOrdem(body.projetoId, body.dataAgendamento);
  }

  @Get('ordens')
  @ApiOperation({ summary: 'Listar ordens de instalação' })
  @ApiQuery({ name: 'status', enum: InstalacaoStatus, required: false })
  listarOrdens(@Query('status') status?: InstalacaoStatus) {
    return this.instalacaoService.listarOrdens(status);
  }

  @Get('ordens/:id')
  @ApiOperation({ summary: 'Buscar ordem de instalação por ID' })
  buscarOrdem(@Param('id') id: string) {
    return this.instalacaoService.buscarOrdem(id);
  }

  @Patch('ordens/:id/etapa')
  @ApiOperation({ summary: 'Avançar para próxima etapa da instalação' })
  avancarEtapa(@Param('id') id: string, @Body('etapa') etapa: InstalacaoStatus) {
    return this.instalacaoService.avancarEtapa(id, etapa);
  }

  @Patch('ordens/:id/checklist/:index')
  @ApiOperation({ summary: 'Atualizar item do checklist de segurança' })
  atualizarChecklist(
    @Param('id') id: string,
    @Param('index') index: number,
    @Body('concluido') concluido: boolean,
    @Body('observacao') observacao?: string,
  ) {
    return this.instalacaoService.atualizarChecklist(id, +index, concluido, observacao);
  }

  @Post('ordens/:id/fotos')
  @ApiOperation({ summary: 'Adicionar foto ao registro da instalação' })
  adicionarFoto(
    @Param('id') id: string,
    @Body() foto: { etapa: string; url: string; descricao?: string },
  ) {
    return this.instalacaoService.adicionarFoto(id, foto);
  }

  @Patch('ordens/:id/assinar')
  @ApiOperation({ summary: 'Registrar assinatura digital do cliente na conclusão' })
  registrarAssinatura(@Param('id') id: string, @Body('assinaturaUrl') assinaturaUrl: string) {
    return this.instalacaoService.registrarAssinaturaCliente(id, assinaturaUrl);
  }

  @Patch('ordens/:id/equipe')
  @ApiOperation({ summary: 'Atribuir equipe à ordem de instalação' })
  atribuirEquipe(
    @Param('id') id: string,
    @Body() body: { equipe: { id: string; nome: string; funcao: string }[] },
  ) {
    return this.instalacaoService.atribuirEquipe(id, body.equipe);
  }
}
