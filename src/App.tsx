
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import { PromoBar } from './components/PromoBar';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Login } from './pages/admin/Login';
import { DashboardLayout } from './pages/admin/DashboardLayout';
import { Products } from './pages/admin/Products';
import { Orders } from './pages/admin/Orders';
import { Coupons } from './pages/admin/Coupons';
import { Cart } from './pages/Cart';
import { UserOrders } from './pages/UserOrders';
import { ProductDetail } from './pages/ProductDetail';

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <PromoBar />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-black italic mb-4 text-white">DLSPORTS <span className="text-dlsports-neon">⚽</span></h3>
            <p className="text-gray-400 text-sm mb-6">
              A maior loja de camisas de futebol do Brasil. Produtos oficiais e exclusivos para você vestir a glória.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dlsports-neon hover:text-black transition-all">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dlsports-neon hover:text-black transition-all">
                <WhatsappIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">INSTITUCIONAL</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-dlsports-neon transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-dlsports-neon transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-dlsports-neon transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">AJUDA</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/orders" className="hover:text-dlsports-neon transition-colors">Meus Pedidos</Link></li>
              <li><Link to="/nacionais" className="hover:text-dlsports-neon transition-colors">Produtos Nacionais</Link></li>
              <li><Link to="/europeus" className="hover:text-dlsports-neon transition-colors">Produtos Europeus</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">PAGAMENTO</h4>
            <div className="flex gap-2">
              {/* Placeholders for payment icons */}
              <div className="w-10 h-6 bg-gray-800 rounded border border-gray-700"></div>
              <div className="w-10 h-6 bg-gray-800 rounded border border-gray-700"></div>
              <div className="w-10 h-6 bg-gray-800 rounded border border-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-gray-600 text-sm">
          <p className="flex items-center justify-center gap-4">
            <span>© 2024 DLSPORTS. Todos os direitos reservados.</span>
            <Link to="/admin" className="text-gray-800 hover:text-dlsports-green transition-colors text-xs">Área Restrita</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function InstagramIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
}

function WhatsappIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.958 13.978c-.286-.145-1.693-.835-1.954-.93-.263-.095-.453-.143-.643.143-.19.288-.74 .93-.906 1.127-.168.197-.334.22-.62.077-.285-.143-1.205-.444-2.296-1.416-.849-.757-1.423-1.691-1.589-1.978-.166-.286-.018-.44.126-.583.131-.13.284-.336.425-.503.14-.167.188-.285.281-.476.096-.192.048-.36-.024-.504-.071-.144-.643-1.55-.88-2.122-.233-.56-.47-.483-.644-.492-.164-.009-.352-.009-.54-.009-.187 0-.493.07-.75.352-.258.283-1.002.977-1.002 2.383 0 1.406 1.025 2.766 1.168 2.956.143.19 2.02 3.085 4.893 4.321.684.294 1.217.47 1.632.602.686.218 1.311.186 1.808.113.555-.082 1.696-.693 1.935-1.362.24-.668.24-1.242.169-1.362-.073-.12-.262-.192-.548-.337z" /></svg>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nacionais" element={<Catalog />} />
          <Route path="/europeus" element={<Catalog />} />
          <Route path="/ofertas" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<Login />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="coupons" element={<Coupons />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
