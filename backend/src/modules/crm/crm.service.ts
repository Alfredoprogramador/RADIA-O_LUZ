import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Cliente, ClienteStatus } from './cliente.entity';
import { Lead, LeadStatus } from './lead.entity';
import { Interacao } from './interacao.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class CrmService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    @InjectRepository(Lead)
    private leadRepo: Repository<Lead>,
    @InjectRepository(Interacao)
    private interacaoRepo: Repository<Interacao>,
  ) {}

  // ── Clientes ──────────────────────────────────────────────────────────

  async criarCliente(dto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.clienteRepo.create(dto);
    return this.clienteRepo.save(cliente);
  }

  async listarClientes(search?: string, status?: ClienteStatus): Promise<Cliente[]> {
    const where: FindOptionsWhere<Cliente> = {};
    if (status) where.status = status;
    if (search) {
      return this.clienteRepo.find({
        where: [
          { nome: Like(`%${search}%`), ...where },
          { cpfCnpj: Like(`%${search}%`), ...where },
          { email: Like(`%${search}%`), ...where },
        ],
      });
    }
    return this.clienteRepo.find({ where, order: { criadoEm: 'DESC' } });
  }

  async buscarCliente(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepo.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException(`Cliente ${id} não encontrado`);
    return cliente;
  }

  async atualizarCliente(id: string, dto: Partial<CreateClienteDto>): Promise<Cliente> {
    await this.buscarCliente(id);
    await this.clienteRepo.update(id, dto);
    return this.buscarCliente(id);
  }

  async removerCliente(id: string): Promise<void> {
    await this.buscarCliente(id);
    await this.clienteRepo.update(id, { status: ClienteStatus.INATIVO });
  }

  // ── Leads ─────────────────────────────────────────────────────────────

  async criarLead(dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepo.create(dto);
    return this.leadRepo.save(lead);
  }

  async listarLeads(status?: LeadStatus, vendedorId?: string): Promise<Lead[]> {
    const where: FindOptionsWhere<Lead> = {};
    if (status) where.status = status;
    if (vendedorId) where.vendedorId = vendedorId;
    return this.leadRepo.find({ where, order: { criadoEm: 'DESC' }, relations: ['cliente'] });
  }

  async buscarLead(id: string): Promise<Lead> {
    const lead = await this.leadRepo.findOne({ where: { id }, relations: ['cliente'] });
    if (!lead) throw new NotFoundException(`Lead ${id} não encontrado`);
    return lead;
  }

  async atualizarStatusLead(id: string, status: LeadStatus): Promise<Lead> {
    await this.buscarLead(id);
    await this.leadRepo.update(id, { status });
    return this.buscarLead(id);
  }

  async converterLeadEmCliente(leadId: string): Promise<Cliente> {
    const lead = await this.buscarLead(leadId);
    const cliente = this.clienteRepo.create({
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone,
      whatsapp: lead.telefone,
      endereco: lead.endereco,
      cidade: lead.cidade,
      estado: lead.estado,
      consumoMensalKwh: lead.consumoMensalKwh,
      status: ClienteStatus.ATIVO,
    });
    const novoCliente = await this.clienteRepo.save(cliente);
    await this.leadRepo.update(leadId, { convertido: true, status: LeadStatus.FECHADO_GANHO, clienteId: novoCliente.id });
    return novoCliente;
  }

  // ── Interações ────────────────────────────────────────────────────────

  async registrarInteracao(dados: Partial<Interacao>): Promise<Interacao> {
    const interacao = this.interacaoRepo.create(dados);
    return this.interacaoRepo.save(interacao);
  }

  async listarInteracoes(clienteId?: string, leadId?: string): Promise<Interacao[]> {
    const where: FindOptionsWhere<Interacao> = {};
    if (clienteId) where.clienteId = clienteId;
    if (leadId) where.leadId = leadId;
    return this.interacaoRepo.find({ where, order: { criadoEm: 'DESC' } });
  }

  async obterFunilVendas(): Promise<Record<string, number>> {
    const leads = await this.leadRepo.find();
    const funil: Record<string, number> = {
      novo: 0,
      qualificado: 0,
      orcamento_enviado: 0,
      negociacao: 0,
      fechado_ganho: 0,
      fechado_perdido: 0,
    };
    leads.forEach((l) => {
      funil[l.status] = (funil[l.status] || 0) + 1;
    });
    return funil;
  }
}
