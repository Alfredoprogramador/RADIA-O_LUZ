import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VendasService } from '../../src/modules/vendas/vendas.service';
import { Simulacao } from '../../src/modules/vendas/simulacao.entity';
import { Contrato, ContratoStatus, FormaPagamento } from '../../src/modules/vendas/contrato.entity';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('VendasService', () => {
  let service: VendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendasService,
        { provide: getRepositoryToken(Simulacao), useFactory: mockRepository },
        { provide: getRepositoryToken(Contrato), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<VendasService>(VendasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criarSimulacao', () => {
    it('deve calcular a potência e criar simulação', async () => {
      const dto = {
        consumoMensalKwh: 450,
        valorContaMensal: 380,
        localizacao: 'Goiânia, GO',
      };

      const simRepo = service['simulacaoRepo'];
      const simMock = {
        id: 'sim-1',
        ...dto,
        potenciaKwp: expect.any(Number),
        quantidadePaineis: expect.any(Number),
        geracaoMensalEstimadaKwh: expect.any(Number),
        economiaAnualEstimada: expect.any(Number),
        paybackAnos: expect.any(Number),
        valorProposta: expect.any(Number),
      };

      (simRepo.create as jest.Mock).mockReturnValue(simMock);
      (simRepo.save as jest.Mock).mockResolvedValue(simMock);

      const result = await service.criarSimulacao(dto);
      expect(result).toBeDefined();
      expect(simRepo.save).toHaveBeenCalled();
    });

    it('deve calcular potência corretamente para 450 kWh/mês', () => {
      const calcularPotencia = service['calcularPotenciaKwp'].bind(service);
      const potencia = calcularPotencia(450);
      // Esperado: (450 * 1.1) / (4.5 * 30 * 0.8) ≈ 4.58 kWp
      expect(potencia).toBeGreaterThan(4);
      expect(potencia).toBeLessThan(6);
    });
  });

  describe('criarContrato', () => {
    it('deve criar contrato com número único', async () => {
      const dto = {
        clienteId: 'cli-1',
        valorTotal: 35000,
        formaPagamento: FormaPagamento.FINANCIAMENTO,
        numeroParcelas: 60,
        comissaoPercentual: 5,
      };

      const contratoRepo = service['contratoRepo'];
      const contratoMock = { id: 'cont-1', ...dto, status: ContratoStatus.RASCUNHO };

      (contratoRepo.create as jest.Mock).mockReturnValue(contratoMock);
      (contratoRepo.save as jest.Mock).mockResolvedValue(contratoMock);

      const result = await service.criarContrato(dto);
      expect(result).toBeDefined();
      expect(contratoRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ numero: expect.stringMatching(/^RL-\d{4}-/) }),
      );
    });
  });
});
