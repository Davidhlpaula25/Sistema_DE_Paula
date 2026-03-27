const Caixa = require('../models/Caixa');

class CaixaController {
  // GET /api/caixas
  static async index(req, res) {
    try {
      const { limit = 50 } = req.query;
      const caixas = await Caixa.findAll(parseInt(limit));
      res.json(caixas);
    } catch (error) {
      console.error('Erro ao listar caixas:', error);
      res.status(500).json({ error: 'Erro ao listar caixas' });
    }
  }

  // GET /api/caixas/aberto
  static async getCaixaAberto(req, res) {
    try {
      const caixa = await Caixa.findCaixaAberto();
      if (!caixa) {
        return res.status(404).json({ error: 'Nenhum caixa aberto' });
      }
      res.json(caixa);
    } catch (error) {
      console.error('Erro ao buscar caixa aberto:', error);
      res.status(500).json({ error: 'Erro ao buscar caixa aberto' });
    }
  }

  // GET /api/caixas/:id
  static async show(req, res) {
    try {
      const { id } = req.params;
      const caixa = await Caixa.findById(id);
      
      if (!caixa) {
        return res.status(404).json({ error: 'Caixa não encontrado' });
      }
      
      res.json(caixa);
    } catch (error) {
      console.error('Erro ao buscar caixa:', error);
      res.status(500).json({ error: 'Erro ao buscar caixa' });
    }
  }

  // POST /api/caixas/abrir
  static async abrir(req, res) {
    try {
      const caixa = await Caixa.abrir(req.body);
      res.status(201).json(caixa);
    } catch (error) {
      console.error('Erro ao abrir caixa:', error);
      if (error.message === 'Já existe um caixa aberto') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao abrir caixa' });
    }
  }

  // POST /api/caixas/:id/fechar
  static async fechar(req, res) {
    try {
      const { id } = req.params;
      const caixa = await Caixa.fechar(id, req.body);
      res.json(caixa);
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      if (error.message === 'Caixa não encontrado ou já está fechado') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erro ao fechar caixa' });
    }
  }
}

module.exports = CaixaController;
