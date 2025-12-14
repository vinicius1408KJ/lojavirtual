import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabase';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // For demo purposes, we'll just check hardcoded credentials or try supabase auth
        // The prompt specified admin@dlsports.com.br / dlsports2025
        if (email === 'admin@dlsports.com.br' && password === 'dlsports2025') {
            // Mock auth success
            localStorage.setItem('admin_auth', 'true');
            navigate('/admin/dashboard');
        } else {
            alert('Credenciais inválidas');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-dlsports-green flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-black text-center mb-8 italic">DLSPORTS <span className="text-dlsports-green">ADMIN</span></h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-dlsports-green"
                            placeholder="admin@dlsports.com.br"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-dlsports-green"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-dlsports-neon p-4 rounded-lg font-black text-dlsports-green hover:brightness-110 transition-all uppercase tracking-wider"
                    >
                        {loading ? 'Entrando...' : 'Acessar Painel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
