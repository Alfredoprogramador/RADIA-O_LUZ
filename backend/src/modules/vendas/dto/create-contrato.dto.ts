import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormaPagamento } from '../contrato.entity';

export class CreateContratoDto {
  @ApiProperty()
  @IsUUID()
  clienteId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  simulacaoId?: string;

  @ApiProperty({ description: 'Valor total do contrato em R$' })
  @IsNumber()
  @Min(0)
  valorTotal: number;

  @ApiProperty({ enum: FormaPagamento })
  @IsEnum(FormaPagamento)
  formaPagamento: FormaPagamento;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  entradaValor?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  numeroParcelas?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  valorParcela?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vendedorId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  comissaoPercentual?: number;
}
