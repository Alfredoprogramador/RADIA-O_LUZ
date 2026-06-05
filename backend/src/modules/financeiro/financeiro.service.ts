import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pagamento, PagamentoStatus, PagamentoMetodo } from './pagamento.entity';
import { Comissao, ComissaoStatus } from './comissao.entity';

@Injectable()
export class FinanceiroService {
  constructor(
    @InjectRepository(Pagamento)
    private pagamentoRepo: Repository<Pagamento>,
    @InjectRepository(Comissao)
    private comissaoRepo: Repository<Comissao>,
  ) {}

  // ── Pagamentos ────────────────────────────────────────────────────────

  async gerarParcelasContrato(
    contratoId: string,
    valorTotal: number,
    numeroParcelas: number,
    dataVencimentoInicial: Date,
    entradaValor?: number,
  ): Promise<Pagamento[]> {
    const pagamentos: Partial<Pagamento>[] = [];

    if (entradaValor && entradaValor > 0) {
      pagamentos.push({
        contratoId,
        parcela: 0,
        valor: entradaValor,
        dataVencimento: dataVencimentoInicial,
        status: PagamentoStatus.PENDENTE,
      });
    }

    const valorRestante = valorTotal - (entradaValor || 0);
    const valorParcela = Math.round((valorRestante / numeroParcelas) * 100) / 100;

    for (let i = 1; i <= numeroParcelas; i++) {
      const vencimento = new Date(dataVencimentoInicial);
      vencimento.setMonth(vencimento.getMonth() + i);
      pagamentos.push({
        contratoId,
        parcela: i,
        valor: i === numeroParcelas ? valorRestante - valorParcela * (numeroParcelas - 1) : valorParcela,
        dataVencimento: vencimento,
        status: PagamentoStatus.PENDENTE,
      });
    }

    const entities = pagamentos.map((p) => this.pagamentoRepo.create(p));
    return this.pagamentoRepo.save(entities);
  }

  async listarPagamentos(contratoId?: string, status?: PagamentoStatus): Promise<Pagamento[]> {
    const where: any = {};
    if (contratoId) where.contratoId = contratoId;
    if (status) where.status = status;
    return this.pagamentoRepo.find({ where, order: { dataVencimento: 'ASC' } });
  }

  async registrarPagamento(
    id: string,
    metodo: PagamentoMetodo,
    transacaoId?: string,
  ): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepo.findOne({ where: { id } });
    if (!pagamento) throw new NotFoundException(`Pagamento ${id} não encontrado`);
    await this.pagamentoRepo.update(id, {
      status: PagamentoStatus.PAGO,
      dataPagamento: new Date(),
      metodo,
      transacaoId,
    });
    return this.pagamentoRepo.findOne({ where: { id } });
  }

  async verificarPagamentosVencidos(): Promise<number> {
    const hoje = new Date();
    const result = await this.pagamentoRepo
      .createQueryBuilder('p')
      .update()
      .set({ status: PagamentoStatus.VENCIDO })
      .where('p.status = :status AND p.dataVencimento < :hoje', {
        status: PagamentoStatus.PENDENTE,
        hoje,
      })
      .execute();
    return result.affected || 0;
  }

  // ── Comissões ─────────────────────────────────────────────────────────

  async criarComissao(dados: {
    contratoId: string;
    vendedorId: string;
    vendedorNome: string;
    valorContrato: number;
    percentualComissao: number;
  }): Promise<Comissao> {
    const valorComissao = (dados.valorContrato * dados.percentualComissao) / 100;
    const comissao = this.comissaoRepo.create({ ...dados, valorComissao });
    return this.comissaoRepo.save(comissao);
  }

  async listarComissoes(vendedorId?: string, status?: ComissaoStatus): Promise<Comissao[]> {
    const where: any = {};
    if (vendedorId) where.vendedorId = vendedorId;
    if (status) where.status = status;
    return this.comissaoRepo.find({ where, order: { criadoEm: 'DESC' } });
  }

  async pagarComissao(id: string): Promise<Comissao> {
    const comissao = await this.comissaoRepo.findOne({ where: { id } });
    if (!comissao) throw new NotFoundException(`Comissão ${id} não encontrada`);
    await this.comissaoRepo.update(id, {
      status: ComissaoStatus.PAGA,
      dataPagamento: new Date(),
    });
    return this.comissaoRepo.findOne({ where: { id } });
  }

  // ── Dashboard Financeiro ──────────────────────────────────────────────

  async obterDashboard(): Promise<{
    receitaTotal: number;
    receitaPendente: number;
    inadimplencia: number;
    comissoesPendentes: number;
  }> {
    const pagamentos = await this.pagamentoRepo.find();
    const comissoes = await this.comissaoRepo.find();

    const receitaTotal = pagamentos
      .filter((p) => p.status === PagamentoStatus.PAGO)
      .reduce((sum, p) => sum + Number(p.valor), 0);

    const receitaPendente = pagamentos
      .filter((p) => p.status === PagamentoStatus.PENDENTE)
      .reduce((sum, p) => sum + Number(p.valor), 0);

    const inadimplencia = pagamentos
      .filter((p) => p.status === PagamentoStatus.VENCIDO)
      .reduce((sum, p) => sum + Number(p.valor), 0);

    const comissoesPendentes = comissoes
      .filter((c) => c.status === ComissaoStatus.PENDENTE || c.status === ComissaoStatus.APROVADA)
      .reduce((sum, c) => sum + Number(c.valorComissao), 0);

    return {
      receitaTotal: Math.round(receitaTotal * 100) / 100,
      receitaPendente: Math.round(receitaPendente * 100) / 100,
      inadimplencia: Math.round(inadimplencia * 100) / 100,
      comissoesPendentes: Math.round(comissoesPendentes * 100) / 100,
    };
  }
}
