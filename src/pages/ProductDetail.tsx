import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Ruler, Truck, ShieldCheck, Star } from 'lucide-react';
import { PRODUCTS } from '../data';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('');

    // In a real app, fetch from Supabase by slug
    const product = PRODUCTS.find(p => p.slug === slug);

    if (!product) {
        return <div className="text-center py-20">Produto não encontrado</div>;
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Por favor, selecione um tamanho.');
            return;
        }
        addToCart(product, selectedSize);
        navigate('/cart');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="bg-gray-100 p-8 flex items-center justify-center">
                        <div className="relative group overflow-hidden rounded-xl bg-white shadow-lg w-full max-w-md aspect-[4/5]">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 cursor-zoom-in"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {product.club}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-dlsports-green">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                            </span>
                            <span className="bg-dlsports-neon/20 text-dlsports-green text-xs font-bold px-2 py-1 rounded">
                                10x sem juros
                            </span>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description || 'Vista as cores do seu time de coração com essa camisa oficial. Tecnologia de tecido respirável para máximo conforto dentro e fora de campo.'}
                        </p>

                        {/* Sizes */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-gray-900">Selecione o Tamanho</span>
                                <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-black">
                                    <Ruler className="w-4 h-4" /> Guia de Medidas
                                </button>
                            </div>
                            <div className="flex gap-3">
                                {product.sizes?.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-lg font-bold border-2 transition-all ${selectedSize === size
                                                ? 'border-dlsports-green bg-dlsports-green text-white'
                                                : 'border-gray-200 text-gray-600 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-dlsports-neon text-dlsports-green font-black py-4 rounded-xl uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(181,255,0,0.3)] hover:shadow-[0_0_30px_rgba(181,255,0,0.5)]"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Adicionar ao Carrinho
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-dlsports-green" />
                                <span>Frete Grátis acima de R$ 299</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-dlsports-green" />
                                <span>Garantia de Autenticidade</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-dlsports-green" />
                                <span>Produto 5 Estrelas</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
