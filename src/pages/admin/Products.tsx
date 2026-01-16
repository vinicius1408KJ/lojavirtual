
import { useState, useEffect } from 'react';
import { Plus, Trash, Edit, Power, PowerOff, X as XIcon, Link as LinkIcon, GripVertical, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
// PRODUCTS import removed
import { supabase } from '../../lib/supabase';
import { AddProductFromGoogle } from '../../components/AddProductFromGoogle';
import type { Product } from '../../types';

export function Products() {
    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (data) setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
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
        is_new: false,
        back_image_url: '',
        sort_order: 0,
        sizes: ['P', 'M', 'G', 'GG', 'XG']
    });

    const handleGoogleProductSelect = (productData: Partial<Product>) => {
        setCurrentProduct(prev => ({ ...prev, ...productData }));
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            // Data Cleaning
            const cleanProduct: any = { ...currentProduct };

            if (!cleanProduct.name) {
                alert('O nome do produto é obrigatório');
                return;
            }

            // Ensure price is a valid number
            cleanProduct.price = Number(cleanProduct.price) || 0;

            // Handle old_price carefully (avoid NaN)
            if (cleanProduct.old_price !== undefined && cleanProduct.old_price !== null && cleanProduct.old_price !== '') {
                const val = Number(cleanProduct.old_price);
                if (isNaN(val)) {
                    delete cleanProduct.old_price;
                } else {
                    cleanProduct.old_price = val;
                }
            } else {
                // If it's empty, send null to database instead of empty string or NaN
                cleanProduct.old_price = null;
            }

            // Ensure slug exists
            if (!cleanProduct.slug) {
                cleanProduct.slug = cleanProduct.name.toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // remove accents
                    .replace(/[^\w\s-]/g, '')       // remove special chars
                    .replace(/\s+/g, '-')           // spaces to hyphens
                    .replace(/-+/g, '-');            // collapse multiple hyphens
            }

            if (cleanProduct.id) {
                const { id, created_at, updated_at, ...updateData } = cleanProduct;
                const { error } = await supabase
                    .from('products')
                    .update(updateData)
                    .eq('id', id);
                if (error) throw error;
                alert('Produto atualizado com sucesso!');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([cleanProduct]);
                if (error) throw error;
                alert('Produto criado com sucesso!');
            }

            await fetchProducts();
            setIsModalOpen(false);
            resetCurrentProduct();
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(`Erro ao salvar produto: ${error.message || 'Verifique os dados e a conexão.'}`);
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
            is_new: false,
            is_retro: false,
            back_image_url: '',
            sort_order: 0,
            sizes: ['P', 'M', 'G', 'GG', 'XG']
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

    const [searchTerm, setSearchTerm] = useState('');


    // Filter Logic
    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
            (product.name || '').toLowerCase().includes(lowerSearch) ||
            (product.club || '').toLowerCase().includes(lowerSearch) ||
            (product.region || '').toLowerCase().includes(lowerSearch)
        );
    });

    const onDragEnd = async (result: DropResult) => {
        // ... (código existente onDragEnd, mas só executa se search estiver vazio implicitamente pelo UI)
        if (!result.destination) return;

        const items = Array.from(products); // Sempre usa lista completa original para reordenar
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // ... (resto da lógica de reordenação)

        // Update sort_order locally for optimistic UI
        const updatedItems = items.map((item, index) => ({
            ...item,
            sort_order: index
        }));

        setProducts(updatedItems);

        try {
            const updates = updatedItems.map((product) => ({
                id: product.id,
                sort_order: product.sort_order
            }));

            for (let i = 0; i < updates.length; i++) {
                await supabase
                    .from('products')
                    .update({ sort_order: updates[i].sort_order })
                    .eq('id', updates[i].id);
            }
        } catch (error) {
            console.error('Error updating sort order:', error);
            alert('Erro ao salvar a nova ordem no servidor.');
        }
    };

    // ...

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black italic text-gray-900 uppercase tracking-tighter">Gerenciar Produtos</h2>
                    <p className="text-gray-500 text-sm">Arraste os itens para definir a ordem de exibição no site.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Buscar produto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-dlsports-green focus:outline-none"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <button
                            onClick={() => fetchProducts()}
                            className="flex-1 md:flex-none px-4 py-2.5 text-gray-600 hover:text-dlsports-green font-bold transition-all text-xs border border-gray-200 rounded-xl bg-white shadow-sm active:scale-95"
                        >
                            Atualizar
                        </button>
                        <button
                            onClick={() => {
                                resetCurrentProduct();
                                setIsModalOpen(true);
                            }}
                            className="flex-1 md:flex-none bg-dlsports-green text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-dlsports-green/90 transition-all font-black italic shadow-lg shadow-dlsports-green/20 active:scale-95 text-xs"
                        >
                            <Plus className="w-4 h-4" /> NOVO PRODUTO
                        </button>
                    </div>
                </div>
            </div>

            {/* Smart Add Component */}
            <div className="mb-8">
                <AddProductFromGoogle onProductSelect={handleGoogleProductSelect} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 hidden md:grid grid-cols-12 gap-4 text-xs font-black uppercase tracking-widest text-gray-400">
                    <div className="col-span-1 text-center">Ordem</div>
                    <div className="col-span-4">Produto</div>
                    <div className="col-span-2">Clube</div>
                    <div className="col-span-2">Preço</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                {searchTerm ? (
                    // Render filtered list WITHOUT DragDrop
                    <div className="divide-y divide-gray-100">
                        {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                            <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/80">
                                {/* Static Order (No Drag Handle) */}
                                <div className="col-span-1 flex flex-col items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400">#{product.sort_order}</span>
                                </div>
                                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                    <div className="relative group shrink-0">
                                        <img src={product.image_url} alt={product.name} className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover bg-gray-100 border border-gray-200 shadow-sm" />
                                        {!product.active && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl"><PowerOff className="w-4 h-4 text-gray-400" /></div>}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 leading-tight mb-0.5 truncate">{product.name}</p>
                                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{product.is_national ? 'Nacional' : 'Internacional'}</span>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block px-2 md:px-0">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Clube:</span>
                                    <span className="text-sm font-medium text-gray-600">{product.club || '-'}</span>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block px-2 md:px-0">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Preço:</span>
                                    <div>
                                        <p className="font-black italic text-gray-900">R$ {product.price.toFixed(2)}</p>
                                        {product.old_price && <p className="text-[10px] text-red-500 line-through">R$ {product.old_price.toFixed(2)}</p>}
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block px-2 md:px-0">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Status:</span>
                                    <button onClick={() => toggleActive(product.id, !!product.active)} className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border transition-all ${product.active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
                                        {product.active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                                        {product.active ? 'Ativo' : 'Inativo'}
                                    </button>
                                </div>
                                <div className="col-span-1 md:col-span-1 flex justify-end gap-3 md:gap-2 border-t md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
                                    <button onClick={() => { setCurrentProduct(product); setIsModalOpen(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Editar"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Excluir"><Trash className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-400">Nenhum produto encontrado para "{searchTerm}"</div>
                        )}
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="products-list">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="divide-y divide-gray-100"
                                >
                                    {products.map((product, index) => (
                                        <Draggable key={product.id} draggableId={product.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center transition-all ${snapshot.isDragging ? 'bg-dlsports-green/5 shadow-2xl scale-[1.02] border-y border-dlsports-green/20 z-10' : 'hover:bg-gray-50/80'}`}
                                                >
                                                    {/* Drag Handle & Manual Order */}
                                                    <div className="col-span-1 flex flex-col items-center gap-2">
                                                        <div {...provided.dragHandleProps} className="p-1 hover:bg-gray-200 rounded cursor-grab active:cursor-grabbing text-gray-400">
                                                            <GripVertical className="w-5 h-5" />
                                                        </div>
                                                        <input
                                                            type="number"
                                                            value={product.sort_order || 0}
                                                            onChange={async (e) => {
                                                                const newVal = parseInt(e.target.value) || 0;
                                                                // Optimistic UI update with automatic positioning
                                                                const updatedProducts = products.map(p =>
                                                                    p.id === product.id ? { ...p, sort_order: newVal } : p
                                                                ).sort((a, b) => {
                                                                    if ((a.sort_order || 0) !== (b.sort_order || 0)) {
                                                                        return (a.sort_order || 0) - (b.sort_order || 0);
                                                                    }
                                                                    // Secondary sort: most recent first (matches fetchProducts)
                                                                    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
                                                                    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
                                                                    return timeB - timeA;
                                                                });
                                                                setProducts(updatedProducts);

                                                                // Supabase update
                                                                const { error } = await supabase
                                                                    .from('products')
                                                                    .update({ sort_order: newVal })
                                                                    .eq('id', product.id);

                                                                if (error) {
                                                                    alert('Erro ao atualizar ordem');
                                                                    fetchProducts(); // rollback
                                                                }
                                                            }}
                                                            className="w-10 h-8 text-center text-xs font-bold border border-gray-200 rounded focus:border-dlsports-green outline-none"
                                                            title="Posição Manual"
                                                        />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                                        <div className="relative group shrink-0">
                                                            <img
                                                                src={product.image_url}
                                                                alt={product.name}
                                                                className="w-12 h-12 md:w-14 md:h-14 rounded-xl object-cover bg-gray-100 border border-gray-200 shadow-sm"
                                                            />
                                                            {!product.active && <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl"><PowerOff className="w-4 h-4 text-gray-400" /></div>}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 leading-tight mb-0.5 truncate">{product.name}</p>
                                                            <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">{product.is_national ? 'Nacional' : 'Internacional'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Club */}
                                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block px-2 md:px-0">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Clube:</span>
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {product.club || '-'}
                                                        </span>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block px-2 md:px-0">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Preço:</span>
                                                        <div>
                                                            <p className="font-black italic text-gray-900">R$ {product.price.toFixed(2)}</p>
                                                            {product.old_price && <p className="text-[10px] text-red-500 line-through">R$ {product.old_price.toFixed(2)}</p>}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block px-2 md:px-0">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">Status:</span>
                                                        <button
                                                            onClick={() => toggleActive(product.id, !!product.active)}
                                                            className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border transition-all ${product.active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                                                        >
                                                            {product.active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                                                            {product.active ? 'Ativo' : 'Inativo'}
                                                        </button>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-1 md:col-span-1 flex justify-end gap-3 md:gap-2 border-t md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
                                                        <button
                                                            onClick={() => {
                                                                setCurrentProduct(product);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                            title="Excluir"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
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
                            <div className="flex justify-center gap-8 mb-6">
                                {/* Front Photo */}
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Frente</p>
                                    <div className="relative group">
                                        {currentProduct.image_url ? (
                                            <img
                                                src={currentProduct.image_url}
                                                alt="Preview Frente"
                                                className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200 bg-gray-50"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Imagem+Invalida';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400">
                                                <LinkIcon className="w-8 h-8 mb-2" />
                                                <span className="text-[8px] uppercase font-bold text-center px-4">Link Foto Frente</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Back Photo */}
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Atrás</p>
                                    <div className="relative group">
                                        {currentProduct.back_image_url ? (
                                            <img
                                                src={currentProduct.back_image_url}
                                                alt="Preview Atrás"
                                                className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-200 bg-gray-50"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Imagem+Invalida';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400">
                                                <LinkIcon className="w-8 h-8 mb-2" />
                                                <span className="text-[8px] uppercase font-bold text-center px-4">Link Foto Atrás</span>
                                            </div>
                                        )}
                                    </div>
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
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">URL Foto Frente</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={currentProduct.image_url || ''}
                                                onChange={e => setCurrentProduct({ ...currentProduct, image_url: e.target.value })}
                                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none text-sm"
                                                placeholder="Cole o link da frente"
                                            />
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">URL Foto Atrás (Costas)</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={currentProduct.back_image_url || ''}
                                                onChange={e => setCurrentProduct({ ...currentProduct, back_image_url: e.target.value })}
                                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none text-sm"
                                                placeholder="Cole o link das costas"
                                            />
                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
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

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-dlsports-neon transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, is_new: !currentProduct.is_new })}>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.is_new ? 'bg-dlsports-neon' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.is_new ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 select-none text-xs">Marcar como Lançamento?</span>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-orange-500 transition-colors cursor-pointer" onClick={() => setCurrentProduct({ ...currentProduct, is_retro: !currentProduct.is_retro })}>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${currentProduct.is_retro ? 'bg-orange-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${currentProduct.is_retro ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <span className="font-bold text-gray-700 select-none text-xs">É Camisa Retrô?</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Tamanhos Disponíveis (Pronta Entrega)</label>
                                <div className="flex flex-wrap gap-2">
                                    {['P', 'M', 'G', 'GG', 'XG'].map(size => {
                                        const isSelected = (currentProduct.sizes || []).includes(size);
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    const newSizes = isSelected
                                                        ? (currentProduct.sizes || []).filter(s => s !== size)
                                                        : [...(currentProduct.sizes || []), size];
                                                    setCurrentProduct({ ...currentProduct, sizes: newSizes });
                                                }}
                                                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold border-2 transition-all ${isSelected
                                                    ? 'bg-dlsports-green border-dlsports-green text-white shadow-lg shadow-dlsports-green/20'
                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-dlsports-green hover:text-dlsports-green'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
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
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Ordem (Exibição)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.sort_order || 0}
                                        onChange={e => setCurrentProduct({ ...currentProduct, sort_order: parseInt(e.target.value) })}
                                        className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-dlsports-green outline-none text-sm"
                                        placeholder="0"
                                    />
                                </div>
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
