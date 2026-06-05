import { IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSimulacaoDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clienteId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nomeProspecto?: string;

  @ApiProperty({ description: 'Consumo médio mensal em kWh' })
  @IsNumber()
  @Min(0)
  consumoMensalKwh: number;

  @ApiProperty({ description: 'Valor médio da conta de luz em R$' })
  @IsNumber()
  @Min(0)
  valorContaMensal: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  localizacao?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
