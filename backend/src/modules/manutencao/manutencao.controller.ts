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
import { ManutencaoService } from './manutencao.service';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { ChamadoStatus, ChamadoTipo } from './chamado-manutencao.entity';

@ApiTags('manutencao')
@Controller('manutencao')
export class ManutencaoController {
  constructor(private readonly manutencaoService: ManutencaoService) {}

  @Post('chamados')
  @ApiOperation({ summary: 'Abrir chamado de manutenção' })
  @HttpCode(HttpStatus.CREATED)
  abrirChamado(@Body() dto: CreateChamadoDto) {
    return this.manutencaoService.abrirChamado(dto);
  }

  @Get('chamados')
  @ApiOperation({ summary: 'Listar chamados de manutenção' })
  @ApiQuery({ name: 'status', enum: ChamadoStatus, required: false })
  @ApiQuery({ name: 'tipo', enum: ChamadoTipo, required: false })
  @ApiQuery({ name: 'clienteId', required: false })
  listarChamados(
    @Query('status') status?: ChamadoStatus,
    @Query('tipo') tipo?: ChamadoTipo,
    @Query('clienteId') clienteId?: string,
  ) {
    return this.manutencaoService.listarChamados(status, tipo, clienteId);
  }

  @Get('chamados/:id')
  @ApiOperation({ summary: 'Buscar chamado por ID' })
  buscarChamado(@Param('id') id: string) {
    return this.manutencaoService.buscarChamado(id);
  }

  @Patch('chamados/:id/tecnico')
  @ApiOperation({ summary: 'Atribuir técnico ao chamado' })
  atribuirTecnico(
    @Param('id') id: string,
    @Body('tecnicoId') tecnicoId: string,
    @Body('tecnicoNome') tecnicoNome: string,
  ) {
    return this.manutencaoService.atribuirTecnico(id, tecnicoId, tecnicoNome);
  }

  @Patch('chamados/:id/agendar')
  @ApiOperation({ summary: 'Agendar atendimento do chamado' })
  agendarAtendimento(@Param('id') id: string, @Body('dataAgendamento') dataAgendamento: Date) {
    return this.manutencaoService.agendarAtendimento(id, dataAgendamento);
  }

  @Patch('chamados/:id/concluir')
  @ApiOperation({ summary: 'Concluir chamado de manutenção' })
  concluirChamado(
    @Param('id') id: string,
    @Body()
    body: {
      solucaoAplicada: string;
      pecasSubstituidas?: any[];
      custoTotal?: number;
    },
  ) {
    return this.manutencaoService.concluirChamado(id, body);
  }

  @Patch('chamados/:id/avaliar')
  @ApiOperation({ summary: 'Registrar avaliação do cliente (NPS)' })
  avaliarAtendimento(
    @Param('id') id: string,
    @Body('avaliacao') avaliacao: number,
    @Body('comentario') comentario?: string,
  ) {
    return this.manutencaoService.avaliarAtendimento(id, avaliacao, comentario);
  }

  @Get('relatorio/sla')
  @ApiOperation({ summary: 'Relatório de SLA de manutenção' })
  obterRelatorioSla() {
    return this.manutencaoService.obterRelatorioSla();
  }
}
