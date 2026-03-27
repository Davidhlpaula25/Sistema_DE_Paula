# 🔧 Guia Rápido de Manutenção

## 📍 Localização Rápida no Código

### Estrutura do arquivo index.html

```
Lines 1-80:    HTML - Estrutura e Estilos
Lines 81-200:  HTML - Sidebar e Header
Lines 201-350: HTML - Dashboard
Lines 351-450: HTML - PDV
Lines 451-600: HTML - Estoque
Lines 601-700: HTML - Financeiro

Lines 701+:    JAVASCRIPT
  - State Global
  - Métodos App (organizados por módulo)
```

## 🎯 Tarefas Comuns

### 1️⃣ Alterar dias de alerta de vencimento

**Arquivo**: `index.html`  
**Linha**: ~710

```javascript
State.diasAlertaVencimento = 30; // Mudar valor aqui
```

### 2️⃣ Adicionar nova categoria padrão

**Arquivo**: `index.html`  
**Linha**: ~708

```javascript
categorias: [..., "NovaCategoria"]
```

### 3️⃣ Mudar cores do tema

**Arquivo**: `index.html`  
**Seção**: `<style>` (linhas 7-45)

```css
/* Principais variáveis de cor */
.sidebar-active { background: #3b82f6; }  /* Azul */
.btn-success { background: #10b981; }     /* Verde */
```

### 4️⃣ Adicionar campo no produto

**Localização das mudanças**:

1. **State** (linha ~707): Adicionar ao modelo de dados
2. **Formulário HTML** (linha ~480): Adicionar input
3. **salvarProduto()** (linha ~1100): Capturar valor
4. **editarProduto()** (linha ~1140): Preencher ao editar
5. **renderTabelaProdutos()** (linha ~1000): Mostrar na tabela

**Exemplo completo**:

```javascript
// 1. No carregarDadosExemplo() - adicionar campo
{id: 1, ..., novoCampo: 'valor'}

// 2. No HTML do formulário
<div>
    <label>Novo Campo</label>
    <input type="text" id="prod-novocampo" class="w-full">
</div>

// 3. No salvarProduto()
const novoCampo = document.getElementById('prod-novocampo').value;
produto.novoCampo = novoCampo;

// 4. No editarProduto()
document.getElementById('prod-novocampo').value = produto.novoCampo || '';

// 5. No renderTabelaProdutos()
<td>${p.novoCampo}</td>
```

### 5️⃣ Modificar cálculo de lucro

**Arquivo**: `index.html`  
**Função**: `addVenda()` (linha ~940)

```javascript
const lucro = this.state.carrinho.reduce((sum, item) => 
    sum + ((item.preco - item.custo) * item.qtd), 0
);
// Modifique a fórmula acima conforme necessário
```

### 6️⃣ Adicionar novo método de pagamento

**Arquivo**: `index.html`  
**Linha**: ~395 (no HTML do select)

```html
<select id="metodo-pagamento" class="w-full">
    <option value="Dinheiro">Dinheiro</option>
    <!-- Adicionar aqui -->
    <option value="NovoMetodo">Novo Método</option>
</select>
```

### 7️⃣ Modificar gráficos do Dashboard

**Arquivo**: `index.html`

**Gráfico de Categorias** → `renderChartCategorias()` (linha ~860)  
**Gráfico de Vendas** → `renderChartVendas()` (linha ~885)

```javascript
// Mudar tipo de gráfico
new Chart(ctx, {
    type: 'bar', // mude para: line, bar, pie, doughnut, etc
    // ...
});
```

### 8️⃣ Adicionar validação no cadastro

**Arquivo**: `index.html`  
**Função**: `salvarProduto()` (linha ~1100)

```javascript
// Adicionar após capturar os campos
if (venda < custo) {
    alert('Preço de venda não pode ser menor que o custo!');
    return;
}
```

### 9️⃣ Mudar formato de data

**Arquivo**: `index.html`  
**Função**: `formatMoeda()` e criar `formatData()`

```javascript
// Adicionar nova função utilitária
formatData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}
```

### 🔟 Adicionar nova página/módulo

**Passos**:

1. **HTML**: Adicionar `<div id="page-novomodulo" class="tab-content">`
2. **Sidebar**: Adicionar botão de navegação
3. **navigate()**: Adicionar título no objeto `titles`
4. **App**: Criar função `renderNovoModulo()`
5. **navigate()**: Adicionar chamada `if (page === 'novomodulo')`

## 🐛 Debug

### Ver dados salvos no navegador

1. Abra **DevTools** (F12)
2. Vá para **Application → Local Storage**
3. Procure por: `db_prod`, `db_cat`, `db_vendas`

### Limpar dados e reiniciar

```javascript
// Cole no Console do navegador:
localStorage.clear();
location.reload();
```

### Ver erros JavaScript

1. Abra **DevTools** (F12)
2. Vá para **Console**
3. Veja mensagens de erro em vermelho

## 📊 Estrutura de Módulos

```
INICIALIZAÇÃO
├─ init()                    → Inicializa tudo
├─ carregarDadosExemplo()    → Cria produtos exemplo
├─ setupClock()              → Relógio em tempo real
└─ setupKeyboard()           → Atalhos de teclado

DASHBOARD
├─ renderDash()              → Renderiza tudo
├─ renderEstoqueBaixo()      → Card de alertas
├─ renderProdutosAVencer()   → Card de vencimento
├─ renderChartCategorias()   → Gráfico rosca
└─ renderChartVendas()       → Gráfico linha

PDV
├─ renderPDV()               → Renderiza tela
├─ adicionarAoCarrinho()     → Adiciona item
├─ alterarQtdCarrinho()      → +/- quantidade
├─ removerDoCarrinho()       → Remove item
├─ atualizarCarrinho()       → Atualiza UI
├─ limparCarrinho()          → Limpa tudo
└─ addVenda()                → Finaliza (F2)

ESTOQUE
├─ renderEstoque()           → Renderiza tela
├─ renderAlertasVencimento() → Alertas de validade
├─ renderTabelaProdutos()    → Tabela principal
├─ mostrarFormProduto()      → Abre formulário
├─ salvarProduto()           → Salva novo/edita
├─ editarProduto()           → Preenche form
├─ deletarProduto()          → Remove produto
└─ filtrarCategoria()        → Filtra tabela

FINANCEIRO
├─ renderFinanceiro()        → Renderiza tela
├─ filtrarFinanceiro()       → Filtra período
└─ renderTabelaVendas()      → Lista vendas

UTILITÁRIOS
├─ formatMoeda()             → Formata R$
├─ getProdutosAVencer()      → Busca produtos
├─ calcularDiasAteVencer()   → Calcula dias
├─ save()                    → Salva localStorage
└─ navigate()                → Navega páginas
```

## ⚡ Dicas de Performance

1. **Não** chame `save()` dentro de loops
2. **Evite** renderizar tudo ao atualizar um item
3. **Use** `getElementById` ao invés de `querySelector` quando possível
4. **Limite** histórico de vendas se ficar muito grande

## 🔒 Segurança

> ⚠️ **Importante**: Este sistema é para uso local. Não contém:
> - Autenticação de usuários
> - Criptografia de dados
> - Validação contra SQL injection (não usa banco)

Para uso em produção, considere:
- Backend com banco de dados real
- Sistema de login
- API REST
- Backup automático

---

**Última atualização**: 26/03/2026
