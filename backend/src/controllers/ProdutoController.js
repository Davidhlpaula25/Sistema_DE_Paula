const Produto = require('../models/Produto');

class ProdutoController {
  // GET /api/produtos
  static async index(req, res) {
    try {
      const produtos = await Produto.findAll();
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos' });
    }
  }

  // GET /api/produtos/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findById(id);
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(produto);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  // GET /api/produtos/codigo/:codigo
  static async findByCodigo(req, res) {
    try {
      const { codigo } = req.params;
      const produto = await Produto.findByCodigo(codigo);
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(produto);
    } catch (error) {
      console.error('Erro ao buscar produto por código:', error);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  // GET /api/produtos/categoria/:categoriaId
  static async findByCategoria(req, res) {
    try {
      const { categoriaId } = req.params;
      const produtos = await Produto.findByCategoria(categoriaId);
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  // GET /api/produtos/alertas/estoque-baixo
  static async estoqueBaixo(req, res) {
    try {
      const produtos = await Produto.findEstoqueBaixo();
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  // GET /api/produtos/vencimento/:dias
  static async proximosVencimento(req, res) {
    try {
      const { dias = 30 } = req.params;
      const produtos = await Produto.findProximosVencimento(parseInt(dias));
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao buscar produtos próximos ao vencimento:', error);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  // POST /api/produtos
  static async create(req, res) {
    try {
      const produtoData = req.body;
      
      // Validações básicas
      if (!produtoData.codigo || !produtoData.nome || !produtoData.custo || !produtoData.preco_venda) {
        return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
      }

      const produto = await Produto.create(produtoData);
      res.status(201).json(produto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      if (error.code === '23505') { // Violação de unique constraint
        return res.status(400).json({ error: 'Código do produto já existe' });
      }
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  // PUT /api/produtos/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const produtoData = req.body;
      
      const produto = await Produto.update(id, produtoData);
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(produto);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Código do produto já existe' });
      }
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  // PATCH /api/produtos/:id/estoque
  static async updateEstoque(req, res) {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;
      
      if (quantidade === undefined) {
        return res.status(400).json({ error: 'Quantidade não fornecida' });
      }
      
      const produto = await Produto.updateEstoque(id, quantidade);
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json(produto);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      res.status(500).json({ error: 'Erro ao atualizar estoque' });
    }
  }

  // DELETE /api/produtos/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.delete(id);
      
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
      
      res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }
}

module.exports = ProdutoController;
