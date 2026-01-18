import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Package, BarChart3 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export function Reports() {
  const [period, setPeriod] = useState('30days');

  // Dados de consumo por categoria
  const consumptionByCategory = [
    { category: 'Destilados', value: 450, color: '#06b6d4' },
    { category: 'Vinhos', value: 280, color: '#8b5cf6' },
    { category: 'Cervejas', value: 620, color: '#f59e0b' },
    { category: 'Mixers', value: 340, color: '#10b981' },
  ];

  // Dados de perdas
  const lossData = [
    { type: 'Quebra', value: 45, color: '#ef4444' },
    { type: 'Derramamento', value: 28, color: '#f97316' },
    { type: 'Roubo', value: 12, color: '#dc2626' },
    { type: 'Vencimento', value: 8, color: '#fb923c' },
  ];

  // Giro diário (últimos 7 dias)
  const dailyTurnover = [
    { day: 'Seg', entradas: 45, saidas: 120 },
    { day: 'Ter', entradas: 30, saidas: 95 },
    { day: 'Qua', entradas: 50, saidas: 110 },
    { day: 'Qui', entradas: 25, saidas: 140 },
    { day: 'Sex', entradas: 60, saidas: 180 },
    { day: 'Sáb', entradas: 40, saidas: 220 },
    { day: 'Dom', entradas: 35, saidas: 160 },
  ];

  // Tendência de valor em estoque (últimas 4 semanas)
  const stockValueTrend = [
    { week: 'Sem 1', value: 42000 },
    { week: 'Sem 2', value: 44500 },
    { week: 'Sem 3', value: 43200 },
    { week: 'Sem 4', value: 45250 },
  ];

  // Top produtos mais consumidos
  const topProducts = [
    { name: 'Cerveja Heineken', qty: 156, change: 12 },
    { name: 'Vodka Absolut', qty: 89, change: -5 },
    { name: 'Gin Tanqueray', qty: 76, change: 8 },
    { name: 'Whisky Jameson', qty: 64, change: 15 },
    { name: 'Vinho Malbec', qty: 52, change: -3 },
  ];

  const totalLoss = lossData.reduce((sum, item) => sum + item.value, 0);
  const totalConsumption = consumptionByCategory.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Relatórios</h1>
          <p className="text-gray-400">Análise de consumo e perdas</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
          >
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
            <option value="year">Este ano</option>
          </select>
          <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Package className="text-blue-400" size={20} />
            </div>
            <p className="text-sm text-gray-400">Total Consumido</p>
          </div>
          <p className="text-3xl mb-1">{totalConsumption}</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingUp size={14} />
            +12% vs. período anterior
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-600/20 rounded-lg">
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <p className="text-sm text-gray-400">Total de Perdas</p>
          </div>
          <p className="text-3xl mb-1">{totalLoss}</p>
          <p className="text-sm text-red-400 flex items-center gap-1">
            <TrendingDown size={14} />
            -3% vs. período anterior
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <DollarSign className="text-emerald-400" size={20} />
            </div>
            <p className="text-sm text-gray-400">Valor Médio Diário</p>
          </div>
          <p className="text-3xl mb-1">R$ 3.420</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingUp size={14} />
            +8% vs. período anterior
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <BarChart3 className="text-purple-400" size={20} />
            </div>
            <p className="text-sm text-gray-400">Taxa de Perda</p>
          </div>
          <p className="text-3xl mb-1">5.4%</p>
          <p className="text-sm text-green-400 flex items-center gap-1">
            <TrendingDown size={14} />
            -1.2% vs. período anterior
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Giro Diário */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Giro Diário (Últimos 7 dias)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyTurnover}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="day" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #3f3f46',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="entradas" fill="#10b981" name="Entradas" />
              <Bar dataKey="saidas" fill="#ef4444" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Consumo por Categoria */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Consumo por Categoria</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consumptionByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, value }) => `${category}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consumptionByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Valor em Estoque */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Tendência de Valor em Estoque</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockValueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="week" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #3f3f46',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 6 }}
                name="Valor em Estoque"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Perdas por Tipo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Perdas por Tipo</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lossData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, value }) => `${type}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {lossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl">Top 5 Produtos Mais Consumidos</h3>
        </div>
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Posição</th>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Produto</th>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Quantidade</th>
              <th className="text-left px-6 py-3 text-sm text-gray-400">Tendência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {topProducts.map((product, index) => (
              <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-600' : 
                    index === 1 ? 'bg-gray-500' : 
                    index === 2 ? 'bg-orange-700' : 
                    'bg-zinc-700'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4 text-2xl">{product.qty}</td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 ${
                    product.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {product.change > 0 ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                    <span>{Math.abs(product.change)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="mb-2">Insight Positivo</h4>
              <p className="text-sm text-gray-300">
                As vendas de destilados premium aumentaram 18% neste período. Considere aumentar o par level desses produtos.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-800/50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="mb-2">Atenção</h4>
              <p className="text-sm text-gray-300">
                A taxa de quebra aumentou 5% nas sextas-feiras. Reforce o treinamento da equipe em horários de pico.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-800/50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <div>
              <h4 className="mb-2">Economia</h4>
              <p className="text-sm text-gray-300">
                Redução de perdas economizou R$ 2.840 este mês em comparação com o mês anterior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}