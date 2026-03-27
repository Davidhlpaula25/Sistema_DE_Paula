const db = require('../config/database');

class Categoria {
  // Listar todas as categorias
  static async findAll() {
    const query = 'SELECT * FROM categorias ORDER BY nome';
    const result = await db.query(query);
    return result.rows;
  }

  // Buscar categoria por ID
  static async findById(id) {
    const query = 'SELECT * FROM categorias WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Buscar categoria por nome
  static async findByNome(nome) {
    const query = 'SELECT * FROM categorias WHERE nome = $1';
    const result = await db.query(query, [nome]);
    return result.rows[0];
  }

  // Criar categoria
  static async create(nome) {
    const query = 'INSERT INTO categorias (nome) VALUES ($1) RETURNING *';
    const result = await db.query(query, [nome]);
    return result.rows[0];
  }

  // Atualizar categoria
  static async update(id, nome) {
    const query = 'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [nome, id]);
    return result.rows[0];
  }

  // Deletar categoria
  static async delete(id) {
    const query = 'DELETE FROM categorias WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Contar produtos por categoria
  static async countProdutos(id) {
    const query = 'SELECT COUNT(*) as total FROM produtos WHERE categoria_id = $1 AND ativo = true';
    const result = await db.query(query, [id]);
    return parseInt(result.rows[0].total);
  }
}

module.exports = Categoria;
