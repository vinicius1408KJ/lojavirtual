import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
// MOCK_PRODUCTS import removed
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export function Catalog() {
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<string>('all');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const clubFilter = searchParams.get('club');

    // Auto-detect category from URL path
    useEffect(() => {
        if (pathname === '/nacionais') setSelectedCategory('nacional');
        else if (pathname === '/europeus') setSelectedCategory('europeu');
        else if (pathname === '/selecoes') setSelectedCategory('selecoes');
        else if (pathname === '/retro') setSelectedCategory('retro');
        else if (pathname === '/lancamentos') setSelectedCategory('lancamentos');
        else if (pathname === '/ofertas') setSelectedCategory('ofertas');
    }, [pathname]);

    // Fetch products from Supabase ONLY
    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (data) {
                    setProducts(data);
                }
            } catch (err) {
                console.error('Supabase fetch failed:', err);
                setError('Falha ao carregar produtos. Verifique sua conexão.');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    // Normalize Helper
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const filteredProducts = useMemo(() => {
        console.log('Filtering Products...', { total: products.length, category: selectedCategory, search: searchQuery });

        return products.filter(product => {
            // Text Search refinement
            const q = normalize(searchQuery);
            const pName = normalize(product.name || '');
            const pTeam = normalize(product.team || '');
            const pClub = normalize(product.club || '');

            const matchesSearch = !q || pName.includes(q) || pTeam.includes(q) || pClub.includes(q);

            if (!matchesSearch) return false;

            // Club Filter
            if (clubFilter) {
                const filters = clubFilter.split(',').map(f => normalize(f));
                const matchesClub = filters.some(f => pTeam === f || pClub === f);
                if (!matchesClub) return false;
            }

            // Category Filter
            if (selectedCategory === 'nacional' && !product.is_national) return false;
            if (selectedCategory === 'europeu' && (product.is_national || product.is_selection)) return false;
            if (selectedCategory === 'selecoes' && !product.is_selection) return false;
            if (selectedCategory === 'retro' && !product.is_retro) return false;
            if (selectedCategory === 'lancamentos' && !product.is_new) return false;
            if (selectedCategory === 'ofertas' && !product.is_offer) return false;

            // Price Filter (Mock)
            if (priceRange === 'under350' && product.price >= 350) return false;
            if (priceRange === 'over350' && product.price < 350) return false;

            return true;
        });
    }, [selectedCategory, priceRange, products, searchQuery, clubFilter]);

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black italic text-dlsports-green">
                    {selectedCategory === 'nacional' ? 'CAMISAS NACIONAIS' :
                        selectedCategory === 'europeu' ? 'CAMISAS EUROPEIAS' :
                            selectedCategory === 'selecoes' ? 'CAMISAS DE SELEÇÕES' :
                                selectedCategory === 'retro' ? 'CAMISAS RETRÔ' :
                                    selectedCategory === 'lancamentos' ? 'LANÇAMENTOS 2026' :
                                        selectedCategory === 'ofertas' ? 'OFERTAS IMPERDÍVEIS' : 'TODAS AS CAMISAS'}
                </h1>
                <span className="text-gray-500 text-sm font-medium">{filteredProducts.length} produtos encontrados</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4 text-dlsports-green font-bold">
                            <Filter className="w-5 h-5" />
                            <h2>FILTRAR POR</h2>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <h3 className="font-bold text-sm mb-3">CATEGORIA</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="all"
                                        checked={selectedCategory === 'all'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Todos</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="nacional"
                                        checked={selectedCategory === 'nacional'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Nacionais</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="europeu"
                                        checked={selectedCategory === 'europeu'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Europeus</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="selecoes"
                                        checked={selectedCategory === 'selecoes'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Seleções</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="retro"
                                        checked={selectedCategory === 'retro'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Retrô</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="lancamentos"
                                        checked={selectedCategory === 'lancamentos'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors font-bold">Lançamentos 🔥</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="ofertas"
                                        checked={selectedCategory === 'ofertas'}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors font-bold text-red-500">Ofertas %</span>
                                </label>
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <h3 className="font-bold text-sm mb-3">PREÇO</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="price"
                                        value="all"
                                        checked={priceRange === 'all'}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Qualquer valor</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="price"
                                        value="under350"
                                        checked={priceRange === 'under350'}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Até R$ 350,00</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="price"
                                        value="over350"
                                        checked={priceRange === 'over350'}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="accent-dlsports-green"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-dlsports-green transition-colors">Acima de R$ 350,00</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Grid */}
                <main className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">Carregando...</div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-64 text-red-500 font-bold">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20 text-gray-500">
                                    Nenhum produto encontrado com esses filtros.
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
