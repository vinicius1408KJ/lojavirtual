-- ==============================================================================
-- SCHEMA COMPLETO DLSPORTS E-COMMERCE (SUPABASE / POSTGRESQL)
-- Versão: 1.1 (CORRIGIDA)
-- ==============================================================================

-- 1. FUNÇÕES AUXILIARES
create or replace function public.handle_updated_at() 
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. TABELA DE PRODUTOS (Cria se não existir)
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  slug text unique not null,
  description text,
  price decimal(10,2) not null,
  image_url text not null,
  club text not null,
  is_national boolean default false,
  sizes text[] default array['P', 'M', 'G', 'GG'],
  active boolean default true,
  stock_quantity integer default 100
);

-- 2.1 ATUALIZAÇÃO DE TABELA (Garante que as colunas novas existam)
-- Isso resolve o erro "column team does not exist"
alter table public.products add column if not exists team text;
alter table public.products add column if not exists region text;
alter table public.products add column if not exists category text;

-- Garante trigger de data
drop trigger if exists on_products_updated on public.products;
create trigger on_products_updated
  before update on public.products
  for each row execute procedure public.handle_updated_at();

-- 3. TABELA DE CUPONS
create table if not exists public.coupons (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value decimal(10,2) not null,
  active boolean default true,
  usage_limit integer,
  usage_count integer default 0
);

-- 4. TABELA DE PEDIDOS
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id),
  customer_name text,
  customer_email text,
  status text default 'pending',
  total_amount decimal(10,2) not null
);

-- 5. TABELA DE ITENS DO PEDIDO
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer default 1,
  size text not null,
  price_at_purchase decimal(10,2) not null
);

-- 6. POLÍTICAS DE SEGURANÇA (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;

-- Remove políticas antigas para evitar duplicação/erro
drop policy if exists "Produtos são visíveis para todos" on public.products;
drop policy if exists "Apenas admins podem modificar produtos" on public.products;

-- Recria políticas
create policy "Produtos são visíveis para todos" on public.products for select using (true);
create policy "Apenas admins podem modificar produtos" on public.products for all using (true); -- MUDANÇA TEMPORÁRIA: Permite tudo para facilitar seus testes iniciais

-- 7. DADOS INICIAIS (SEED)
-- Inserir dados apenas se não existirem duplicatas (pelo slug)
insert into public.products (name, slug, price, image_url, club, team, region, category, is_national, active)
values 
('Camisa Flamengo I 24/25 Adidas Masculina', 'camisa-flamengo-1-24-25-v2', 349.90, 'https://imgcentauro-a.akamaihd.net/900x900/98263302/camisa-do-flamengo-i-2024-adidas-masculina-img.jpg', 'Flamengo', 'Clube de Regatas do Flamengo', 'Rio de Janeiro', 'nacional', true, true),
('Camisa Palmeiras I 24/25 Puma Masculina', 'camisa-palmeiras-1-24-25-v2', 329.90, 'https://imgcentauro-a.akamaihd.net/900x900/98286202/camisa-do-palmeiras-i-2024-puma-masculina-img.jpg', 'Palmeiras', 'Sociedade Esportiva Palmeiras', 'São Paulo', 'nacional', true, true),
('Camisa Real Madrid Home 24/25 Adidas', 'camisa-real-madrid-home-24-25-v2', 399.90, 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2d9f485304914a5198ecbc3762883344_9366/Camisa_1_Real_Madrid_24-25_Branco_RM_JSY_M_RM_JSY_M.jpg', 'Real Madrid', 'Real Madrid CF', 'Espanha', 'europeu', false, true)
on conflict (slug) do nothing; -- Evita erro se rodar de novo
