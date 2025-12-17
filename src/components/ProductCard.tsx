import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link to={`/produto/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.active !== false && (
                        <span className="bg-white/90 backdrop-blur-sm text-black font-bold text-[10px] px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            Lançamento
                        </span>
                    )}
                </div>

                {/* Quick Action Button (Visual Only) */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <button className="w-full bg-white text-black font-bold text-sm py-3 rounded-lg hover:bg-dlsports-neon hover:text-black transition-colors uppercase tracking-wide shadow-lg">
                        Ver Detalhes
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest bg-gray-100 px-2 py-1 rounded-sm">{product.club || 'DLSports'}</p>
                    <div className="flex text-yellow-500 text-[10px]">
                        ★★★★★
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-1 leading-snug text-sm md:text-base line-clamp-2 h-10 group-hover:text-dlsports-green transition-colors">
                    {product.name}
                </h3>

                <div className="mt-4 flex items-end justify-between border-t pt-3 border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * 1.5)}
                        </span>
                        <span className="text-lg font-black text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                        <span className="text-[10px] text-green-600 font-bold">
                            5% OFF no PIX
                        </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-dlsports-green group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
