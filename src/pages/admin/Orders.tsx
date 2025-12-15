
import { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock } from 'lucide-react';

// Mock data generator for demo purposes
const MOCK_ORDERS = [
    { id: 'ORD-001', customer: 'João Silva', date: '2024-03-10', total: 349.90, status: 'pending', items: ['Camisa Flamengo Home 24/25 (M)'] },
    { id: 'ORD-002', customer: 'Maria Santos', date: '2024-03-09', total: 699.80, status: 'paid', items: ['Camisa Real Madrid (G)', 'Camisa Barcelona (P)'] },
    { id: 'ORD-003', customer: 'Pedro Costa', date: '2024-03-08', total: 329.90, status: 'shipped', items: ['Camisa Palmeiras Home 24/25 (GG)'] },
];

export function Orders() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orders, _setOrders] = useState<any[]>(MOCK_ORDERS);

    // In a real app, fetch from Supabase
    useEffect(() => {
        // const fetchOrders = async () => {
        //    const { data } = await supabase.from('orders').select('*');
        //    if (data) setOrders(data);
        // }
        // fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'paid': return 'Pago';
            case 'shipped': return 'Enviado';
            default: return status;
        }
    };

    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Gerenciar Pedidos</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-yellow-50 text-yellow-600 rounded-full">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">12</h3>
                        <p className="text-gray-500 text-sm">Aguardando Pagamento</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">5</h3>
                        <p className="text-gray-500 text-sm">Prontos para Envio</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-full">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black">28</h3>
                        <p className="text-gray-500 text-sm">Enviados este mês</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">ID Pedido</th>
                            <th className="p-4 font-semibold text-gray-600">Cliente</th>
                            <th className="p-4 font-semibold text-gray-600">Data</th>
                            <th className="p-4 font-semibold text-gray-600">Itens</th>
                            <th className="p-4 font-semibold text-gray-600">Total</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono text-xs">{order.id}</td>
                                <td className="p-4 font-medium">{order.customer}</td>
                                <td className="p-4 text-gray-500 text-sm">{order.date}</td>
                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{order.items.join(', ')}</td>
                                <td className="p-4 font-bold text-dlsports-green">R$ {order.total.toFixed(2)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-600 hover:underline text-sm font-bold"
                                    >
                                        Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Detalhes do Pedido <span className="text-gray-500 font-mono text-base">#{selectedOrder.id}</span></h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <span className="sr-only">Fechar</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase">Cliente</p>
                                    <p className="font-medium text-gray-800">{selectedOrder.customer}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase">Data</p>
                                    <p className="font-medium text-gray-800">{selectedOrder.date}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase mb-2">Itens</p>
                                <ul className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    {selectedOrder.items.map((item: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dlsports-green flex-shrink-0"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-black text-dlsports-green">R$ {selectedOrder.total.toFixed(2)}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-sm text-gray-500 font-bold uppercase mb-1">Status Atual</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusText(selectedOrder.status)}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
