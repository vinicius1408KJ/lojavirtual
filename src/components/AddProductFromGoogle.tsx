
import { useState } from 'react';
import { Search, Plus, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../types';

interface AddProductFromGoogleProps {
    onProductSelect: (product: Partial<Product>) => void;
}

interface SearchResult {
    url: string;
    thumbnail: string;
    title: string;
    source: string;
}

export function AddProductFromGoogle({ onProductSelect }: AddProductFromGoogleProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [manualUrl, setManualUrl] = useState('');
    const [searchMode, setSearchMode] = useState<'search' | 'manual'>('search');

    // MOCK DATA for 12 images (Simulating a response)
    const MOCK_RESULTS: SearchResult[] = Array(12).fill(null).map((_, i) => ({
        url: `https://picsum.photos/seed/${i + 100}/800/800`,
        thumbnail: `https://picsum.photos/seed/${i + 100}/400/400`,
        title: `Resultado Imagem Google ${i + 1}`,
        source: 'google.com'
    }));

    const handleSearch = async () => {
        if (!searchTerm) return;
        setIsLoading(true);

        // Simulate API Call
        setTimeout(() => {
            const generatedResults = MOCK_RESULTS.map((item, idx) => ({
                ...item,
                title: `${searchTerm} - Opção ${idx + 1}`,
                thumbnail: item.thumbnail
            }));

            setResults(generatedResults);
            setIsLoading(false);
        }, 800);
    };

    const processProductData = (imgUrl: string, title: string) => {
        // 1. Infer Team
        const term = searchTerm.toLowerCase();
        let club = 'Time Desconhecido';
        let isNational = false;

        if (term.includes('flamengo')) { club = 'Flamengo'; isNational = true; }
        else if (term.includes('palmeiras')) { club = 'Palmeiras'; isNational = true; }
        else if (term.includes('corinthians')) { club = 'Corinthians'; isNational = true; }
        else if (term.includes('são paulo')) { club = 'São Paulo'; isNational = true; }
        else if (term.includes('vasco')) { club = 'Vasco'; isNational = true; }
        else if (term.includes('brasil')) { club = 'Seleção Brasileira'; isNational = true; }
        else if (term.includes('real madrid')) { club = 'Real Madrid'; isNational = false; }
        else if (term.includes('barcelona')) { club = 'Barcelona'; isNational = false; }
        else if (term.includes('city')) { club = 'Manchester City'; isNational = false; }
        else if (term.includes('united')) { club = 'Manchester United'; isNational = false; }
        else if (term.includes('arsenal')) { club = 'Arsenal'; isNational = false; }
        else if (term.includes('psg')) { club = 'PSG'; isNational = false; }
        else if (term.includes('bayern')) { club = 'Bayern de Munique'; isNational = false; }

        // 2. Format Name
        // Capitalize first letters
        const formattedName = searchTerm
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const productData: Partial<Product> = {
            name: formattedName || title,
            club: club,
            is_national: isNational,
            price: 299.90,
            image_url: imgUrl,
            slug: formattedName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            description: `Camisa oficial ${club} temporada 2024/2025. Produto original com garantia.\n\nMaterial: 100% Poliéster\nTecnologia: Respirável\nOrigem: Importado`,
            sizes: ['P', 'M', 'G', 'GG', 'XG'],
            active: true,
        };

        onProductSelect(productData);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                    <ImageIcon className="w-5 h-5 text-dlsports-green" />
                    Adicionar do Google Imagens
                </h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setSearchMode('search')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${searchMode === 'search' ? 'bg-white shadow text-dlsports-green' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Busca Automática
                    </button>
                    <button
                        onClick={() => setSearchMode('manual')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${searchMode === 'manual' ? 'bg-white shadow text-dlsports-green' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Link Manual
                    </button>
                </div>
            </div>

            {searchMode === 'search' ? (
                <div className="space-y-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Ex: Camisa Flamengo 2025 Oficial Jogo 1"
                                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-dlsports-green focus:ring-4 focus:ring-dlsports-green/10 outline-none transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="h-12 px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar no Google'}
                        </button>
                    </div>

                    {/* Results Grid */}
                    {results.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {results.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => processProductData(item.url, item.title)}
                                    className="group cursor-pointer relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-dlsports-green transition-all"
                                >
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Plus className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={manualUrl}
                            onChange={(e) => setManualUrl(e.target.value)}
                            placeholder="Cole a URL da imagem aqui (https://...)"
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 focus:border-dlsports-green outline-none"
                        />
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                        onClick={() => processProductData(manualUrl, searchTerm || 'Produto via Link')}
                        disabled={!manualUrl}
                        className="h-12 px-8 bg-dlsports-green text-white font-bold rounded-xl hover:bg-dlsports-green/90 transition-colors shadow-lg shadow-dlsports-green/20 disabled:opacity-50"
                    >
                        Adicionar do Link
                    </button>
                </div>
            )}
        </div>
    );
}
