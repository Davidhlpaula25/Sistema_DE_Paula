const db = require('../config/database');

class Caixa {
  // Buscar caixa aberto
  static async findCaixaAberto() {
    const query = `
      SELECT 
        c.*,
        COALESCE(SUM(CASE WHEN v.metodo_pagamento = 'dinheiro' THEN v.total ELSE 0 END), 0) as total_dinheiro,
        COALESCE(SUM(CASE WHEN v.metodo_pagamento = 'pix' THEN v.total ELSE 0 END), 0) as total_pix,
        COALESCE(SUM(CASE WHEN v.metodo_pagamento = 'debito' THEN v.total ELSE 0 END), 0) as total_debito,
        COALESCE(SUM(CASE WHEN v.metodo_pagamento = 'credito' THEN v.total ELSE 0 END), 0) as total_credito,
        COALESCE(SUM(v.total), 0) as total_vendas
      FROM caixas c
      LEFT JOIN vendas v ON v.caixa_id = c.id
      WHERE c.status = 'aberto'
      GROUP BY c.id
      ORDER BY c.data_abertura DESC
      LIMIT 1
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  // Listar todos os caixas
  static async findAll(limit = 50) {
    const query = `
      SELECT * FROM caixas
      ORDER BY data_abertura DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  // Buscar caixa por ID
  static async findById(id) {
    const query = `SELECT * FROM caixas WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Abrir caixa
  static async abrir(dados) {
    const { valor_abertura, usuario, observacoes } = dados;
    
    // Verificar se já existe caixa aberto
    const caixaAberto = await this.findCaixaAberto();
    if (caixaAberto) {
      throw new Error('Já existe um caixa aberto');
    }

    const query = `
      INSERT INTO caixas (valor_abertura, usuario, observacoes, status)
      VALUES ($1, $2, $3, 'aberto')
      RETURNING *
    `;
    
    const result = await db.query(query, [
      valor_abertura || 0,
      usuario || 'Sistema',
      observacoes
    ]);
    
    return result.rows[0];
  }

  // Fechar caixa
  static async fechar(id, dados) {
    const { valor_fechamento, observacoes } = dados;
    
    // Buscar totais de vendas do caixa
    const vendasQuery = `
      SELECT 
        COUNT(*) as total_vendas,
        COALESCE(SUM(CASE WHEN metodo_pagamento = 'dinheiro' THEN total ELSE 0 END), 0) as total_dinheiro,
        COALESCE(SUM(CASE WHEN metodo_pagamento = 'pix' THEN total ELSE 0 END), 0) as total_pix,
        COALESCE(SUM(CASE WHEN metodo_pagamento = 'debito' THEN total ELSE 0 END), 0) as total_debito,
        COALESCE(SUM(CASE WHEN metodo_pagamento = 'credito' THEN total ELSE 0 END), 0) as total_credito
      FROM vendas
      WHERE caixa_id = $1
    `;
    const vendasResult = await db.query(vendasQuery, [id]);
    const totaisVendas = vendasResult.rows[0];

    const totalVendas = parseFloat(totaisVendas.total_dinheiro) + 
                       parseFloat(totaisVendas.total_pix) + 
                       parseFloat(totaisVendas.total_debito) + 
                       parseFloat(totaisVendas.total_credito);

    const query = `
      UPDATE caixas
      SET 
        data_fechamento = CURRENT_TIMESTAMP,
        valor_fechamento = $1,
        total_vendas = $2,
        total_dinheiro = $3,
        total_pix = $4,
        total_debito = $5,
        total_credito = $6,
        status = 'fechado',
        observacoes = COALESCE($7, observacoes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND status = 'aberto'
      RETURNING *
    `;
    
    const result = await db.query(query, [
      valor_fechamento,
      totalVendas,
      totaisVendas.total_dinheiro,
      totaisVendas.total_pix,
      totaisVendas.total_debito,
      totaisVendas.total_credito,
      observacoes,
      id
    ]);
    
    if (result.rows.length === 0) {
      throw new Error('Caixa não encontrado ou já está fechado');
    }
    
    return result.rows[0];
  }
}

module.exports = Caixa;
