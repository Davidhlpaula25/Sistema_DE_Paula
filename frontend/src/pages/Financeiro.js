import React, { useState, useEffect } from 'react';
import { vendaService } from '../services';
import Alert from '../components/Alert';

const Financeiro = () => {
  const [vendas, setVendas] = useState([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [alert, setAlert] = useState(null);
  const [vendedorFiltro, setVendedorFiltro] = useState('');
  const [vendedores, setVendedores] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total_vendas: 0,
    valor_total: 0,
    lucro_total: 0
  });

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  useEffect(() => {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    setDataInicio(primeiroDiaMes.toISOString().split('T')[0]);
    setDataFim(hoje.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (dataInicio && dataFim) {
      carregarVendas();
    }
  }, [dataInicio, dataFim]);

  const carregarVendas = async () => {
    try {
      const vendasData = await vendaService.getByPeriodo(dataInicio, dataFim);
      const vendas = Array.isArray(vendasData) ? vendasData : [];
      setVendas(vendas);
      
      // Extrair vendedores únicos
      const vendedoresUnicos = [...new Set(vendas.map(v => v.vendedor).filter(Boolean))];
      setVendedores(vendedoresUnicos);
      
      const stats = vendas.reduce((acc, venda) => ({
        total_vendas: acc.total_vendas + 1,
        valor_total: acc.valor_total + parseFloat(venda.total || 0),
        lucro_total: acc.lucro_total + parseFloat(venda.lucro || 0)
      }), { total_vendas: 0, valor_total: 0, lucro_total: 0 });
      
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      setVendas([]);
      setEstatisticas({ total_vendas: 0, valor_total: 0, lucro_total: 0 });
    }
  };

  const abrirDetalhes = async (vendaId) => {
    try {
      const venda = await vendaService.getById(vendaId);
      setVendaSelecionada(venda);
    } catch (error) {
      showAlert('Erro ao carregar detalhes da venda', 'error');
    }
  };

  const getMetodoPagamentoIcon = (metodo) => {
    const icons = {
      'dinheiro': '💵',
      'pix': '📱',
      'debito': '💳',
      'credito': '💳'
    };
    return icons[metodo] || '💰';
  };

  const getMetodoPagamentoBadge = (metodo) => {
    const badges = {
      'dinheiro': 'badge-ok',
      'pix': 'badge-pix',
      'debito': 'badge-debito',
      'credito': 'badge-credito'
    };
    return badges[metodo] || 'badge-ok';
  };

  const exportarExcel = () => {
    const vendasFiltradas = vendasParaExibir();
    
    let csv = 'ID,Data/Hora,Vendedor,Método,Qtd Itens,Valor Total,Lucro\n';
    vendasFiltradas.forEach(venda => {
      const dataHora = new Date(venda.data_venda).toLocaleString('pt-BR');
      const vendedor = venda.vendedor || 'Não informado';
      const itens = venda.itens?.length || 0;
      const total = parseFloat(venda.total || 0).toFixed(2);
      const lucro = parseFloat(venda.lucro || 0).toFixed(2);
      
      csv += `${venda.id},${dataHora},${vendedor},${venda.metodo_pagamento},${itens},${total},${lucro}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_vendas_${dataInicio}_${dataFim}.csv`;
    link.click();
    showAlert('Relatório exportado com sucesso!', 'success');
  };

  const exportarPDF = () => {
    const vendasFiltradas = vendasParaExibir();
    
    let conteudo = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório de Vendas</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1e40af; color: white; }
            .totais { margin-top: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Relatório de Vendas</h1>
          <p>Período: ${new Date(dataInicio).toLocaleDateString('pt-BR')} até ${new Date(dataFim).toLocaleDateString('pt-BR')}</p>
          ${vendedorFiltro ? `<p>Vendedor: ${vendedorFiltro}</p>` : ''}
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data/Hora</th>
                <th>Vendedor</th>
                <th>Método</th>
                <th>Itens</th>
                <th>Valor Total</th>
                <th>Lucro</th>
              </tr>
            </thead>
            <tbody>
    `;

    vendasFiltradas.forEach(venda => {
      conteudo += `
        <tr>
          <td>#${venda.id}</td>
          <td>${new Date(venda.data_venda).toLocaleString('pt-BR')}</td>
          <td>${venda.vendedor || 'Não informado'}</td>
          <td>${venda.metodo_pagamento}</td>
          <td>${venda.itens?.length || 0}</td>
          <td>R$ ${parseFloat(venda.total || 0).toFixed(2)}</td>
          <td>R$ ${parseFloat(venda.lucro || 0).toFixed(2)}</td>
        </tr>
      `;
    });

    const totalVendas = vendasFiltradas.length;
    const totalReceita = vendasFiltradas.reduce((acc, v) => acc + parseFloat(v.total || 0), 0);
    const totalLucro = vendasFiltradas.reduce((acc, v) => acc + parseFloat(v.lucro || 0), 0);

    conteudo += `
            </tbody>
          </table>
          
          <div class="totais">
            <p>Total de Vendas: ${totalVendas}</p>
            <p>Receita Total: R$ ${totalReceita.toFixed(2)}</p>
            <p>Lucro Total: R$ ${totalLucro.toFixed(2)}</p>
          </div>
        </body>
      </html>
    `;

    const janela = window.open('', '_blank');
    janela.document.write(conteudo);
    janela.document.close();
    janela.print();
    showAlert('Relatório aberto para impressão/PDF!', 'success');
  };

  const vendasParaExibir = () => {
    if (!vendedorFiltro) return vendas;
    return vendas.filter(v => v.vendedor === vendedorFiltro);
  };

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      
      <h1 className="text-3xl font-bold mb-6">Relatório Financeiro</h1>

      {/* Filtros */}
      <div className="card-premium mb-6 p-6">
        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <label className="block font-semibold mb-2">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">Vendedor</label>
            <select
              value={vendedorFiltro}
              onChange={(e) => setVendedorFiltro(e.target.value)}
              className="w-full"
            >
              <option value="">Todos os vendedores</option>
              {vendedores.map(vendedor => (
                <option key={vendedor} value={vendedor}>{vendedor}</option>
              ))}
            </select>
          </div>
          <button onClick={carregarVendas} className="btn-primary">
            🔍 Buscar
          </button>
        </div>
        
        <div className="flex gap-3 pt-4 border-t">
          <button onClick={exportarExcel} className="btn-success">
            📊 Exportar Excel
          </button>
          <button onClick={exportarPDF} className="btn-primary">
            📄 Exportar PDF
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card-premium p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-sm opacity-90 mb-2">Total de Vendas</div>
          <div className="text-4xl font-bold">{vendasParaExibir().length}</div>
        </div>

        <div className="card-premium p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-sm opacity-90 mb-2">Receita Total</div>
          <div className="text-4xl font-bold">
            R$ {vendasParaExibir().reduce((acc, v) => acc + parseFloat(v.total || 0), 0).toFixed(2)}
          </div>
        </div>

        <div className="card-premium p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-sm opacity-90 mb-2">Lucro Líquido</div>
          <div className="text-4xl font-bold">
            R$ {vendasParaExibir().reduce((acc, v) => acc + parseFloat(v.lucro || 0), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabela de Vendas */}
      <div className="card-premium p-6">
        <h2 className="text-xl font-bold mb-4">Histórico de Vendas</h2>
        
        {vendasParaExibir().length === 0 ? (
          <p className="text-center text-gray-400 py-8">Nenhuma venda encontrada no período</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data/Hora</th>
                  <th>Vendedor</th>
                  <th>Método</th>
                  <th>Qtd. Itens</th>
                  <th>Valor Total</th>
                  <th>Lucro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendasParaExibir().map(venda => (
                  <tr key={venda.id}>
                    <td className="font-mono">#{venda.id}</td>
                    <td>
                      {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                      {' '}
                      {new Date(venda.data_venda).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td>{venda.vendedor || 'Não informado'}</td>
                    <td>
                      <span className={getMetodoPagamentoBadge(venda.metodo_pagamento)}>
                        {getMetodoPagamentoIcon(venda.metodo_pagamento)} {venda.metodo_pagamento}
                      </span>
                    </td>
                    <td className="text-center">{venda.itens?.length || '-'}</td>
                    <td className="font-bold text-green-600">
                      R$ {parseFloat(venda.total || 0).toFixed(2)}
                    </td>
                    <td className="font-bold text-purple-600">
                      R$ {parseFloat(venda.lucro || 0).toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => abrirDetalhes(venda.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalhes"
                      >
                        👁️ Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {vendaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Detalhes da Venda #{vendaSelecionada.id}</h2>
              <button
                onClick={() => setVendaSelecionada(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Data/Hora:</span>
                  <div className="font-semibold">
                    {new Date(vendaSelecionada.data_venda).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Método de Pagamento:</span>
                  <div className="font-semibold">
                    {getMetodoPagamentoIcon(vendaSelecionada.metodo_pagamento)}{' '}
                    {vendaSelecionada.metodo_pagamento}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-3">Itens da Venda</h3>
            <table className="w-full mb-6">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {vendaSelecionada.itens?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.produto_nome || 'Produto'}</td>
                    <td className="text-center">{item.quantidade}</td>
                    <td>R$ {parseFloat(item.preco_unitario).toFixed(2)}</td>
                    <td className="font-bold">
                      R$ {(item.quantidade * parseFloat(item.preco_unitario)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Valor Total:</span>
                <span className="font-bold text-green-600">
                  R$ {parseFloat(vendaSelecionada.valor_total).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Lucro Líquido:</span>
                <span className="font-bold text-purple-600">
                  R$ {parseFloat(vendaSelecionada.lucro_liquido).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setVendaSelecionada(null)}
              className="btn-primary w-full mt-6"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;
