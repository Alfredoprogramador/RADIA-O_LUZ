import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Simulacao } from './simulacao.entity';
import { Contrato, ContratoStatus } from './contrato.entity';
import { CreateSimulacaoDto } from './dto/create-simulacao.dto';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { v4 as uuidv4 } from 'uuid';

// Tarifa média de energia (R$/kWh) — pode ser configurável por estado
const TARIFA_MEDIA_KWH = 0.85;
// Irradiação solar média Brasil (horas de pico solar por dia)
const IRRADIACAO_MEDIA_HPS = 4.5;
// Custo médio por kWp instalado (R$)
const CUSTO_POR_KWP = 5500;
// Potência de um painel padrão (Wp)
const POTENCIA_PAINEL_WP = 550;

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(Simulacao)
    private simulacaoRepo: Repository<Simulacao>,
    @InjectRepository(Contrato)
    private contratoRepo: Repository<Contrato>,
  ) {}

  // ── Simulação ─────────────────────────────────────────────────────────

  async criarSimulacao(dto: CreateSimulacaoDto): Promise<Simulacao> {
    const potenciaKwp = this.calcularPotenciaKwp(dto.consumoMensalKwh);
    const quantidadePaineis = Math.ceil((potenciaKwp * 1000) / POTENCIA_PAINEL_WP);
    const geracaoMensalEstimadaKwh = potenciaKwp * IRRADIACAO_MEDIA_HPS * 30 * 0.8;
    const economiaAnualEstimada = geracaoMensalEstimadaKwh * 12 * TARIFA_MEDIA_KWH;
    const valorProposta = potenciaKwp * CUSTO_POR_KWP;
    const paybackAnos = valorProposta / economiaAnualEstimada;

    const simulacao = this.simulacaoRepo.create({
      ...dto,
      potenciaKwp,
      quantidadePaineis,
      geracaoMensalEstimadaKwh,
      economiaAnualEstimada,
      paybackAnos,
      valorProposta,
      detalhesEquipamentos: {
        paineis: {
          quantidade: quantidadePaineis,
          potenciaUnitariaWp: POTENCIA_PAINEL_WP,
          modeloSugerido: 'Painel Monocristalino 550Wp',
        },
        inversor: {
          potenciaKw: potenciaKwp,
          modeloSugerido: potenciaKwp <= 5 ? 'Micro-inversor' : 'String Inversor',
        },
        estrutura: {
          tipo: 'Telhado',
          material: 'Alumínio e Aço Galvanizado',
        },
      },
    });

    return this.simulacaoRepo.save(simulacao);
  }

  private calcularPotenciaKwp(consumoMensalKwh: number): number {
    const geracaoNecessaria = consumoMensalKwh * 1.1; // 10% de margem
    const potencia = geracaoNecessaria / (IRRADIACAO_MEDIA_HPS * 30 * 0.8);
    return Math.round(potencia * 100) / 100;
  }

  async listarSimulacoes(clienteId?: string): Promise<Simulacao[]> {
    const where = clienteId ? { clienteId } : {};
    return this.simulacaoRepo.find({ where, order: { criadoEm: 'DESC' } });
  }

  async buscarSimulacao(id: string): Promise<Simulacao> {
    const sim = await this.simulacaoRepo.findOne({ where: { id }, relations: ['cliente'] });
    if (!sim) throw new NotFoundException(`Simulação ${id} não encontrada`);
    return sim;
  }

  // ── Contratos ─────────────────────────────────────────────────────────

  async criarContrato(dto: CreateContratoDto): Promise<Contrato> {
    const numero = `RL-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const contrato = this.contratoRepo.create({ ...dto, numero });
    return this.contratoRepo.save(contrato);
  }

  async listarContratos(clienteId?: string, status?: ContratoStatus): Promise<Contrato[]> {
    const where: any = {};
    if (clienteId) where.clienteId = clienteId;
    if (status) where.status = status;
    return this.contratoRepo.find({ where, order: { criadoEm: 'DESC' }, relations: ['cliente'] });
  }

  async buscarContrato(id: string): Promise<Contrato> {
    const contrato = await this.contratoRepo.findOne({ where: { id }, relations: ['cliente', 'simulacao'] });
    if (!contrato) throw new NotFoundException(`Contrato ${id} não encontrado`);
    return contrato;
  }

  async assinarContrato(id: string, pdfUrl?: string): Promise<Contrato> {
    const contrato = await this.buscarContrato(id);
    await this.contratoRepo.update(id, {
      status: ContratoStatus.ASSINADO,
      dataAssinatura: new Date(),
      pdfAssinadoUrl: pdfUrl,
    });
    return this.buscarContrato(id);
  }

  async cancelarContrato(id: string): Promise<Contrato> {
    await this.buscarContrato(id);
    await this.contratoRepo.update(id, { status: ContratoStatus.CANCELADO });
    return this.buscarContrato(id);
  }
}
