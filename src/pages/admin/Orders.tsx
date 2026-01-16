
import { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Trash2, ExternalLink, Zap } from 'lucide-react';

// Mock data updated to reflect WhatsApp Conversion flow
const MOCK_CONVERSIONS = [
    {
        id: 'LID-482',
        customer: 'João Silva',
        phone: '5511988887777',
        date: '2025-12-25 14:30',
        total: 349.90,
        status: 'pending',
        items: ['Camisa Flamengo Home 24/25 (M)'],
        source: 'Instagram Ad'
    },
    {
        id: 'LID-481',
        customer: 'Maria Santos',
        phone: '5521999990000',
        date: '2025-12-25 11:15',
        total: 145.00,
        status: 'chatting',
        items: ['Camisa PSG - 2025 (G)'],
        source: 'Pesquisa Google'
    },
    {
        id: 'LID-480',
        customer: 'Pedro Costa',
        phone: '5519977776666',
        date: '2025-12-24 18:20',
        total: 329.90,
        status: 'closed',
        items: ['Camisa Palmeiras Home 24/25 (GG)'],
        source: 'Direct'
    },
];

export function Orders() {
    const [leads, _setLeads] = useState<any[]>(MOCK_CONVERSIONS);
    const [selectedLead, setSelectedLead] = useState<any>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'chatting': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'closed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Aguardando Contato';
            case 'chatting': return 'Em Negociação';
            case 'closed': return 'Venda Fechada';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const openWhatsApp = (phone: string, name: string, items: string[]) => {
        const message = encodeURIComponent(`Olá ${name}! Fiquei feliz que se interessou pelas camisas: ${items.join(', ')}. Como posso te ajudar a finalizar seu pedido?`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">Leads do WhatsApp</h2>
                    <p className="text-gray-500 font-medium">Gerencie suas conversas e feche mais vendas</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Limpar Antigos
                    </button>
                    <button className="bg-dlsports-green text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-dlsports-green/20 hover:scale-105 transition-all flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Exportar Leads
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Clock className="w-12 h-12" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Novos Leads</p>
                    <h3 className="text-3xl font-black text-gray-900">08</h3>
                    <div className="mt-2 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full inline-block">
                        Urgente
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform text-blue-600">
                        <MessageSquare className="w-12 h-12" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Em Conversa</p>
                    <h3 className="text-3xl font-black text-gray-900">14</h3>
                    <div className="mt-2 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                        Ativos
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform text-green-600">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Conversão Hoje</p>
                    <h3 className="text-3xl font-black text-gray-900">R$ 1.2k</h3>
                    <div className="mt-2 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full inline-block">
                        +12% vs ontem
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform text-purple-600">
                        <Zap className="w-12 h-12" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Taxa de Fechamento</p>
                    <h3 className="text-3xl font-black text-gray-900">68%</h3>
                    <div className="mt-2 text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                        Meta batida
                    </div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h4 className="font-black italic text-gray-900 uppercase tracking-tight text-sm">Fila de Atendimento</h4>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suporte Online</span>
                    </div>
                </div>
                <div className="md:overflow-x-auto">
                    {/* Desktop Table View */}
                    <table className="w-full text-left hidden md:table">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th className="p-6">Origem</th>
                                <th className="p-6">Cliente</th>
                                <th className="p-6">Interesse</th>
                                <th className="p-6">Total Est.</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {leads.map(lead => (
                                <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 whitespace-nowrap">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[9px] font-black uppercase">
                                            {lead.source}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-gray-900 text-sm">{lead.customer}</span>
                                            <span className="text-[11px] text-gray-400 font-medium">{lead.phone}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            {lead.items.map((item: string, i: number) => (
                                                <span key={i} className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                                                    {item}
                                                </span>
                                            ))}
                                            <span className="text-[9px] text-gray-400 uppercase font-black">{lead.date}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-black text-dlsports-green">
                                        R$ {lead.total.toFixed(2)}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(lead.status)}`}>
                                            {getStatusText(lead.status)}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedLead(lead)}
                                                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                                                title="Ver Detalhes"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openWhatsApp(lead.phone, lead.customer, lead.items)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-green-200 transition-all hover:-translate-y-1 flex items-center gap-2"
                                            >
                                                <MessageSquare className="w-4 h-4" /> Atender
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100 px-4">
                        {leads.map(lead => (
                            <div key={lead.id} className="py-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h5 className="font-black text-gray-900">{lead.customer}</h5>
                                        <p className="text-xs text-gray-400 font-bold tracking-tight">{lead.phone}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusColor(lead.status)}`}>
                                        {getStatusText(lead.status)}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Interesse:</p>
                                    <ul className="space-y-1">
                                        {lead.items.map((item: string, i: number) => (
                                            <li key={i} className="text-xs font-bold text-gray-700 italic">- {item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-black text-dlsports-green italic">R$ {lead.total.toFixed(2)}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedLead(lead)} className="p-3 bg-gray-100 rounded-xl text-gray-500"><ExternalLink className="w-4 h-4" /></button>
                                        <button onClick={() => openWhatsApp(lead.phone, lead.customer, lead.items)} className="bg-green-500 text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-green-100">
                                            <MessageSquare className="w-4 h-4" /> Atender
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lead Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden relative border border-white/20">
                        {/* Modal Header */}
                        <div className="p-8 bg-gray-900 border-b border-white/10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-dlsports-neon p-2 rounded-xl text-black">
                                        <Zap className="w-5 h-5 fill-black" />
                                    </span>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Pedido via WhatsApp</h3>
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Referência: {selectedLead.id}</p>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Dados do Lead</h4>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Nome Completo</p>
                                            <p className="text-lg font-black text-gray-900 leading-none">{selectedLead.customer}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">WhatsApp</p>
                                            <p className="text-lg font-black text-gray-900 leading-none">{selectedLead.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Análise do Carrinho</h4>
                                    <div className="bg-gray-50 p-6 rounded-[30px] border border-gray-100 relative">
                                        <ul className="space-y-3">
                                            {selectedLead.items.map((item: any, i: number) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-dlsports-green rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                                                    <span className="text-sm font-black text-gray-700 italic leading-tight">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-8 pt-6 border-t border-gray-200/50 flex justify-between items-end">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Valor Total</p>
                                                <p className="text-3xl font-black text-dlsports-green italic leading-none">R$ {selectedLead.total.toFixed(2)}</p>
                                            </div>
                                            <span className="bg-black text-[10px] text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">Aguardando PIX</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sales Assistant Tip */}
                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex gap-5 items-start mb-10">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
                                    <Zap className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <h5 className="font-black text-indigo-900 uppercase text-xs tracking-wide mb-1 italic">Dica do Vendedor AI</h5>
                                    <p className="text-sm text-indigo-700 font-medium leading-relaxed">
                                        Este cliente veio de {selectedLead.source}. Ofereça um cupom de 5% se ele fechar no PIX agora para garantir a conversão imediata!
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex gap-4">
                                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black py-5 rounded-3xl uppercase tracking-tighter text-sm transition-all">
                                    Marcar como Perder
                                </button>
                                <button
                                    onClick={() => openWhatsApp(selectedLead.phone, selectedLead.customer, selectedLead.items)}
                                    className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-3xl uppercase tracking-tighter text-sm shadow-xl shadow-green-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
                                >
                                    <MessageSquare className="w-6 h-6" /> Iniciar Venda no WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
