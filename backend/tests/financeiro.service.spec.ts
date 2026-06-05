import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FinanceiroService } from '../../src/modules/financeiro/financeiro.service';
import { Pagamento, PagamentoStatus, PagamentoMetodo } from '../../src/modules/financeiro/pagamento.entity';
import { Comissao, ComissaoStatus } from '../../src/modules/financeiro/comissao.entity';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 2 }),
  })),
});

describe('FinanceiroService', () => {
  let service: FinanceiroService;
  let pagamentoRepo: any;
  let comissaoRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceiroService,
        { provide: getRepositoryToken(Pagamento), useFactory: mockRepository },
        { provide: getRepositoryToken(Comissao), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<FinanceiroService>(FinanceiroService);
    pagamentoRepo = module.get(getRepositoryToken(Pagamento));
    comissaoRepo = module.get(getRepositoryToken(Comissao));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('gerarParcelasContrato', () => {
    it('deve gerar parcelas mensais corretamente', async () => {
      pagamentoRepo.create.mockImplementation((data) => data);
      pagamentoRepo.save.mockImplementation(async (data) => data);

      const dataInicial = new Date('2024-01-10');
      const parcelas = await service.gerarParcelasContrato(
        'contrato-1',
        36000,
        12,
        dataInicial,
        6000,
      );

      // Entrada + 12 parcelas = 13 itens
      expect(parcelas.length).toBe(13);
      expect(parcelas[0].parcela).toBe(0); // entrada
      expect(parcelas[0].valor).toBe(6000);
      expect(parcelas[1].parcela).toBe(1);
    });
  });

  describe('obterDashboard', () => {
    it('deve calcular totais financeiros corretamente', async () => {
      const pagamentosMock = [
        { status: PagamentoStatus.PAGO, valor: 10000 },
        { status: PagamentoStatus.PAGO, valor: 5000 },
        { status: PagamentoStatus.PENDENTE, valor: 3000 },
        { status: PagamentoStatus.VENCIDO, valor: 1500 },
      ];
      const comissoesMock = [
        { status: ComissaoStatus.PENDENTE, valorComissao: 800 },
        { status: ComissaoStatus.PAGA, valorComissao: 1000 },
      ];

      pagamentoRepo.find.mockResolvedValue(pagamentosMock);
      comissaoRepo.find.mockResolvedValue(comissoesMock);

      const dashboard = await service.obterDashboard();
      expect(dashboard.receitaTotal).toBe(15000);
      expect(dashboard.receitaPendente).toBe(3000);
      expect(dashboard.inadimplencia).toBe(1500);
      expect(dashboard.comissoesPendentes).toBe(800);
    });
  });
});
