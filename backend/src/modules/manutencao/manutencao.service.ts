import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChamadoManutencao, ChamadoStatus, ChamadoTipo } from './chamado-manutencao.entity';
import { CreateChamadoDto } from './dto/create-chamado.dto';

@Injectable()
export class ManutencaoService {
  constructor(
    @InjectRepository(ChamadoManutencao)
    private chamadoRepo: Repository<ChamadoManutencao>,
  ) {}

  async abrirChamado(dto: CreateChamadoDto): Promise<ChamadoManutencao> {
    const chamado = this.chamadoRepo.create(dto);
    return this.chamadoRepo.save(chamado);
  }

  async listarChamados(status?: ChamadoStatus, tipo?: ChamadoTipo, clienteId?: string): Promise<ChamadoManutencao[]> {
    const where: any = {};
    if (status) where.status = status;
    if (tipo) where.tipo = tipo;
    if (clienteId) where.clienteId = clienteId;
    return this.chamadoRepo.find({ where, order: { criadoEm: 'DESC' }, relations: ['cliente'] });
  }

  async buscarChamado(id: string): Promise<ChamadoManutencao> {
    const chamado = await this.chamadoRepo.findOne({ where: { id }, relations: ['cliente'] });
    if (!chamado) throw new NotFoundException(`Chamado ${id} não encontrado`);
    return chamado;
  }

  async atribuirTecnico(id: string, tecnicoId: string, tecnicoNome: string): Promise<ChamadoManutencao> {
    await this.buscarChamado(id);
    await this.chamadoRepo.update(id, {
      tecnicoId,
      tecnicoNome,
      status: ChamadoStatus.EM_ATENDIMENTO,
    });
    return this.buscarChamado(id);
  }

  async agendarAtendimento(id: string, dataAgendamento: Date): Promise<ChamadoManutencao> {
    await this.buscarChamado(id);
    await this.chamadoRepo.update(id, {
      dataAgendamento,
      status: ChamadoStatus.AGENDADO,
    });
    return this.buscarChamado(id);
  }

  async concluirChamado(
    id: string,
    dados: {
      solucaoAplicada: string;
      pecasSubstituidas?: any[];
      custoTotal?: number;
    },
  ): Promise<ChamadoManutencao> {
    await this.buscarChamado(id);
    await this.chamadoRepo.update(id, {
      ...dados,
      status: ChamadoStatus.CONCLUIDO,
      dataConclusao: new Date(),
      dataAtendimento: new Date(),
    });
    return this.buscarChamado(id);
  }

  async avaliarAtendimento(id: string, avaliacao: number, comentario?: string): Promise<ChamadoManutencao> {
    await this.buscarChamado(id);
    await this.chamadoRepo.update(id, {
      avaliacaoCliente: avaliacao,
      comentarioCliente: comentario,
    });
    return this.buscarChamado(id);
  }

  async obterRelatorioSla(): Promise<{
    abertos: number;
    emAtendimento: number;
    concluidos: number;
    tempoMedioResposta: number;
  }> {
    const chamados = await this.chamadoRepo.find();
    const abertos = chamados.filter((c) => c.status === ChamadoStatus.ABERTO).length;
    const emAtendimento = chamados.filter((c) => c.status === ChamadoStatus.EM_ATENDIMENTO).length;
    const concluidos = chamados.filter((c) => c.status === ChamadoStatus.CONCLUIDO);

    let tempoMedioResposta = 0;
    if (concluidos.length > 0) {
      const tempos = concluidos
        .filter((c) => c.dataAtendimento)
        .map((c) => {
          const abertura = new Date(c.criadoEm).getTime();
          const atendimento = new Date(c.dataAtendimento).getTime();
          return (atendimento - abertura) / (1000 * 60 * 60);
        });
      tempoMedioResposta = tempos.length > 0
        ? tempos.reduce((a, b) => a + b, 0) / tempos.length
        : 0;
    }

    return {
      abertos,
      emAtendimento,
      concluidos: concluidos.length,
      tempoMedioResposta: Math.round(tempoMedioResposta * 10) / 10,
    };
  }
}
