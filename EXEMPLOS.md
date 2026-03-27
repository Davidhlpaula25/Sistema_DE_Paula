# 🎨 Exemplos de Customização

## 1. Adicionar Desconto no PDV

### Passo 1: Adicionar campo no HTML do PDV

Localize a seção "Resumo" no PDV (linha ~395) e adicione:

```html
<div class="pt-4 border-t">
    <label class="block text-sm font-semibold text-slate-700 mb-2">Desconto (%)</label>
    <input type="number" id="desconto-percentual" class="w-full" value="0" min="0" max="100">
</div>
```

### Passo 2: Modificar função atualizarCarrinho()

```javascript
atualizarCarrinho() {
    const tbody = document.getElementById('carrinho-items');
    const subtotal = this.state.carrinho.reduce((sum, item) => sum + (item.preco * item.qtd), 0);
    
    // Calcular desconto
    const descontoPercent = parseFloat(document.getElementById('desconto-percentual')?.value || 0);
    const valorDesconto = (subtotal * descontoPercent) / 100;
    const total = subtotal - valorDesconto;

    // ... resto do código

    document.getElementById('resumo-subtotal').textContent = this.formatMoeda(subtotal);
    document.getElementById('resumo-total').textContent = this.formatMoeda(total);
}
```

### Passo 3: Atualizar addVenda()

```javascript
addVenda() {
    // ... código existente
    
    const subtotal = this.state.carrinho.reduce((sum, item) => sum + (item.preco * item.qtd), 0);
    const descontoPercent = parseFloat(document.getElementById('desconto-percentual')?.value || 0);
    const valorDesconto = (subtotal * descontoPercent) / 100;
    const total = subtotal - valorDesconto;
    
    // ... resto do código
    
    const venda = {
        id: Date.now(),
        data: new Date().toISOString(),
        itens: [...this.state.carrinho],
        subtotal: subtotal,
        desconto: valorDesconto,
        total: total,
        lucro: lucro,
        metodo: metodo
    };
}
```

## 2. Adicionar Imagem ao Produto

### Passo 1: Atualizar modelo de dados

```javascript
// Em carregarDadosExemplo()
{
    id: 1,
    cod: '001',
    nome: 'Brahma Latão 473ml',
    imagem: 'https://exemplo.com/brahma.jpg', // Nova propriedade
    // ... outros campos
}
```

### Passo 2: Adicionar input no formulário

```html
<div class="col-span-2">
    <label class="block text-sm font-semibold text-slate-700 mb-2">URL da Imagem</label>
    <input type="url" id="prod-imagem" class="w-full" placeholder="https://exemplo.com/imagem.jpg">
</div>
```

### Passo 3: Atualizar salvarProduto() e editarProduto()

```javascript
// Em salvarProduto()
const imagem = document.getElementById('prod-imagem').value;
produto.imagem = imagem || null;

// Em editarProduto()
document.getElementById('prod-imagem').value = produto.imagem || '';
```

### Passo 4: Mostrar imagem nos produtos rápidos do PDV

```javascript
renderProdutosRapidos() {
    // ...
    container.innerHTML = produtos.map(p => `
        <button onclick="App.adicionarAoCarrinho('${p.cod}')" 
                class="card-premium p-4 text-left hover:shadow-lg transition-all">
            ${p.imagem ? `<img src="${p.imagem}" class="w-full h-24 object-cover rounded-lg mb-2">` : ''}
            <div class="font-bold text-slate-800 text-sm mb-1">${p.nome}</div>
            <!-- ... resto -->
        </button>
    `).join('');
}
```

## 3. Sistema de Código de Barras Real

### Passo 1: Atualizar input de bipagem

```javascript
setupKeyboard() {
    // ... código existente
    
    let codigoBuffer = '';
    let ultimaTecla = Date.now();
    
    document.addEventListener('keypress', (e) => {
        const agora = Date.now();
        
        // Se passou mais de 100ms, é digitação manual
        if (agora - ultimaTecla > 100) {
            codigoBuffer = '';
        }
        
        if (e.key === 'Enter' && codigoBuffer.length > 3) {
            // É um código de barras
            this.adicionarAoCarrinho(codigoBuffer);
            codigoBuffer = '';
        } else {
            codigoBuffer += e.key;
        }
        
        ultimaTecla = agora;
    });
}
```

## 4. Exportar Relatório para Excel

### Adicionar botão no Financeiro

```html
<button onclick="App.exportarExcel()" class="btn-success">
    📊 Exportar para Excel
</button>
```

### Adicionar função exportarExcel()

```javascript
exportarExcel() {
    const dataInicio = document.getElementById('data-inicio').value;
    const dataFim = document.getElementById('data-fim').value;
    
    let vendasFiltradas = this.state.vendas;
    if (dataInicio && dataFim) {
        vendasFiltradas = this.state.vendas.filter(v => {
            const dataVenda = v.data.split('T')[0];
            return dataVenda >= dataInicio && dataVenda <= dataFim;
        });
    }
    
    // Criar CSV
    let csv = 'ID,Data,Hora,Itens,Total,Lucro,Metodo\n';
    vendasFiltradas.forEach(v => {
        const data = new Date(v.data);
        csv += `${v.id},${data.toLocaleDateString('pt-BR')},${data.toLocaleTimeString('pt-BR')},${v.itens.length},${v.total},${v.lucro},"${v.metodo}"\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendas_${dataInicio}_${dataFim}.csv`;
    a.click();
}
```

## 5. Sistema de Notificações

### Adicionar HTML para notificações

```html
<!-- Adicionar antes do </body> -->
<div id="notificacoes" class="fixed top-4 right-4 z-50 space-y-2"></div>
```

### Adicionar CSS

```css
.notificacao {
    background: white;
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out;
    min-width: 300px;
}

@keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
```

### Adicionar função notificar()

```javascript
notificar(mensagem, tipo = 'info') {
    const cores = {
        sucesso: 'green',
        erro: 'red',
        info: 'blue',
        alerta: 'yellow'
    };
    
    const cor = cores[tipo] || 'blue';
    
    const notif = document.createElement('div');
    notif.className = `notificacao border-l-4 border-${cor}-500`;
    notif.innerHTML = `
        <div class="font-bold text-${cor}-800">${mensagem}</div>
    `;
    
    document.getElementById('notificacoes').appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Usar em addVenda()
addVenda() {
    // ... código existente
    this.notificar(`Venda finalizada! Total: ${this.formatMoeda(total)}`, 'sucesso');
}
```

## 6. Múltiplos Usuários (Vendedores)

### Adicionar campo vendedor

```javascript
// No State
vendedorAtual: localStorage.getItem('vendedor_atual') || 'Caixa 1',
vendedores: ['Caixa 1', 'Caixa 2', 'Gerente']

// No header, adicionar select
<select id="select-vendedor" onchange="App.trocarVendedor()" class="border px-4 py-2 rounded-xl">
    <option>Caixa 1</option>
    <option>Caixa 2</option>
    <option>Gerente</option>
</select>

// Função
trocarVendedor() {
    this.state.vendedorAtual = document.getElementById('select-vendedor').value;
    localStorage.setItem('vendedor_atual', this.state.vendedorAtual);
}

// Em addVenda()
const venda = {
    // ... campos existentes
    vendedor: this.state.vendedorAtual
};
```

## 7. Backup Automático

### Adicionar botão na sidebar

```html
<button onclick="App.fazerBackup()" class="w-full text-left px-6 py-4 rounded-[1.5rem] font-semibold transition-all hover:bg-slate-800">
    💾 Fazer Backup
</button>
```

### Adicionar funções de backup

```javascript
fazerBackup() {
    const backup = {
        data: new Date().toISOString(),
        produtos: this.state.produtos,
        categorias: this.state.categorias,
        vendas: this.state.vendas
    };
    
    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    alert('Backup realizado com sucesso!');
}

restaurarBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const backup = JSON.parse(event.target.result);
                this.state.produtos = backup.produtos;
                this.state.categorias = backup.categorias;
                this.state.vendas = backup.vendas;
                this.save();
                alert('Backup restaurado com sucesso!');
                location.reload();
            } catch (error) {
                alert('Erro ao restaurar backup!');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
```

## 8. Modo Escuro

### Adicionar toggle no header

```html
<button onclick="App.toggleModoEscuro()" id="btn-modo-escuro" class="bg-white border p-3 rounded-2xl">
    🌙
</button>
```

### Adicionar CSS

```css
body.dark-mode {
    background-color: #0f172a;
    color: #e2e8f0;
}

body.dark-mode .card-premium {
    background: #1e293b;
    color: #e2e8f0;
}

body.dark-mode input,
body.dark-mode select {
    background: #334155;
    color: #e2e8f0;
    border-color: #475569;
}
```

### Adicionar função

```javascript
toggleModoEscuro() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('modo-escuro', isDark);
    document.getElementById('btn-modo-escuro').textContent = isDark ? '☀️' : '🌙';
}

// Em init()
if (localStorage.getItem('modo-escuro') === 'true') {
    this.toggleModoEscuro();
}
```

---

## 💡 Dicas

1. **Teste sempre** após cada modificação
2. **Faça backup** antes de mudanças grandes
3. **Use comentários** para marcar suas alterações
4. **Mantenha consistência** de estilo com o código existente

## 🔗 Recursos Úteis

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Docs](https://www.chartjs.org/docs)
- [MDN JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

---

**Use esses exemplos como base e adapte conforme suas necessidades!**
