import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdemInstalacao, InstalacaoStatus } from './ordem-instalacao.entity';

const ETAPAS_DEFAULT = [
  { etapa: '1. Visita Técnica', status: 'pendente' },
  { etapa: '2. Infraestrutura', status: 'pendente' },
  { etapa: '3. Montagem', status: 'pendente' },
  { etapa: '4. Elétrica', status: 'pendente' },
  { etapa: '5. Ativação', status: 'pendente' },
];

const CHECKLIST_SEGURANCA_DEFAULT = [
  { item: 'EPI completo disponível', concluido: false },
  { item: 'Equipamentos testados', concluido: false },
  { item: 'Desligamento da rede elétrica verificado', concluido: false },
  { item: 'Estrutura do telhado avaliada', concluido: false },
  { item: 'Sinalização de segurança instalada', concluido: false },
  { item: 'Cliente informado sobre procedimentos', concluido: false },
];

@Injectable()
export class InstalacaoService {
  constructor(
    @InjectRepository(OrdemInstalacao)
    private ordemRepo: Repository<OrdemInstalacao>,
  ) {}

  async criarOrdem(projetoId: string, dataAgendamento?: Date): Promise<OrdemInstalacao> {
    const ordem = this.ordemRepo.create({
      projetoId,
      dataAgendamento,
      etapas: ETAPAS_DEFAULT,
      checklistSeguranca: CHECKLIST_SEGURANCA_DEFAULT,
      status: InstalacaoStatus.AGENDADA,
    });
    return this.ordemRepo.save(ordem);
  }

  async listarOrdens(status?: InstalacaoStatus): Promise<OrdemInstalacao[]> {
    const where: any = {};
    if (status) where.status = status;
    return this.ordemRepo.find({ where, order: { criadoEm: 'DESC' }, relations: ['projeto'] });
  }

  async buscarOrdem(id: string): Promise<OrdemInstalacao> {
    const ordem = await this.ordemRepo.findOne({ where: { id }, relations: ['projeto'] });
    if (!ordem) throw new NotFoundException(`Ordem de instalação ${id} não encontrada`);
    return ordem;
  }

  async avancarEtapa(id: string, etapa: InstalacaoStatus): Promise<OrdemInstalacao> {
    const ordem = await this.buscarOrdem(id);
    const update: Partial<OrdemInstalacao> = { status: etapa };

    if (etapa === InstalacaoStatus.VISITA_TECNICA) {
      update.dataInicio = new Date();
    } else if (etapa === InstalacaoStatus.CONCLUIDA) {
      update.dataConclusao = new Date();
    }

    await this.ordemRepo.update(id, update);
    return this.buscarOrdem(id);
  }

  async atualizarChecklist(
    id: string,
    checklistIndex: number,
    concluido: boolean,
    observacao?: string,
  ): Promise<OrdemInstalacao> {
    const ordem = await this.buscarOrdem(id);
    const checklist = ordem.checklistSeguranca || [];
    if (checklist[checklistIndex]) {
      checklist[checklistIndex].concluido = concluido;
      if (observacao) checklist[checklistIndex].observacao = observacao;
    }
    await this.ordemRepo.update(id, { checklistSeguranca: checklist });
    return this.buscarOrdem(id);
  }

  async adicionarFoto(id: string, foto: { etapa: string; url: string; descricao?: string }): Promise<OrdemInstalacao> {
    const ordem = await this.buscarOrdem(id);
    const fotos = ordem.fotos || [];
    fotos.push({ ...foto, tiradaEm: new Date() });
    await this.ordemRepo.update(id, { fotos });
    return this.buscarOrdem(id);
  }

  async registrarAssinaturaCliente(id: string, assinaturaUrl: string): Promise<OrdemInstalacao> {
    await this.buscarOrdem(id);
    await this.ordemRepo.update(id, {
      assinaturaClienteUrl: assinaturaUrl,
      assinaturaClienteEm: new Date(),
      status: InstalacaoStatus.CONCLUIDA,
      dataConclusao: new Date(),
    });
    return this.buscarOrdem(id);
  }

  async atribuirEquipe(id: string, equipe: { id: string; nome: string; funcao: string }[]): Promise<OrdemInstalacao> {
    await this.buscarOrdem(id);
    await this.ordemRepo.update(id, { equipeResponsavel: equipe });
    return this.buscarOrdem(id);
  }
}
