import { Package, LogOut, Ticket, Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex relative">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-dlsports-green text-dlsports-neon rounded-full shadow-2xl"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-dlsports-green text-white flex flex-col transform transition-transform duration-300 ease-in-out
                lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black italic">DLSPORTS <span className="text-dlsports-neon text-sm">ADMIN</span></h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-6 h-6 text-dlsports-neon" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                        to="/admin/dashboard"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${location.pathname === '/admin/dashboard' ? 'bg-white/10 text-dlsports-neon shadow-sm' : 'hover:bg-white/5 text-gray-300'}`}
                    >
                        <Package className="w-5 h-5" />
                        Produtos
                    </Link>

                    <NavLink
                        to="/admin/coupons"
                        onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-white/10 text-dlsports-neon shadow-sm' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                    >
                        <Ticket className="w-5 h-5" />
                        Cupons
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all font-medium w-full text-left text-red-300 hover:text-red-200">
                        <LogOut className="w-5 h-5" />
                        Sair do Painel
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                <header className="bg-white shadow-sm h-16 md:h-20 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
                    <div>
                        <h1 className="text-lg md:text-xl font-black italic text-gray-900 uppercase tracking-tight">
                            {location.pathname === '/admin/dashboard' ? 'Gerenciador de Produtos' : 'Controle de Cupons'}
                        </h1>
                        <p className="hidden md:block text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Bem-vindo de volta, Administrador</p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-xs font-black italic text-gray-900 leading-none">ADMINISTRADOR</span>
                            <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-dlsports-green flex items-center justify-center font-black italic shadow-inner">
                            DLS
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
