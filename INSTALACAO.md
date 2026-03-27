# 📖 Guia de Instalação - Sistema Paula Bebidas

Este guia passo a passo irá te ajudar a instalar e executar o sistema completo (Backend + Frontend + Banco de Dados).

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

1. **Node.js** (versão 16 ou superior)
   - Download: https://nodejs.org/
   - Verifique a instalação: `node --version`

2. **PostgreSQL** (versão 12 ou superior)
   - Download: https://www.postgresql.org/download/
   - Verifique a instalação: `psql --version`

3. **Git** (opcional, para controle de versão)
   - Download: https://git-scm.com/

---

## 🗄️ Passo 1: Configurar o Banco de Dados PostgreSQL

### 1.1 Abra o terminal do PostgreSQL (psql)

No Windows, procure por "SQL Shell (psql)" no menu iniciar.

### 1.2 Crie o banco de dados

```sql
CREATE DATABASE paula_bebidas;
```

### 1.3 Crie um usuário (opcional, mas recomendado)

```sql
CREATE USER paula_admin WITH PASSWORD 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE paula_bebidas TO paula_admin;
```

> **Nota**: Lembre-se da senha que você definir, pois será usada no arquivo `.env`

---

## 🔧 Passo 2: Configurar o Backend

### 2.1 Navegue até a pasta do backend

```bash
cd "c:\Users\Administrador\Desktop\Sistema Paula\backend"
```

### 2.2 Instalar as dependências

```bash
npm install
```

### 2.3 Criar o arquivo de configuração `.env`

Crie um arquivo chamado `.env` na pasta `backend` com o seguinte conteúdo:

```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=paula_bebidas
DB_USER=paula_admin
DB_PASSWORD=senha_segura_aqui

# Configuração do Servidor
PORT=5000
NODE_ENV=development

# JWT Secret (para autenticação futura)
JWT_SECRET=seu_secret_super_secreto_aqui_mude_isso
```

> **Importante**: Substitua `DB_USER` e `DB_PASSWORD` pelos dados que você criou no Passo 1.3

### 2.4 Executar as migrações (criar tabelas)

```bash
npm run migrate
```

Você deve ver uma mensagem: "✅ Database migrated successfully!"

### 2.5 Iniciar o servidor backend

```bash
npm start
```

ou para desenvolvimento (com reinicialização automática):

```bash
npm run dev
```

O servidor deve iniciar na porta 5000. Acesse http://localhost:5000/health para verificar.

---

## ⚛️ Passo 3: Configurar o Frontend React

### 3.1 Abra um NOVO terminal (deixe o backend rodando)

### 3.2 Navegue até a pasta do frontend

```bash
cd "c:\Users\Administrador\Desktop\Sistema Paula\frontend"
```

### 3.3 Instalar as dependências

```bash
npm install
```

Este comando pode demorar alguns minutos, pois irá baixar o React e todas as bibliotecas necessárias.

### 3.4 Iniciar o servidor de desenvolvimento

```bash
npm start
```

O navegador deve abrir automaticamente em http://localhost:3000

---

## ✅ Verificação da Instalação

Se tudo ocorreu bem:

1. ✅ Backend rodando em: http://localhost:5000
2. ✅ Frontend rodando em: http://localhost:3000
3. ✅ Banco de dados PostgreSQL com tabelas criadas
4. ✅ Sistema carregando no navegador com dados de exemplo

---

## 🎯 Primeiros Passos no Sistema

Após a instalação, você pode:

1. **Dashboard**: Ver estatísticas gerais de vendas e alertas
2. **PDV**: Realizar uma venda de teste
3. **Estoque**: Cadastrar novos produtos
4. **Financeiro**: Ver o histórico de vendas

---

## 🐛 Solução de Problemas Comuns

### Erro: "ECONNREFUSED" no backend

**Problema**: O backend não consegue conectar ao PostgreSQL

**Solução**:
- Verifique se o PostgreSQL está rodando (procure por "PostgreSQL" nos serviços do Windows)
- Confirme as credenciais no arquivo `.env`
- Teste a conexão manualmente: `psql -U paula_admin -d paula_bebidas`

### Erro: "Port 3000 is already in use"

**Problema**: Outra aplicação está usando a porta 3000

**Solução**:
- Feche outros programas que possam estar usando a porta
- Ou edite `package.json` do frontend e mude a porta

### Erro: "Module not found"

**Problema**: Dependências não foram instaladas corretamente

**Solução**:
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Backend retorna erro 500

**Problema**: Tabelas não foram criadas no banco de dados

**Solução**:
```bash
# Execute novamente as migrações
cd backend
npm run migrate
```

---

## 📚 Estrutura de Pastas

```
Sistema Paula/
├── backend/
│   ├── src/
│   │   ├── config/       # Configurações (DB, migrations)
│   │   ├── models/       # Modelos de dados
│   │   ├── controllers/  # Lógica de negócio
│   │   └── routes/       # Rotas da API
│   ├── server.js         # Ponto de entrada
│   ├── package.json
│   └── .env              # Variáveis de ambiente (VOCÊ CRIA)
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── pages/        # Páginas principais
│   │   ├── services/     # Integração com API
│   │   ├── App.js        # Componente raiz
│   │   └── index.js      # Ponto de entrada
│   ├── public/
│   └── package.json
│
└── INSTALACAO.md         # Este arquivo
```

---

## 🔐 Segurança

**IMPORTANTE**: Este sistema está configurado para desenvolvimento local. Antes de colocar em produção:

1. Mude todas as senhas e secrets do arquivo `.env`
2. Configure HTTPS
3. Implemente autenticação de usuários
4. Configure CORS adequadamente para seu domínio
5. Use variáveis de ambiente seguras (não comite o `.env` no Git)

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs no terminal do backend
2. Abra o Console do navegador (F12) para ver erros do frontend
3. Consulte a documentação do PostgreSQL: https://www.postgresql.org/docs/

---

## 🚀 Próximos Passos

Após a instalação, você pode:

- Personalizar as categorias de produtos
- Adicionar seus próprios produtos
- Configurar métodos de pagamento
- Implementar relatórios customizados
- Adicionar sistema de autenticação de usuários

---

**Desenvolvido para Paula Bebidas** 🍾
Versão 2.0 - Full Stack (React + Node.js + PostgreSQL)
