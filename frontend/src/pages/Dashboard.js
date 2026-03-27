import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { vendaService, produtoService } from '../services';
import caixaService from '../services/caixaService';
import CaixaModal from '../components/CaixaModal';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [estatisticas, setEstatisticas] = useState({});
  const [estoqueBaixo, setEstoqueBaixo] = useState([]);
  const [produtosVencer, setProdutosVencer] = useState([]);
  const [vendasPorCategoria, setVendasPorCategoria] = useState([]);
  const [vendasUltimosDias, setVendasUltimosDias] = useState([]);
  const [totalProdutosEstoque, setTotalProdutosEstoque] = useState(0);
  const [caixaAberto, setCaixaAberto] = useState(null);
  const [showCaixaModal, setShowCaixaModal] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [stats, baixo, vencer, categorias, ultimos, produtos, caixa] = await Promise.all([
        vendaService.getEstatisticas(),
        produtoService.getEstoqueBaixo(),
        produtoService.getProximosVencimento(30),
        vendaService.getVendasPorCategoria(),
        vendaService.getVendasUltimosDias(7),
        produtoService.getAll(),
        caixaService.getCaixaAberto(),
      ]);

      setEstatisticas(stats || {});
      setEstoqueBaixo(Array.isArray(baixo) ? baixo : []);
      setProdutosVencer(Array.isArray(vencer) ? vencer : []);
      setVendasPorCategoria(Array.isArray(categorias) ? categorias : []);
      setVendasUltimosDias(Array.isArray(ultimos) ? ultimos : []);
      setTotalProdutosEstoque(Array.isArray(produtos) ? produtos.length : 0);
      setCaixaAberto(caixa);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setEstatisticas({});
      setEstoqueBaixo([]);
      setProdutosVencer([]);
      setVendasPorCategoria([]);
      setVendasUltimosDias([]);
      setTotalProdutosEstoque(0);
    }
  };

  const getDiasRestantes = (dataValidade) => {
    if (!dataValidade) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataValidade);
    vencimento.setHours(0, 0, 0, 0);
    const diffTime = vencimento - hoje;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const chartCategorias = {
    labels: vendasPorCategoria.map(c => c.categoria),
    datasets: [{
      label: 'Vendas por Categoria',
      data: vendasPorCategoria.map(c => parseFloat(c.total_vendido) || 0),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    }],
  };

  const chartVendas = {
    labels: vendasUltimosDias.map(v => new Date(v.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
    datasets: [{
      label: 'Vendas (R$)',
      data: vendasUltimosDias.map(v => parseFloat(v.faturamento) || 0),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }],
  };

  return (
    <div className="animate-fade-in">
      {/* Card de Caixa */}
      <div className="mb-6">
        {caixaAberto ? (
          <div className="card-premium p-6 bg-gradient-to-r from-green-500 to-green-600">
            <div className="flex justify-between items-start">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-lg font-bold">Caixa Aberto</span>
                </div>
                <p className="text-sm opacity-90 mb-1">
                  Aberto em: {new Date(caixaAberto.data_abertura).toLocaleString('pt-BR')}
                </p>
                <p className="text-sm opacity-90">
                  Operador: {caixaAberto.usuario}
                </p>
                <div className="mt-4 grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Valor Abertura</p>
                    <p className="text-xl font-bold">R$ {parseFloat(caixaAberto.valor_abertura).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">💵 Dinheiro</p>
                    <p className="text-xl font-bold">R$ {(parseFloat(caixaAberto.total_dinheiro) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">📱 PIX</p>
                    <p className="text-xl font-bold">R$ {(parseFloat(caixaAberto.total_pix) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">💳 Débito</p>
                    <p className="text-xl font-bold">R$ {(parseFloat(caixaAberto.total_debito) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">💳 Crédito</p>
                    <p className="text-xl font-bold">R$ {(parseFloat(caixaAberto.total_credito) || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCaixaModal(true)}
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Gerenciar Caixa
              </button>
            </div>
          </div>
        ) : (
          <div className="card-premium p-6 bg-gradient-to-r from-red-500 to-red-600">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span className="text-lg font-bold">Caixa Fechado</span>
                </div>
                <p className="text-sm opacity-90">
                  Abra o caixa para começar a realizar vendas
                </p>
              </div>
              <button
                onClick={() => setShowCaixaModal(true)}
                className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Abrir Caixa
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card-premium p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="text-sm font-semibold text-slate-600 mb-2">💰 Total em Vendas</div>
          <div className="text-3xl font-bold text-blue-600">R$ {(parseFloat(estatisticas.faturamento_total) || 0).toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-2">{estatisticas.total_vendas || 0} vendas realizadas</div>
        </div>

        <div className="card-premium p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="text-sm font-semibold text-slate-600 mb-2">📈 Lucro Total</div>
          <div className="text-3xl font-bold text-green-600">R$ {(parseFloat(estatisticas.lucro_total) || 0).toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-2">Ticket Médio: R$ {(parseFloat(estatisticas.ticket_medio) || 0).toFixed(2)}</div>
        </div>

        <div className="card-premium p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="text-sm font-semibold text-slate-600 mb-2">Produtos no Estoque</div>
          <div className="text-3xl font-bold text-purple-600">{totalProdutosEstoque}</div>
          <div className="text-xs text-slate-500 mt-2">{estoqueBaixo.length} com estoque baixo</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">📊 Vendas por Categoria</h3>
          <p className="text-xs text-slate-500 mb-4">Distribuição total de vendas</p>
          {vendasPorCategoria.length > 0 ? (
            <Doughnut data={chartCategorias} />
          ) : (
            <div className="text-center text-slate-400 py-8">Sem dados de vendas</div>
          )}
        </div>

        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">📈 Vendas dos Últimos 7 Dias</h3>
          <p className="text-xs text-slate-500 mb-4">Evolução das vendas por dia</p>
          {vendasUltimosDias.length > 0 ? (
            <Line data={chartVendas} />
          ) : (
            <div className="text-center text-slate-400 py-8">Sem dados de vendas</div>
          )}
        </div>
      </div>

      {estoqueBaixo.length > 0 && (
        <div className="card-premium p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">⚠️ Alertas de Estoque Baixo</h3>
          <div className="grid grid-cols-4 gap-3">
            {estoqueBaixo.slice(0, 4).map(p => (
              <div key={p.id} className="bg-red-50 border-2 border-red-300 p-3 rounded-xl">
                <span className="badge badge-low text-xs">ESTOQUE BAIXO</span>
                <div className="font-bold text-sm text-slate-800 mt-2">{p.nome}</div>
                <div className="text-xs text-slate-600 mt-1">Estoque: <strong>{p.estoque}</strong> (mín: {p.estoque_minimo})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {produtosVencer.length > 0 && (
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">📅 Produtos Próximos ao Vencimento</h3>
          <div className="grid grid-cols-4 gap-3">
            {produtosVencer.slice(0, 4).map(p => {
              const diasRestantes = getDiasRestantes(p.data_validade);
              const corAlerta = diasRestantes <= 7 ? 'red' : diasRestantes <= 15 ? 'orange' : 'yellow';
              return (
                <div key={p.id} className={`bg-${corAlerta}-50 border-2 border-${corAlerta}-300 p-3 rounded-xl`}>
                  <span className="badge badge-low text-xs">{diasRestantes <= 7 ? 'URGENTE' : 'ATENÇÃO'}</span>
                  <div className="font-bold text-sm text-slate-800 mt-2">{p.nome}</div>
                  <div className="text-xs text-slate-600 mt-1">Vence em: <strong>{diasRestantes} dias</strong></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showCaixaModal && (
        <CaixaModal
          onClose={() => setShowCaixaModal(false)}
          onUpdate={() => {
            setShowCaixaModal(false);
            carregarDados();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
