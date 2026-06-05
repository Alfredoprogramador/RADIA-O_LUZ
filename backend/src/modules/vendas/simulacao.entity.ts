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

@Entity('simulacoes')
export class Simulacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  clienteId: string;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ length: 150, nullable: true })
  nomeProspecto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consumoMensalKwh: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorContaMensal: number;

  @Column({ length: 200, nullable: true })
  localizacao: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  potenciaKwp: number;

  @Column({ nullable: true })
  quantidadePaineis: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  geracaoMensalEstimadaKwh: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  economiaAnualEstimada: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paybackAnos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorProposta: number;

  @Column({ type: 'jsonb', nullable: true })
  detalhesEquipamentos: object;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
