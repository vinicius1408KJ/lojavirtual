
import { useState } from 'react';
import { Truck, CheckCircle, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data generator for demo purposes
const MOCK_USER_ORDERS = [
    { id: 'ORD-001', date: '2024-03-10', total: 349.90, status: 'pending', items: ['Camisa Flamengo Home 24/25 (M)'] },
    { id: 'ORD-002', date: '2024-03-09', total: 699.80, status: 'paid', items: ['Camisa Real Madrid (G)', 'Camisa Barcelona (P)'] },
];

export function UserOrders() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orders] = useState<any[]>(MOCK_USER_ORDERS);

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
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black italic text-dlsports-green mb-8">MEUS PEDIDOS</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Você ainda não tem pedidos</h3>
                    <p className="text-gray-500 mb-6">Aproveite nossas ofertas e vista a camisa do seu time!</p>
                    <Link to="/nacionais" className="bg-dlsports-green text-white px-6 py-3 rounded-full font-bold hover:bg-black transition-colors">
                        Começar a Comprar
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pedido</p>
                                    <p className="font-mono font-bold text-gray-800">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Data</p>
                                    <p className="text-sm font-medium">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                                    <p className="text-sm font-bold text-dlsports-green">R$ {order.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        {order.status === 'shipped' && <Truck className="w-3 h-3" />}
                                        {order.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                                        {order.status === 'pending' && <Clock className="w-3 h-3" />}
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50/50">
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Itens do Pedido</h4>
                                <ul className="space-y-2">
                                    {order.items.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-dlsports-green"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
