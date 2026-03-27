import axios from 'axios';

const API_URL = '/api/caixas';

export const caixaService = {
  async listarCaixas() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async getCaixaAberto() {
    try {
      const response = await axios.get(`${API_URL}/aberto`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getCaixaById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async abrirCaixa(dados) {
    const response = await axios.post(`${API_URL}/abrir`, dados);
    return response.data;
  },

  async fecharCaixa(id, dados) {
    const response = await axios.post(`${API_URL}/${id}/fechar`, dados);
    return response.data;
  }
};

export default caixaService;
