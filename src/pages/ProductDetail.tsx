import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Ruler, ShieldCheck, Star, CheckCircle2, Truck, X as XIcon } from 'lucide-react';
// PRODUCTS import removed
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { toast } from '../lib/toast';

export function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [activeImage, setActiveImage] = useState(0);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            if (!slug) return;
            setLoading(true);
            try {
                // Fetch main product
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) throw error;
                setProduct(data);

            } catch (err) {
                console.error('Error fetching product:', err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner">Carregando detalhes...</div>
            </div>
        );
    }

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

    // Dynamic images for gallery
    const galleryImages = [product.image_url];
    if (product.back_image_url) {
        galleryImages.push(product.back_image_url);
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Por favor, selecione um tamanho.');
            return;
        }
        addToCart(product, selectedSize);
        toast.success(`Camisa ${product.club} adicionada ao carrinho!`);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="container mx-auto px-4 text-xs text-gray-500 uppercase tracking-wider">
                    Home / {product.is_national ? 'Nacionais' : product.is_selection ? 'Seleções' : 'Europeus'} / <span className="text-black font-bold">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-4 md:py-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Left: Gallery */}
                        <div className="p-4 md:p-8 bg-gray-50 flex flex-col items-center">
                            <div className="relative w-full max-w-[500px] aspect-[4/5] bg-white rounded-2xl shadow-lg overflow-hidden group mb-4">
                                <img
                                    src={galleryImages[activeImage]}
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
                            <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-[500px] scrollbar-hide">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-16 h-20 md:w-24 md:h-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all relative group ${activeImage === idx ? 'border-dlsports-green ring-2 ring-dlsports-green/20' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-[8px] text-white font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            {idx === 0 ? 'Frente' : 'Costas'}
                                        </div>
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
                                {product.club && <span className="font-bold text-black uppercase">{product.club}</span>}
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
                                    {product.sizes && product.sizes.length > 0 ? (
                                        product.sizes.map((size: string) => (
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
                                        ))
                                    ) : (
                                        <div className="w-full p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold text-sm flex items-center gap-2">
                                            <XIcon className="w-4 h-4" /> Sem estoque para pronta entrega no momento.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main CTA */}
                            <div className="flex flex-col gap-3 mb-10">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.sizes || product.sizes.length === 0}
                                    className={`w-full font-black py-4 md:py-5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg text-sm md:text-base ${(!product.sizes || product.sizes.length === 0)
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-dlsports-neon text-dlsports-green hover:brightness-110 shadow-[0_4px_20px_rgba(181,255,0,0.4)] hover:shadow-dlsports-neon/60 hover:-translate-y-1'
                                        }`}
                                >
                                    <div className={`${(!product.sizes || product.sizes.length === 0) ? 'bg-gray-300' : 'bg-dlsports-green/20'} p-2 rounded-full`}>
                                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    {(!product.sizes || product.sizes.length === 0) ? 'Indisponível' : 'Adicionar ao Carrinho'}
                                </button>
                                <p className="text-center text-[10px] md:text-xs text-gray-400 font-medium">Compra 100% Segura e Garantida</p>
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


                        </div>
                    </div>

                    {/* Description Tabs */}
                    <div className="border-t border-gray-100">
                        <div className="container mx-auto px-6 py-12">
                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-4">Descrição</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                            <h4 className="font-bold text-gray-900 mb-4 mt-8 uppercase tracking-wider text-xs border-b pb-2">Especificações Técnicas</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm mt-4">
                                <li className="flex items-center gap-2 text-gray-600"><div className="w-1.5 h-1.5 bg-dlsports-green rounded-full"></div><strong>Composição:</strong> <span>100% Poliéster Premium</span></li>
                                <li className="flex items-center gap-2 text-gray-600"><div className="w-1.5 h-1.5 bg-dlsports-green rounded-full"></div><strong>Tecnologia:</strong> <span>Respirável (Dri-Fit/Aeroready)</span></li>
                                <li className="flex items-center gap-2 text-gray-600"><div className="w-1.5 h-1.5 bg-dlsports-green rounded-full"></div><strong>Origem:</strong> <span>Importado</span></li>
                                <li className="flex items-center gap-2 text-gray-600"><div className="w-1.5 h-1.5 bg-dlsports-green rounded-full"></div><strong>Garantia:</strong> <span>Contra defeito de fabricação</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
