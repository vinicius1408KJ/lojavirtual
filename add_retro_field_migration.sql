-- ==============================================================================
-- MIGRATION: Adicionar campos faltantes na tabela products
-- Data: 2026-01-15
-- Descrição: Adiciona campos is_retro, is_offer, is_selection, is_new, 
--            old_price, back_image_url, sort_order, updated_at
-- ==============================================================================

-- Adicionar campos booleanos para categorização
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_retro BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_selection BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;

-- Adicionar campos de preço e imagem
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS old_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS back_image_url TEXT;

-- Adicionar campo de ordenação
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Adicionar campo de atualização (se não existir)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Criar índices para melhorar performance nas consultas
CREATE INDEX IF NOT EXISTS idx_products_is_retro ON public.products(is_retro) WHERE is_retro = true;
CREATE INDEX IF NOT EXISTS idx_products_is_offer ON public.products(is_offer) WHERE is_offer = true;
CREATE INDEX IF NOT EXISTS idx_products_is_selection ON public.products(is_selection) WHERE is_selection = true;
CREATE INDEX IF NOT EXISTS idx_products_is_new ON public.products(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active) WHERE active = true;

-- Criar ou substituir função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS on_products_updated ON public.products;
CREATE TRIGGER on_products_updated
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Comentários para documentação
COMMENT ON COLUMN public.products.is_retro IS 'Indica se o produto é uma camisa retrô';
COMMENT ON COLUMN public.products.is_offer IS 'Indica se o produto está em oferta';
COMMENT ON COLUMN public.products.is_selection IS 'Indica se o produto é de seleção nacional';
COMMENT ON COLUMN public.products.is_new IS 'Indica se o produto é um lançamento';
COMMENT ON COLUMN public.products.old_price IS 'Preço antigo (antes do desconto)';
COMMENT ON COLUMN public.products.back_image_url IS 'URL da imagem das costas do produto';
COMMENT ON COLUMN public.products.sort_order IS 'Ordem de exibição do produto (menor valor = maior prioridade)';
