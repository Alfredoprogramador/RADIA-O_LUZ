import { IsString, IsOptional, IsUUID, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjetoStatus } from '../projeto-tecnico.entity';

export class CreateProjetoTecnicoDto {
  @ApiProperty()
  @IsUUID()
  contratoId: string;

  @ApiProperty({ description: 'Nome da distribuidora (ex: Enel, Cemig, Energisa)' })
  @IsString()
  distribuidora: string;

  @ApiPropertyOptional({ enum: ProjetoStatus })
  @IsEnum(ProjetoStatus)
  @IsOptional()
  status?: ProjetoStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  potenciaInstalada?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  engenheiroResponsavel?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  anotacaoResponsabilidadeTecnica?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observacoes?: string;
}
