import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjetoTecnico } from '../projetos/projeto-tecnico.entity';

export enum InstalacaoStatus {
  AGENDADA = 'agendada',
  VISITA_TECNICA = 'visita_tecnica',
  INFRAESTRUTURA = 'infraestrutura',
  MONTAGEM = 'montagem',
  ELETRICA = 'eletrica',
  ATIVACAO = 'ativacao',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada',
}

@Entity('ordens_instalacao')
export class OrdemInstalacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projetoId: string;

  @ManyToOne(() => ProjetoTecnico)
  @JoinColumn({ name: 'projetoId' })
  projeto: ProjetoTecnico;

  @Column({ type: 'enum', enum: InstalacaoStatus, default: InstalacaoStatus.AGENDADA })
  status: InstalacaoStatus;

  @Column({ nullable: true })
  dataAgendamento: Date;

  @Column({ nullable: true })
  dataInicio: Date;

  @Column({ nullable: true })
  dataConclusao: Date;

  @Column({ type: 'jsonb', nullable: true })
  equipeResponsavel: {
    id: string;
    nome: string;
    funcao: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  checklistSeguranca: {
    item: string;
    concluido: boolean;
    observacao?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  etapas: {
    etapa: string;
    status: string;
    dataInicio?: Date;
    dataConclusao?: Date;
    observacao?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  fotos: {
    etapa: string;
    url: string;
    descricao?: string;
    tiradaEm: Date;
  }[];

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ nullable: true })
  assinaturaClienteUrl: string;

  @Column({ nullable: true })
  assinaturaClienteEm: Date;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
