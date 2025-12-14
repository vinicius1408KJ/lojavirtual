
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, LogOut, Package, Heart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { LoginModal } from './LoginModal';
import { supabase } from '../lib/supabase';
import { MegaMenu, MENU_DATA } from './MegaMenu';

export function Header() {
    const { cartCount } = useCart();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <>
            <header className="bg-white sticky top-0 z-40 shadow-sm font-sans">
                {/* Main Header Row */}
                <div className="container mx-auto px-4 h-24 flex items-center gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="text-4xl font-black italic tracking-tighter text-dlsports-green">
                            DLS<span className="text-gray-800">PORTS</span>
                        </h1>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-3xl relative">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="O que você procura?"
                                className="w-full h-12 pl-6 pr-12 rounded-full bg-gray-100 border border-transparent focus:bg-white focus:border-dlsports-green focus:outline-none focus:ring-2 focus:ring-dlsports-green/20 transition-all text-gray-700 placeholder-gray-400 group-hover:bg-white cursor-pointer"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 flex-shrink-0">
                        {/* Login */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-2 relative group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="w-8 h-8 rounded-full bg-dlsports-green text-white flex items-center justify-center font-bold text-sm">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-xs text-left">
                                    <p className="text-gray-500">Olá, {user.email?.split('@')[0]}</p>
                                    <p className="font-bold text-gray-800">Minha Conta</p>
                                </div>

                                {/* Dropdown User */}
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 text-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 border border-gray-100">
                                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors">
                                        <Package className="w-4 h-4" /> Meus Pedidos
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600">
                                        <LogOut className="w-4 h-4" /> Sair
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="hidden md:flex items-right gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors text-left"
                            >
                                <User className="w-6 h-6 text-gray-700" />
                                <div className="text-xs">
                                    <p className="text-gray-500">Bem-vindo :)</p>
                                    <p className="font-bold text-gray-800">Entre ou Cadastre-se</p>
                                </div>
                            </button>
                        )}

                        {/* Heart */}
                        <Link to="#" className="hidden md:block relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <Heart className="w-6 h-6 text-gray-700" />
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            <span className="absolute top-0 right-0 bg-dlsports-green text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </Link>

                        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="border-t border-gray-100">
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

                {/* Mobile Menu Overlay (Simplified) */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute top-full left-0 w-full shadow-lg z-50">
                        <nav className="flex flex-col gap-4">
                            {MENU_DATA.map(menu => (
                                <Link key={menu.id} to={menu.link} className="text-gray-800 font-bold py-2 border-b border-gray-100">
                                    {menu.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSuccess={(user) => {
                    setUser(user);
                    setIsLoginOpen(false);
                }}
            />
        </>
    );
}
