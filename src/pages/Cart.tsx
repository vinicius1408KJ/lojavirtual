
import { useState } from 'react';
import { Trash, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export function Cart() {
    const { items, removeFromCart, cartTotal } = useCart();
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Calcula total com desconto
    const total = cartTotal - discount;

    const handleApplyCoupon = async () => {
        if (!coupon) return;
        setLoading(true);

        try {
            const { data, error } = await supabase.rpc('validate_and_apply_coupon', {
                coupon_code: coupon,
                cart_total: cartTotal
            });

            if (error) throw error;

            if (data && data.valid) {
                setDiscount(data.discount_amount);
                alert(`Cupom ${coupon} aplicado com sucesso!`);
            } else {
                alert('Cupom inválido ou expirado');
                setDiscount(0);
            }
        } catch (err) {
            console.error('Erro ao validar cupom:', err);
            alert('Erro ao validar cupom. Verifique sua conexão.');
            setDiscount(0);
        }
        setLoading(false);
    };

    const WHATSAPP_NUMBER = '5511999999999'; // Substitua pelo número real do vendedor

    const handleWhatsAppCheckout = () => {
        let message = "Olá! Vim pelo site da DL Sports.\n";
        message += "Esses são os produtos do meu carrinho:\n\n";

        items.forEach(item => {
            message += `Produto: ${item.name}\n`;
            message += `Tamanho: ${item.size}\n`;
            message += `Quantidade: ${item.quantity}\n`;
            message += `Valor unitário: R$ ${item.price.toFixed(2)}\n\n`;
        });

        message += `Total do pedido: R$ ${total.toFixed(2)}\n\n`;
        message += "Gostaria de confirmar disponibilidade, frete e forma de pagamento.";

        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(url, '_blank');
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-400 mb-4">Seu carrinho está vazio</h2>
                <a href="/" className="text-dlsports-green font-bold hover:underline">Voltar para a loja</a>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 font-sans pb-24 md:pb-8">
            <h1 className="text-2xl md:text-3xl font-black italic text-dlsports-green mb-4 md:mb-8 text-center md:text-left">SEU CARRINHO</h1>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                {/* Items */}
                <div className="flex-1 space-y-3 md:space-y-4">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-3 md:gap-4 border p-3 md:p-4 rounded-xl bg-white shadow-sm items-center md:items-stretch">
                            <img src={item.image_url} alt={item.name} className="w-20 h-24 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight mb-1">{item.name}</h3>
                                    <p className="text-xs md:text-sm text-gray-500">Tamanho: {item.size} | Qtd: {item.quantity}</p>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="font-black text-dlsports-green text-sm md:text-base">R$ {item.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        className="text-red-500 hover:bg-red-50 p-1.5 md:p-2 rounded-full transition-colors"
                                    >
                                        <Trash className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-96 h-fit bg-white p-4 md:p-6 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">Resumo do Pedido</h3>
                    <div className="space-y-2 mb-4 text-sm md:text-base">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>R$ {cartTotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Desconto</span>
                                <span>- R$ {discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-black text-xl text-dlsports-green pt-4 border-t mt-2">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4 md:mb-6">
                        <input
                            type="text"
                            placeholder="CUPOM"
                            className="flex-1 border rounded-lg px-3 py-2 uppercase text-sm outline-none focus:border-dlsports-green transition-colors"
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            OK
                        </button>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:p-0 md:bg-transparent md:border-0 z-50">
                        <button
                            onClick={handleWhatsAppCheckout}
                            className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg hover:shadow-xl md:transform md:hover:-translate-y-1 text-sm md:text-base"
                        >
                            FINALIZAR PELO WHATSAPP <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
