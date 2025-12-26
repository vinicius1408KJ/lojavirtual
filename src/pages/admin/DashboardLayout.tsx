import { Package, LogOut, Ticket } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dlsports-green text-white flex-shrink-0 flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-black italic">DLSPORTS <span className="text-dlsports-neon">ADMIN</span></h2>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${location.pathname === '/admin/dashboard' ? 'bg-white/10 text-dlsports-neon' : 'hover:bg-white/5'}`}>
                        <Package className="w-5 h-5" />
                        Produtos
                    </Link>

                    <NavLink
                        to="/admin/coupons"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-white/10 text-dlsports-neon' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Ticket className="w-5 h-5" />
                        Cupons
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors font-medium w-full text-left text-red-300 hover:text-red-200">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm h-16 flex items-center px-8 justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Painel Geral</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Olá, Admin</span>
                        <div className="w-8 h-8 rounded-full bg-dlsports-green text-dlsports-neon flex items-center justify-center font-bold">A</div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
