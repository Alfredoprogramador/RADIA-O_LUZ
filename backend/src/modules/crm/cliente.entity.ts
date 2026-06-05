import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum ClienteStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  PROSPECTO = 'prospecto',
  BLOQUEADO = 'bloqueado',
}

export enum TipoPessoa {
  FISICA = 'fisica',
  JURIDICA = 'juridica',
}

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  nome: string;

  @Column({ length: 20, unique: true })
  cpfCnpj: string;

  @Column({ type: 'enum', enum: TipoPessoa, default: TipoPessoa.FISICA })
  tipoPessoa: TipoPessoa;

  @Column({ length: 200, nullable: true })
  endereco: string;

  @Column({ length: 100, nullable: true })
  cidade: string;

  @Column({ length: 2, nullable: true })
  estado: string;

  @Column({ length: 9, nullable: true })
  cep: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ length: 20, nullable: true })
  whatsapp: string;

  @Column({ type: 'enum', enum: ClienteStatus, default: ClienteStatus.PROSPECTO })
  status: ClienteStatus;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ nullable: true })
  consumoMensalKwh: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valorContaMedia: number;

  @OneToMany(() => Lead, (lead) => lead.cliente)
  leads: Lead[];

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
