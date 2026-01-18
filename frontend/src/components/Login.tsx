import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12">
              <path 
                d="M12 2L8 6H6C4.9 6 4 6.9 4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8C20 6.9 19.1 6 18 6H16L12 2Z" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M8 12L16 12M12 8V16" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl mb-2">Mixology Management</h1>
          <p className="text-gray-400">Sistema de Gestão de Estoque</p>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl mb-6 text-center">Bem-vindo de volta</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-orange-600 focus:ring-orange-600 focus:ring-offset-zinc-900"
                />
                <span className="text-sm text-gray-400">Lembrar-me</span>
              </label>
              <a href="#" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium"
            >
              Entrar
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?{' '}
              <a href="#" className="text-orange-500 hover:text-orange-400 transition-colors">
                Fale com o administrador
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Mixology Management. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
