const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const produtosRouter = require('./src/routes/produtos');
const categoriasRouter = require('./src/routes/categorias');
const vendasRouter = require('./src/routes/vendas');
const caixasRouter = require('./src/routes/caixas');

app.use('/api/produtos', produtosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/vendas', vendasRouter);
app.use('/api/caixas', caixasRouter);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'David Distri API está rodando!',
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🍺  DAVID DISTRI - API REST                            ║
║                                                           ║
║   ✅ Servidor rodando na porta ${PORT}                      ║
║   🌐 http://localhost:${PORT}                              ║
║   📡 API: http://localhost:${PORT}/api                      ║
║                                                           ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
