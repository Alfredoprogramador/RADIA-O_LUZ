import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrmService } from '../../src/modules/crm/crm.service';
import { Cliente, ClienteStatus, TipoPessoa } from '../../src/modules/crm/cliente.entity';
import { Lead, LeadStatus, LeadOrigem } from '../../src/modules/crm/lead.entity';
import { Interacao } from '../../src/modules/crm/interacao.entity';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('CrmService', () => {
  let service: CrmService;
  let clienteRepo: jest.Mocked<Repository<Cliente>>;
  let leadRepo: jest.Mocked<Repository<Lead>>;
  let interacaoRepo: jest.Mocked<Repository<Interacao>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        { provide: getRepositoryToken(Cliente), useFactory: mockRepository },
        { provide: getRepositoryToken(Lead), useFactory: mockRepository },
        { provide: getRepositoryToken(Interacao), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<CrmService>(CrmService);
    clienteRepo = module.get(getRepositoryToken(Cliente));
    leadRepo = module.get(getRepositoryToken(Lead));
    interacaoRepo = module.get(getRepositoryToken(Interacao));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('criarCliente', () => {
    it('deve criar um cliente com sucesso', async () => {
      const dto = {
        nome: 'João Silva',
        cpfCnpj: '123.456.789-00',
        tipoPessoa: TipoPessoa.FISICA,
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
      };

      const clienteMock = { id: 'uuid-1', ...dto, status: ClienteStatus.PROSPECTO };
      clienteRepo.create.mockReturnValue(clienteMock as any);
      clienteRepo.save.mockResolvedValue(clienteMock as any);

      const result = await service.criarCliente(dto);
      expect(result).toEqual(clienteMock);
      expect(clienteRepo.create).toHaveBeenCalledWith(dto);
      expect(clienteRepo.save).toHaveBeenCalledWith(clienteMock);
    });
  });

  describe('criarLead', () => {
    it('deve criar um lead com sucesso', async () => {
      const dto = {
        nome: 'Maria Souza',
        email: 'maria@email.com',
        telefone: '(11) 88888-8888',
        origem: LeadOrigem.SITE,
      };

      const leadMock = { id: 'uuid-2', ...dto, status: LeadStatus.NOVO, convertido: false };
      leadRepo.create.mockReturnValue(leadMock as any);
      leadRepo.save.mockResolvedValue(leadMock as any);

      const result = await service.criarLead(dto);
      expect(result).toEqual(leadMock);
      expect(leadRepo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('obterFunilVendas', () => {
    it('deve retornar contagem por status de lead', async () => {
      const leads = [
        { status: LeadStatus.NOVO },
        { status: LeadStatus.NOVO },
        { status: LeadStatus.QUALIFICADO },
        { status: LeadStatus.FECHADO_GANHO },
      ];
      leadRepo.find.mockResolvedValue(leads as any);

      const funil = await service.obterFunilVendas();
      expect(funil[LeadStatus.NOVO]).toBe(2);
      expect(funil[LeadStatus.QUALIFICADO]).toBe(1);
      expect(funil[LeadStatus.FECHADO_GANHO]).toBe(1);
    });
  });

  describe('converterLeadEmCliente', () => {
    it('deve converter lead em cliente', async () => {
      const lead = {
        id: 'lead-1',
        nome: 'Carlos',
        email: 'carlos@email.com',
        telefone: '11999990000',
        status: LeadStatus.NEGOCIACAO,
      };

      const clienteNovo = { id: 'cli-1', nome: 'Carlos', status: ClienteStatus.ATIVO };

      leadRepo.findOne.mockResolvedValue(lead as any);
      clienteRepo.create.mockReturnValue(clienteNovo as any);
      clienteRepo.save.mockResolvedValue(clienteNovo as any);
      leadRepo.update.mockResolvedValue(undefined as any);

      const result = await service.converterLeadEmCliente('lead-1');
      expect(result).toEqual(clienteNovo);
      expect(leadRepo.update).toHaveBeenCalledWith('lead-1', expect.objectContaining({
        convertido: true,
        status: LeadStatus.FECHADO_GANHO,
        clienteId: 'cli-1',
      }));
    });
  });
});
