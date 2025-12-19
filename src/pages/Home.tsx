
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
// MOCK_PRODUCTS import removed
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

const CLUBS = [
    { name: 'Atlético-MG', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Clube_Atl%C3%A9tico_Mineiro_logo.svg' },
    { name: 'Athletico-PR', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Club_Athletico_Paranaense_2019.svg' },
    { name: 'Bahia', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Esporte_Clube_Bahia_logo.svg' },
    { name: 'Botafogo', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Botafogo_de_Futebol_e_Regatas_logo.svg' },
    { name: 'Corinthians', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Sport_Club_Corinthians_Paulista_crest.svg' },
    { name: 'Cruzeiro', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg' },
    { name: 'Flamengo', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg' },
    { name: 'Fluminense', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Fluminense_FC_escudo.png' },
    { name: 'Fortaleza', logo: 'data:image/png;base64,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' },
    { name: 'Grêmio', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Gremio_logo.svg/1718px-Gremio_logo.svg.png' },
    { name: 'Internacional', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg' },
    { name: 'Juventude', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8z3Gj1Iar2_tIYJGnWzvHzbyvLBfHq7q1iQ&s' },
    { name: 'Mirassol', logo: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9169.png' },
    { name: 'Palmeiras', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
    { name: 'Bragantino', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9e/RedBullBragantino.png/250px-RedBullBragantino.png' },
    { name: 'Santos', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Santos_logo.svg' },
    { name: 'São Paulo', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg' },
    { name: 'Sport', logo: 'https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png' },
    { name: 'Vasco', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNq1bLlC-tnaYJgVzgxqp77gO96emrEA2sNA&s' },
    { name: 'Vitória', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNBr1LqFnNsphU07fu3xbBxVzfcFFJ-sT6lg&s' },
    { name: 'Ceará', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Cear%C3%A1_Sporting_Club_logo.svg' },
];

export function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [bannerNationalSlide, setBannerNationalSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setBannerNationalSlide((prev) => (prev + 1) % 3);
        }, 4000); // Slightly faster for inner banner to feel dynamic
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                // Priority: Supabase
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('active', true)
                    .limit(4);

                if (error) throw error;

                if (data) {
                    setFeaturedProducts(data);
                }
            } catch (e) {
                console.error('Failed to fetch featured products', e);
                setError('Não foi possível carregar os destaques.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden bg-black">
                {/* Carousel Background */}
                <div className="absolute inset-0 z-0">
                    {[
                        'https://d2r9epyceweg5n.cloudfront.net/stores/002/560/088/rte/comprar-camisa-do-inter-miami-ii-2-away-reserva-2025-25-26-adidas-masculino-masculina-preto-com-cinza-com-rosa-mundial-mls-messi-camisa-de-time-loja-tealto-sports-.jpg',
                        'https://s2-ge.glbimg.com/nsWqBNFbL9VIv9LXLXoFBl536Jk=/0x0:544x680/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2024/9/b/Bf93b0QcOg57yML48MkQ/gtvc0ctwqaa81tg.jpg',
                        'https://loukosnofutebol.com/public/arqConteudo/arqZPProduto/flamengo.jpg'
                    ].map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={img}
                                alt={`Banner ${index + 1}`}
                                className={`w-full h-full object-cover object-center transition-transform duration-[10000ms] ease-linear ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                            />
                            {/* Dark Overlay with Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                    ))}
                </div>

                <div className="container mx-auto px-4 z-10 relative">
                    <div className="max-w-3xl pt-20 md:pt-0">
                        {/* Tag Premium */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-dlsports-neon animate-pulse"></span>
                            <span className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">Lançamentos 2025 Disponíveis</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-7xl font-black italic mb-4 leading-[0.9] tracking-tighter drop-shadow-2xl animate-fade-in-up">
                            VISTA SEU TIME.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dlsports-neon to-green-400">
                                VIVA O JOGO.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm md:text-2xl text-gray-300 font-medium max-w-xl mb-6 md:mb-10 leading-relaxed drop-shadow-md animate-fade-in-up delay-200">
                            A maior coleção de camisas oficiais do Brasil. Qualidade premium para quem respira futebol.
                        </p>

                        {/* Social Proof Mini */}
                        <div className="flex items-center gap-4 mb-10 animate-fade-in-up delay-300">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Cliente" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-white text-sm">
                                <div className="flex text-dlsports-neon mb-0.5">
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <span className="font-bold">+5.000 clientes satisfeitos</span>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                            <Link
                                to="/nacionais"
                                className="group relative overflow-hidden bg-dlsports-neon text-dlsports-green px-8 md:px-10 py-4 md:py-5 rounded-lg font-black text-lg tracking-wide hover:scale-105 transition-all shadow-[0_0_30px_rgba(181,255,0,0.4)] flex items-center justify-center gap-3"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    COMPRAR AGORA <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                to="/europeus"
                                className="px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-lg tracking-wide text-white border border-white/30 hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm flex items-center justify-center text-center"
                            >
                                VER LANÇAMENTOS 2025
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

            {/* Benefits Banner */}
            <div className="bg-black text-white py-6 border-b border-white/10">
                <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-4 text-xs md:text-sm font-bold tracking-wider uppercase text-center">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-dlsports-neon rounded-full" /> Envio Imediato para todo Brasil</span>
                    <span className="flex items-center gap-2 hidden md:flex"><div className="w-2 h-2 bg-dlsports-neon rounded-full" /> Parcelamento em até 10x sem juros</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-dlsports-neon rounded-full" /> 5% OFF no PIX</span>
                </div>
            </div>

            {/* Dual Category Banner (National vs European) */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* National Banner */}
                    <Link to="/nacionais" className="group relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-between px-8 md:px-12 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 border border-gray-200">
                        {/* Text Content */}
                        <div className="relative z-10 flex flex-col items-start gap-2">
                            <span className="text-yellow-500 font-extrabold text-sm tracking-widest uppercase">Season 2025</span>
                            <h3 className="text-3xl md:text-5xl font-black italic text-gray-900 leading-none">
                                Times <br />Nacionais
                            </h3>
                            <p className="text-gray-500 font-medium text-xs md:text-sm mb-2">A partir de <strong className="text-gray-900 text-lg md:text-2xl">R$ 129,90</strong></p>
                            <span className="bg-black text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider group-hover:bg-dlsports-green group-hover:text-white transition-colors">
                                Ver Coleção
                            </span>
                        </div>
                        {/* Image/Graphic Carousel */}
                        <div className="absolute right-0 top-0 h-full w-1/2 md:w-2/3">
                            {[
                                'https://static.netshoes.com.br/produtos/camisa-vasco-iii-2425-sn-kombat-jogador-kappa-masculina/04/D24-6504-004/D24-6504-004_zoom1.jpg?ts=1765386947',
                                'https://static.netshoes.com.br/produtos/camisa-sao-paulo-i-2526-torcedor-new-balance-masculina/24/39V-1638-024/39V-1638-024_zoom1.jpg?ts=1765855271&ims=1088x',
                                'https://imgcentauro-a.akamaihd.net/800x800/9948763XA2.jpg'
                            ].map((img, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 bg-contain bg-right bg-no-repeat transition-opacity duration-1000 ${index === bannerNationalSlide ? 'opacity-90' : 'opacity-0'}`}
                                    style={{ backgroundImage: `url("${img}")` }}
                                ></div>
                            ))}
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl group-hover:bg-green-400/30 transition-colors"></div>
                    </Link>

                    {/* European Banner */}
                    <Link to="/europeus" className="group relative h-64 md:h-80 rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-between px-8 md:px-12 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 border border-gray-200">
                        {/* Text Content */}
                        <div className="relative z-10 flex flex-col items-start gap-2">
                            <span className="text-blue-600 font-extrabold text-sm tracking-widest uppercase">Todas as ligas Europeias</span>
                            <h3 className="text-3xl md:text-5xl font-black italic text-gray-900 leading-none">
                                Times <br />Europeus
                            </h3>
                            <p className="text-gray-500 font-medium text-xs md:text-sm mb-2">A partir de <strong className="text-gray-900 text-lg md:text-2xl">R$ 149,90</strong></p>
                            <span className="bg-black text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider group-hover:bg-blue-600 transition-colors">
                                Ver Coleção
                            </span>
                        </div>
                        {/* Image/Graphic Carousel */}
                        <div className="absolute right-0 top-0 h-full w-1/2 md:w-2/3">
                            {[
                                'https://imgcentauro-a.akamaihd.net/800x800/9971A4TKA2.jpg',
                                'https://imgcentauro-a.akamaihd.net/1200x1200/98876205A5.jpg',
                                'https://cdn.vnda.com.br/1500x/grandestorcidas/2024/08/15/10_10_15_892_10_8_0_033_whatsapp20image2024081520at20100950.jpeg?v=1723727416'
                            ].map((img, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 bg-contain bg-right bg-no-repeat transition-opacity duration-1000 ${index === bannerNationalSlide ? 'opacity-90' : 'opacity-0'}`}
                                    style={{ backgroundImage: `url("${img}")` }}
                                ></div>
                            ))}
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-colors"></div>
                    </Link>
                </div>
            </section>

            {/* Clubs Section */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-gray-900 mb-2 uppercase">Brasileirão Betano 2025</h2>
                        <div className="w-16 h-1 bg-dlsports-neon mx-auto"></div>
                    </div>

                    {/* Responsive Scroll / Marquee Feel */}
                    <div className="relative">
                        <div className="flex overflow-x-auto gap-8 md:gap-12 pb-8 scrollbar-hide snap-x px-4 justify-start md:justify-center flex-wrap md:flex-nowrap">
                            {CLUBS.map(club => (
                                <Link
                                    to={`/nacionais?club=${encodeURIComponent(club.name)}`}
                                    key={club.name}
                                    className="group flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px] snap-center hover:scale-110 transition-transform duration-300"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center p-3 shadow-sm border border-gray-100 group-hover:border-dlsports-green group-hover:shadow-[0_0_15px_rgba(181,255,0,0.2)] transition-all">
                                        <img src={club.logo} alt={club.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-dlsports-green transition-colors uppercase tracking-wider text-center w-full truncate">{club.name}</span>
                                </Link>
                            ))}
                        </div>
                        {/* Gradient Fade for Scroll hints */}
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden"></div>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-20 bg-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-dlsports-green font-bold tracking-widest text-sm uppercase mb-2 block">Destaques da Semana</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic tracking-tighter">
                                MAIS VENDIDOS <span className="text-stroke-neon text-transparent" style={{ WebkitTextStroke: '1px #000' }}>2025</span>
                            </h2>
                        </div>
                        <Link to="/nacionais" className="group flex items-center gap-2 font-bold text-gray-900 hover:text-dlsports-green transition-colors text-lg">
                            Ver catálogo completo
                            <span className="p-1 rounded-full bg-black text-white group-hover:bg-dlsports-green transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {isLoading ? (
                            <div className="col-span-full text-center py-20">
                                <span className="loading-spinner">Carregando destaques...</span>
                            </div>
                        ) : error ? (
                            <div className="col-span-full text-center py-20 text-red-500 font-bold">
                                {error}
                            </div>
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                Nenhum destaque disponível.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials Section (Social Proof) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-dlsports-neon font-black text-xl mb-2 block tracking-widest">FEEDBACK</span>
                        <h2 className="text-3xl md:text-5xl font-black italic text-gray-900 mb-6">QUEM COMPROU APROVOU</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Confira o que nossos clientes estão falando sobre a qualidade e experiência de compra na DL Sports.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Ricardo S.', time: 'Há 2 dias', text: 'Qualidade surreal! O tecido é idêntico ao de jogador. Chegou em 3 dias aqui em SP.' },
                            { name: 'Matheus O.', time: 'Semana passada', text: 'Melhor loja de camisas que já comprei. O suporte no WhatsApp é nota 10.' },
                            { name: 'Gabriela M.', time: 'Há 1 mês', text: 'Comprei de presente pro meu namorado e ele amou. Veio tudo certinho e bem embalado.' }
                        ].map((review, i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                                </div>
                                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{review.name}</p>
                                        <p className="text-xs text-gray-400">{review.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
