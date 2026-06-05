import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VendasService } from './vendas.service';
import { CreateSimulacaoDto } from './dto/create-simulacao.dto';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { ContratoStatus } from './contrato.entity';

@ApiTags('vendas')
@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  // ── Simulações ────────────────────────────────────────────────────────

  @Post('simulacoes')
  @ApiOperation({ summary: 'Criar nova simulação de energia solar' })
  @HttpCode(HttpStatus.CREATED)
  criarSimulacao(@Body() dto: CreateSimulacaoDto) {
    return this.vendasService.criarSimulacao(dto);
  }

  @Get('simulacoes')
  @ApiOperation({ summary: 'Listar simulações' })
  @ApiQuery({ name: 'clienteId', required: false })
  listarSimulacoes(@Query('clienteId') clienteId?: string) {
    return this.vendasService.listarSimulacoes(clienteId);
  }

  @Get('simulacoes/:id')
  @ApiOperation({ summary: 'Buscar simulação por ID' })
  buscarSimulacao(@Param('id') id: string) {
    return this.vendasService.buscarSimulacao(id);
  }

  // ── Contratos ─────────────────────────────────────────────────────────

  @Post('contratos')
  @ApiOperation({ summary: 'Criar novo contrato' })
  @HttpCode(HttpStatus.CREATED)
  criarContrato(@Body() dto: CreateContratoDto) {
    return this.vendasService.criarContrato(dto);
  }

  @Get('contratos')
  @ApiOperation({ summary: 'Listar contratos' })
  @ApiQuery({ name: 'clienteId', required: false })
  @ApiQuery({ name: 'status', enum: ContratoStatus, required: false })
  listarContratos(@Query('clienteId') clienteId?: string, @Query('status') status?: ContratoStatus) {
    return this.vendasService.listarContratos(clienteId, status);
  }

  @Get('contratos/:id')
  @ApiOperation({ summary: 'Buscar contrato por ID' })
  buscarContrato(@Param('id') id: string) {
    return this.vendasService.buscarContrato(id);
  }

  @Patch('contratos/:id/assinar')
  @ApiOperation({ summary: 'Assinar contrato digitalmente' })
  assinarContrato(@Param('id') id: string, @Body('pdfUrl') pdfUrl?: string) {
    return this.vendasService.assinarContrato(id, pdfUrl);
  }

  @Patch('contratos/:id/cancelar')
  @ApiOperation({ summary: 'Cancelar contrato' })
  cancelarContrato(@Param('id') id: string) {
    return this.vendasService.cancelarContrato(id);
  }
}
