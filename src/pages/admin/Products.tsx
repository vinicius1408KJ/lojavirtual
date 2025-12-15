
import { useState } from 'react';
import { Plus, Trash, Edit, Power, PowerOff, X as XIcon } from 'lucide-react';
import { PRODUCTS } from '../../data';
import { AddProductFromGoogle } from '../../components/AddProductFromGoogle';
import type { Product } from '../../types';

export function Products() {
    // Initialize from LocalStorage if available, otherwise use default data
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('dlsports_products');
        return saved ? JSON.parse(saved) : PRODUCTS;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
        name: '',
        price: 0,
        club: '',
        image_url: '',
        description: '',
        active: true,
        sizes: ['P', 'M', 'G', 'GG']
    });

    // Helper to update state and storage
    const updateProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem('dlsports_products', JSON.stringify(newProducts));
    };

    const handleGoogleProductSelect = (productData: Partial<Product>) => {
        setCurrentProduct(prev => ({ ...prev, ...productData }));
        setIsModalOpen(true);
    };

    const handleSave = () => {
        let newProducts;
        if (currentProduct.id) {
            newProducts = products.map(p => p.id === currentProduct.id ? { ...p, ...currentProduct } as Product : p);
            alert('Produto atualizado com sucesso!');
        } else {
            const newId = Math.random().toString(36).substr(2, 9);
            newProducts = [...products, { ...currentProduct, id: newId } as Product];
            alert('Produto criado com sucesso!');
        }
        updateProducts(newProducts);
        setIsModalOpen(false);
        setCurrentProduct({ name: '', price: 0, club: '', image_url: '', description: '', active: true, sizes: ['P', 'M', 'G', 'GG'] });
    };

    const toggleActive = (id: string) => {
        const newProducts = products.map(p => {
            if (p.id === id) return { ...p, active: !p.active };
            return p;
        });
        updateProducts(newProducts);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Produtos</h2>
                <button
                    onClick={() => {
                        setCurrentProduct({ name: '', price: 0, club: '', image_url: '', description: '', active: true, sizes: ['P', 'M', 'G', 'GG'] });
                        setIsModalOpen(true);
                    }}
                    className="bg-dlsports-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-dlsports-green/90 transition-colors font-bold"
                >
                    <Plus className="w-5 h-5" /> Novo Produto
                </button>
            </div>

            {/* Smart Add Component */}
            <AddProductFromGoogle onProductSelect={handleGoogleProductSelect} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Produto</th>
                            <th className="p-4 font-semibold text-gray-600">Clube</th>
                            <th className="p-4 font-semibold text-gray-600">Preço</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 group">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded object-cover bg-gray-100" />
                                    <span className="font-medium text-gray-900 group-hover:text-dlsports-green transition-colors">{product.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{product.club}</td>
                                <td className="p-4 font-bold">R$ {product.price.toFixed(2)}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleActive(product.id)}
                                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${product.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                                    >
                                        {product.active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                                        {product.active ? 'Ativo' : 'Inativo'}
                                    </button>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                setCurrentProduct(product);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Tem certeza que deseja excluir este produto?')) {
                                                    const newProducts = products.filter(p => p.id !== product.id);
                                                    updateProducts(newProducts);
                                                    alert('Produto excluído com sucesso!');
                                                }
                                            }}
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit/Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="text-xl font-black italic text-gray-800">
                                {currentProduct.id ? 'Editar Produto' : 'Novo Produto'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <XIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Preview Image */}
                            {currentProduct.image_url && (
                                <div className="flex justify-center mb-6">
                                    <div className="relative group">
                                        <img src={currentProduct.image_url} alt="Preview" className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-200" />
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                            Imagem OK
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Produto</label>
                                <input
                                    type="text"
                                    value={currentProduct.name}
                                    onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green focus:ring-2 focus:ring-dlsports-green/20 outline-none transition-all"
                                    placeholder="Ex: Camisa Flamengo I 24/25"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Preço (R$)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.price}
                                        onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Clube</label>
                                    <input
                                        type="text"
                                        value={currentProduct.club}
                                        onChange={e => setCurrentProduct({ ...currentProduct, club: e.target.value })}
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                                        placeholder="Ex: Flamengo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Região / Estado (opcional)</label>
                                <input
                                    type="text"
                                    value={currentProduct.region || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, region: e.target.value })}
                                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                                    placeholder="Ex: Rio de Janeiro, Inglaterra, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem</label>
                                <input
                                    type="text"
                                    value={currentProduct.image_url}
                                    onChange={e => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none text-sm text-gray-600"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-dlsports-green transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, active: !currentProduct.active })}>
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.active ? 'bg-dlsports-green' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                                <span className="font-bold text-gray-700 select-none">Produto Ativo no Site?</span>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full h-14 bg-dlsports-green text-white font-black italic text-lg rounded-xl hover:bg-dlsports-green/90 transition-all shadow-lg shadow-dlsports-green/20 mt-4"
                            >
                                SALVAR PRODUTO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
