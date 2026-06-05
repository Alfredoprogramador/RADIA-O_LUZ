import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../crm/cliente.entity';
import { Simulacao } from './simulacao.entity';

export enum ContratoStatus {
  RASCUNHO = 'rascunho',
  ENVIADO = 'enviado',
  ASSINADO = 'assinado',
  CANCELADO = 'cancelado',
  CONCLUIDO = 'concluido',
}

export enum FormaPagamento {
  FINANCIAMENTO = 'financiamento',
  LEASING = 'leasing',
  FCO = 'fco',
  A_VISTA = 'a_vista',
  PARCELADO = 'parcelado',
  CONSORCIO = 'consorcio',
}

@Entity('contratos')
export class Contrato {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clienteId: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ nullable: true })
  simulacaoId: string;

  @ManyToOne(() => Simulacao, { nullable: true })
  @JoinColumn({ name: 'simulacaoId' })
  simulacao: Simulacao;

  @Column({ length: 50, unique: true })
  numero: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorTotal: number;

  @Column({ type: 'enum', enum: FormaPagamento })
  formaPagamento: FormaPagamento;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  entradaValor: number;

  @Column({ nullable: true })
  numeroParcelas: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  valorParcela: number;

  @Column({ type: 'enum', enum: ContratoStatus, default: ContratoStatus.RASCUNHO })
  status: ContratoStatus;

  @Column({ nullable: true })
  dataAssinatura: Date;

  @Column({ length: 500, nullable: true })
  pdfAssinadoUrl: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ nullable: true })
  vendedorId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  comissaoPercentual: number;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
