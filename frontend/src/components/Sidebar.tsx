import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, User } from 'lucide-react';

type View = 'dashboard' | 'inventory' | 'movements' | 'reports';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onSettingsClick?: () => void;
}

export function Sidebar({ currentView, onNavigate, onSettingsClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'inventory' as View, icon: Package, label: 'Estoque' },
    { id: 'movements' as View, icon: ShoppingCart, label: 'Histórico' },
    { id: 'reports' as View, icon: BarChart3, label: 'Relatórios' },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <path d="M12 2L8 6H6C4.9 6 4 6.9 4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8C20 6.9 19.1 6 18 6H16L12 2Z" 
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12L16 12M12 8V16" 
                    stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Mixology Management</h1>
            <p className="text-xs text-gray-400">Gestão de Estoque</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-400 hover:bg-zinc-800 hover:text-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800 cursor-pointer hover:bg-zinc-700 transition-colors" onClick={onSettingsClick}>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm">Charles Alexandre</p>
            <p className="text-xs text-gray-400">Estoquista</p>
          </div>
          <button className="text-gray-400 hover:text-gray-200 transition-colors" title="Configurações">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}