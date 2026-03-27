const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

// Rotas de alertas (devem vir antes das rotas com :id)
router.get('/estoque-baixo', ProdutoController.estoqueBaixo);
router.get('/vencimento/:dias', ProdutoController.proximosVencimento);

// Rotas de busca por código e categoria
router.get('/codigo/:codigo', ProdutoController.findByCodigo);
router.get('/categoria/:categoriaId', ProdutoController.findByCategoria);

// CRUD básico
router.get('/', ProdutoController.index);
router.get('/:id', ProdutoController.show);
router.post('/', ProdutoController.create);
router.put('/:id', ProdutoController.update);
router.patch('/:id/estoque', ProdutoController.updateEstoque);
router.delete('/:id', ProdutoController.delete);

module.exports = router;
