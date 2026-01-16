
import { useState } from 'react';
import { Search, ShoppingCart, Menu, Heart, ChevronDown, X as XIcon, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MegaMenu, MENU_DATA } from './MegaMenu';

export function Header() {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
        }
    };





    return (
        <>
            <header className="bg-white sticky top-0 z-40 shadow-sm font-sans">
                {/* Main Header Row */}
                <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between gap-4 md:gap-8">
                    {/* Menu Toggle Mobile (Left) */}
                    <button className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMenuOpen(true)}>
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter text-dlsports-green">
                            DLS<span className="text-gray-800">PORTS</span>
                        </h1>
                    </Link>

                    {/* Search Bar - Hidden on small mobile, visible on tablet/desktop */}
                    <div className="hidden sm:flex flex-1 max-w-2xl relative">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="O que você procura?"
                                className="w-full h-10 md:h-12 pl-6 pr-12 rounded-full bg-gray-100 border border-transparent focus:bg-white focus:border-dlsports-green focus:outline-none transition-all text-sm text-gray-700"
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dlsports-green transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
                        {/* Search Icon Mobile */}
                        <button className="sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMenuOpen(true)}>
                            <Search className="w-6 h-6 text-gray-700" />
                        </button>



                        {/* Heart */}
                        <Link to="#" className="hidden sm:block relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Heart className="w-6 h-6 text-gray-700" />
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            <span className="absolute top-0 right-0 bg-dlsports-green text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation Bar - HIDDEN ON MOBILE */}
                <div className="hidden md:block border-t border-gray-100">
                    <div className="container mx-auto px-4 relative">
                        <nav className="flex items-center justify-between h-12">
                            {MENU_DATA.map(menu => (
                                <div
                                    key={menu.id}
                                    className="h-full flex items-center"
                                    onMouseEnter={() => setActiveMegaMenu(menu.id)}
                                    onMouseLeave={() => setActiveMegaMenu(null)}
                                >
                                    <Link
                                        to={menu.link}
                                        className={`
                                        flex items-center gap-1 text-sm font-bold tracking-wide px-3 h-full border-b-2 transition-all
                                        ${activeMegaMenu === menu.id ? 'border-dlsports-green text-dlsports-green' : 'border-transparent text-gray-600 hover:text-dlsports-green'}
                                    `}
                                    >
                                        {menu.label}
                                        {menu.hasMegaMenu && <ChevronDown className="w-3 h-3" />}
                                    </Link>

                                    {/* Render Mega Menu only for active item */}
                                    {activeMegaMenu === menu.id && <MegaMenu activeMenu={menu.id} />}
                                </div>
                            ))}

                            <Link to="/ofertas" className="h-8 bg-dlsports-green text-white text-xs font-bold px-4 rounded-full flex items-center hover:bg-dlsports-green/90 transition-colors">
                                OFERTAS
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Mobile Side Drawer Menu */}
                <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                    {/* Backdrop */}
                    <div
                        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50 font-sans">
                            <h2 className="text-2xl font-black italic text-dlsports-green">DLS<span className="text-gray-800">PORTS</span></h2>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <XIcon className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Search in Drawer */}
                        <div className="p-6 border-b border-gray-100">
                            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Procurar camisa..."
                                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-gray-100 border-none outline-none focus:ring-2 focus:ring-dlsports-green/20 text-sm"
                                />
                                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {MENU_DATA.map(menu => (
                                <div key={menu.id} className="border-b border-gray-50 last:border-none">
                                    <div className="flex justify-between items-center py-4">
                                        <Link to={menu.link} onClick={() => setIsMenuOpen(false)} className="text-lg font-black italic text-gray-800 uppercase">
                                            {menu.label}
                                        </Link>
                                    </div>
                                    {menu.hasMegaMenu && (
                                        <div className="pl-4 pb-4 space-y-4">
                                            {menu.columns?.map((col, idx) => (
                                                <div key={idx}>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{col.title}</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {col.items.slice(0, 4).map((item, i) => {
                                                            const label = typeof item === 'string' ? item : item.label;
                                                            const searchTerm = typeof item === 'string' ? item : item.search;
                                                            return (
                                                                <Link
                                                                    key={i}
                                                                    to={`${menu.link}?search=${encodeURIComponent(searchTerm)}`}
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:border-dlsports-green hover:text-dlsports-green transition-all"
                                                                >
                                                                    {label}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link to="/ofertas" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 mt-6 bg-dlsports-green text-white font-black italic rounded-xl shadow-lg shadow-dlsports-green/20">
                                <Star className="w-5 h-5 fill-current" /> OFERTAS
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
