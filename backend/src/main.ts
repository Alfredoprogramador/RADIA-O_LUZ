import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('RADIAÇÃO_LUZ API')
    .setDescription('Sistema de Gestão Integrada para empresa de energia solar')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('crm', 'Gestão de Clientes e Leads')
    .addTag('vendas', 'Simulações, Orçamentos e Contratos')
    .addTag('projetos', 'Projetos Técnicos')
    .addTag('instalacao', 'Ordens de Instalação')
    .addTag('manutencao', 'Chamados de Manutenção')
    .addTag('financeiro', 'Gestão Financeira')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Aplicação iniciada na porta ${port}`);
  logger.log(`Documentação disponível em http://localhost:${port}/api/docs`);
}

bootstrap();
