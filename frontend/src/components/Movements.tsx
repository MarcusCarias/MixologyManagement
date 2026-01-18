import { useState } from 'react';
import { Calendar, ArrowUpDown, Filter, Download, ArrowUp, ArrowDown, Plus, Minus, AlertCircle } from 'lucide-react';

export function Movements() {
  const [dateFilter, setDateFilter] = useState('today');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const movements = [
    {
      id: 1,
      date: '17/01/2026',
      time: '14:32',
      product: 'Jack Daniels',
      type: 'Saída',
      category: 'Venda',
      quantity: -2,
      user: 'Carlos Silva',
      location: 'Bar Principal',
      notes: 'Mesa 15'
    },
    {
      id: 2,
      date: '17/01/2026',
      time: '13:15',
      product: 'Gin Tanqueray',
      type: 'Entrada',
      category: 'Recebimento',
      quantity: 12,
      user: 'Charles Alexandre',
      location: 'Estoque Seco',
      notes: 'NF 45782'
    },
    {
      id: 3,
      date: '17/01/2026',
      time: '12:45',
      product: 'Vodka Absolut',
      type: 'Saída',
      category: 'Quebra',
      quantity: -1,
      user: 'Ana Santos',
      location: 'Bar Principal',
      notes: 'Garrafa quebrada'
    },
    {
      id: 4,
      date: '17/01/2026',
      time: '10:22',
      product: 'Tônica Antárctica',
      type: 'Saída',
      category: 'Evento',
      quantity: -24,
      user: 'Carlos Silva',
      location: 'Bar Principal',
      notes: 'Evento corporativo'
    },
    {
      id: 5,
      date: '16/01/2026',
      time: '18:30',
      product: 'Vinho Malbec',
      type: 'Entrada',
      category: 'Recebimento',
      quantity: 6,
      user: 'Charles Alexandre',
      location: 'Adega Subsolo',
      notes: 'NF 45780'
    },
    {
      id: 6,
      date: '16/01/2026',
      time: '16:45',
      product: 'Whisky Jameson',
      type: 'Saída',
      category: 'Venda',
      quantity: -3,
      user: 'Ana Santos',
      location: 'Bar Principal',
      notes: 'Consumo salão'
    },
    {
      id: 7,
      date: '16/01/2026',
      time: '15:10',
      product: 'Cerveja Heineken',
      type: 'Ajuste',
      category: 'Inventário',
      quantity: 5,
      user: 'Charles Alexandre',
      location: 'Estoque Seco',
      notes: 'Contagem física'
    },
    {
      id: 8,
      date: '16/01/2026',
      time: '11:20',
      product: 'Gin Tanqueray',
      type: 'Saída',
      category: 'Transferência',
      quantity: -4,
      user: 'Carlos Silva',
      location: 'Bar Principal',
      notes: 'Para bar secundário'
    }
  ];

  const filteredMovements = movements.filter(mov => {
    const matchesType = typeFilter === 'all' || mov.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || mov.category === categoryFilter;
    return matchesType && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    if (type === 'Entrada') return <ArrowDown className="text-green-500" size={20} />;
    if (type === 'Saída') return <ArrowUp className="text-red-500" size={20} />;
    return <ArrowUpDown className="text-yellow-500" size={20} />;
  };

  const getTypeColor = (type: string) => {
    if (type === 'Entrada') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (type === 'Saída') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, string> = {
      'Venda': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Recebimento': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Quebra': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Evento': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Ajuste': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Transferência': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'Inventário': 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };
    return badges[category] || 'bg-zinc-700 text-gray-400';
  };

  const summary = {
    totalIn: movements.filter(m => m.quantity > 0).reduce((sum, m) => sum + m.quantity, 0),
    totalOut: Math.abs(movements.filter(m => m.quantity < 0).reduce((sum, m) => sum + m.quantity, 0)),
    totalMovements: movements.length
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Histórico de Movimentações</h1>
          <p className="text-gray-400">Rastreamento completo de entrada e saída</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors">
            <Download size={20} />
            <span>Exportar</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
            <Plus size={20} />
            <span>Nova Movimentação</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900/40 to-green-950/40 border border-green-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-600 rounded-lg">
              <ArrowDown size={24} />
            </div>
            <div>
              <p className="text-gray-300">Total de Entradas</p>
              <p className="text-2xl">{summary.totalIn} un</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Últimas 24 horas</p>
        </div>

        <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 border border-red-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-600 rounded-lg">
              <ArrowUp size={24} />
            </div>
            <div>
              <p className="text-gray-300">Total de Saídas</p>
              <p className="text-2xl">{summary.totalOut} un</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Últimas 24 horas</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <ArrowUpDown size={24} />
            </div>
            <div>
              <p className="text-gray-300">Movimentações</p>
              <p className="text-2xl">{summary.totalMovements}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Últimas 24 horas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter size={20} className="text-gray-400" />
          <h3 className="text-lg">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Período</label>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="today">Hoje</option>
              <option value="yesterday">Ontem</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mês</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Tipo</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Todos</option>
              <option value="Entrada">Entradas</option>
              <option value="Saída">Saídas</option>
              <option value="Ajuste">Ajustes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Categoria</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Todas</option>
              <option value="Venda">Venda</option>
              <option value="Recebimento">Recebimento</option>
              <option value="Quebra">Quebra</option>
              <option value="Evento">Evento</option>
              <option value="Transferência">Transferência</option>
              <option value="Inventário">Inventário</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Data/Hora</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Tipo</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Produto</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Categoria</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Quantidade</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Usuário</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Local</th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p>{movement.date}</p>
                      <p className="text-sm text-gray-400">{movement.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${getTypeColor(movement.type)}`}>
                      {getTypeIcon(movement.type)}
                      <span className="text-sm">{movement.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{movement.product}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg border text-sm ${getCategoryBadge(movement.category)}`}>
                      {movement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={movement.quantity > 0 ? 'text-green-400' : 'text-red-400'}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity} un
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{movement.user}</td>
                  <td className="px-6 py-4 text-gray-400">{movement.location}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{movement.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-center text-gray-400 text-sm">
        Mostrando {filteredMovements.length} movimentações
      </div>
    </div>
  );
}