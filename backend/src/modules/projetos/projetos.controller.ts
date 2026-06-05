import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProjetosService } from './projetos.service';
import { CreateProjetoTecnicoDto } from './dto/create-projeto-tecnico.dto';
import { ProjetoStatus } from './projeto-tecnico.entity';

@ApiTags('projetos')
@Controller('projetos')
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo projeto técnico' })
  @HttpCode(HttpStatus.CREATED)
  criarProjeto(@Body() dto: CreateProjetoTecnicoDto) {
    return this.projetosService.criarProjeto(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar projetos técnicos' })
  @ApiQuery({ name: 'status', enum: ProjetoStatus, required: false })
  @ApiQuery({ name: 'distribuidora', required: false })
  listarProjetos(
    @Query('status') status?: ProjetoStatus,
    @Query('distribuidora') distribuidora?: string,
  ) {
    return this.projetosService.listarProjetos(status, distribuidora);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar projeto técnico por ID' })
  buscarProjeto(@Param('id') id: string) {
    return this.projetosService.buscarProjeto(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do projeto' })
  atualizarStatus(
    @Param('id') id: string,
    @Body('status') status: ProjetoStatus,
    @Body('numeroProtocolo') numeroProtocolo?: string,
  ) {
    return this.projetosService.atualizarStatus(id, status, { numeroProtocolo });
  }

  @Post(':id/arquivos')
  @ApiOperation({ summary: 'Adicionar arquivo ao projeto' })
  adicionarArquivo(
    @Param('id') id: string,
    @Body() arquivo: { tipo: string; nome: string; url: string },
  ) {
    return this.projetosService.adicionarArquivo(id, arquivo);
  }

  @Patch(':id/comissionamento')
  @ApiOperation({ summary: 'Registrar comissionamento' })
  registrarComissionamento(@Param('id') id: string, @Body('data') data?: Date) {
    return this.projetosService.registrarComissionamento(id, data);
  }
}
