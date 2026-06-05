import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Lead } from './lead.entity';

export enum InteracaoTipo {
  LIGACAO = 'ligacao',
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  REUNIAO = 'reuniao',
  VISITA = 'visita',
  OUTROS = 'outros',
}

@Entity('interacoes')
export class Interacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  clienteId: string;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ nullable: true })
  leadId: string;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({ type: 'enum', enum: InteracaoTipo })
  tipo: InteracaoTipo;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ nullable: true })
  responsavelId: string;

  @Column({ length: 100, nullable: true })
  responsavelNome: string;

  @Column({ nullable: true })
  dataInteracao: Date;

  @CreateDateColumn()
  criadoEm: Date;
}
