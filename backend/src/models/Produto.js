const db = require('../config/database');

class Produto {
  // Listar todos os produtos
  static async findAll() {
    const query = `
      SELECT p.*, c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.ativo = true
      ORDER BY p.nome
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Buscar produto por ID
  static async findById(id) {
    const query = `
      SELECT p.*, c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1 AND p.ativo = true
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Buscar produto por código
  static async findByCodigo(codigo) {
    const query = `
      SELECT p.*, c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.codigo = $1 AND p.ativo = true
    `;
    const result = await db.query(query, [codigo]);
    return result.rows[0];
  }

  // Listar produtos por categoria
  static async findByCategoria(categoriaId) {
    const query = `
      SELECT p.*, c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.categoria_id = $1 AND p.ativo = true
      ORDER BY p.nome
    `;
    const result = await db.query(query, [categoriaId]);
    return result.rows;
  }

  // Produtos com estoque baixo
  static async findEstoqueBaixo() {
    const query = `
      SELECT p.*, c.nome as categoria_nome
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.estoque <= p.estoque_minimo AND p.ativo = true
      ORDER BY p.estoque ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // Produtos próximos ao vencimento
  static async findProximosVencimento(dias = 30) {
    const query = `
      SELECT p.*, c.nome as categoria_nome,
        (p.data_validade - CURRENT_DATE) as dias_restantes
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.data_validade IS NOT NULL 
        AND p.data_validade >= CURRENT_DATE
        AND (p.data_validade - CURRENT_DATE) <= $1
        AND p.ativo = true
      ORDER BY p.data_validade ASC
    `;
    const result = await db.query(query, [dias]);
    return result.rows;
  }

  // Criar produto
  static async create(produtoData) {
    const { codigo, nome, categoria_id, custo, preco_venda, estoque, estoque_minimo, data_validade, imagem_url } = produtoData;
    
    const query = `
      INSERT INTO produtos (codigo, nome, categoria_id, custo, preco_venda, estoque, estoque_minimo, data_validade, imagem_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      codigo, nome, categoria_id, custo, preco_venda, estoque, estoque_minimo, data_validade, imagem_url
    ]);
    
    return result.rows[0];
  }

  // Atualizar produto
  static async update(id, produtoData) {
    const { codigo, nome, categoria_id, custo, preco_venda, estoque, estoque_minimo, data_validade, imagem_url } = produtoData;
    
    const query = `
      UPDATE produtos
      SET codigo = $1, nome = $2, categoria_id = $3, custo = $4, preco_venda = $5,
          estoque = $6, estoque_minimo = $7, data_validade = $8, imagem_url = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND ativo = true
      RETURNING *
    `;
    
    const result = await db.query(query, [
      codigo, nome, categoria_id, custo, preco_venda, estoque, estoque_minimo, data_validade, imagem_url, id
    ]);
    
    return result.rows[0];
  }

  // Atualizar estoque
  static async updateEstoque(id, quantidade) {
    const query = `
      UPDATE produtos
      SET estoque = estoque + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND ativo = true
      RETURNING *
    `;
    const result = await db.query(query, [quantidade, id]);
    return result.rows[0];
  }

  // Deletar (soft delete)
  static async delete(id) {
    const query = `
      UPDATE produtos
      SET ativo = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Produto;
