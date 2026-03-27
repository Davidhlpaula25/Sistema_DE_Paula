# � Sistema Paula Bebidas - ERP/PDV Full Stack

Sistema completo de gerenciamento empresarial (ERP) e ponto de venda (PDV) para distribuidora de bebidas Paula.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express.js** - API REST
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver PostgreSQL para Node.js
- **CORS** - Controle de acesso entre domínios
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React 18.2** - Biblioteca JavaScript para UI
- **React Router DOM** - Navegação entre páginas
- **Axios** - Cliente HTTP para consumir a API
- **Tailwind CSS** - Framework CSS utilitário
- **Chart.js** + **react-chartjs-2** - Gráficos interativos

## 📁 Estrutura do Projeto

```
Sistema Paula/
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     # Conexão PostgreSQL
│   │   │   └── migrate.js      # Migrations + dados iniciais
│   │   ├── models/
│   │   │   ├── Produto.js      # Model de Produtos
│   │   │   ├── Categoria.js    # Model de Categorias
│   │   │   └── Venda.js        # Model de Vendas
│   │   ├── controllers/
│   │   │   ├── ProdutoController.js
│   │   │   ├── CategoriaController.js
│   │   │   └── VendaController.js
│   │   └── routes/
│   │       ├── produtos.js
│   │       ├── categorias.js
│   │       └── vendas.js
│   ├── server.js               # Ponto de entrada
│   ├── package.json
│   └── .env                    # Configurações (criar)
│
├── frontend/                   # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js      # Menu lateral
│   │   │   └── Header.js       # Cabeçalho + relógio
│   │   ├── pages/
│   │   │   ├── Dashboard.js    # Página inicial
│   │   │   ├── PDV.js          # Ponto de Venda
│   │   │   ├── Estoque.js      # Gestão de produtos
│   │   │   └── Financeiro.js   # Relatórios
│   │   ├── services/
│   │   │   ├── api.js          # Config do Axios
│   │   │   └── index.js        # Services da API
│   │   ├── App.js              # Componente raiz
│   │   ├── index.js            # Ponto de entrada
│   │   └── index.css           # Estilos globais
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── tailwind.config.js
│
├── INSTALACAO.md               # Guia de instalação completo
├── README.md                   # Este arquivo
└── index.html                  # Versão legacy (single file)
```

## 📦 Banco de Dados PostgreSQL

### Estrutura de Tabelas

#### `categorias`
```sql
id SERIAL PRIMARY KEY
nome VARCHAR(100) NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

#### `produtos`
```sql
id SERIAL PRIMARY KEY
codigo VARCHAR(50) UNIQUE NOT NULL
nome VARCHAR(255) NOT NULL
categoria_id INTEGER REFERENCES categorias(id)
custo DECIMAL(10,2) NOT NULL
preco_venda DECIMAL(10,2) NOT NULL
estoque INTEGER NOT NULL
estoque_minimo INTEGER DEFAULT 10
data_validade DATE                    -- 🆕 Controle de validade
imagem_url VARCHAR(500)
ativo BOOLEAN DEFAULT true
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
```

#### `vendas`
```sql
id SERIAL PRIMARY KEY
data_venda TIMESTAMP DEFAULT NOW()
subtotal DECIMAL(10,2) NOT NULL
desconto DECIMAL(10,2) DEFAULT 0
total DECIMAL(10,2) NOT NULL
lucro DECIMAL(10,2) NOT NULL
metodo_pagamento VARCHAR(50)          -- DINHEIRO, PIX, CARTAO_DEBITO, CARTAO_CREDITO
vendedor VARCHAR(100)
observacoes TEXT
created_at TIMESTAMP DEFAULT NOW()
```

#### `venda_itens`
```sql
id SERIAL PRIMARY KEY
venda_id INTEGER REFERENCES vendas(id)
produto_id INTEGER REFERENCES produtos(id)
produto_nome VARCHAR(255) NOT NULL
quantidade INTEGER NOT NULL
preco_unitario DECIMAL(10,2) NOT NULL
custo_unitario DECIMAL(10,2) NOT NULL
subtotal DECIMAL(10,2) NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

## 🎯 Funcionalidades

### 📊 Dashboard
- ✅ Estatísticas de vendas (últimos 7 dias, mês atual)
- ✅ Gráficos interativos (vendas por categoria, tendência de vendas)
- ✅ Alertas de estoque baixo
- ✅ Alertas de produtos próximos ao vencimento (30 dias)
- ✅ Cards com totais de vendas, lucro e quantidade de produtos

### 🛒 PDV (Ponto de Venda)
- ✅ Busca de produtos por código de barras (Enter para adicionar)
- ✅ Produtos rápidos (grid clicável)
- ✅ Carrinho de compras com ajuste de quantidade
- ✅ Seleção de método de pagamento
- ✅ Cálculo automático de desconto e lucro
- ✅ Finalização com F2 (keyboard shortcut)
- ✅ Validação de estoque em tempo real
- ✅ Transações atômicas (rollback em caso de erro)

### 📦 Estoque
- ✅ Listagem completa de produtos
- ✅ Filtro por categorias (sidebar dinâmica)
- ✅ CRUD completo de produtos
- ✅ Campo de data de validade com alertas visuais
- ✅ Badges de status (estoque OK/BAIXO, vencimento urgente)
- ✅ Modal de cadastro/edição
- ✅ Confirmação de exclusão
- ✅ Painel de alertas de vencimento no topo

### 💰 Financeiro
- ✅ Filtro de vendas por período (data início/fim)
- ✅ Resumo financeiro (total vendas, lucro líquido, margem)
- ✅ Histórico detalhado de todas as vendas
- ✅ Modal com detalhes completos da venda
- ✅ Listagem de produtos vendidos por transação
- ✅ Cálculo de ticket médio
- ✅ Badges coloridos por método de pagamento

## 🔌 API Endpoints

### Produtos
```
GET    /api/produtos                    # Listar todos
GET    /api/produtos/:id                # Buscar por ID
GET    /api/produtos/codigo/:codigo     # Buscar por código
GET    /api/produtos/categoria/:id      # Filtrar por categoria
GET    /api/produtos/estoque-baixo      # Produtos com estoque baixo
GET    /api/produtos/vencimento/:dias   # Produtos vencendo em X dias
POST   /api/produtos                    # Criar produto
PUT    /api/produtos/:id                # Atualizar produto
PATCH  /api/produtos/:id/estoque        # Atualizar apenas estoque
DELETE /api/produtos/:id                # Deletar (soft delete)
```

### Categorias
```
GET    /api/categorias                  # Listar todas
GET    /api/categorias/:id              # Buscar por ID
POST   /api/categorias                  # Criar categoria
PUT    /api/categorias/:id              # Atualizar categoria
DELETE /api/categorias/:id              # Deletar categoria
```

### Vendas
```
GET    /api/vendas                      # Listar todas
GET    /api/vendas/:id                  # Buscar por ID (com itens)
GET    /api/vendas/periodo?inicio=&fim= # Filtrar por período
GET    /api/vendas/estatisticas         # Estatísticas dashboard
GET    /api/vendas/categorias           # Vendas por categoria
GET    /api/vendas/ultimos-dias/:dias   # Vendas dos últimos X dias
POST   /api/vendas                      # Criar venda (transação)
```

## 🎨 Design System

### Paleta de Cores
```css
--primary-500: #3b82f6    /* Azul principal */
--success-500: #10b981    /* Verde sucesso */
--warning-500: #f59e0b    /* Laranja alerta */
--danger-500: #ef4444     /* Vermelho erro */
--sidebar: #0b1437        /* Azul escuro sidebar */
```

### Tipografia
- **Fonte**: Plus Jakarta Sans (Google Fonts)
- **Pesos**: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

### Componentes
- **Cards Premium**: `rounded-3xl` (2rem) com sombra suave
- **Botões**: Arredondados com transições suaves
- **Badges**: Status coloridos e arredondados
- **Tabelas**: Zebradas com hover interativo

## 🚀 Como Executar

### Instalação Rápida

1. **Instale o PostgreSQL e crie o banco de dados**
2. **Configure o Backend**:
   ```bash
   cd backend
   npm install
   # Crie o arquivo .env (veja INSTALACAO.md)
   npm run migrate
   npm start
   ```

3. **Configure o Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Acesse**: http://localhost:3000

📘 **Guia completo**: Veja [INSTALACAO.md](INSTALACAO.md) para instruções detalhadas.

## 🔐 Segurança

- ⚠️ **IMPORTANTE**: Configure o arquivo `.env` com senhas fortes
- ⚠️ **NUNCA** comite o arquivo `.env` no Git
- ⚠️ Para produção: Configure HTTPS, autenticação JWT, validação de entrada
- ⚠️ Implemente controle de acesso por níveis de usuário

## 📈 Métricas do Sistema

- **Backend**: ~2.500 linhas de código (TypeScript-ready)
    │   ├── renderTabelaProdutos()
    │   ├── mostrarFormProduto()
    │   ├── salvarProduto()
    │   ├── editarProduto()
    │   ├── deletarProduto()
    │   └── mostrarNovaCategoria()
    │
    ├── MÓDULO: FINANCEIRO
    │   ├── renderFinanceiro()
    │   ├── filtrarFinanceiro()
    │   ├── renderTabelaVendas()
    │   └── verDetalhesVenda()
    │
    └── UTILITÁRIOS
        ├── formatMoeda()
        ├── getProdutosAVencer()
        └── calcularDiasAteVencer()
```

## 🗃️ Modelo de Dados

### Produto
```javascript
{
    id: Number,           // ID único
    cod: String,          // Código do produto (para bipagem)
    nome: String,         // Nome do produto
    cat: String,          // Categoria
    validade: String,     // Data de validade (YYYY-MM-DD)
    custo: Number,        // Preço de custo
    venda: Number,        // Preço de venda
    estoque: Number,      // Quantidade em estoque
    min: Number          // Estoque mínimo
}
```

### Venda
```javascript
{
    id: Number,           // Timestamp da venda
    data: String,         // ISO DateTime
    itens: Array,         // Array de produtos vendidos
    total: Number,        // Valor total
    lucro: Number,        // Lucro da venda
    metodo: String       // Método de pagamento
}
```

## ✨ Funcionalidades

### 📊 Dashboard
- **Cards de Resumo**: Faturamento, Lucro, Produtos em Estoque
- **Gráficos**: Vendas por categoria e faturamento semanal
- **Alertas**: Produtos com estoque baixo e próximos ao vencimento

### 🛒 PDV
- Campo de bipagem rápida (Enter para adicionar)
- Carrinho com ajuste de quantidade
- Atalho F2 para finalizar venda
- Baixa automática de estoque

### 📦 Estoque
- CRUD completo de produtos
- **Campo de Validade**: Controle de vencimento
- Filtros por categoria
- Alertas visuais de produtos a vencer
- Indicadores de estoque baixo

### 💰 Financeiro
- Filtro por período (data início/fim)
- Relatórios de vendas
- Cálculo de lucro líquido

## 🔔 Sistema de Alertas de Vencimento

### Configuração
```javascript
State.diasAlertaVencimento = 30; // Alertar produtos que vencem em até 30 dias
```

### Níveis de Alerta
- **🔴 URGENTE**: Produtos que vencem em até 7 dias
- **🟠 ATENÇÃO**: Produtos que vencem em 8-15 dias
- **🟡 ALERTA**: Produtos que vencem em 16-30 dias

### Onde Aparecem
1. **Dashboard**: Card dedicado "Produtos Próximos ao Vencimento"
2. **Estoque**: Seção de alertas com detalhes completos
3. **Tabela de Produtos**: Destaque visual em amarelo + badge

## 💾 Persistência

Todos os dados são salvos automaticamente no `localStorage`:
- `db_prod`: Produtos
- `db_cat`: Categorias
- `db_vendas`: Vendas

## ⌨️ Atalhos de Teclado

- **F2**: Finalizar venda no PDV
- **Enter**: Adicionar produto ao carrinho (campo de bipagem)

## 🎨 Design

### Paleta de Cores
- Fundo: `#f8fafc`
- Sidebar: `#0b1437`
- Primário (Blue): `#3b82f6`
- Sucesso (Green): `#10b981`
- Alerta (Orange): `#f59e0b`
- Perigo (Red): `#ef4444`

### Tipografia
- Fonte: `Plus Jakarta Sans`
- Bordas: `rounded-[2rem]` (super arredondadas)
- Sombras suaves

## 🔧 Manutenção

### Para Adicionar Nova Funcionalidade

1. **Criar função no módulo apropriado**
2. **Adicionar comentário de seção se necessário**
3. **Atualizar State se precisar de novos dados**
4. **Chamar save() após modificações de dados**

### Exemplo: Adicionar novo campo em Produto

```javascript
// 1. Atualizar dados de exemplo em carregarDadosExemplo()
{
    // ... campos existentes
    novoCampo: valor
}

// 2. Adicionar input no formulário HTML
<input type="text" id="prod-novocampo" class="w-full">

// 3. Atualizar salvarProduto()
const novoCampo = document.getElementById('prod-novocampo').value;
produto.novoCampo = novoCampo;

// 4. Atualizar editarProduto()
document.getElementById('prod-novocampo').value = produto.novoCampo;

// 5. Atualizar renderTabelaProdutos() se necessário
```

## 📝 Boas Práticas

- ✅ Sempre use `this.save()` após modificar dados
- ✅ Use `this.state` para acessar dados globais
- ✅ Separe lógica de negócio de renderização UI
- ✅ Adicione comentários em funções complexas
- ✅ Mantenha funções pequenas e focadas

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. Dados de exemplo serão carregados automaticamente
3. Navegue pelos módulos usando a sidebar
4. Todos os dados são salvos automaticamente

## 📦 Dependências

- **Tailwind CSS**: Framework CSS (via CDN)
- **Chart.js**: Biblioteca de gráficos (via CDN)
- **Google Fonts**: Plus Jakarta Sans

---

**Desenvolvido para David Distribuidora de Bebidas** 🍺
#   S i s t e m a _ D E _ P a u l a  
 