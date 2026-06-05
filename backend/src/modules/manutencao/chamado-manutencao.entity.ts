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

export enum ChamadoTipo {
  CORRETIVA = 'corretiva',
  PREVENTIVA = 'preventiva',
  LIMPEZA = 'limpeza',
  MONITORAMENTO = 'monitoramento',
  GARANTIA = 'garantia',
}

export enum ChamadoPrioridade {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta',
  CRITICA = 'critica',
}

export enum ChamadoStatus {
  ABERTO = 'aberto',
  EM_ATENDIMENTO = 'em_atendimento',
  AGUARDANDO_PECA = 'aguardando_peca',
  AGENDADO = 'agendado',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado',
}

@Entity('chamados_manutencao')
export class ChamadoManutencao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clienteId: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ type: 'enum', enum: ChamadoTipo })
  tipo: ChamadoTipo;

  @Column({ type: 'enum', enum: ChamadoPrioridade, default: ChamadoPrioridade.MEDIA })
  prioridade: ChamadoPrioridade;

  @Column({ type: 'enum', enum: ChamadoStatus, default: ChamadoStatus.ABERTO })
  status: ChamadoStatus;

  @Column({ length: 300 })
  descricaoProblema: string;

  @Column({ nullable: true })
  tecnicoId: string;

  @Column({ length: 100, nullable: true })
  tecnicoNome: string;

  @Column({ nullable: true })
  dataAgendamento: Date;

  @Column({ nullable: true })
  dataAtendimento: Date;

  @Column({ nullable: true })
  dataConclusao: Date;

  @Column({ type: 'text', nullable: true })
  solucaoAplicada: string;

  @Column({ type: 'jsonb', nullable: true })
  pecasSubstituidas: {
    codigo: string;
    descricao: string;
    quantidade: number;
    valorUnitario: number;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  custoTotal: number;

  @Column({ type: 'boolean', default: false })
  cobertaGarantia: boolean;

  @Column({ nullable: true })
  avaliacaoCliente: number;

  @Column({ type: 'text', nullable: true })
  comentarioCliente: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
