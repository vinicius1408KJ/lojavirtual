
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function PromoBar() {
    const [promoText, setPromoText] = useState('FRETE GRÁTIS PARA TODO O BRASIL NAS COMPRAS ACIMA DE R$ 299,90');

    useEffect(() => {
        // Tenta buscar um cupom ativo para destacar
        // Se não tiver DB, mantém o texto padrão
        const fetchActivePromo = async () => {
            try {
                const { data, error } = await supabase
                    .from('coupons')
                    .select('code, discount_value, discount_type')
                    .eq('active', true)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (data && !error) {
                    const discountDisplay = data.discount_type === 'percent' ? `${data.discount_value}%` : `R$ ${data.discount_value}`;
                    setPromoText(`🔥 USE O CUPOM ${data.code} E GANHE ${discountDisplay} DE DESCONTO! APROVEITE! 🔥`);
                }
            } catch (e) {
                console.log('Using default promo text');
            }
        };

        fetchActivePromo();
    }, []);

    return (
        <div className="bg-black text-white text-[10px] md:text-xs font-bold py-2 text-center tracking-widest relative overflow-hidden group h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="animate-pulse">{promoText}</span>
        </div>
    );
}
