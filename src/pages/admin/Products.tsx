
import { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Power, PowerOff, X as XIcon, Link as LinkIcon } from 'lucide-react';
// PRODUCTS import removed
import { supabase } from '../../lib/supabase';
import { AddProductFromGoogle } from '../../components/AddProductFromGoogle';
import type { Product } from '../../types';

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const { data, error } = await supabase.from('products').select('*');
            if (error) throw error;
            if (data) setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
        name: '',
        price: 0,
        club: '',
        image_url: '',
        description: '',
        active: true,
        is_national: false,
        is_selection: false,
        is_offer: false,
        sizes: ['P', 'M', 'G', 'GG']
    });

    const handleGoogleProductSelect = (productData: Partial<Product>) => {
        setCurrentProduct(prev => ({ ...prev, ...productData }));
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            let finalProduct = { ...currentProduct };

            // Ensure slug exists
            if (!finalProduct.slug && finalProduct.name) {
                finalProduct.slug = finalProduct.name.toLowerCase()
                    .replace(/[^\w\s-]/g, '') // remove special chars
                    .replace(/\s+/g, '-');     // replace spaces with hyphens
            }

            if (finalProduct.id) {
                const { error } = await supabase
                    .from('products')
                    .update(finalProduct)
                    .eq('id', finalProduct.id);
                if (error) throw error;
                alert('Produto atualizado com sucesso!');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([finalProduct]);
                if (error) throw error;
                alert('Produto criado com sucesso!');
            }

            await fetchProducts();
            setIsModalOpen(false);
            resetCurrentProduct();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erro ao salvar produto');
        }
    };

    const resetCurrentProduct = () => {
        setCurrentProduct({
            name: '',
            price: 0,
            club: '',
            image_url: '',
            description: '',
            active: true,
            is_national: false,
            is_selection: false,
            is_offer: false,
            sizes: ['P', 'M', 'G', 'GG']
        });
    };

    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ active: !currentStatus })
                .eq('id', id);
            if (error) throw error;
            await fetchProducts();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Erro ao alterar status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            alert('Produto excluído com sucesso!');
            await fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Erro ao excluir produto');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Carregando produtos...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Produtos</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (confirm("Deseja atualizar a lista de produtos?")) {
                                fetchProducts();
                            }
                        }}
                        className="px-4 py-2 text-gray-500 hover:text-dlsports-green font-bold transition-colors text-xs"
                    >
                        Atualizar Lista
                    </button>
                    <button
                        onClick={() => {
                            resetCurrentProduct();
                            setIsModalOpen(true);
                        }}
                        className="bg-dlsports-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-dlsports-green/90 transition-colors font-bold"
                    >
                        <Plus className="w-5 h-5" /> Novo Produto
                    </button>
                </div>
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
                                        onClick={() => toggleActive(product.id, !!product.active)}
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
                                            onClick={() => handleDelete(product.id)}
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
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    {currentProduct.image_url ? (
                                        <img
                                            src={currentProduct.image_url}
                                            alt="Preview"
                                            className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-200 bg-gray-50"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Imagem+Invalida';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400">
                                            <LinkIcon className="w-8 h-8 mb-2" />
                                            <span className="text-[10px] uppercase font-bold text-center px-4">URL da foto obrigatória</span>
                                        </div>
                                    )}
                                    {currentProduct.image_url && (
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            Preview Online
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Produto</label>
                                <input
                                    type="text"
                                    value={currentProduct.name || ''}
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
                                        value={currentProduct.price || 0}
                                        onChange={e => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Clube</label>
                                    <input
                                        type="text"
                                        value={currentProduct.club || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, club: e.target.value })}
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                                        placeholder="Ex: Flamengo"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Região / Estado</label>
                                    <input
                                        type="text"
                                        value={currentProduct.region || ''}
                                        onChange={e => setCurrentProduct({ ...currentProduct, region: e.target.value })}
                                        className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none"
                                        placeholder="Ex: Rio de Janeiro"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">URL da Imagem</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={currentProduct.image_url || ''}
                                            onChange={e => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                            className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none text-sm"
                                            placeholder="Cole o link da imagem aqui"
                                        />
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-dlsports-green transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, active: !currentProduct.active })}>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.active ? 'bg-dlsports-green' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 select-none text-xs">Produto Ativo?</span>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-dlsports-green transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, is_national: !currentProduct.is_national })}>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.is_national ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.is_national ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 select-none text-xs">É Nacional?</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-yellow-500 transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, is_selection: !currentProduct.is_selection })}>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.is_selection ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.is_selection ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 select-none text-xs">É Seleção?</span>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-500 transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, is_offer: !currentProduct.is_offer })}>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.is_offer ? 'bg-red-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.is_offer ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 select-none text-xs">Em Oferta?</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Preço Antigo (R$)</label>
                                <input
                                    type="number"
                                    value={currentProduct.old_price || ''}
                                    onChange={e => setCurrentProduct({ ...currentProduct, old_price: parseFloat(e.target.value) })}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-red-500 outline-none text-sm"
                                    placeholder="Preço sem desconto"
                                />
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
