import { IsString, IsEnum, IsOptional, IsUUID, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChamadoTipo, ChamadoPrioridade } from '../chamado-manutencao.entity';

export class CreateChamadoDto {
  @ApiProperty()
  @IsUUID()
  clienteId: string;

  @ApiProperty({ enum: ChamadoTipo })
  @IsEnum(ChamadoTipo)
  tipo: ChamadoTipo;

  @ApiPropertyOptional({ enum: ChamadoPrioridade })
  @IsEnum(ChamadoPrioridade)
  @IsOptional()
  prioridade?: ChamadoPrioridade;

  @ApiProperty({ description: 'Descrição do problema' })
  @IsString()
  descricaoProblema: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  cobertaGarantia?: boolean;
}
