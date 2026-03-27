# ✅ Checklist de Instalação - Sistema Paula Bebidas

Siga este checklist para garantir que tudo foi configurado corretamente.

---

## 📝 Pré-Instalação

- [ ] Node.js versão 16+ instalado
  - Comando: `node --version`
  - Link: https://nodejs.org/

- [ ] PostgreSQL versão 12+ instalado
  - Comando: `psql --version`
  - Link: https://www.postgresql.org/download/

- [ ] Git instalado (opcional)
  - Comando: `git --version`

---

## 🗄️ Configuração do Banco de Dados

- [ ] PostgreSQL está rodando (verifique os serviços do Windows)

- [ ] Banco de dados criado
  ```sql
  CREATE DATABASE paula_bebidas;
  ```

- [ ] Usuário criado (opcional)
  ```sql
  CREATE USER paula_admin WITH PASSWORD 'sua_senha_aqui';
  GRANT ALL PRIVILEGES ON DATABASE paula_bebidas TO paula_admin;
  ```

- [ ] Testou a conexão
  ```bash
  psql -U paula_admin -d paula_bebidas
  ```

---

## 🔧 Configuração do Backend

- [ ] Navegou até a pasta do backend
  ```bash
  cd backend
  ```

- [ ] Instalou as dependências
  ```bash
  npm install
  ```

- [ ] Criou o arquivo `.env` baseado no `.env.example`

- [ ] Configurou as variáveis do `.env`:
  - [ ] DB_HOST=localhost
  - [ ] DB_PORT=5432
  - [ ] DB_NAME=paula_bebidas
  - [ ] DB_USER=seu_usuario
  - [ ] DB_PASSWORD=sua_senha
  - [ ] PORT=5000
  - [ ] JWT_SECRET=uma_string_aleatoria_longa

- [ ] Executou as migrações
  ```bash
  npm run migrate
  ```
  - Deve aparecer: "✅ Database migrated successfully!"

- [ ] Testou o backend
  ```bash
  npm start
  ```
  - Backend deve estar em: http://localhost:5000
  - Health check: http://localhost:5000/health

---

## ⚛️ Configuração do Frontend

- [ ] Navegou até a pasta do frontend (em OUTRO terminal)
  ```bash
  cd frontend
  ```

- [ ] Instalou as dependências
  ```bash
  npm install
  ```
  - Pode demorar alguns minutos

- [ ] Iniciou o servidor de desenvolvimento
  ```bash
  npm start
  ```
  - Frontend deve abrir em: http://localhost:3000

---

## ✅ Verificação Final

### Backend (http://localhost:5000)

- [ ] Endpoint de health check responde
  - URL: http://localhost:5000/health
  - Resposta esperada: `{"status": "OK"}`

- [ ] Endpoint de produtos responde
  - URL: http://localhost:5000/api/produtos
  - Deve retornar array com 4 produtos de exemplo

- [ ] Endpoint de categorias responde
  - URL: http://localhost:5000/api/categorias
  - Deve retornar array com 4 categorias

### Frontend (http://localhost:3000)

- [ ] Página inicial carrega sem erros

- [ ] Sidebar está visível com 4 menu items:
  - [ ] Dashboard
  - [ ] PDV
  - [ ] Estoque
  - [ ] Financeiro

- [ ] Header mostra o relógio em tempo real

- [ ] Dashboard exibe:
  - [ ] Cards de estatísticas (vendas, lucro, produtos)
  - [ ] Gráfico de vendas por categoria (Doughnut)
  - [ ] Gráfico de vendas dos últimos 7 dias (Line)
  - [ ] Alertas de estoque baixo
  - [ ] Alertas de produtos próximos ao vencimento

- [ ] PDV funciona:
  - [ ] Campo de código de barras aceita input
  - [ ] Produtos rápidos são exibidos em grid
  - [ ] Consegue adicionar produto ao carrinho
  - [ ] Consegue alterar quantidade (+/-)
  - [ ] Consegue remover produto do carrinho
  - [ ] Consegue finalizar venda (F2 ou botão)

- [ ] Estoque funciona:
  - [ ] Lista de produtos é exibida
  - [ ] Filtro por categoria funciona
  - [ ] Consegue abrir formulário de novo produto
  - [ ] Consegue salvar produto
  - [ ] Consegue editar produto
  - [ ] Consegue excluir produto (com confirmação)

- [ ] Financeiro funciona:
  - [ ] Filtro de datas funciona
  - [ ] Cards de resumo são exibidos
  - [ ] Tabela de vendas é exibida
  - [ ] Modal de detalhes abre ao clicar

---

## 🐛 Solução de Problemas

### ❌ Backend não inicia

- [ ] Verifique as credenciais do `.env`
- [ ] Confirme que o PostgreSQL está rodando
- [ ] Execute novamente: `npm run migrate`
- [ ] Verifique os logs no terminal

### ❌ Frontend não carrega dados

- [ ] Verifique se o backend está rodando (http://localhost:5000/health)
- [ ] Abra o Console do navegador (F12) e veja os erros
- [ ] Confirme que não há erro de CORS

### ❌ Erro de CORS

- [ ] Verifique se o backend está configurado para aceitar `http://localhost:3000`
- [ ] Arquivo: `backend/server.js` → configuração do CORS

### ❌ Produtos não aparecem

- [ ] Execute novamente `npm run migrate` no backend
- [ ] Limpe o cache do navegador (Ctrl+Shift+Delete)
- [ ] Recarregue a página (Ctrl+F5)

---

## 🚀 Scripts Úteis

### Backend
```bash
npm start          # Inicia servidor (produção)
npm run dev        # Inicia com nodemon (desenvolvimento)
npm run migrate    # Executa migrações e dados iniciais
```

### Frontend
```bash
npm start          # Inicia servidor de desenvolvimento
npm run build      # Cria build de produção
npm test           # Executa testes
```

---

## 📊 Dados de Exemplo

Após executar `npm run migrate`, o sistema terá:

- ✅ 4 Categorias
  - Refrigerantes
  - Cervejas
  - Águas
  - Sucos

- ✅ 4 Produtos
  - Coca-Cola 2L (Refrigerantes)
  - Heineken 600ml (Cervejas)
  - Água Mineral 500ml (Águas)
  - Suco de Laranja 1L (Sucos)

Todos com estoque e alguns próximos ao vencimento para testar alertas.

---

## 🎯 Próximos Passos

Após confirmar que tudo está funcionando:

1. [ ] Personalize as categorias conforme seu negócio
2. [ ] Cadastre seus produtos reais
3. [ ] Faça uma venda de teste
4. [ ] Configure backups do banco de dados
5. [ ] Considere implementar autenticação de usuários

---

## 📞 Suporte

Em caso de problemas:

1. Consulte [INSTALACAO.md](INSTALACAO.md) para mais detalhes
2. Consulte [API_REFERENCE.md](API_REFERENCE.md) para entender os endpoints
3. Verifique os logs nos terminais (backend e frontend)
4. Confira o Console do navegador (F12) para erros JavaScript

---

**Sistema Paula Bebidas v2.0** 🍾
Desenvolvido com React + Node.js + PostgreSQL
