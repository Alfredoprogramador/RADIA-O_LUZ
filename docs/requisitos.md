# 📋 Requisitos do Sistema – RADIAÇÃO_LUZ

## 1. Visão Geral

O sistema de gestão integrada da **RADIAÇÃO_LUZ** cobre todo o ciclo de vida de um projeto de energia solar:

```
Lead → Simulação → Orçamento → Contrato → Projeto Técnico → Instalação → Manutenção
```

---

## 2. Requisitos Funcionais

### 2.1 Módulo CRM

| ID    | Requisito                                              | Prioridade |
|-------|--------------------------------------------------------|-----------|
| CRM-01 | Cadastro de clientes (PF e PJ)                        | Alta      |
| CRM-02 | Cadastro e gestão de leads                            | Alta      |
| CRM-03 | Funil de vendas (Kanban)                              | Alta      |
| CRM-04 | Histórico de interações por cliente/lead              | Média     |
| CRM-05 | Conversão de lead em cliente                         | Alta      |
| CRM-06 | Origem de leads (site, WhatsApp, indicação, etc.)     | Média     |

### 2.2 Módulo de Simulação e Orçamento

| ID    | Requisito                                              | Prioridade |
|-------|--------------------------------------------------------|-----------|
| SIM-01 | Cálculo automático de potência kWp por consumo        | Alta      |
| SIM-02 | Dimensionamento de painéis e inversores               | Alta      |
| SIM-03 | Estimativa de geração mensal e economia anual         | Alta      |
| SIM-04 | Cálculo de payback                                    | Alta      |
| SIM-05 | Geração de proposta com valor do investimento         | Alta      |
| SIM-06 | Suporte a múltiplas formas de pagamento               | Alta      |
| CON-01 | Criação de contrato vinculado à simulação             | Alta      |
| CON-02 | Número único de contrato                              | Alta      |
| CON-03 | Aceite digital / assinatura eletrônica                | Alta      |
| CON-04 | Cancelamento de contrato                              | Média     |

### 2.3 Módulo de Projetos Técnicos

| ID    | Requisito                                              | Prioridade |
|-------|--------------------------------------------------------|-----------|
| PRO-01 | Criação de projeto técnico vinculado ao contrato      | Alta      |
| PRO-02 | Controle de aprovação junto à distribuidora           | Alta      |
| PRO-03 | Registro de número de protocolo                       | Alta      |
| PRO-04 | Upload e gestão de arquivos (PDF, DWG, ART)           | Média     |
| PRO-05 | Registro de comissionamento e homologação             | Alta      |
| PRO-06 | Histórico de status com datas                         | Média     |

### 2.4 Módulo de Instalação

| ID    | Requisito                                              | Prioridade |
|-------|--------------------------------------------------------|-----------|
| INS-01 | Criação de ordem de instalação                        | Alta      |
| INS-02 | Agendamento com data e equipe                         | Alta      |
| INS-03 | Pipeline de etapas: Visita → Infra → Montagem → Elétrica → Ativação | Alta |
| INS-04 | Checklist de segurança                                | Alta      |
| INS-05 | Registro fotográfico por etapa                        | Média     |
| INS-06 | Assinatura digital do cliente na conclusão            | Alta      |

### 2.5 Módulo de Manutenção

| ID    | Requisito                                              | Prioridade |
|-------|--------------------------------------------------------|-----------|
| MAN-01 | Abertura de chamados (corretiva, preventiva, limpeza, garantia) | Alta |
| MAN-02 | Prioridade do chamado (baixa, média, alta, crítica)   | Alta      |
| MAN-03 | Atribuição automática de técnicos por região          | Média     |
| MAN-04 | Agendamento de atendimento                            | Alta      |
| MAN-05 | Registro de solução e peças substituídas              | Alta      |
| MAN-06 | Controle de garantia de equipamentos e mão de obra    | Alta      |
| MAN-07 | Avaliação NPS pós-atendimento                         | Média     |
| MAN-08 | Relatório de SLA (tempo médio de resposta)            | Alta      |

### 2.6 Módulo Financeiro

| ID    | Requisito                                              | Prioridade |
|-------|--------------------------------------------------------|-----------|
| FIN-01 | Geração automática de parcelas                        | Alta      |
| FIN-02 | Controle de recebíveis com status (pendente/pago/vencido) | Alta  |
| FIN-03 | Registro de pagamento com método (PIX, boleto, cartão) | Alta     |
| FIN-04 | Gestão de comissões de vendedores                     | Alta      |
| FIN-05 | Dashboard financeiro (receita, pendências, inadimplência) | Alta  |
| FIN-06 | Verificação e marcação automática de inadimplência    | Média     |

---

## 3. Requisitos Não-Funcionais

| ID    | Requisito                                              | Categoria   |
|-------|--------------------------------------------------------|-------------|
| NF-01 | API REST com documentação Swagger                      | Técnico     |
| NF-02 | Autenticação JWT com expiração configurável            | Segurança   |
| NF-03 | Validação de todos os campos de entrada               | Qualidade   |
| NF-04 | Criptografia de dados sensíveis (CPF, senhas)         | LGPD        |
| NF-05 | Logs de auditoria para ações críticas                 | Compliance  |
| NF-06 | Controle de acesso por perfil (admin/vendedor/técnico/cliente) | Segurança |
| NF-07 | Containerização com Docker                            | Deploy      |
| NF-08 | Banco de dados PostgreSQL                             | Dados       |
| NF-09 | Cache Redis para consultas frequentes                 | Performance |
| NF-10 | Monitoramento com Prometheus + Grafana                | Observabilidade |
| NF-11 | Frontend responsivo (desktop e mobile)               | UX          |
| NF-12 | App mobile para técnicos e clientes (React Native)    | Mobile      |

---

## 4. Entidades e Relacionamentos

```
cliente (1) ──── (N) lead
cliente (1) ──── (N) contrato
cliente (1) ──── (N) chamado_manutencao
cliente (1) ──── (N) interacao

lead    (N) ──── (1) cliente (quando convertido)

simulacao (N) ──── (1) cliente
contrato  (N) ──── (1) cliente
contrato  (N) ──── (1) simulacao

projeto_tecnico (1) ──── (1) contrato
ordem_instalacao (1) ──── (1) projeto_tecnico

pagamento (N) ──── (1) contrato
comissao  (N) ──── (1) contrato
```

---

## 5. Cronograma de Implementação

| Fase        | Duração   | Entregáveis                                                   |
|-------------|-----------|---------------------------------------------------------------|
| MVP         | 2 meses   | CRM + Simulação + Contrato Digital + Instalação básica        |
| Fase 2      | 1 mês     | Módulo de Manutenção + App Técnico                           |
| Fase 3      | 1 mês     | Monitoramento em tempo real + Dashboards avançados            |
| Lançamento  | 2 semanas | Treinamento, piloto com 5 clientes, ajustes                   |

---

## 6. Considerações de Segurança e LGPD

- Criptografia de CPF/CNPJ no banco de dados
- Senhas armazenadas com bcrypt (salt rounds ≥ 10)
- Tokens JWT com tempo de expiração
- Controle de acesso por perfil com RBAC
- Logs de auditoria para ações CRUD em dados sensíveis
- Consentimento explícito para uso de dados pessoais
- Possibilidade de anonimização e exclusão de dados (direito ao esquecimento)
- SSL/TLS obrigatório em produção
