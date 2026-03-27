# 🔌 API Reference - Sistema Paula Bebidas

Documentação completa da API REST do backend.

**Base URL**: `http://localhost:5000/api`

---

## 📦 Produtos

### `GET /produtos`
Lista todos os produtos ativos com informações de categoria.

**Response:**
```json
[
  {
    "id": 1,
    "codigo": "7891234567890",
    "nome": "Coca-Cola 2L",
    "categoria_id": 1,
    "categoria_nome": "Refrigerantes",
    "custo": 5.50,
    "preco_venda": 8.00,
    "estoque": 150,
    "estoque_minimo": 20,
    "data_validade": "2025-12-31",
    "imagem_url": null,
    "ativo": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### `GET /produtos/:id`
Busca um produto específico por ID.

**Params:**
- `id` (integer) - ID do produto

**Response:**
```json
{
  "id": 1,
  "codigo": "7891234567890",
  "nome": "Coca-Cola 2L",
  "categoria_id": 1,
  "categoria_nome": "Refrigerantes",
  "custo": 5.50,
  "preco_venda": 8.00,
  "estoque": 150,
  "estoque_minimo": 20,
  "data_validade": "2025-12-31"
}
```

**Errors:**
- `404` - Produto não encontrado

---

### `GET /produtos/codigo/:codigo`
Busca produto por código de barras.

**Params:**
- `codigo` (string) - Código de barras do produto

**Response:** (mesmo formato de GET /produtos/:id)

**Errors:**
- `404` - Produto não encontrado

---

### `GET /produtos/categoria/:id`
Lista todos os produtos de uma categoria específica.

**Params:**
- `id` (integer) - ID da categoria

**Response:** Array de produtos (mesmo formato de GET /produtos)

---

### `GET /produtos/estoque-baixo`
Lista produtos com estoque igual ou inferior ao estoque mínimo.

**Response:** Array de produtos (mesmo formato de GET /produtos)

---

### `GET /produtos/vencimento/:dias`
Lista produtos que vencem nos próximos X dias.

**Params:**
- `dias` (integer) - Número de dias (ex: 30 para produtos vencendo em 30 dias)

**Response:**
```json
[
  {
    "id": 5,
    "codigo": "7890123456789",
    "nome": "Leite Integral 1L",
    "categoria_nome": "Lácteos",
    "estoque": 45,
    "data_validade": "2024-02-05",
    "dias_restantes": 14
  }
]
```

---

### `POST /produtos`
Cria um novo produto.

**Body:**
```json
{
  "codigo": "7891234567890",
  "nome": "Coca-Cola 2L",
  "categoria_id": 1,
  "custo": 5.50,
  "preco_venda": 8.00,
  "estoque": 150,
  "estoque_minimo": 20,
  "data_validade": "2025-12-31"  // Opcional
}
```

**Response:**
```json
{
  "id": 10,
  "codigo": "7891234567890",
  "nome": "Coca-Cola 2L",
  ...
}
```

**Errors:**
- `400` - Dados inválidos
- `409` - Código de produto já existe

---

### `PUT /produtos/:id`
Atualiza um produto existente.

**Params:**
- `id` (integer) - ID do produto

**Body:** (mesmo formato do POST, todos os campos)

**Response:** Produto atualizado

**Errors:**
- `404` - Produto não encontrado
- `400` - Dados inválidos

---

### `PATCH /produtos/:id/estoque`
Atualiza APENAS o estoque de um produto.

**Params:**
- `id` (integer) - ID do produto

**Body:**
```json
{
  "quantidade": 100  // Novo valor do estoque
}
```

**Response:** Produto com estoque atualizado

---

### `DELETE /produtos/:id`
Deleta um produto (soft delete - marca como inativo).

**Params:**
- `id` (integer) - ID do produto

**Response:**
```json
{
  "message": "Produto deletado com sucesso"
}
```

**Errors:**
- `404` - Produto não encontrado

---

## 🏷️ Categorias

### `GET /categorias`
Lista todas as categorias.

**Response:**
```json
[
  {
    "id": 1,
    "nome": "Refrigerantes",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### `GET /categorias/:id`
Busca uma categoria por ID.

**Response:** Objeto categoria

---

### `POST /categorias`
Cria uma nova categoria.

**Body:**
```json
{
  "nome": "Energéticos"
}
```

**Response:** Categoria criada

---

### `PUT /categorias/:id`
Atualiza uma categoria.

**Body:**
```json
{
  "nome": "Bebidas Energéticas"
}
```

---

### `DELETE /categorias/:id`
Deleta uma categoria (apenas se não tiver produtos).

**Errors:**
- `400` - Categoria possui produtos vinculados

---

## 💵 Vendas

### `GET /vendas`
Lista todas as vendas ordenadas por data (mais recentes primeiro).

**Response:**
```json
[
  {
    "id": 1,
    "data_venda": "2024-01-22T14:30:00.000Z",
    "subtotal": 100.00,
    "desconto": 5.00,
    "total": 95.00,
    "lucro": 30.00,
    "metodo_pagamento": "PIX",
    "vendedor": "João Silva",
    "observacoes": null,
    "total_itens": 3,
    "created_at": "2024-01-22T14:30:00.000Z"
  }
]
```

---

### `GET /vendas/:id`
Busca uma venda específica com todos os itens.

**Response:**
```json
{
  "id": 1,
  "data_venda": "2024-01-22T14:30:00.000Z",
  "subtotal": 100.00,
  "desconto": 5.00,
  "total": 95.00,
  "lucro": 30.00,
  "metodo_pagamento": "PIX",
  "vendedor": "João Silva",
  "observacoes": null,
  "itens": [
    {
      "id": 1,
      "produto_id": 3,
      "produto_nome": "Coca-Cola 2L",
      "quantidade": 2,
      "preco_unitario": 8.00,
      "custo_unitario": 5.50,
      "subtotal": 16.00
    }
  ]
}
```

---

### `GET /vendas/periodo`
Busca vendas em um período específico.

**Query Params:**
- `inicio` (date) - Data inicial (YYYY-MM-DD)
- `fim` (date) - Data final (YYYY-MM-DD)

**Exemplo:**
```
GET /vendas/periodo?inicio=2024-01-01&fim=2024-01-31
```

**Response:** Array de vendas

---

### `GET /vendas/estatisticas`
Retorna estatísticas agregadas de vendas.

**Response:**
```json
{
  "vendas_hoje": 5,
  "total_hoje": 450.00,
  "lucro_hoje": 120.00,
  "vendas_semana": 35,
  "total_semana": 3200.00,
  "lucro_semana": 890.00,
  "vendas_mes": 150,
  "total_mes": 14500.00,
  "lucro_mes": 4200.00
}
```

---

### `GET /vendas/categorias`
Vendas agregadas por categoria.

**Response:**
```json
[
  {
    "categoria_id": 1,
    "categoria_nome": "Refrigerantes",
    "total_vendido": 8500.00,
    "quantidade": 320
  }
]
```

---

### `GET /vendas/ultimos-dias/:dias`
Vendas dos últimos X dias (para gráficos).

**Params:**
- `dias` (integer) - Número de dias (ex: 7 para última semana)

**Response:**
```json
[
  {
    "data": "2024-01-15",
    "total": 450.00,
    "lucro": 120.00,
    "quantidade_vendas": 12
  },
  {
    "data": "2024-01-16",
    "total": 380.00,
    "lucro": 95.00,
    "quantidade_vendas": 8
  }
]
```

---

### `POST /vendas`
Cria uma nova venda (transação atômica).

**Body:**
```json
{
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 5,
      "quantidade": 1
    }
  ],
  "subtotal": 100.00,
  "desconto": 5.00,
  "total": 95.00,
  "lucro": 30.00,
  "metodo_pagamento": "PIX",
  "vendedor": "João Silva",
  "observacoes": "Cliente pagou com Pix"  // Opcional
}
```

**Response:**
```json
{
  "id": 42,
  "data_venda": "2024-01-22T14:35:00.000Z",
  "total": 95.00,
  "lucro": 30.00
}
```

**Errors:**
- `400` - Dados inválidos ou estoque insuficiente
- `500` - Erro ao processar transação (rollback automático)

**Comportamento:**
- ✅ Valida estoque antes de criar a venda
- ✅ Cria registro de venda
- ✅ Cria registros de venda_itens
- ✅ Atualiza estoque automaticamente
- ✅ Rollback completo em caso de erro

---

## 🔐 Autenticação

> **Status**: Preparado mas não implementado

Endpoints de autenticação preparados (JWT + bcrypt):
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /auth/me` - Perfil do usuário logado

---

## ⚠️ Códigos de Status HTTP

- `200 OK` - Sucesso
- `201 Created` - Recurso criado
- `400 Bad Request` - Dados inválidos
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: código duplicado)
- `500 Internal Server Error` - Erro no servidor

---

## 🧪 Testando a API

### Com cURL:

```bash
# Listar produtos
curl http://localhost:5000/api/produtos

# Buscar produto por ID
curl http://localhost:5000/api/produtos/1

# Criar produto
curl -X POST http://localhost:5000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "123456",
    "nome": "Teste",
    "categoria_id": 1,
    "custo": 5,
    "preco_venda": 10,
    "estoque": 100,
    "estoque_minimo": 10
  }'
```

### Com Postman/Insomnia:

1. Importe a Collection (criar arquivo JSON separado)
2. Configure a base URL: `http://localhost:5000/api`
3. Teste cada endpoint

---

## 📝 Notas Importantes

- **Soft Delete**: Produtos deletados são marcados como `ativo = false`, não removidos do banco
- **Transações**: Vendas usam transações do PostgreSQL para garantir consistência
- **JOIN Automático**: Produtos sempre retornam o nome da categoria
- **Timezone**: Todas as datas em UTC, converter no frontend
- **Validação**: Validação básica implementada, adicione express-validator para produção
- **CORS**: Habilitado para `http://localhost:3000` (dev), configure para produção

---

**Última atualização**: Janeiro 2024
**Versão da API**: 2.0
