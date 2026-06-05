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
import { FinanceiroService } from './financeiro.service';
import { PagamentoStatus, PagamentoMetodo } from './pagamento.entity';
import { ComissaoStatus } from './comissao.entity';

@ApiTags('financeiro')
@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly financeiroService: FinanceiroService) {}

  // ── Dashboard ─────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard financeiro' })
  obterDashboard() {
    return this.financeiroService.obterDashboard();
  }

  // ── Pagamentos ────────────────────────────────────────────────────────

  @Post('pagamentos/gerar-parcelas')
  @ApiOperation({ summary: 'Gerar parcelas de um contrato' })
  @HttpCode(HttpStatus.CREATED)
  gerarParcelas(
    @Body()
    body: {
      contratoId: string;
      valorTotal: number;
      numeroParcelas: number;
      dataVencimentoInicial: Date;
      entradaValor?: number;
    },
  ) {
    return this.financeiroService.gerarParcelasContrato(
      body.contratoId,
      body.valorTotal,
      body.numeroParcelas,
      body.dataVencimentoInicial,
      body.entradaValor,
    );
  }

  @Get('pagamentos')
  @ApiOperation({ summary: 'Listar pagamentos' })
  @ApiQuery({ name: 'contratoId', required: false })
  @ApiQuery({ name: 'status', enum: PagamentoStatus, required: false })
  listarPagamentos(
    @Query('contratoId') contratoId?: string,
    @Query('status') status?: PagamentoStatus,
  ) {
    return this.financeiroService.listarPagamentos(contratoId, status);
  }

  @Patch('pagamentos/:id/registrar')
  @ApiOperation({ summary: 'Registrar pagamento recebido' })
  registrarPagamento(
    @Param('id') id: string,
    @Body('metodo') metodo: PagamentoMetodo,
    @Body('transacaoId') transacaoId?: string,
  ) {
    return this.financeiroService.registrarPagamento(id, metodo, transacaoId);
  }

  @Post('pagamentos/verificar-vencidos')
  @ApiOperation({ summary: 'Verificar e marcar pagamentos vencidos' })
  verificarVencidos() {
    return this.financeiroService.verificarPagamentosVencidos();
  }

  // ── Comissões ─────────────────────────────────────────────────────────

  @Post('comissoes')
  @ApiOperation({ summary: 'Criar comissão para vendedor' })
  @HttpCode(HttpStatus.CREATED)
  criarComissao(
    @Body()
    body: {
      contratoId: string;
      vendedorId: string;
      vendedorNome: string;
      valorContrato: number;
      percentualComissao: number;
    },
  ) {
    return this.financeiroService.criarComissao(body);
  }

  @Get('comissoes')
  @ApiOperation({ summary: 'Listar comissões' })
  @ApiQuery({ name: 'vendedorId', required: false })
  @ApiQuery({ name: 'status', enum: ComissaoStatus, required: false })
  listarComissoes(
    @Query('vendedorId') vendedorId?: string,
    @Query('status') status?: ComissaoStatus,
  ) {
    return this.financeiroService.listarComissoes(vendedorId, status);
  }

  @Patch('comissoes/:id/pagar')
  @ApiOperation({ summary: 'Registrar pagamento de comissão' })
  pagarComissao(@Param('id') id: string) {
    return this.financeiroService.pagarComissao(id);
  }
}
