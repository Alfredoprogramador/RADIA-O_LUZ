# 🌞 RADIAÇÃO_LUZ – Sistema de Gestão Integrada

Plataforma completa (web + mobile) para gerenciar todo o ciclo de relacionamento com o cliente de uma empresa de energia solar — da prospecção até a manutenção.

---

## 📋 Módulos do Sistema

| Módulo | Descrição |
|--------|-----------|
| **CRM** | Clientes, leads, funil de vendas, histórico de interações |
| **Vendas** | Simulação solar, orçamento automático, contratos digitais |
| **Projetos Técnicos** | Aprovação junto às distribuidoras (Enel, Cemig, etc.) |
| **Instalação** | Agendamento, pipeline de etapas, checklist, fotos, assinatura |
| **Manutenção** | Chamados corretivos/preventivos, SLA, NPS, garantia |
| **Financeiro** | Parcelas, recebíveis, inadimplência, comissões de vendedores |

---

## 🏗️ Arquitetura

```
radiacao_luz/
├── backend/               # API NestJS + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── modules/
│   │   │   ├── crm/       # Clientes, Leads, Interações
│   │   │   ├── vendas/    # Simulações, Contratos
│   │   │   ├── projetos/  # Projetos Técnicos
│   │   │   ├── instalacao/# Ordens de Instalação
│   │   │   ├── manutencao/# Chamados de Manutenção
│   │   │   └── financeiro/# Pagamentos, Comissões
│   │   └── main.ts
│   └── tests/
├── frontend-web/          # React + TypeScript + Vite + Tailwind CSS
│   └── src/
│       ├── pages/         # Páginas por módulo
│       ├── components/    # Layout, componentes compartilhados
│       └── services/      # Chamadas à API (axios)
├── mobile/                # React Native (Expo) – app para técnicos/clientes
│   └── src/
│       ├── screens/       # HomeScreen, Chamados, Instalação, Monitoramento
│       └── navigation/    # Bottom Tab Navigator
├── docs/
│   ├── ddl.sql            # Schema completo do PostgreSQL
│   ├── requisitos.md      # Requisitos funcionais e não-funcionais
│   └── prometheus.yml     # Configuração de monitoramento
└── docker-compose.yml     # PostgreSQL + Redis + API + Web + Grafana
```

---

## 🚀 Como Executar

### Pré-requisitos
- Docker + Docker Compose
- Node.js 20+ (para desenvolvimento local)

### Com Docker (recomendado)

```bash
# 1. Clonar o repositório
git clone https://github.com/Alfredoprogramador/RADIA-O_LUZ.git
cd RADIA-O_LUZ

# 2. Copiar variáveis de ambiente
cp backend/.env.example backend/.env

# 3. Subir todos os serviços
docker-compose up -d

# 4. Verificar os serviços
docker-compose ps
```

| Serviço | URL |
|---------|-----|
| Frontend Web | http://localhost:3000 |
| Backend API | http://localhost:3001/api/v1 |
| Swagger Docs | http://localhost:3001/api/docs |
| Grafana | http://localhost:3030 |
| Prometheus | http://localhost:9090 |

### Desenvolvimento Local

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run start:dev

# Frontend
cd frontend-web
npm install
npm run dev

# Mobile
cd mobile
npm install
npm start
```

---

## 🔌 Principais Endpoints da API

### CRM
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/crm/clientes` | Criar cliente |
| GET | `/api/v1/crm/clientes` | Listar clientes |
| POST | `/api/v1/crm/leads` | Criar lead |
| GET | `/api/v1/crm/funil` | Funil de vendas |
| POST | `/api/v1/crm/leads/:id/converter` | Converter lead em cliente |

### Vendas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/vendas/simulacoes` | Calcular simulação solar |
| POST | `/api/v1/vendas/contratos` | Criar contrato |
| PATCH | `/api/v1/vendas/contratos/:id/assinar` | Assinar contrato |

### Manutenção
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/manutencao/chamados` | Abrir chamado |
| PATCH | `/api/v1/manutencao/chamados/:id/concluir` | Concluir chamado |
| GET | `/api/v1/manutencao/relatorio/sla` | Relatório de SLA |

### Financeiro
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/financeiro/dashboard` | Dashboard financeiro |
| POST | `/api/v1/financeiro/pagamentos/gerar-parcelas` | Gerar parcelas |
| PATCH | `/api/v1/financeiro/pagamentos/:id/registrar` | Registrar pagamento |

---

## 🛢️ Modelo de Dados

As tabelas principais do banco PostgreSQL são:

- `clientes` — cadastro de clientes PF e PJ
- `leads` — prospecção e funil de vendas
- `simulacoes` — cálculos de potência, geração e economia
- `contratos` — contratos com aceite digital
- `projetos_tecnicos` — aprovação junto às distribuidoras
- `ordens_instalacao` — agendamento e execução da instalação
- `chamados_manutencao` — chamados técnicos com SLA
- `pagamentos` — recebíveis e parcelas
- `comissoes` — comissões de vendedores

> Ver schema completo em [`docs/ddl.sql`](docs/ddl.sql)

---

## 🔒 Segurança e LGPD

- Autenticação JWT com expiração configurável
- Senhas com bcrypt (salt rounds ≥ 10)
- Controle de acesso por perfil (admin, vendedor, técnico, cliente)
- Criptografia de dados sensíveis (CPF/CNPJ)
- Logs de auditoria de ações críticas
- Consentimento explícito para uso de dados (LGPD Art. 7)

---

## 📊 Monitoramento

- **Grafana** – dashboards de geração solar, KPIs de vendas e manutenção
- **Prometheus** – métricas da API (latência, throughput, erros)

---

## 🗺️ Roadmap

| Fase | Prazo | Entregáveis |
|------|-------|-------------|
| MVP | 2 meses | CRM + Simulação + Contrato Digital + Instalação |
| Fase 2 | +1 mês | Manutenção + App do Técnico |
| Fase 3 | +1 mês | Monitoramento em tempo real + Dashboards |
| Lançamento | +2 sem | Treinamento, piloto, ajustes |

---

## 🧪 Testes

```bash
# Backend – testes unitários
cd backend
npm test

# Backend – cobertura
npm run test:cov
```

---

## 📄 Licença

MIT © RADIAÇÃO_LUZ

