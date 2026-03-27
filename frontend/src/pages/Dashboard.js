import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { vendaService, produtoService } from '../services';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [estatisticas, setEstatisticas] = useState({});
  const [estoqueBaixo, setEstoqueBaixo] = useState([]);
  const [produtosVencer, setProdutosVencer] = useState([]);
  const [vendasPorCategoria, setVendasPorCategoria] = useState([]);
  const [vendasUltimosDias, setVendasUltimosDias] = useState([]);
  const [totalProdutosEstoque, setTotalProdutosEstoque] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [stats, baixo, vencer, categorias, ultimos, produtos] = await Promise.all([
        vendaService.getEstatisticas(),
        produtoService.getEstoqueBaixo(),
        produtoService.getProximosVencimento(30),
        vendaService.getVendasPorCategoria(),
        vendaService.getVendasUltimosDias(7),
        produtoService.getAll(),
      ]);

      setEstatisticas(stats || {});
      setEstoqueBaixo(Array.isArray(baixo) ? baixo : []);
      setProdutosVencer(Array.isArray(vencer) ? vencer : []);
      setVendasPorCategoria(Array.isArray(categorias) ? categorias : []);
      setVendasUltimosDias(Array.isArray(ultimos) ? ultimos : []);
      setTotalProdutosEstoque(Array.isArray(produtos) ? produtos.length : 0);
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
    labels: vendasPorCategoria.map(c => c.categoria_nome),
    datasets: [{
      label: 'Vendas por Categoria',
      data: vendasPorCategoria.map(c => c.total_vendido),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    }],
  };

  const chartVendas = {
    labels: vendasUltimosDias.map(v => new Date(v.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
    datasets: [{
      label: 'Vendas (R$)',
      data: vendasUltimosDias.map(v => v.total),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }],
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card-premium p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="text-sm font-semibold text-slate-600 mb-2">Total em Vendas (Hoje)</div>
          <div className="text-3xl font-bold text-blue-600">R$ {(estatisticas.total_hoje || 0).toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-2">{(estatisticas.vendas_hoje || 0)} vendas</div>
        </div>

        <div className="card-premium p-6 bg-gradient-to-br from-green-50 to-white">
          <div className="text-sm font-semibold text-slate-600 mb-2">Lucro (Hoje)</div>
          <div className="text-3xl font-bold text-green-600">R$ {(estatisticas.lucro_hoje || 0).toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-2">Margem: {estatisticas.total_hoje > 0 ? ((estatisticas.lucro_hoje / estatisticas.total_hoje) * 100).toFixed(1) : 0}%</div>
        </div>

        <div className="card-premium p-6 bg-gradient-to-br from-purple-50 to-white">
          <div className="text-sm font-semibold text-slate-600 mb-2">Produtos no Estoque</div>
          <div className="text-3xl font-bold text-purple-600">{totalProdutosEstoque}</div>
          <div className="text-xs text-slate-500 mt-2">{estoqueBaixo.length} com estoque baixo</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Vendas por Categoria</h3>
          {vendasPorCategoria.length > 0 ? (
            <Doughnut data={chartCategorias} />
          ) : (
            <div className="text-center text-slate-400 py-8">Sem dados de vendas</div>
          )}
        </div>

        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Vendas dos Últimos 7 Dias</h3>
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
    </div>
  );
};

export default Dashboard;
