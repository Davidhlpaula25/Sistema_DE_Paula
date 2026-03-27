const db = require('../config/database');

class Venda {
  // Listar todas as vendas
  static async findAll(limit = 100) {
    const query = `
      SELECT v.*, 
        COUNT(vi.id) as total_itens,
        json_agg(
          json_build_object(
            'produto_nome', vi.produto_nome,
            'quantidade', vi.quantidade,
            'preco_unitario', vi.preco_unitario,
            'subtotal', vi.subtotal
          )
        ) as itens
      FROM vendas v
      LEFT JOIN venda_itens vi ON v.id = vi.venda_id
      GROUP BY v.id
      ORDER BY v.data_venda DESC
      LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
  }

  // Buscar venda por ID
  static async findById(id) {
    const query = `
      SELECT v.*, 
        json_agg(
          json_build_object(
            'id', vi.id,
            'produto_id', vi.produto_id,
            'produto_nome', vi.produto_nome,
            'quantidade', vi.quantidade,
            'preco_unitario', vi.preco_unitario,
            'custo_unitario', vi.custo_unitario,
            'subtotal', vi.subtotal
          )
        ) as itens
      FROM vendas v
      LEFT JOIN venda_itens vi ON v.id = vi.venda_id
      WHERE v.id = $1
      GROUP BY v.id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Vendas por período
  static async findByPeriodo(dataInicio, dataFim) {
    const query = `
      SELECT v.*,
        COUNT(vi.id) as total_itens,
        json_agg(
          json_build_object(
            'produto_nome', vi.produto_nome,
            'quantidade', vi.quantidade,
            'preco_unitario', vi.preco_unitario,
            'subtotal', vi.subtotal
          )
        ) as itens
      FROM vendas v
      LEFT JOIN venda_itens vi ON v.id = vi.venda_id
      WHERE DATE(v.data_venda) BETWEEN $1 AND $2
      GROUP BY v.id
      ORDER BY v.data_venda DESC
    `;
    const result = await db.query(query, [dataInicio, dataFim]);
    return result.rows;
  }

  // Estatísticas do dashboard
  static async getEstatisticas() {
    const query = `
      SELECT 
        COUNT(DISTINCT v.id) as total_vendas,
        COALESCE(SUM(v.total), 0) as faturamento_total,
        COALESCE(SUM(v.lucro), 0) as lucro_total,
        COALESCE(AVG(v.total), 0) as ticket_medio
      FROM vendas v
    `;
    const result = await db.query(query);
    return result.rows[0];
  }

  // Vendas por categoria
  static async getVendasPorCategoria() {
    const query = `
      SELECT 
        c.nome as categoria,
        COALESCE(SUM(vi.subtotal), 0) as total_vendido,
        COUNT(DISTINCT vi.venda_id) as total_vendas
      FROM categorias c
      LEFT JOIN produtos p ON c.id = p.categoria_id
      LEFT JOIN venda_itens vi ON p.id = vi.produto_id
      GROUP BY c.id, c.nome
      ORDER BY total_vendido DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Vendas dos últimos N dias
  static async getVendasUltimosDias(dias = 7) {
    const query = `
      SELECT 
        DATE(data_venda) as data,
        COUNT(*) as total_vendas,
        SUM(total) as faturamento,
        SUM(lucro) as lucro
      FROM vendas
      WHERE data_venda >= CURRENT_DATE - INTERVAL '${dias} days'
      GROUP BY DATE(data_venda)
      ORDER BY data
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Criar venda (com transação)
  static async create(vendaData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');

      const { itens, subtotal, desconto, total, lucro, metodo_pagamento, vendedor, observacoes, caixa_id } = vendaData;

      // Inserir venda
      const vendaQuery = `
        INSERT INTO vendas (subtotal, desconto, total, lucro, metodo_pagamento, vendedor, observacoes, caixa_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const vendaResult = await client.query(vendaQuery, [
        subtotal, desconto || 0, total, lucro, metodo_pagamento, vendedor, observacoes, caixa_id
      ]);
      
      const venda = vendaResult.rows[0];

      // Inserir itens da venda e atualizar estoque
      for (const item of itens) {
        // Inserir item
        const itemQuery = `
          INSERT INTO venda_itens (venda_id, produto_id, produto_nome, quantidade, preco_unitario, custo_unitario, subtotal)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await client.query(itemQuery, [
          venda.id,
          item.produto_id,
          item.produto_nome,
          item.quantidade,
          item.preco_unitario,
          item.custo_unitario,
          item.subtotal
        ]);

        // Atualizar estoque
        const estoqueQuery = `
          UPDATE produtos
          SET estoque = estoque - $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `;
        await client.query(estoqueQuery, [item.quantidade, item.produto_id]);
      }

      await client.query('COMMIT');
      return venda;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Venda;
