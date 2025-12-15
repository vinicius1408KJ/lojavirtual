import { useState } from 'react';
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
// Mock Data
const INITIAL_COUPONS: Coupon[] = [
    { id: '1', code: 'DLS10', discount_type: 'percent', discount_value: 10, active: true, usage_count: 45 },
    { id: '2', code: 'PRIMEIRACOMPRA', discount_type: 'fixed', discount_value: 20, active: true, usage_count: 12 },
    { id: '3', code: 'FRETEGRATIS', discount_type: 'fixed', discount_value: 0, active: false, usage_count: 89 }
];

// Initialize from LocalStorage if available
const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('dlsports_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
});

// Helper to update state and storage
const updateCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    localStorage.setItem('dlsports_coupons', JSON.stringify(newCoupons));
};
const [newCouponCode, setNewCouponCode] = useState('');
const [newCouponValue, setNewCouponValue] = useState(10);

const handleCreateCoupon = () => {
    if (!newCouponCode) return;
    const newCoupon: Coupon = {
        id: Math.random().toString(36).substr(2, 9),
        code: newCouponCode.toUpperCase(),
        discount_type: 'percent', // Defaulting for demo
        discount_value: newCouponValue,
        active: true,
        usage_count: 0
    };
    updateCoupons([...coupons, newCoupon]);
    setNewCouponCode('');
};

const toggleActive = (id: string) => {
    const newCoupons = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    updateCoupons(newCoupons);
};

const handleDelete = (id: string) => {
    updateCoupons(coupons.filter(c => c.id !== id));
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
                            <button onClick={() => toggleActive(coupon.id)} className={`w-8 h-4 rounded-full transition-colors relative ${coupon.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${coupon.active ? 'left-4.5' : 'left-0.5'}`} style={{ left: coupon.active ? '18px' : '2px' }} />
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Excluir este cupom?')) handleDelete(coupon.id);
                                }}
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
