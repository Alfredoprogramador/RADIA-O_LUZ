import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmModule } from './modules/crm/crm.module';
import { VendasModule } from './modules/vendas/vendas.module';
import { ProjetosModule } from './modules/projetos/projetos.module';
import { InstalacaoModule } from './modules/instalacao/instalacao.module';
import { ManutencaoModule } from './modules/manutencao/manutencao.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', 'postgres'),
        database: configService.get('DB_NAME', 'radiacao_luz'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    CrmModule,
    VendasModule,
    ProjetosModule,
    InstalacaoModule,
    ManutencaoModule,
    FinanceiroModule,
  ],
})
export class AppModule {}
