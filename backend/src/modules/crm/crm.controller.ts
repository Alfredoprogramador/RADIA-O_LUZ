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
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ClienteStatus } from './cliente.entity';
import { LeadStatus } from './lead.entity';
import { InteracaoTipo } from './interacao.entity';

@ApiTags('crm')
@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // ── Clientes ──────────────────────────────────────────────────────────

  @Post('clientes')
  @ApiOperation({ summary: 'Criar novo cliente' })
  @HttpCode(HttpStatus.CREATED)
  criarCliente(@Body() dto: CreateClienteDto) {
    return this.crmService.criarCliente(dto);
  }

  @Get('clientes')
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: ClienteStatus, required: false })
  listarClientes(@Query('search') search?: string, @Query('status') status?: ClienteStatus) {
    return this.crmService.listarClientes(search, status);
  }

  @Get('clientes/:id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  buscarCliente(@Param('id') id: string) {
    return this.crmService.buscarCliente(id);
  }

  @Put('clientes/:id')
  @ApiOperation({ summary: 'Atualizar cliente' })
  atualizarCliente(@Param('id') id: string, @Body() dto: Partial<CreateClienteDto>) {
    return this.crmService.atualizarCliente(id, dto);
  }

  @Patch('clientes/:id/desativar')
  @ApiOperation({ summary: 'Desativar cliente' })
  removerCliente(@Param('id') id: string) {
    return this.crmService.removerCliente(id);
  }

  // ── Leads ─────────────────────────────────────────────────────────────

  @Post('leads')
  @ApiOperation({ summary: 'Criar novo lead' })
  @HttpCode(HttpStatus.CREATED)
  criarLead(@Body() dto: CreateLeadDto) {
    return this.crmService.criarLead(dto);
  }

  @Get('leads')
  @ApiOperation({ summary: 'Listar leads' })
  @ApiQuery({ name: 'status', enum: LeadStatus, required: false })
  @ApiQuery({ name: 'vendedorId', required: false })
  listarLeads(@Query('status') status?: LeadStatus, @Query('vendedorId') vendedorId?: string) {
    return this.crmService.listarLeads(status, vendedorId);
  }

  @Get('leads/:id')
  @ApiOperation({ summary: 'Buscar lead por ID' })
  buscarLead(@Param('id') id: string) {
    return this.crmService.buscarLead(id);
  }

  @Patch('leads/:id/status')
  @ApiOperation({ summary: 'Atualizar status do lead' })
  atualizarStatusLead(@Param('id') id: string, @Body('status') status: LeadStatus) {
    return this.crmService.atualizarStatusLead(id, status);
  }

  @Post('leads/:id/converter')
  @ApiOperation({ summary: 'Converter lead em cliente' })
  converterLeadEmCliente(@Param('id') id: string) {
    return this.crmService.converterLeadEmCliente(id);
  }

  // ── Funil de Vendas ───────────────────────────────────────────────────

  @Get('funil')
  @ApiOperation({ summary: 'Obter funil de vendas' })
  obterFunilVendas() {
    return this.crmService.obterFunilVendas();
  }

  // ── Interações ────────────────────────────────────────────────────────

  @Post('interacoes')
  @ApiOperation({ summary: 'Registrar interação' })
  @HttpCode(HttpStatus.CREATED)
  registrarInteracao(
    @Body()
    body: {
      clienteId?: string;
      leadId?: string;
      tipo: InteracaoTipo;
      descricao: string;
      responsavelNome?: string;
      dataInteracao?: Date;
    },
  ) {
    return this.crmService.registrarInteracao(body);
  }

  @Get('interacoes')
  @ApiOperation({ summary: 'Listar interações' })
  @ApiQuery({ name: 'clienteId', required: false })
  @ApiQuery({ name: 'leadId', required: false })
  listarInteracoes(@Query('clienteId') clienteId?: string, @Query('leadId') leadId?: string) {
    return this.crmService.listarInteracoes(clienteId, leadId);
  }
}
