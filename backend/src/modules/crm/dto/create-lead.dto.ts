import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadOrigem, LeadStatus } from '../lead.entity';

export class CreateLeadDto {
  @ApiProperty({ description: 'Nome do lead' })
  @IsString()
  nome: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ enum: LeadOrigem })
  @IsEnum(LeadOrigem)
  @IsOptional()
  origem?: LeadOrigem;

  @ApiPropertyOptional({ enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pontuacao?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  consumoMensalKwh?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vendedorId?: string;
}
