const express = require('express');
const router = express.Router();
const CaixaController = require('../controllers/CaixaController');

// Listar caixas
router.get('/', CaixaController.index);

// Buscar caixa aberto
router.get('/aberto', CaixaController.getCaixaAberto);

// Buscar caixa por ID
router.get('/:id', CaixaController.show);

// Abrir caixa
router.post('/abrir', CaixaController.abrir);

// Fechar caixa
router.post('/:id/fechar', CaixaController.fechar);

module.exports = router;
