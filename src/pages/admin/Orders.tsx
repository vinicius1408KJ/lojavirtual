
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
                                        onClick={() => alert(`Detalhes do pedido ${order.id}:\nCliente: ${order.customer}\nTotal: R$ ${order.total.toFixed(2)}`)}
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
        </div>
    );
}
