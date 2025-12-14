
-- 1. Reset (Cuidado: Isso apaga tabelas existentes se você rodar tudo)
-- DROP TABLE IF EXISTS public.orders;
-- DROP TABLE IF EXISTS public.products;
-- DROP TABLE IF EXISTS public.coupons;
-- DROP TABLE IF EXISTS public.profiles;

-- 2. Tabela de Perfis (Profiles) - Vinculada ao Auth do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'customer', -- 'admin' ou 'customer'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger para criar perfil automaticamente ao se cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (new.id, new.email, 'customer', new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove trigger se existir para recriar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 3. Tabela de Produtos (Products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  club TEXT,
  is_national BOOLEAN DEFAULT false,
  sizes TEXT[] DEFAULT '{P,M,G,GG}'::TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies Products
-- Qualquer um pode ver produtos ativos
CREATE POLICY "Public view active products" ON public.products FOR SELECT USING (active = true);
-- Admins podem ver todos (checa se o role no profile é admin)
CREATE POLICY "Admins view all products" ON public.products FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Apenas Admins podem inserir/atualizar/deletar
CREATE POLICY "Admins insert products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins update products" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 4. Tabela de Cupons (Coupons)
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em Coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Policies Coupons
-- Leitura pública permitida para validar o cupom no front
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);
-- Apenas admin modifica
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 5. Tabela de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT,
  items JSONB, -- Armazena array de itens [{name, qty, price...}]
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, shipped, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies Orders
-- Usuário vê seus próprios pedidos
CREATE POLICY "User view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
-- Admin vê todos
CREATE POLICY "Admins view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Usuário pode criar pedidos
CREATE POLICY "User create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Apenas Admin atualiza status
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 6. Storage (Imagens)
-- Tentar criar bucket 'products' se não existir (requer acesso via painel, mas inserimos policy aqui)
-- Nota: A criação do bucket em si geralmente é feita via UI ou API de Storage, mas as policies são SQL.

-- Policy para Storage (Objetos)
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
-- CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') );


-- 7. Função Helper para Validar Cupom (RPC)
CREATE OR REPLACE FUNCTION validate_coupon(coupon_code TEXT)
RETURNS JSONB AS $$
DECLARE
  coupon_record RECORD;
BEGIN
  SELECT * INTO coupon_record FROM public.coupons WHERE code = coupon_code AND active = true;
  
  IF coupon_record IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Cupom inválido ou expirado');
  ELSE
    RETURN jsonb_build_object(
      'valid', true, 
      'type', coupon_record.discount_type, 
      'value', coupon_record.discount_value,
      'code', coupon_record.code
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. QUERY FINAL PARA TRANSFORMAR SEU USUÁRIO EM ADMIN
-- IMPORTANTE: Rode este comando SEPARADAMENTE depois de criar seu usuário no site, ou substitua o email aqui.
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@dlsports.com.br';
