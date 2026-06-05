import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum ComissaoStatus {
  PENDENTE = 'pendente',
  APROVADA = 'aprovada',
  PAGA = 'paga',
  CANCELADA = 'cancelada',
}

@Entity('comissoes')
export class Comissao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contratoId: string;

  @Column()
  vendedorId: string;

  @Column({ length: 100 })
  vendedorNome: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorContrato: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentualComissao: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valorComissao: number;

  @Column({ type: 'enum', enum: ComissaoStatus, default: ComissaoStatus.PENDENTE })
  status: ComissaoStatus;

  @Column({ nullable: true })
  dataPagamento: Date;

  @CreateDateColumn()
  criadoEm: Date;
}
