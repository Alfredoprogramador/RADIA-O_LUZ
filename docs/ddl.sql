-- =============================================================================
-- RADIAÇÃO_LUZ – Sistema de Gestão Integrada
-- DDL – Esquema do Banco de Dados PostgreSQL
-- =============================================================================

-- Tipos ENUM
CREATE TYPE tipo_pessoa AS ENUM ('fisica', 'juridica');
CREATE TYPE cliente_status AS ENUM ('ativo', 'inativo', 'prospecto', 'bloqueado');
CREATE TYPE lead_origem AS ENUM ('site', 'whatsapp', 'indicacao', 'instagram', 'facebook', 'google_ads', 'ligacao', 'outros');
CREATE TYPE lead_status AS ENUM ('novo', 'qualificado', 'orcamento_enviado', 'negociacao', 'fechado_ganho', 'fechado_perdido');
CREATE TYPE interacao_tipo AS ENUM ('ligacao', 'email', 'whatsapp', 'reuniao', 'visita', 'outros');
CREATE TYPE contrato_status AS ENUM ('rascunho', 'enviado', 'assinado', 'cancelado', 'concluido');
CREATE TYPE forma_pagamento AS ENUM ('financiamento', 'leasing', 'fco', 'a_vista', 'parcelado', 'consorcio');
CREATE TYPE projeto_status AS ENUM ('elaboracao', 'aguardando_aprovacao', 'em_analise_distribuidora', 'aprovado', 'reprovado', 'homologado');
CREATE TYPE instalacao_status AS ENUM ('agendada', 'visita_tecnica', 'infraestrutura', 'montagem', 'eletrica', 'ativacao', 'concluida', 'cancelada');
CREATE TYPE chamado_tipo AS ENUM ('corretiva', 'preventiva', 'limpeza', 'monitoramento', 'garantia');
CREATE TYPE chamado_prioridade AS ENUM ('baixa', 'media', 'alta', 'critica');
CREATE TYPE chamado_status AS ENUM ('aberto', 'em_atendimento', 'aguardando_peca', 'agendado', 'concluido', 'cancelado');
CREATE TYPE pagamento_status AS ENUM ('pendente', 'pago', 'vencido', 'cancelado', 'estornado');
CREATE TYPE pagamento_metodo AS ENUM ('pix', 'boleto', 'cartao_credito', 'cartao_debito', 'transferencia', 'financiamento');
CREATE TYPE comissao_status AS ENUM ('pendente', 'aprovada', 'paga', 'cancelada');

-- =============================================================================
-- 1. Clientes
-- =============================================================================
CREATE TABLE clientes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome            VARCHAR(150) NOT NULL,
    cpf_cnpj        VARCHAR(20) NOT NULL UNIQUE,
    tipo_pessoa     tipo_pessoa NOT NULL DEFAULT 'fisica',
    endereco        VARCHAR(200),
    cidade          VARCHAR(100),
    estado          CHAR(2),
    cep             CHAR(9),
    email           VARCHAR(100),
    telefone        VARCHAR(20),
    whatsapp        VARCHAR(20),
    status          cliente_status NOT NULL DEFAULT 'prospecto',
    observacoes     TEXT,
    consumo_mensal_kwh  NUMERIC(10,2),
    valor_conta_media   NUMERIC(10,2),
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_nome ON clientes(nome);

-- =============================================================================
-- 2. Leads
-- =============================================================================
CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id      UUID REFERENCES clientes(id) ON DELETE SET NULL,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(100),
    telefone        VARCHAR(20),
    origem          lead_origem NOT NULL DEFAULT 'site',
    status          lead_status NOT NULL DEFAULT 'novo',
    pontuacao       NUMERIC(5,2) DEFAULT 0,
    consumo_mensal_kwh  NUMERIC(10,2),
    endereco        VARCHAR(200),
    cidade          VARCHAR(100),
    estado          CHAR(2),
    observacoes     TEXT,
    convertido      BOOLEAN NOT NULL DEFAULT FALSE,
    vendedor_id     UUID,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_vendedor ON leads(vendedor_id);

-- =============================================================================
-- 3. Interações CRM
-- =============================================================================
CREATE TABLE interacoes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id      UUID REFERENCES clientes(id) ON DELETE CASCADE,
    lead_id         UUID REFERENCES leads(id) ON DELETE CASCADE,
    tipo            interacao_tipo NOT NULL,
    descricao       TEXT NOT NULL,
    responsavel_id  UUID,
    responsavel_nome VARCHAR(100),
    data_interacao  TIMESTAMPTZ,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. Simulações
-- =============================================================================
CREATE TABLE simulacoes (
    id                              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id                      UUID REFERENCES clientes(id) ON DELETE SET NULL,
    nome_prospecto                  VARCHAR(150),
    consumo_mensal_kwh              NUMERIC(10,2) NOT NULL,
    valor_conta_mensal              NUMERIC(10,2) NOT NULL,
    localizacao                     VARCHAR(200),
    latitude                        NUMERIC(10,6),
    longitude                       NUMERIC(10,6),
    potencia_kwp                    NUMERIC(10,2) NOT NULL,
    quantidade_paineis              INTEGER,
    geracao_mensal_estimada_kwh     NUMERIC(10,2),
    economia_anual_estimada         NUMERIC(10,2),
    payback_anos                    NUMERIC(10,2),
    valor_proposta                  NUMERIC(12,2) NOT NULL,
    detalhes_equipamentos           JSONB,
    criado_em                       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. Contratos
-- =============================================================================
CREATE TABLE contratos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id          UUID NOT NULL REFERENCES clientes(id),
    simulacao_id        UUID REFERENCES simulacoes(id) ON DELETE SET NULL,
    numero              VARCHAR(50) NOT NULL UNIQUE,
    valor_total         NUMERIC(12,2) NOT NULL,
    forma_pagamento     forma_pagamento NOT NULL,
    entrada_valor       NUMERIC(12,2),
    numero_parcelas     INTEGER,
    valor_parcela       NUMERIC(12,2),
    status              contrato_status NOT NULL DEFAULT 'rascunho',
    data_assinatura     TIMESTAMPTZ,
    pdf_assinado_url    VARCHAR(500),
    observacoes         TEXT,
    vendedor_id         UUID,
    comissao_percentual NUMERIC(5,2),
    criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contratos_cliente ON contratos(cliente_id);
CREATE INDEX idx_contratos_status ON contratos(status);

-- =============================================================================
-- 6. Projetos Técnicos
-- =============================================================================
CREATE TABLE projetos_tecnicos (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_id                 UUID NOT NULL REFERENCES contratos(id),
    distribuidora               VARCHAR(100) NOT NULL,
    numero_protocolo            VARCHAR(100),
    status                      projeto_status NOT NULL DEFAULT 'elaboracao',
    data_submissao              TIMESTAMPTZ,
    data_aprovacao              TIMESTAMPTZ,
    data_comissionamento        TIMESTAMPTZ,
    data_homologacao            TIMESTAMPTZ,
    arquivos                    JSONB,
    potencia_instalada          NUMERIC(10,2),
    observacoes                 TEXT,
    engenheiro_responsavel      VARCHAR(150),
    anotacao_responsabilidade   VARCHAR(20),
    criado_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projetos_status ON projetos_tecnicos(status);

-- =============================================================================
-- 7. Ordens de Instalação
-- =============================================================================
CREATE TABLE ordens_instalacao (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id              UUID NOT NULL REFERENCES projetos_tecnicos(id),
    status                  instalacao_status NOT NULL DEFAULT 'agendada',
    data_agendamento        TIMESTAMPTZ,
    data_inicio             TIMESTAMPTZ,
    data_conclusao          TIMESTAMPTZ,
    equipe_responsavel      JSONB,
    checklist_seguranca     JSONB,
    etapas                  JSONB,
    fotos                   JSONB,
    observacoes             TEXT,
    assinatura_cliente_url  VARCHAR(500),
    assinatura_cliente_em   TIMESTAMPTZ,
    criado_em               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ordens_status ON ordens_instalacao(status);

-- =============================================================================
-- 8. Chamados de Manutenção
-- =============================================================================
CREATE TABLE chamados_manutencao (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id          UUID NOT NULL REFERENCES clientes(id),
    tipo                chamado_tipo NOT NULL,
    prioridade          chamado_prioridade NOT NULL DEFAULT 'media',
    status              chamado_status NOT NULL DEFAULT 'aberto',
    descricao_problema  VARCHAR(300) NOT NULL,
    tecnico_id          UUID,
    tecnico_nome        VARCHAR(100),
    data_agendamento    TIMESTAMPTZ,
    data_atendimento    TIMESTAMPTZ,
    data_conclusao      TIMESTAMPTZ,
    solucao_aplicada    TEXT,
    pecas_substituidas  JSONB,
    custo_total         NUMERIC(10,2),
    coberta_garantia    BOOLEAN NOT NULL DEFAULT FALSE,
    avaliacao_cliente   SMALLINT CHECK (avaliacao_cliente BETWEEN 1 AND 5),
    comentario_cliente  TEXT,
    criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chamados_status ON chamados_manutencao(status);
CREATE INDEX idx_chamados_cliente ON chamados_manutencao(cliente_id);
CREATE INDEX idx_chamados_tecnico ON chamados_manutencao(tecnico_id);

-- =============================================================================
-- 9. Pagamentos
-- =============================================================================
CREATE TABLE pagamentos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_id     UUID NOT NULL REFERENCES contratos(id),
    parcela         SMALLINT,
    valor           NUMERIC(12,2) NOT NULL,
    data_vencimento DATE,
    data_pagamento  TIMESTAMPTZ,
    status          pagamento_status NOT NULL DEFAULT 'pendente',
    metodo          pagamento_metodo,
    transacao_id    VARCHAR(200),
    boleto_url      VARCHAR(500),
    observacoes     TEXT,
    criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pagamentos_contrato ON pagamentos(contrato_id);
CREATE INDEX idx_pagamentos_status ON pagamentos(status);
CREATE INDEX idx_pagamentos_vencimento ON pagamentos(data_vencimento);

-- =============================================================================
-- 10. Comissões
-- =============================================================================
CREATE TABLE comissoes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_id         UUID NOT NULL REFERENCES contratos(id),
    vendedor_id         UUID NOT NULL,
    vendedor_nome       VARCHAR(100) NOT NULL,
    valor_contrato      NUMERIC(12,2) NOT NULL,
    percentual_comissao NUMERIC(5,2) NOT NULL,
    valor_comissao      NUMERIC(12,2) NOT NULL,
    status              comissao_status NOT NULL DEFAULT 'pendente',
    data_pagamento      TIMESTAMPTZ,
    criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comissoes_vendedor ON comissoes(vendedor_id);
CREATE INDEX idx_comissoes_status ON comissoes(status);

-- =============================================================================
-- Função: atualizar campo atualizado_em automaticamente
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER tg_clientes_updated BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tg_leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tg_contratos_updated BEFORE UPDATE ON contratos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tg_projetos_updated BEFORE UPDATE ON projetos_tecnicos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tg_ordens_updated BEFORE UPDATE ON ordens_instalacao FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tg_chamados_updated BEFORE UPDATE ON chamados_manutencao FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tg_pagamentos_updated BEFORE UPDATE ON pagamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
