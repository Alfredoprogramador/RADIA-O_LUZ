import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjetoTecnico, ProjetoStatus } from './projeto-tecnico.entity';
import { CreateProjetoTecnicoDto } from './dto/create-projeto-tecnico.dto';

@Injectable()
export class ProjetosService {
  constructor(
    @InjectRepository(ProjetoTecnico)
    private projetoRepo: Repository<ProjetoTecnico>,
  ) {}

  async criarProjeto(dto: CreateProjetoTecnicoDto): Promise<ProjetoTecnico> {
    const projeto = this.projetoRepo.create(dto);
    return this.projetoRepo.save(projeto);
  }

  async listarProjetos(status?: ProjetoStatus, distribuidora?: string): Promise<ProjetoTecnico[]> {
    const where: any = {};
    if (status) where.status = status;
    if (distribuidora) where.distribuidora = distribuidora;
    return this.projetoRepo.find({ where, order: { criadoEm: 'DESC' }, relations: ['contrato'] });
  }

  async buscarProjeto(id: string): Promise<ProjetoTecnico> {
    const projeto = await this.projetoRepo.findOne({ where: { id }, relations: ['contrato'] });
    if (!projeto) throw new NotFoundException(`Projeto técnico ${id} não encontrado`);
    return projeto;
  }

  async atualizarStatus(id: string, status: ProjetoStatus, dados?: Partial<ProjetoTecnico>): Promise<ProjetoTecnico> {
    await this.buscarProjeto(id);
    const update: Partial<ProjetoTecnico> = { status, ...dados };

    if (status === ProjetoStatus.EM_ANALISE_DISTRIBUIDORA) {
      update.dataSubmissao = new Date();
    } else if (status === ProjetoStatus.APROVADO) {
      update.dataAprovacao = new Date();
    } else if (status === ProjetoStatus.HOMOLOGADO) {
      update.dataHomologacao = new Date();
    }

    await this.projetoRepo.update(id, update);
    return this.buscarProjeto(id);
  }

  async adicionarArquivo(id: string, arquivo: { tipo: string; nome: string; url: string }): Promise<ProjetoTecnico> {
    const projeto = await this.buscarProjeto(id);
    const arquivos = projeto.arquivos || [];
    arquivos.push({ ...arquivo, criadoEm: new Date() });
    await this.projetoRepo.update(id, { arquivos });
    return this.buscarProjeto(id);
  }

  async registrarComissionamento(id: string, data?: Date): Promise<ProjetoTecnico> {
    await this.buscarProjeto(id);
    await this.projetoRepo.update(id, { dataComissionamento: data || new Date() });
    return this.buscarProjeto(id);
  }
}
