const { pool } = require('./database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando criação das tabelas...');

    // Tabela de Categorias
    await client.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela categorias criada');

    // Tabela de Produtos
    await client.query(`
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        nome VARCHAR(200) NOT NULL,
        categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
        custo DECIMAL(10, 2) NOT NULL,
        preco_venda DECIMAL(10, 2) NOT NULL,
        estoque INTEGER NOT NULL DEFAULT 0,
        estoque_minimo INTEGER NOT NULL DEFAULT 0,
        data_validade DATE,
        imagem_url TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela produtos criada');

    // Índice para busca rápida por código
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_produtos_codigo ON produtos(codigo);
    `);

    // Tabela de Vendas
    await client.query(`
      CREATE TABLE IF NOT EXISTS vendas (
        id SERIAL PRIMARY KEY,
        data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        subtotal DECIMAL(10, 2) NOT NULL,
        desconto DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        lucro DECIMAL(10, 2) NOT NULL,
        metodo_pagamento VARCHAR(50) NOT NULL,
        vendedor VARCHAR(100),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela vendas criada');

    // Tabela de Itens da Venda
    await client.query(`
      CREATE TABLE IF NOT EXISTS venda_itens (
        id SERIAL PRIMARY KEY,
        venda_id INTEGER REFERENCES vendas(id) ON DELETE CASCADE,
        produto_id INTEGER REFERENCES produtos(id) ON DELETE SET NULL,
        produto_nome VARCHAR(200) NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario DECIMAL(10, 2) NOT NULL,
        custo_unitario DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela venda_itens criada');

    // Inserir categorias padrão
    await client.query(`
      INSERT INTO categorias (nome) 
      VALUES ('Cervejas'), ('Refrigerantes'), ('Águas'), ('Sucos')
      ON CONFLICT (nome) DO NOTHING;
    `);
    console.log('✅ Categorias padrão inseridas');

    // Inserir produtos de exemplo
    const categoriaCerveja = await client.query(`SELECT id FROM categorias WHERE nome = 'Cervejas' LIMIT 1`);
    const categoriaRefri = await client.query(`SELECT id FROM categorias WHERE nome = 'Refrigerantes' LIMIT 1`);
    const categoriaAgua = await client.query(`SELECT id FROM categorias WHERE nome = 'Águas' LIMIT 1`);

    const hoje = new Date();
    const daqui20Dias = new Date(hoje.getTime() + (20 * 24 * 60 * 60 * 1000));
    const daqui60Dias = new Date(hoje.getTime() + (60 * 24 * 60 * 60 * 1000));
    const daqui90Dias = new Date(hoje.getTime() + (90 * 24 * 60 * 60 * 1000));

    await client.query(`
      INSERT INTO produtos (codigo, nome, categoria_id, custo, preco_venda, estoque, estoque_minimo, data_validade)
      VALUES 
        ('001', 'Brahma Latão 473ml', $1, 3.50, 5.00, 120, 20, $2),
        ('002', 'Coca-Cola 2L', $3, 5.00, 8.00, 50, 15, $4),
        ('003', 'Água Mineral 500ml', $5, 1.00, 2.00, 200, 30, $6),
        ('004', 'Skol Lata 350ml', $1, 2.50, 4.00, 8, 20, $2)
      ON CONFLICT (codigo) DO NOTHING;
    `, [
      categoriaCerveja.rows[0]?.id,
      daqui60Dias.toISOString().split('T')[0],
      categoriaRefri.rows[0]?.id,
      daqui90Dias.toISOString().split('T')[0],
      categoriaAgua.rows[0]?.id,
      daqui20Dias.toISOString().split('T')[0]
    ]);
    console.log('✅ Produtos de exemplo inseridos');

    console.log('\n🎉 Banco de dados configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Executar migrations
createTables()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
