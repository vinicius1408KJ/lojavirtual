
import { useNavigate } from 'react-router-dom';
import { Trash2, RefreshCw } from 'lucide-react';
import { PRODUCTS } from '../data';

export function Reset() {
    const navigate = useNavigate();

    const handleReset = () => {
        if (confirm('ATENÇÃO: Isso vai apagar todos os dados salvos no seu computador e restaurar o site para o estado original. Continuar?')) {
            localStorage.clear();

            // Re-initialize correct data structure immediately
            localStorage.setItem('dlsports_products', JSON.stringify(PRODUCTS));

            alert('Sistema reiniciado com sucesso!');
            window.location.href = '/';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Trash2 className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-2xl font-black text-gray-800">Diagnóstico e Reset</h1>

                <p className="text-gray-600">
                    Se o site não está funcionando corretamente (botões não respondem, produtos não aparecem),
                    seu navegador pode estar com dados corrompidos na memória.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg text-left text-sm text-yellow-800 border border-yellow-200">
                    <strong>Sintomas comuns:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Botão "Adicionar Produto" não faz nada.</li>
                        <li>Busca não encontra produtos novos.</li>
                        <li>Tela branca ou erros visuais.</li>
                    </ul>
                </div>

                <button
                    onClick={handleReset}
                    className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                    <RefreshCw className="w-5 h-5" />
                    LIMPAR NAVEGADOR E REINICIAR
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="text-gray-500 hover:text-gray-800 text-sm font-medium underline"
                >
                    Voltar para Home
                </button>
            </div>
        </div>
    );
}
