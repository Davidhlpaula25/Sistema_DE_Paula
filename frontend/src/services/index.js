import api from './api';

export const produtoService = {
  getAll: async () => (await api.get('/produtos')).data,
  getById: async (id) => (await api.get(`/produtos/${id}`)).data,
  getByCodigo: async (codigo) => (await api.get(`/produtos/codigo/${codigo}`)).data,
  getByCategoria: async (id) => (await api.get(`/produtos/categoria/${id}`)).data,
  getEstoqueBaixo: async () => (await api.get('/produtos/estoque-baixo')).data,
  getProximosVencimento: async (dias = 30) => (await api.get(`/produtos/vencimento/${dias}`)).data,
  create: async (data) => (await api.post('/produtos', data)).data,
  update: async (id, data) => (await api.put(`/produtos/${id}`, data)).data,
  updateEstoque: async (id, quantidade) => (await api.patch(`/produtos/${id}/estoque`, { quantidade })).data,
  delete: async (id) => (await api.delete(`/produtos/${id}`)).data,
};

export const categoriaService = {
  getAll: async () => (await api.get('/categorias')).data,
  getById: async (id) => (await api.get(`/categorias/${id}`)).data,
  create: async (data) => (await api.post('/categorias', data)).data,
  update: async (id, data) => (await api.put(`/categorias/${id}`, data)).data,
  delete: async (id) => (await api.delete(`/categorias/${id}`)).data,
};

export const vendaService = {
  getAll: async () => (await api.get('/vendas')).data,
  getById: async (id) => (await api.get(`/vendas/${id}`)).data,
  getByPeriodo: async (inicio, fim) => (await api.get(`/vendas/periodo?inicio=${inicio}&fim=${fim}`)).data,
  getEstatisticas: async () => (await api.get('/vendas/estatisticas')).data,
  getVendasPorCategoria: async () => (await api.get('/vendas/categorias')).data,
  getVendasUltimosDias: async (dias = 7) => (await api.get(`/vendas/ultimos-dias/${dias}`)).data,
  create: async (data) => (await api.post('/vendas', data)).data,
};
