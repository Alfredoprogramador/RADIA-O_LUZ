import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClienteStatus, TipoPessoa } from '../cliente.entity';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nome completo do cliente' })
  @IsString()
  @MinLength(3)
  nome: string;

  @ApiProperty({ description: 'CPF ou CNPJ do cliente' })
  @IsString()
  cpfCnpj: string;

  @ApiProperty({ enum: TipoPessoa, default: TipoPessoa.FISICA })
  @IsEnum(TipoPessoa)
  @IsOptional()
  tipoPessoa?: TipoPessoa;

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
  cep?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional({ enum: ClienteStatus })
  @IsEnum(ClienteStatus)
  @IsOptional()
  status?: ClienteStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  consumoMensalKwh?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  valorContaMedia?: number;
}
