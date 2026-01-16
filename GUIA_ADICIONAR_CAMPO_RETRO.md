# 🔧 Guia: Adicionar Campo is_retro no Supabase

## ✅ O que foi implementado

O campo `is_retro` já está **totalmente implementado** no código frontend:

1. ✅ **Types** (`src/types.ts`) - Interface Product tem `is_retro?: boolean`
2. ✅ **Admin Panel** (`src/pages/admin/Products.tsx`) - Toggle "É Camisa Retrô?" no formulário
3. ✅ **Catálogo** (`src/pages/Catalog.tsx`) - Filtro para produtos retro
4. ✅ **Home** (`src/pages/Home.tsx`) - Banner "Camisas Retrô" com link para `/retro`

## 🚨 O que falta fazer

Você precisa **adicionar o campo no banco de dados Supabase**. Siga os passos abaixo:

---

## 📋 Passo a Passo

### 1️⃣ Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto **DLSPORTS**

### 2️⃣ Abra o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New Query"**

### 3️⃣ Execute a Migration
- Copie **TODO** o conteúdo do arquivo `add_retro_field_migration.sql`
- Cole no editor SQL
- Clique em **"Run"** (ou pressione Ctrl+Enter)

### 4️⃣ Verifique se funcionou
Execute esta query para confirmar:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('is_retro', 'is_offer', 'is_selection', 'is_new', 'old_price', 'back_image_url', 'sort_order');
```

Você deve ver todas essas colunas listadas.

---

## 🎯 Como usar depois

### No Admin Panel:
1. Vá para `/admin/products`
2. Crie ou edite um produto
3. Ative o toggle **"É Camisa Retrô?"**
4. Salve o produto

### No Site:
- Clique no banner **"Camisas Retrô"** na home
- Ou acesse diretamente `/retro`
- Apenas produtos com `is_retro = true` serão exibidos

---

## 🔍 Campos adicionados pela migration

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `is_retro` | boolean | Marca produto como camisa retrô |
| `is_offer` | boolean | Marca produto em oferta |
| `is_selection` | boolean | Marca produto de seleção |
| `is_new` | boolean | Marca produto como lançamento |
| `old_price` | numeric | Preço antigo (para mostrar desconto) |
| `back_image_url` | text | URL da foto das costas |
| `sort_order` | integer | Ordem de exibição (0 = primeiro) |
| `updated_at` | timestamptz | Data da última atualização |

---

## ⚡ Dica Pro

Depois de executar a migration, você pode marcar produtos existentes como retro assim:

```sql
-- Exemplo: Marcar produto específico como retro
UPDATE public.products 
SET is_retro = true 
WHERE name ILIKE '%retro%' OR name ILIKE '%retrô%';
```

---

## 🆘 Problemas?

Se der erro ao executar a migration:
1. Verifique se você está conectado ao projeto correto
2. Confirme que tem permissões de admin
3. Tente executar os comandos `ALTER TABLE` um por um

---

**Pronto!** Depois de executar a migration, o sistema de camisas retrô estará 100% funcional! 🎉
