const Categoria = require('../models/Categoria');

class CategoriaController {
  // GET /api/categorias
  static async index(req, res) {
    try {
      const categorias = await Categoria.findAll();
      res.json(categorias);
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ error: 'Erro ao listar categorias' });
    }
  }

  // GET /api/categorias/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findById(id);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
  }

  // POST /api/categorias
  static async create(req, res) {
    try {
      const { nome } = req.body;
      
      if (!nome) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }

      const categoria = await Categoria.create(nome);
      res.status(201).json(categoria);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Categoria já existe' });
      }
      res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }

  // PUT /api/categorias/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      
      if (!nome) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }

      const categoria = await Categoria.update(id, nome);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json(categoria);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Categoria já existe' });
      }
      res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
  }

  // DELETE /api/categorias/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se há produtos na categoria
      const totalProdutos = await Categoria.countProdutos(id);
      if (totalProdutos > 0) {
        return res.status(400).json({ 
          error: 'Não é possível deletar categoria com produtos associados',
          total_produtos: totalProdutos
        });
      }

      const categoria = await Categoria.delete(id);
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      
      res.json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
  }
}

module.exports = CategoriaController;
