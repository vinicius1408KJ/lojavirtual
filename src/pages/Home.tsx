
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
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchFeatured() {
            // Priority 1: LocalStorage (Sync with Admin)
            const localData = localStorage.getItem('dlsports_products');
            if (localData) {
                const products = JSON.parse(localData).map((p: Product) => ({
                    ...p,
                    slug: p.slug || p.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                }));
                const activeProducts = products.filter((p: Product) => p.active !== false).slice(0, 4);
                setFeaturedProducts(activeProducts);
                return;
            }

            // Priority 2: Supabase (if connected)
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
            <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
                {/* Carousel Background */}
                <div className="absolute inset-0 z-0">
                    {[
                        'https://d2r9epyceweg5n.cloudfront.net/stores/002/560/088/rte/comprar-camisa-do-inter-miami-ii-2-away-reserva-2025-25-26-adidas-masculino-masculina-preto-com-cinza-com-rosa-mundial-mls-messi-camisa-de-time-loja-tealto-sports-.jpg',
                        'https://s2-ge.glbimg.com/nsWqBNFbL9VIv9LXLXoFBl536Jk=/0x0:544x680/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2024/9/b/Bf93b0QcOg57yML48MkQ/gtvc0ctwqaa81tg.jpg',
                        'https://loukosnofutebol.com/public/arqConteudo/arqZPProduto/flamengo.jpg'
                    ].map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Banner ${index + 1}`}
                                className={`w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'
                                    }`}
                            />
                            {/* Dark overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    ))}

                    {/* Gradient Overlay - Stronger on left for text */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-4xl pt-12 md:pt-0">
                        <span className="inline-block px-4 py-2 bg-dlsports-neon/10 backdrop-blur-md border border-dlsports-neon/50 rounded-full text-dlsports-neon font-bold tracking-widest text-xs md:text-sm mb-6 animate-fade-in shadow-[0_0_15px_rgba(181,255,0,0.3)]">
                            NOVA COLEÇÃO 24/25
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter mb-6 leading-[0.95] drop-shadow-2xl">
                            VISTA A <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dlsports-neon to-green-400 drop-shadow-[0_0_25px_rgba(181,255,0,0.4)]">
                                GLÓRIA ETERNA
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 font-medium max-w-xl mb-10 leading-relaxed drop-shadow-md">
                            As camisas dos maiores campeões do mundo. <br />
                            <span className="text-dlsports-neon">Exclusividade e estilo</span> para quem vive o jogo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <Link
                                to="/nacionais"
                                className="group relative overflow-hidden bg-dlsports-neon text-dlsports-green px-10 py-5 rounded-full font-black text-lg tracking-wide hover:scale-105 transition-all shadow-[0_0_30px_rgba(181,255,0,0.4)] flex items-center gap-3"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    COMPRAR AGORA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                            </Link>
                            <Link
                                to="/europeus"
                                className="group px-10 py-5 rounded-full font-bold text-lg tracking-wide text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
                            >
                                EUROPEUS
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-10 right-10 flex gap-3 z-20">
                    {[0, 1, 2].map((i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-dlsports-neon w-12' : 'bg-white/30 w-4 hover:bg-white/60'
                                }`}
                        />
                    ))}
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
