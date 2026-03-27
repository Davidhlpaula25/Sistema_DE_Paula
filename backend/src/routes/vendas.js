const express = require('express');
const router = express.Router();
const VendaController = require('../controllers/VendaController');

// Rotas de estatísticas (devem vir antes das rotas com :id)
router.get('/estatisticas', VendaController.getEstatisticas);
router.get('/categorias', VendaController.getVendasPorCategoria);
router.get('/ultimos-dias/:dias', VendaController.getVendasUltimosDias);

// Rotas de período
router.get('/periodo', VendaController.findByPeriodo);

// CRUD básico
router.get('/', VendaController.index);
router.get('/:id', VendaController.show);
router.post('/', VendaController.create);

module.exports = router;
