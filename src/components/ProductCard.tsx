import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link to={`/produto/${product.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
            <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-dlsports-neon text-dlsports-green font-bold text-xs px-2 py-1 rounded-full">
                        NOVO
                    </span>
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">{product.club}</p>
                <h3 className="font-bold text-gray-900 mb-2 leading-tight h-10 line-clamp-2 group-hover:text-dlsports-green transition-colors">{product.name}</h3>
                <div className="mt-2">
                    <span className="text-xl font-black text-dlsports-green">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                    <div className="mt-1">
                        <span className="text-xs font-bold text-dlsports-neon bg-black px-2 py-0.5 rounded">
                            10x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 10)} sem juros
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
