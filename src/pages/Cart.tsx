
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
                alert('Cupom aplicado com sucesso!');
            } else {
                // Fallback mock
                if (coupon === 'DLS10') {
                    setDiscount(cartTotal * 0.1);
                    alert('Cupom aplicado com sucesso! (MOCK)');
                } else {
                    alert('Cupom inválido');
                    setDiscount(0);
                }
            }
        } catch (err) {
            console.log('Erro ao validar cupom (usando mock):', err);
            // Fallback Mock
            if (coupon === 'DLS10') {
                setDiscount(cartTotal * 0.1);
                alert('Cupom aplicado com sucesso! (Fallback)');
            } else {
                alert('Erro ao validar cupom');
            }
        }
        setLoading(false);
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-black italic text-dlsports-green mb-8">SEU CARRINHO</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Items */}
                <div className="flex-1 space-y-4">
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 border p-4 rounded-xl bg-white shadow-sm">
                            <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                            <div className="flex-1">
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-sm text-gray-500">Tamanho: {item.size} | Qtd: {item.quantity}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-bold text-dlsports-green">R$ {item.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="w-full lg:w-96 h-fit bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="font-bold text-lg mb-4">Resumo do Pedido</h3>
                    <div className="space-y-2 mb-4">
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
                        <div className="flex justify-between font-black text-xl text-dlsports-green pt-4 border-t">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Cupom de desconto"
                            className="flex-1 border rounded-lg px-3 py-2 uppercase"
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={loading}
                            className="bg-black text-white px-4 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                        >
                            OK
                        </button>
                    </div>

                    <button
                        onClick={() => alert('Compra finalizada com sucesso! (Simulação)')}
                        className="w-full bg-dlsports-neon text-dlsports-green font-black py-4 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                    >
                        Finalizar Compra <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
