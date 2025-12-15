import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS as MOCK_PRODUCTS } from '../data';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export function Catalog() {
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<string>('all');
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [loading, setLoading] = useState(true);

    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const clubFilter = searchParams.get('club');

    // Fetch products from LocalStorage (Sync with Admin) or Supabase with Mock fallback
    useEffect(() => {
        async function fetchProducts() {
            // Priority 1: LocalStorage (Admin changes)
            const localData = localStorage.getItem('dlsports_products');
            if (localData) {
                setProducts(JSON.parse(localData));
                setLoading(false);
                return;
            }

            // Priority 2: Supabase (if connected)
            try {
                const { data, error } = await supabase.from('products').select('*');
                if (error) throw error;
                if (data && data.length > 0) {
                    setProducts(data);
                }
            } catch (err) {
                console.log('Supabase fetch failed, using mock data:', err);
                // Priority 3: Mock (default state)
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Text Search
            const q = searchQuery;
            const nameMatch = (product.name || '').toLowerCase().includes(q);
            const teamMatch = (product.team || '').toLowerCase().includes(q);
            const clubMatch = (product.club || '').toLowerCase().includes(q);

            if (searchQuery && !nameMatch && !teamMatch && !clubMatch) {
                return false;
            }

            // Club Filter
            if (clubFilter) {
                const teamIs = (product.team || '').toLowerCase() === clubFilter.toLowerCase();
                const clubIs = (product.club || '').toLowerCase() === clubFilter.toLowerCase();
                if (!teamIs && !clubIs) return false;
            }

            // Category Filter
            if (selectedCategory === 'nacional' && !product.is_national) return false;
            if (selectedCategory === 'europeu' && product.is_national) return false;

            // Price Filter (Mock)
            if (priceRange === 'under350' && product.price >= 350) return false;
            if (priceRange === 'over350' && product.price < 350) return false;

            return true;
        });
    }, [selectedCategory, priceRange, products, searchQuery, clubFilter]);

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black italic text-dlsports-green">TODAS AS CAMISAS</h1>
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
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
