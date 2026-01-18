import { useState } from 'react';
import { Plus, Search, ShoppingCart, Truck, Phone, Mail, MapPin, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function Purchases() {
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 1,
      orderNumber: 'PO-2026-001',
      supplier: 'Distribuidora Premium Ltda',
      date: '15/01/2026',
      expectedDate: '20/01/2026',
      status: 'Pendente',
      items: 5,
      total: 4250.00,
      paymentMethod: 'Boleto 30 dias'
    },
    {
      id: 2,
      orderNumber: 'PO-2026-002',
      supplier: 'Importadora Spirits SA',
      date: '14/01/2026',
      expectedDate: '18/01/2026',
      status: 'Aprovado',
      items: 12,
      total: 8900.00,
      paymentMethod: 'Transferência'
    },
    {
      id: 3,
      orderNumber: 'PO-2025-089',
      supplier: 'Bebidas Nacional',
      date: '10/01/2026',
      expectedDate: '17/01/2026',
      status: 'Recebido',
      items: 8,
      total: 3450.00,
      paymentMethod: 'Boleto 30 dias'
    },
    {
      id: 4,
      orderNumber: 'PO-2025-088',
      supplier: 'Distribuidora Premium Ltda',
      date: '08/01/2026',
      expectedDate: '15/01/2026',
      status: 'Atrasado',
      items: 6,
      total: 5600.00,
      paymentMethod: 'Cartão'
    }
  ];

  const suppliers = [
    {
      id: 1,
      name: 'Distribuidora Premium Ltda',
      category: 'Destilados Premium',
      contact: 'Roberto Silva',
      phone: '(11) 3456-7890',
      email: 'contato@premiumbebidas.com.br',
      address: 'São Paulo, SP',
      rating: 4.8,
      activeOrders: 2,
      totalOrders: 45,
      paymentTerms: 'Boleto 30 dias'
    },
    {
      id: 2,
      name: 'Importadora Spirits SA',
      category: 'Importados',
      contact: 'Maria Santos',
      phone: '(11) 9876-5432',
      email: 'importacao@spirits.com.br',
      address: 'Rio de Janeiro, RJ',
      rating: 4.5,
      activeOrders: 1,
      totalOrders: 28,
      paymentTerms: 'Transferência'
    },
    {
      id: 3,
      name: 'Bebidas Nacional',
      category: 'Cervejas e Mixers',
      contact: 'João Oliveira',
      phone: '(11) 2345-6789',
      email: 'vendas@bebidasnacional.com.br',
      address: 'Campinas, SP',
      rating: 4.2,
      activeOrders: 0,
      totalOrders: 67,
      paymentTerms: 'Boleto 30/60 dias'
    },
    {
      id: 4,
      name: 'Vinícola do Sul',
      category: 'Vinhos Nacionais',
      contact: 'Ana Costa',
      phone: '(54) 3210-9876',
      email: 'comercial@vinicoladosul.com.br',
      address: 'Bento Gonçalves, RS',
      rating: 4.9,
      activeOrders: 0,
      totalOrders: 32,
      paymentTerms: 'Boleto 45 dias'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Pendente': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Aprovado': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Recebido': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Atrasado': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Cancelado': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    };
    return colors[status] || 'bg-zinc-700 text-gray-400';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Recebido') return <CheckCircle size={16} />;
    if (status === 'Atrasado') return <AlertCircle size={16} />;
    if (status === 'Aprovado') return <Clock size={16} />;
    return <Clock size={16} />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const orderStats = {
    pending: orders.filter(o => o.status === 'Pendente').length,
    approved: orders.filter(o => o.status === 'Aprovado').length,
    totalValue: orders.reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Compras & Fornecedores</h1>
          <p className="text-gray-400">Gerenciamento de pedidos e relacionamento com fornecedores</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
          <Plus size={20} />
          <span>Novo Pedido</span>
        </button>
      </div>

      {/* Summary Cards */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-950/40 border border-yellow-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-yellow-600 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-gray-300">Pedidos Pendentes</p>
                <p className="text-2xl">{orderStats.pending}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Aguardando aprovação</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/40 border border-blue-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-gray-300">Em Trânsito</p>
                <p className="text-2xl">{orderStats.approved}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Aprovados e a caminho</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border border-emerald-800/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-emerald-600 rounded-lg">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-300">Valor Total</p>
                <p className="text-2xl">R$ {orderStats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Pedidos ativos</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 transition-colors ${
            activeTab === 'orders'
              ? 'border-b-2 border-cyan-600 text-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <span>Pedidos de Compra</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-6 py-3 transition-colors ${
            activeTab === 'suppliers'
              ? 'border-b-2 border-cyan-600 text-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Truck size={18} />
            <span>Fornecedores</span>
          </div>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={activeTab === 'orders' ? "Buscar pedidos..." : "Buscar fornecedores..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
          />
        </div>

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
              >
                <option value="all">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Recebido">Recebido</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Nº Pedido</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Fornecedor</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Data</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Previsão</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Status</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Itens</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Total</th>
                  <th className="text-left px-6 py-3 text-sm text-gray-400">Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="text-cyan-400">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4">{order.supplier}</td>
                    <td className="px-6 py-4 text-gray-400">{order.date}</td>
                    <td className="px-6 py-4 text-gray-400">{order.expectedDate}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="text-sm">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{order.items} itens</td>
                    <td className="px-6 py-4">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{order.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl mb-1">{supplier.name}</h3>
                  <p className="text-sm text-gray-400">{supplier.category}</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg">
                  <span>⭐</span>
                  <span className="text-sm">{supplier.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone size={16} />
                  <span className="text-sm">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail size={16} />
                  <span className="text-sm">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={16} />
                  <span className="text-sm">{supplier.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pedidos Ativos</p>
                  <p className="text-xl">{supplier.activeOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Histórico</p>
                  <p className="text-xl">{supplier.totalOrders}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm">
                  Novo Pedido
                </button>
                <button className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors text-sm">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-gray-400 text-sm">
        {activeTab === 'orders' 
          ? `Mostrando ${filteredOrders.length} de ${orders.length} pedidos`
          : `Mostrando ${filteredSuppliers.length} de ${suppliers.length} fornecedores`
        }
      </div>
    </div>
  );
}
