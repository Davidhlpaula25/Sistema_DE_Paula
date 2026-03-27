const Venda = require('../models/Venda');

class VendaController {
  // GET /api/vendas
  static async index(req, res) {
    try {
      const { limit = 100 } = req.query;
      const vendas = await Venda.findAll(parseInt(limit));
      res.json(vendas);
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
      res.status(500).json({ error: 'Erro ao listar vendas' });
    }
  }

  // GET /api/vendas/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const venda = await Venda.findById(id);
      
      if (!venda) {
        return res.status(404).json({ error: 'Venda não encontrada' });
      }
      
      res.json(venda);
    } catch (error) {
      console.error('Erro ao buscar venda:', error);
      res.status(500).json({ error: 'Erro ao buscar venda' });
    }
  }

  // GET /api/vendas/periodo?inicio=...&fim=...
  static async findByPeriodo(req, res) {
    try {
      const { inicio, fim } = req.query;
      const vendas = await Venda.findByPeriodo(inicio, fim);
      res.json(vendas);
    } catch (error) {
      console.error('Erro ao buscar vendas por período:', error);
      res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
  }

  // GET /api/vendas/estatisticas/dashboard
  static async getEstatisticas(req, res) {
    try {
      const estatisticas = await Venda.getEstatisticas();
      res.json(estatisticas);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
  }

  // GET /api/vendas/estatisticas/categorias
  static async getVendasPorCategoria(req, res) {
    try {
      const vendas = await Venda.getVendasPorCategoria();
      res.json(vendas);
    } catch (error) {
      console.error('Erro ao buscar vendas por categoria:', error);
      res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
  }

  // GET /api/vendas/ultimos-dias/:dias
  static async getVendasUltimosDias(req, res) {
    try {
      const { dias = 7 } = req.params;
      const vendas = await Venda.getVendasUltimosDias(parseInt(dias));
      res.json(vendas);
    } catch (error) {
      console.error('Erro ao buscar vendas dos últimos dias:', error);
      res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
  }

  // POST /api/vendas
  static async create(req, res) {
    try {
      const vendaData = req.body;
      
      // Validações básicas
      if (!vendaData.itens || vendaData.itens.length === 0) {
        return res.status(400).json({ error: 'Venda deve conter pelo menos um item' });
      }
      
      if (!vendaData.total || !vendaData.metodo_pagamento) {
        return res.status(400).json({ error: 'Total e método de pagamento são obrigatórios' });
      }

      const venda = await Venda.create(vendaData);
      res.status(201).json(venda);
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      res.status(500).json({ error: 'Erro ao criar venda', details: error.message });
    }
  }
}

module.exports = VendaController;
