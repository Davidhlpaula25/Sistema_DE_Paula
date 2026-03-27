import React, { useState, useEffect, useRef } from 'react';
import { produtoService, vendaService, categoriaService } from '../services';
import caixaService from '../services/caixaService';
import Alert from '../components/Alert';

const PDV = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('dinheiro');
  const [valorRecebido, setValorRecebido] = useState('');
  const [alert, setAlert] = useState(null);
  const [caixaAberto, setCaixaAberto] = useState(null);
  const inputBuscaRef = useRef(null);

  useEffect(() => {
    carregarDados();
    inputBuscaRef.current?.focus();

    const handleF2 = (e) => {
      if (e.key === 'F2' && carrinho.length > 0) {
        e.preventDefault();
        finalizarVenda();
      }
    };

    window.addEventListener('keydown', handleF2);
    return () => window.removeEventListener('keydown', handleF2);
  }, [carrinho]);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const carregarDados = async () => {
    try {
      const [produtosData, categoriasData, caixa] = await Promise.all([
        produtoService.getAll(),
        categoriaService.getAll(),
        caixaService.getCaixaAberto()
      ]);
      setProdutos(Array.isArray(produtosData) ? produtosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setCaixaAberto(caixa);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setProdutos([]);
      setCategorias([]);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
    
    setBusca('');
    inputBuscaRef.current?.focus();
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQuantidade = item.quantidade + delta;
        return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : item;
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  const buscarProduto = async (e) => {
    if (e.key === 'Enter' && busca.trim()) {
      try {
        const produto = await produtoService.getByCodigo(busca);
        if (produto) {
          adicionarAoCarrinho(produto);
        } else {
          showAlert('Produto não encontrado!', 'warning');
        }
      } catch (error) {
        showAlert('Erro ao buscar produto!', 'error');
      }
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco_venda * item.quantidade), 0);
  };

  const calcularLucro = () => {
    return carrinho.reduce((lucro, item) => 
      lucro + (((parseFloat(item.preco_venda) || 0) - (parseFloat(item.custo) || 0)) * item.quantidade), 0
    );
  };

  const finalizarVenda = async () => {
    if (!caixaAberto) {
      showAlert('Nenhum caixa aberto! Abra o caixa na Dashboard antes de realizar vendas.', 'error');
      return;
    }

    if (carrinho.length === 0) {
      showAlert('Carrinho vazio!', 'warning');
      return;
    }

    if (metodoPagamento === 'dinheiro' && !valorRecebido) {
      showAlert('Informe o valor recebido!', 'warning');
      return;
    }

    const total = calcularTotal();
    const lucro = calcularLucro();
    const recebido = metodoPagamento === 'dinheiro' ? parseFloat(valorRecebido) : total;
    const troco = metodoPagamento === 'dinheiro' ? recebido - total : 0;

    if (metodoPagamento === 'dinheiro' && recebido < total) {
      showAlert('Valor recebido insuficiente!', 'error');
      return;
    }

    try {
      await vendaService.create({
        itens: carrinho.map(item => ({
          produto_id: item.id,
          produto_nome: item.nome,
          quantidade: item.quantidade,
          preco_unitario: parseFloat(item.preco_venda),
          custo_unitario: parseFloat(item.custo || 0),
          subtotal: parseFloat(item.preco_venda) * item.quantidade
        })),
        subtotal: total,
        desconto: 0,
        total: total,
        lucro: lucro,
        metodo_pagamento: metodoPagamento
      });

      if (metodoPagamento === 'dinheiro' && troco > 0) {
        showAlert(`Venda finalizada! Troco: R$ ${troco.toFixed(2)}`, 'success');
      } else {
        showAlert('Venda finalizada com sucesso!', 'success');
      }

      setCarrinho([]);
      setValorRecebido('');
      setBusca('');
      inputBuscaRef.current?.focus();
      carregarDados();
    } catch (error) {
      showAlert('Erro ao finalizar venda: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const produtosFiltrados = produtos.filter(p => {
    const matchCategoria = !categoriaSelecionada || p.categoria_id === parseInt(categoriaSelecionada);
    const matchBusca = !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.codigo.includes(busca);
    return matchCategoria && matchBusca && (p.estoque || 0) > 0;
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      
      {/* Operador Atual */}
      {caixaAberto && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="text-2xl">👤</div>
          <div>
            <div className="text-sm opacity-90">Operador</div>
            <div className="font-bold text-lg">{caixaAberto.usuario}</div>
          </div>
        </div>
      )}
      
      {/* Alerta de Caixa Fechado */}
      {!caixaAberto && (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <div className="font-bold">Caixa Fechado</div>
            <div className="text-sm opacity-90">Abra o caixa na Dashboard para realizar vendas</div>
          </div>
        </div>
      )}
      
      {/* Área Principal */}
      <div className="flex gap-6 flex-1">
      {/* Área de Produtos */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex gap-3">
          <input
            ref={inputBuscaRef}
            type="text"
            placeholder="Digite o código de barras ou nome do produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={buscarProduto}
            className="flex-1"
          />
          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="w-48"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-3 overflow-y-auto">
          {produtosFiltrados.map(produto => (
            <button
              key={produto.id}
              onClick={() => adicionarAoCarrinho(produto)}
              className="card-premium p-4 text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg mb-1">{produto.nome}</h3>
              <p className="text-sm text-gray-500 mb-2">{produto.codigo}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                  R$ {(parseFloat(produto.preco_venda) || 0).toFixed(2)}
                </span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Est: {produto.estoque || 0}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Carrinho */}
      <div className="w-96 card-premium flex flex-col">
        <h2 className="text-2xl font-bold mb-4 pb-3 border-b">Carrinho</h2>
        
        <div className="flex-1 overflow-y-auto mb-4">
          {carrinho.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">Carrinho vazio</p>
          ) : (
            carrinho.map(item => (
              <div key={item.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{item.nome}</h4>
                  <button
                    onClick={() => removerDoCarrinho(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alterarQuantidade(item.id, -1)}
                      className="w-8 h-8 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold">{item.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(item.id, 1)}
                      className="w-8 h-8 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-green-600">
                    R$ {((parseFloat(item.preco_venda) || 0) * item.quantidade).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">R$ {calcularTotal().toFixed(2)}</span>
          </div>

          <select
            value={metodoPagamento}
            onChange={(e) => setMetodoPagamento(e.target.value)}
            className="w-full"
          >
            <option value="dinheiro">💵 Dinheiro</option>
            <option value="pix">📱 PIX</option>
            <option value="debito">💳 Débito</option>
            <option value="credito">💳 Crédito</option>
          </select>

          {metodoPagamento === 'dinheiro' && (
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Valor recebido"
                value={valorRecebido}
                onChange={(e) => setValorRecebido(e.target.value)}
                className="w-full"
                step="0.01"
              />
              {valorRecebido && parseFloat(valorRecebido) >= calcularTotal() && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-700 font-semibold">💰 Troco:</span>
                    <span className="text-2xl font-bold text-green-700">
                      R$ {(parseFloat(valorRecebido) - calcularTotal()).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              {valorRecebido && parseFloat(valorRecebido) < calcularTotal() && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-red-700 font-semibold">⚠️ Faltam:</span>
                    <span className="text-xl font-bold text-red-700">
                      R$ {(calcularTotal() - parseFloat(valorRecebido)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={finalizarVenda}
            disabled={carrinho.length === 0}
            className="btn-success w-full text-lg py-3"
          >
            💰 Finalizar Venda (F2)
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PDV;
