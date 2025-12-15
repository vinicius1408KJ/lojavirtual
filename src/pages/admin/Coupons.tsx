import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash } from 'lucide-react';

interface Coupon {
    id: string;
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    active: boolean;
    usage_count: number;
}

// Mock Data
import { supabase } from '../../lib/supabase';

// Mock Data removed in favor of DB

export function Coupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setCoupons(data);
        } catch (error) {
            console.error('Erro ao buscar cupons:', error);
            // Fallback empty or alert
        } finally {
            setLoading(false);
        }
    };
    const [newCouponCode, setNewCouponCode] = useState('');
    const [newCouponValue, setNewCouponValue] = useState(10);

    const handleCreateCoupon = async () => {
        if (!newCouponCode) return;

        try {
            const { data, error } = await supabase
                .from('coupons')
                .insert([{
                    code: newCouponCode.toUpperCase(),
                    discount_type: 'percent',
                    discount_value: newCouponValue,
                    active: true,
                    usage_count: 0
                }])
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setCoupons([data, ...coupons]);
                setNewCouponCode('');
            }
        } catch (error) {
            console.error('Erro ao criar cupom:', error);
            alert('Erro ao criar cupom. Tente novamente.');
        }
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('coupons')
                .update({ active: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            setCoupons(coupons.map(c => c.id === id ? { ...c, active: !currentStatus } : c));
        } catch (error) {
            console.error('Erro ao atualizar cupom:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este cupom?')) return;

        try {
            const { error } = await supabase
                .from('coupons')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            console.error('Erro ao deletar cupom:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gerenciar Cupons</h2>

            {/* Creator */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-end gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Código do Cupom</label>
                    <div className="relative">
                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={newCouponCode}
                            onChange={(e) => setNewCouponCode(e.target.value)}
                            placeholder="Ex: BLACKFRIDAY"
                            className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 focus:border-dlsports-green focus:ring-2 focus:ring-dlsports-green/20 outline-none uppercase font-mono"
                        />
                    </div>
                </div>
                <div className="w-40">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Desconto (%)</label>
                    <input
                        type="number"
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(Number(e.target.value))}
                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                    />
                </div>
                <button
                    onClick={handleCreateCoupon}
                    className="h-12 px-6 bg-dlsports-green text-white font-bold rounded-lg hover:bg-dlsports-green/90 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Criar
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map(coupon => (
                    <div key={coupon.id} className={`bg-white rounded-xl p-6 border-2 transition-all group ${coupon.active ? 'border-gray-100 hover:border-dlsports-green' : 'border-gray-100 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-gray-100 px-3 py-1 rounded text-sm font-mono font-bold text-gray-700 flex items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                {coupon.code}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleActive(coupon.id, coupon.active)} className={`w-8 h-4 rounded-full transition-colors relative ${coupon.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${coupon.active ? 'left-4.5' : 'left-0.5'}`} style={{ left: coupon.active ? '18px' : '2px' }} />
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-black text-gray-800">
                                    {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `R$ ${coupon.discount_value}`}
                                </p>
                                <p className="text-xs text-gray-500 font-bold uppercase">Desconto</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-600">{coupon.usage_count}</p>
                                <p className="text-xs text-gray-400">Usos</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
