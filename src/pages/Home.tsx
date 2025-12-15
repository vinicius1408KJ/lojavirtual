
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS as MOCK_PRODUCTS } from '../data';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

const CLUBS = [
    { name: 'Flamengo', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg' },
    { name: 'Palmeiras', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
    { name: 'Corinthians', logo: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_simbolo.png' },
    { name: 'São Paulo', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg' },
    { name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg' },
    { name: 'Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg' },
    { name: 'Man. City', logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' },
    { name: 'Arsenal', logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' }
];

export function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>(MOCK_PRODUCTS.filter(p => p.active !== false).slice(0, 4));

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const { data, error } = await supabase.from('products').select('*').eq('active', true).limit(4);
                if (!error && data && data.length > 0) {
                    setFeaturedProducts(data);
                }
            } catch (e) {
                console.error('Failed to fetch featured products', e);
            }
        }
        fetchFeatured();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero.png"
                        alt="Jogador comemorando"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-dlsports-green/80 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 z-10 relative mt-12">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-2 bg-black/40 backdrop-blur-sm border border-dlsports-neon/30 rounded-full text-dlsports-neon font-bold tracking-wider text-sm mb-6 animate-fade-in text-shadow">
                            NOVA COLEÇÃO 24/25
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-6 leading-[0.9] drop-shadow-xl">
                            VISTA A <br />
                            <span className="text-dlsports-neon drop-shadow-[0_0_20px_rgba(181,255,0,0.5)]">GLÓRIA</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl mb-10 leading-relaxed shadow-neutral-900 drop-shadow-md">
                            As camisas mais exclusivas dos maiores clubes do mundo chegaram na DLSPORTS.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/nacionais"
                                className="group bg-dlsports-neon text-dlsports-green px-8 py-4 rounded-full font-black text-lg tracking-wide hover:scale-105 transition-all flex items-center justify-between gap-4 shadow-[0_0_20px_rgba(181,255,0,0.3)] hover:shadow-[0_0_30px_rgba(181,255,0,0.5)]"
                            >
                                COMPRAR AGORA
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/europeus"
                                className="group bg-black text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg tracking-wide hover:bg-white hover:text-black transition-all"
                            >
                                EUROPEUS
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clubs Section */}
            <section className="py-12 bg-white container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest text-gray-400">Escolha por Clube</h2>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    {CLUBS.map(club => (
                        <Link
                            to={`/nacionais?club=${encodeURIComponent(club.name)}`}
                            key={club.name}
                            className="flex flex-col items-center gap-3 group cursor-pointer"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-50 flex items-center justify-center p-4 border border-gray-100 group-hover:border-dlsports-green group-hover:shadow-[0_0_15px_rgba(181,255,0,0.2)] transition-all duration-300">
                                <img src={club.logo} alt={club.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                            </div>
                            <span className="text-sm font-bold text-gray-400 group-hover:text-dlsports-green transition-colors">{club.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-20 container mx-auto px-4 bg-gray-50">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-dlsports-green italic tracking-tighter">
                        DESTAQUES DA SEMANA
                    </h2>
                    <Link to="/nacionais" className="text-dlsports-green font-bold flex items-center gap-2 hover:text-dlsports-neon hover:bg-black px-4 py-2 rounded-full transition-all">
                        VER TODOS <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Trust Section */}
            <section className="bg-black text-white py-16">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 border border-white/10 rounded-2xl">
                        <Star className="w-10 h-10 text-dlsports-neon mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Produtos Oficiais</h3>
                        <p className="text-gray-400">Garantia de autenticidade em todas as peças.</p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-2xl">
                        <div className="w-10 h-10 text-dlsports-neon mx-auto mb-4 font-black flex items-center justify-center text-2xl">10x</div>
                        <h3 className="text-xl font-bold mb-2">Parcelamento Facilitado</h3>
                        <p className="text-gray-400">Em até 10x sem juros em todos os cartões.</p>
                    </div>
                    <div className="p-6 border border-white/10 rounded-2xl">
                        <div className="w-10 h-10 text-dlsports-neon mx-auto mb-4 font-black flex items-center justify-center text-2xl">🛫</div>
                        <h3 className="text-xl font-bold mb-2">Envio para todo Brasil</h3>
                        <p className="text-gray-400">Frete grátis nas compras acima de R$ 299,90.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
