import React, { useState, useEffect } from 'react';
import { caixaService } from '../services/caixaService';
import Alert from './Alert';
import Confirm from './Confirm';

const CaixaModal = ({ onClose, onUpdate }) => {
  const [caixaAberto, setCaixaAberto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Formulário de abertura
  const [valorAbertura, setValorAbertura] = useState('100.00');
  const [usuario, setUsuario] = useState('');
  
  // Formulário de fechamento
  const [observacoes, setObservacoes] = useState('');

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    carregarCaixaAberto();
  }, []);

  const carregarCaixaAberto = async () => {
    try {
      setLoading(true);
      const caixa = await caixaService.getCaixaAberto();
      setCaixaAberto(caixa);
    } catch (error) {
      console.error('Erro ao carregar caixa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirCaixa = async (e) => {
    e.preventDefault();
    try {
      await caixaService.abrirCaixa({
        valor_abertura: parseFloat(valorAbertura),
        usuario: usuario || 'Admin'
      });
      showAlert('Caixa aberto com sucesso!', 'success');
      await carregarCaixaAberto();
      setTimeout(() => onUpdate(), 1500);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Erro ao abrir caixa', 'error');
    }
  };

  const handleFecharCaixa = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmarFechamento = async () => {
    setShowConfirm(false);
    try {
      await caixaService.fecharCaixa(caixaAberto.id, {
        observacoes
      });
      showAlert('Caixa fechado com sucesso!', 'success');
      await carregarCaixaAberto();
      setTimeout(() => onUpdate(), 1500);
    } catch (error) {
      showAlert(error.response?.data?.error || 'Erro ao fechar caixa', 'error');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {caixaAberto ? 'Caixa Aberto' : 'Abrir Caixa'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {!caixaAberto ? (
            // Formulário de abertura
            <form onSubmit={handleAbrirCaixa}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor de Abertura
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={valorAbertura}
                    onChange={(e) => setValorAbertura(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuário
                  </label>
                  <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Nome do operador"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Abrir Caixa
                </button>
              </div>
            </form>
          ) : (
            // Informações do caixa aberto
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-800 font-semibold">Caixa Aberto</span>
                </div>
                <p className="text-sm text-green-700">
                  Aberto em: {new Date(caixaAberto.data_abertura).toLocaleString('pt-BR')}
                </p>
                <p className="text-sm text-green-700">
                  Operador: {caixaAberto.usuario}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Valor de Abertura</p>
                  <p className="text-2xl font-bold text-gray-800">
                    R$ {parseFloat(caixaAberto.valor_abertura).toFixed(2)}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Total em Vendas</p>
                  <p className="text-2xl font-bold text-blue-800">
                    R$ {(parseFloat(caixaAberto.total_vendas) || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Vendas por Forma de Pagamento</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">💵 Dinheiro:</span>
                    <span className="font-semibold text-gray-800">
                      R$ {(parseFloat(caixaAberto.total_dinheiro) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">📱 PIX:</span>
                    <span className="font-semibold text-gray-800">
                      R$ {(parseFloat(caixaAberto.total_pix) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">💳 Débito:</span>
                    <span className="font-semibold text-gray-800">
                      R$ {(parseFloat(caixaAberto.total_debito) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">💳 Crédito:</span>
                    <span className="font-semibold text-gray-800">
                      R$ {(parseFloat(caixaAberto.total_credito) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFecharCaixa}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações do Fechamento
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações sobre o fechamento do caixa..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Fechar Caixa
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {showConfirm && (
        <Confirm
          message="Confirma o fechamento do caixa? Esta ação irá calcular todos os totais e fechar o movimento do dia."
          type="danger"
          onConfirm={confirmarFechamento}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default CaixaModal;
