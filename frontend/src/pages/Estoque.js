import React, { useState, useEffect } from 'react';
import { produtoService, categoriaService } from '../services';
import Alert from '../components/Alert';
import Confirm from '../components/Confirm';

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formCategoria, setFormCategoria] = useState({ nome: '', descricao: '' });
  const [alert, setAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    codigo: '',
    nome: '',
    categoria_id: '',
    preco_compra: '',
    preco_venda: '',
    estoque_minimo: '',
    estoque_atual: '',
    data_validade: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const carregarDados = async () => {
    try {
      const [produtosData, categoriasData] = await Promise.all([
        produtoService.getAll(),
        categoriaService.getAll()
      ]);
      setProdutos(Array.isArray(produtosData) ? produtosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setProdutos([]);
      setCategorias([]);
    }
  };

  const abrirModalNovo = () => {
    setProdutoEditando(null);
    setForm({
      codigo: '',
      nome: '',
      categoria_id: '',
      preco_compra: '',
      preco_venda: '',
      estoque_minimo: '',
      estoque_atual: '',
      data_validade: ''
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (produto) => {
    setProdutoEditando(produto);
    setForm({
      codigo: produto.codigo,
      nome: produto.nome,
      categoria_id: produto.categoria_id,
      preco_compra: produto.custo || produto.preco_compra,
      preco_venda: produto.preco_venda,
      estoque_minimo: produto.estoque_minimo,
      estoque_atual: produto.estoque,
      data_validade: produto.data_validade ? produto.data_validade.split('T')[0] : ''
    });
    setMostrarModal(true);
  };

  const salvarProduto = async (e) => {
    e.preventDefault();
    
    try {
      const dados = {
        codigo: form.codigo,
        nome: form.nome,
        categoria_id: parseInt(form.categoria_id),
        custo: parseFloat(form.preco_compra),
        preco_venda: parseFloat(form.preco_venda),
        estoque_minimo: parseInt(form.estoque_minimo),
        estoque: parseInt(form.estoque_atual),
        data_validade: form.data_validade || null
      };

      if (produtoEditando) {
        await produtoService.update(produtoEditando.id, dados);
        showAlert('Produto atualizado com sucesso!', 'success');
      } else {
        await produtoService.create(dados);
        showAlert('Produto cadastrado com sucesso!', 'success');
      }

      setMostrarModal(false);
      carregarDados();
    } catch (error) {
      showAlert('Erro ao salvar produto: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const excluirProduto = (id) => {
    setConfirmDelete({
      type: 'produto',
      id,
      message: 'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.'
    });
  };

  const confirmarExclusaoProduto = async () => {
    const id = confirmDelete.id;
    setConfirmDelete(null);
    try {
      await produtoService.delete(id);
      showAlert('Produto excluído com sucesso!', 'success');
      carregarDados();
    } catch (error) {
      showAlert('Erro ao excluir produto: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  // Funções de Categoria
  const abrirModalNovaCategoria = () => {
    setCategoriaEditando(null);
    setFormCategoria({ nome: '', descricao: '' });
    setMostrarModalCategoria(true);
  };

  const abrirModalEditarCategoria = (categoria) => {
    setCategoriaEditando(categoria);
    setFormCategoria({ nome: categoria.nome, descricao: categoria.descricao || '' });
    setMostrarModalCategoria(true);
  };

  const salvarCategoria = async (e) => {
    e.preventDefault();
    
    try {
      if (categoriaEditando) {
        await categoriaService.update(categoriaEditando.id, formCategoria);
        showAlert('Categoria atualizada com sucesso!', 'success');
      } else {
        await categoriaService.create(formCategoria);
        showAlert('Categoria cadastrada com sucesso!', 'success');
      }

      setMostrarModalCategoria(false);
      carregarDados();
    } catch (error) {
      showAlert('Erro ao salvar categoria: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const excluirCategoria = (id) => {
    const produtosNaCategoria = produtos.filter(p => p.categoria_id === id).length;
    
    if (produtosNaCategoria > 0) {
      showAlert(`Não é possível excluir esta categoria pois existem ${produtosNaCategoria} produto(s) vinculado(s).`, 'warning');
      return;
    }

    setConfirmDelete({
      type: 'categoria',
      id,
      message: 'Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.'
    });
  };

  const confirmarExclusaoCategoria = async () => {
    const id = confirmDelete.id;
    setConfirmDelete(null);
    try {
      await categoriaService.delete(id);
      showAlert('Categoria excluída com sucesso!', 'success');
      carregarDados();
    } catch (error) {
      showAlert('Erro ao excluir categoria: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  const getDiasRestantes = (dataValidade) => {
    if (!dataValidade) return null;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diff = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCorAlerta = (dias) => {
    if (dias <= 7) return 'text-red-600 font-bold';
    if (dias <= 15) return 'text-orange-500 font-semibold';
    if (dias <= 30) return 'text-yellow-600';
    return '';
  };

  const produtosFiltrados = produtos.filter(p =>
    !categoriaSelecionada || p.categoria_id === parseInt(categoriaSelecionada)
  );

  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestão de Estoque</h1>
        <button onClick={abrirModalNovo} className="btn-primary">
          ➕ Novo Produto
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filtro de Categorias */}
        <div className="w-64 card-premium">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Categorias</h3>
            <button
              onClick={abrirModalNovaCategoria}
              className="text-blue-600 hover:text-blue-800 text-xl"
              title="Adicionar Categoria"
            >
              ➕
            </button>
          </div>
          <button
            onClick={() => setCategoriaSelecionada('')}
            className={`w-full text-left px-3 py-2 rounded mb-1 ${
              !categoriaSelecionada ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            📦 Todas ({produtos.length})
          </button>
          {categorias.map(cat => {
            const count = produtos.filter(p => p.categoria_id === cat.id).length;
            return (
              <div key={cat.id} className="group relative">
                <button
                  onClick={() => setCategoriaSelecionada(cat.id.toString())}
                  className={`w-full text-left px-3 py-2 rounded mb-1 ${
                    categoriaSelecionada === cat.id.toString() ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.nome} ({count})
                </button>
                <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); abrirModalEditarCategoria(cat); }}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); excluirCategoria(cat.id); }}
                    className="text-red-600 hover:text-red-800 text-xs"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela de Produtos */}
        <div className="flex-1 card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço Venda</th>
                  <th>Estoque</th>
                  <th>Validade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map(produto => {
                  const diasRestantes = getDiasRestantes(produto.data_validade);
                  const estoqueAlerta = (produto.estoque || 0) <= produto.estoque_minimo;

                  return (
                    <tr key={produto.id}>
                      <td className="font-mono">{produto.codigo}</td>
                      <td className="font-semibold">{produto.nome}</td>
                      <td>
                        <span className="badge-ok">
                          {categorias.find(c => c.id === produto.categoria_id)?.nome}
                        </span>
                      </td>
                      <td className="font-bold text-green-600">
                        R$ {(parseFloat(produto.preco_venda) || 0).toFixed(2)}
                      </td>
                      <td>
                        <span className={estoqueAlerta ? 'badge-low' : 'badge-ok'}>
                          {produto.estoque || 0} un
                          {estoqueAlerta && ' ⚠️'}
                        </span>
                      </td>
                      <td className={diasRestantes ? getCorAlerta(diasRestantes) : ''}>
                        {produto.data_validade ? (
                          <>
                            {new Date(produto.data_validade).toLocaleDateString('pt-BR')}
                            {diasRestantes !== null && diasRestantes <= 30 && (
                              <div className="text-xs">({diasRestantes} dias)</div>
                            )}
                          </>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => abrirModalEditar(produto)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => excluirProduto(produto.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {produtoEditando ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <form onSubmit={salvarProduto} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Código de Barras *</label>
                  <input
                    type="text"
                    required
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Categoria *</label>
                  <select
                    required
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Preço de Compra *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.preco_compra}
                    onChange={(e) => setForm({ ...form, preco_compra: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Preço de Venda *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.preco_venda}
                    onChange={(e) => setForm({ ...form, preco_venda: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Estoque Mínimo *</label>
                  <input
                    type="number"
                    required
                    value={form.estoque_minimo}
                    onChange={(e) => setForm({ ...form, estoque_minimo: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Estoque Atual *</label>
                  <input
                    type="number"
                    required
                    value={form.estoque_atual}
                    onChange={(e) => setForm({ ...form, estoque_atual: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Data de Validade</label>
                <input
                  type="date"
                  value={form.data_validade}
                  onChange={(e) => setForm({ ...form, data_validade: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-success flex-1">
                  💾 Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="btn-danger flex-1"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Categoria */}
      {mostrarModalCategoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>

            <form onSubmit={salvarCategoria} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bebidas, Cervejas, Destilados..."
                  value={formCategoria.nome}
                  onChange={(e) => setFormCategoria({ ...formCategoria, nome: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Descrição</label>
                <textarea
                  rows="3"
                  placeholder="Descrição opcional da categoria"
                  value={formCategoria.descricao}
                  onChange={(e) => setFormCategoria({ ...formCategoria, descricao: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-success flex-1">
                  💾 Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalCategoria(false)}
                  className="btn-danger flex-1"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <Confirm
          message={confirmDelete.message}
          type="danger"
          onConfirm={confirmDelete.type === 'produto' ? confirmarExclusaoProduto : confirmarExclusaoCategoria}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default Estoque;
