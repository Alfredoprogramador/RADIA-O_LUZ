import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contrato } from '../vendas/contrato.entity';

export enum PagamentoStatus {
  PENDENTE = 'pendente',
  PAGO = 'pago',
  VENCIDO = 'vencido',
  CANCELADO = 'cancelado',
  ESTORNADO = 'estornado',
}

export enum PagamentoMetodo {
  PIX = 'pix',
  BOLETO = 'boleto',
  CARTAO_CREDITO = 'cartao_credito',
  CARTAO_DEBITO = 'cartao_debito',
  TRANSFERENCIA = 'transferencia',
  FINANCIAMENTO = 'financiamento',
}

@Entity('pagamentos')
export class Pagamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contratoId: string;

  @ManyToOne(() => Contrato)
  @JoinColumn({ name: 'contratoId' })
  contrato: Contrato;

  @Column({ nullable: true })
  parcela: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: number;

  @Column({ nullable: true })
  dataVencimento: Date;

  @Column({ nullable: true })
  dataPagamento: Date;

  @Column({ type: 'enum', enum: PagamentoStatus, default: PagamentoStatus.PENDENTE })
  status: PagamentoStatus;

  @Column({ type: 'enum', enum: PagamentoMetodo, nullable: true })
  metodo: PagamentoMetodo;

  @Column({ length: 200, nullable: true })
  transacaoId: string;

  @Column({ length: 500, nullable: true })
  boletoUrl: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
