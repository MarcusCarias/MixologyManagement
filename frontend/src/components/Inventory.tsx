import { useState } from 'react';
import { Search, Plus, Edit, Settings } from 'lucide-react';

interface InventoryProps {
  onOpenAdjustment: (product: any) => void;
}

export function Inventory({ onOpenAdjustment }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Gin Tanqueray',
      brand: 'Tanqueray',
      category: 'Destilado',
      location: 'Bar Principal',
      currentQty: 14,
      parLevel: 8,
      size: '750ml',
      image: '🍸',
      stockPercent: 100
    },
    {
      id: 2,
      name: 'Whisky Jameson',
      brand: 'Jameson',
      category: 'Destilado',
      location: 'Bar Principal',
      currentQty: 5,
      parLevel: 5,
      size: '1L',
      image: '🥃',
      stockPercent: 60
    },
    {
      id: 3,
      name: 'Tônica Antárctica',
      brand: 'Antárctica',
      category: 'Mixer',
      location: 'Estoque Seco',
      currentQty: 24,
      parLevel: 60,
      size: '350ml',
      image: '🥤',
      stockPercent: 30
    },
    {
      id: 4,
      name: 'Vodka Absolut',
      brand: 'Absolut',
      category: 'Destilado',
      location: 'Bar Principal',
      currentQty: 3,
      parLevel: 10,
      size: '1L',
      image: '🍸',
      stockPercent: 25
    },
    {
      id: 5,
      name: 'Vinho Malbec',
      brand: 'Trapiche',
      category: 'Vinho',
      location: 'Adega Subsolo',
      currentQty: 18,
      parLevel: 12,
      size: '750ml',
      image: '🍷',
      stockPercent: 100
    },
    {
      id: 6,
      name: 'Cerveja Heineken',
      brand: 'Heineken',
      category: 'Cerveja',
      location: 'Estoque Seco',
      currentQty: 48,
      parLevel: 72,
      size: '330ml',
      image: '🍺',
      stockPercent: 50
    }
  ];

  const getStockColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || product.location === locationFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'low' && product.currentQty <= product.parLevel);
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Estoque</h1>
          <p className="text-gray-400">Lista mestre de produtos</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, marca, ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Categoria</label>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Todas</option>
              <option value="Destilado">Destilados</option>
              <option value="Vinho">Vinhos</option>
              <option value="Cerveja">Cervejas</option>
              <option value="Mixer">Mixers</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Localização</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Todas</option>
              <option value="Bar Principal">Bar Principal</option>
              <option value="Adega Subsolo">Adega Subsolo</option>
              <option value="Estoque Seco">Estoque Seco</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Tudo</option>
              <option value="low">Estoque Baixo</option>
              <option value="ordered">Em Pedido</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Produto & Marca</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Categoria</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Localização</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Nível de Estoque</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Qtd. Atual</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Par Level</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Tamanho</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div>
                        <p>{product.name}</p>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 text-gray-400">{product.location}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStockColor(product.stockPercent)} transition-all`}
                          style={{ width: `${product.stockPercent}%` }}
                        />
                      </div>
                      {product.currentQty <= product.parLevel && (
                        <span className="text-xs text-red-400">ALERTA</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.currentQty} un</td>
                  <td className="px-6 py-4 text-gray-400">{product.parLevel} un</td>
                  <td className="px-6 py-4 text-gray-400">{product.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onOpenAdjustment(product)}
                        className="p-2 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-center text-gray-400 text-sm">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </div>
    </div>
  );
}