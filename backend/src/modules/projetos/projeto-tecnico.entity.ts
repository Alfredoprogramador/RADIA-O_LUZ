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

export enum ProjetoStatus {
  ELABORACAO = 'elaboracao',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  EM_ANALISE_DISTRIBUIDORA = 'em_analise_distribuidora',
  APROVADO = 'aprovado',
  REPROVADO = 'reprovado',
  HOMOLOGADO = 'homologado',
}

@Entity('projetos_tecnicos')
export class ProjetoTecnico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contratoId: string;

  @ManyToOne(() => Contrato)
  @JoinColumn({ name: 'contratoId' })
  contrato: Contrato;

  @Column({ length: 100 })
  distribuidora: string;

  @Column({ nullable: true })
  numeroProtocolo: string;

  @Column({ type: 'enum', enum: ProjetoStatus, default: ProjetoStatus.ELABORACAO })
  status: ProjetoStatus;

  @Column({ nullable: true })
  dataSubmissao: Date;

  @Column({ nullable: true })
  dataAprovacao: Date;

  @Column({ nullable: true })
  dataComissionamento: Date;

  @Column({ nullable: true })
  dataHomologacao: Date;

  @Column({ type: 'jsonb', nullable: true })
  arquivos: {
    tipo: string;
    nome: string;
    url: string;
    criadoEm: Date;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  potenciaInstalada: number;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ nullable: true })
  engenheiroResponsavel: string;

  @Column({ length: 20, nullable: true })
  anotacaoResponsabilidadeTecnica: string;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
