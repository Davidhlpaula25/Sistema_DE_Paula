-- Migração: Criar tabela de caixas
CREATE TABLE IF NOT EXISTS caixas (
  id SERIAL PRIMARY KEY,
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  data_fechamento TIMESTAMP WITH TIME ZONE,
  valor_abertura DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_fechamento DECIMAL(10,2),
  total_vendas DECIMAL(10,2) DEFAULT 0,
  total_dinheiro DECIMAL(10,2) DEFAULT 0,
  total_pix DECIMAL(10,2) DEFAULT 0,
  total_debito DECIMAL(10,2) DEFAULT 0,
  total_credito DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'aberto', -- 'aberto' ou 'fechado'
  observacoes TEXT,
  usuario VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar campo caixa_id nas vendas
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS caixa_id INTEGER REFERENCES caixas(id);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_caixas_status ON caixas(status);
CREATE INDEX IF NOT EXISTS idx_caixas_data ON caixas(data_abertura);
CREATE INDEX IF NOT EXISTS idx_vendas_caixa ON vendas(caixa_id);
