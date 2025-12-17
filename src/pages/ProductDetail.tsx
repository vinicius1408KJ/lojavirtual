import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Ruler, Truck, ShieldCheck, Star, CreditCard, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { PRODUCTS } from '../data';
import { useCart } from '../context/CartContext';
import { toast } from '../lib/toast';

export function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [activeImage, setActiveImage] = useState(0);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    // Priority 1: Check LocalStorage
    const localData = localStorage.getItem('dlsports_products');
    let allProducts = PRODUCTS;

    if (localData) {
        allProducts = JSON.parse(localData).map((p: any) => ({
            ...p,
            slug: p.slug || p.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
        }));
    }

    const product = allProducts.find((p: any) => p.slug === slug);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
                    <button onClick={() => navigate('/')} className="text-dlsports-green hover:underline">Voltar para Home</button>
                </div>
            </div>
        );
    }

    // Mock images for gallery (using the main product image multiple times for demo)
    const images = [product.image_url, product.image_url, product.image_url];

    // Mock "Buy Together" products
    const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 2);


    const handleAddToCart = () => {
        if (!selectedSize) {
            // Can use a warning toast here if implemented, or simple alert for now for error
            alert('Por favor, selecione um tamanho.');
            return;
        }
        addToCart(product, selectedSize);
        // navigate('/cart'); // Remove navigation to keep user in flow
        toast.success(`Camisa ${product.club} adicionada ao carrinho!`);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 text-xs text-gray-500 uppercase tracking-wider">
                    Home / {product.category || 'Nacionais'} / <span className="text-black font-bold">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 md:py-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Left: Gallery */}
                        <div className="p-4 md:p-8 bg-gray-50 flex flex-col items-center">
                            <div className="relative w-full max-w-[500px] aspect-[4/5] bg-white rounded-2xl shadow-lg overflow-hidden group mb-4">
                                <img
                                    src={images[activeImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                                />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                        {product.club}
                                    </span>
                                    {product.active && <span className="bg-dlsports-neon text-dlsports-green px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider animate-pulse">
                                        Pronta Entrega
                                    </span>}
                                </div>
                            </div>
                            {/* Thumbnails */}
                            <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-[500px] scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-16 h-20 md:w-20 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-dlsports-green opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Info */}
                        <div className="p-5 md:p-12 lg:overflow-y-auto lg:max-h-[800px] custom-scrollbar">
                            <h1 className="text-2xl md:text-5xl font-black text-gray-900 mb-2 leading-tight uppercase italic tracking-tighter">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 mb-6 text-xs md:text-sm text-gray-500">
                                <span className="font-bold text-black">Modelo 2024/25</span>
                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                <div className="flex text-yellow-500">
                                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                                </div>
                                <span className="text-black font-bold text-xs">(128 avaliações)</span>
                            </div>

                            <div className="mb-6 md:mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-3xl md:text-4xl font-black text-dlsports-green">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                    </span>
                                    <span className="text-xs md:text-sm text-gray-400 line-through mb-1.5 opacity-60">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * 1.4)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 font-medium">
                                    <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>Em até <strong>10x sem juros</strong> no cartão</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-dlsports-green font-bold mt-1">
                                    <div className="w-4 h-4 flex items-center justify-center bg-dlsports-neon rounded-full text-[10px]">%</div>
                                    <span>5% de desconto no PIX</span>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-gray-900 uppercase text-xs md:text-sm tracking-wide">Tamanho</span>
                                    <button
                                        onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)}
                                        className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-black underline"
                                    >
                                        <Ruler className="w-3 h-3" /> Guia de Medidas
                                    </button>
                                </div>

                                {isSizeGuideOpen && (
                                    <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 animate-fade-in-down">
                                        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                                            <div className="flex justify-between border-b pb-1"><span>P</span> <span>70x50 cm</span></div>
                                            <div className="flex justify-between border-b pb-1"><span>M</span> <span>72x52 cm</span></div>
                                            <div className="flex justify-between border-b pb-1"><span>G</span> <span>74x54 cm</span></div>
                                            <div className="flex justify-between border-b pb-1"><span>GG</span> <span>76x56 cm</span></div>
                                            <div className="flex justify-between border-b pb-1"><span>XG</span> <span>78x58 cm</span></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    {product.sizes?.map((size: string) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-lg font-black border-2 transition-all flex items-center justify-center text-sm md:text-base ${selectedSize === size
                                                ? 'border-dlsports-green bg-dlsports-green text-white shadow-lg scale-105'
                                                : 'border-gray-200 text-gray-600 hover:border-black hover:bg-gray-50'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main CTA */}
                            <div className="flex flex-col gap-3 mb-10">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-dlsports-neon text-dlsports-green font-black py-4 md:py-5 rounded-xl uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(181,255,0,0.4)] hover:shadow-dlsports-neon/60 hover:-translate-y-1 text-sm md:text-base"
                                >
                                    <div className="bg-dlsports-green/20 p-2 rounded-full">
                                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    Adicionar ao Carrinho
                                </button>
                                <p className="text-center text-[10px] md:text-xs text-gray-400 font-medium">Compra 100% Segura e Garantida pelo Mercado Pago</p>
                            </div>

                            {/* Benefits Bullets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="bg-gray-100 p-2 rounded-full text-dlsports-green">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Escudo Bordado</h4>
                                        <p className="text-xs text-gray-500">Alta definição e durabilidade</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="bg-gray-100 p-2 rounded-full text-dlsports-green">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Envio Rastreado</h4>
                                        <p className="text-xs text-gray-500">Acompanhe seu pedido</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="bg-gray-100 p-2 rounded-full text-dlsports-green">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Tecido Premium</h4>
                                        <p className="text-xs text-gray-500">Tecnologia anti-suor</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="bg-gray-100 p-2 rounded-full text-dlsports-green">
                                        <Star className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Não Desbota</h4>
                                        <p className="text-xs text-gray-500">Garantia de qualidade</p>
                                    </div>
                                </div>
                            </div>

                            {/* Buy Together */}
                            {relatedProducts.length > 0 && (
                                <div className="border-t pt-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wide">Compre Junto e Economize</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-2">
                                            {/* Current Product */}
                                            <div className="flex-shrink-0 w-20 relative">
                                                <img src={images[0]} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center font-bold text-gray-400 shadow-sm z-10">+</div>
                                            </div>

                                            {/* Related Mock */}
                                            {relatedProducts.map((rp: any) => (
                                                <div key={rp.id} className="flex-shrink-0 w-20">
                                                    <img src={rp.image_url} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-bold text-gray-600">Leve o Kit completo</p>
                                                <p className="text-xs text-green-600 font-bold">Economize 15%</p>
                                            </div>
                                            <button className="text-xs font-bold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                                Ver Oferta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Description Tabs */}
                    <div className="border-t border-gray-100">
                        <div className="container mx-auto px-6 py-12">
                            <h3 className="text-xl font-bold mb-6">Detalhes do Produto</h3>
                            <div className="prose max-w-none text-gray-600">
                                <p className="mb-4">
                                    {product.description || 'A nova camisa oficial traz tecnologia de ponta para garantir conforto e performance. Desenvolvida com tecido respirável que afasta o suor da pele, mantendo você seco durante todo o jogo. O design moderno e arrojado representa a tradição e a glória do clube.'}
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Composição:</strong> 100% Poliéster Reciclado de alta performance.</li>
                                    <li><strong>Tecnologia:</strong> Dri-Fit / Aeroready (absorção de suor).</li>
                                    <li><strong>Origem:</strong> Importado.</li>
                                    <li><strong>Garantia:</strong> Contra defeito de fabricação.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
