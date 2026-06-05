import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';

export enum LeadOrigem {
  SITE = 'site',
  WHATSAPP = 'whatsapp',
  INDICACAO = 'indicacao',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  GOOGLE_ADS = 'google_ads',
  LIGACAO = 'ligacao',
  OUTROS = 'outros',
}

export enum LeadStatus {
  NOVO = 'novo',
  QUALIFICADO = 'qualificado',
  ORCAMENTO_ENVIADO = 'orcamento_enviado',
  NEGOCIACAO = 'negociacao',
  FECHADO_GANHO = 'fechado_ganho',
  FECHADO_PERDIDO = 'fechado_perdido',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  clienteId: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.leads, { nullable: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ length: 150 })
  nome: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'enum', enum: LeadOrigem, default: LeadOrigem.SITE })
  origem: LeadOrigem;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NOVO })
  status: LeadStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  pontuacao: number;

  @Column({ nullable: true })
  consumoMensalKwh: number;

  @Column({ length: 200, nullable: true })
  endereco: string;

  @Column({ length: 100, nullable: true })
  cidade: string;

  @Column({ length: 2, nullable: true })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: false })
  convertido: boolean;

  @Column({ nullable: true })
  vendedorId: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
