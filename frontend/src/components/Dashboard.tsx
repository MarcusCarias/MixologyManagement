import { AlertTriangle, ArrowDownUp, Calendar, Truck, Barcode, ClipboardList } from 'lucide-react';

interface DashboardProps {
  onOpenQuickExit?: () => void;
}

export function Dashboard({ onOpenQuickExit }: DashboardProps) {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Dashboard</h1>
        <p className="text-gray-400">Visão geral do estoque e alertas</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Receive Event */}
          <button className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-zinc-700 group-hover:bg-zinc-600 rounded-xl transition-colors">
                <ClipboardList size={36} />
              </div>
              <div>
                <p className="text-xl mb-2">Receber Evento</p>
                <p className="text-sm text-gray-400">Conferência dos itens</p>
              </div>
            </div>
          </button>

          {/* Send Event */}
          <button className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-zinc-700 group-hover:bg-zinc-600 rounded-xl transition-colors">
                <Truck size={36} />
              </div>
              <div>
                <p className="text-xl mb-2">Enviar Eventos</p>
                <p className="text-sm text-gray-400">Fazer despache dos eventos</p>
              </div>
            </div>
          </button>

          {/* Add Item */}
          <button className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-zinc-700 group-hover:bg-zinc-600 rounded-xl transition-colors">
                <Barcode size={36} />
              </div>
              <div>
                <p className="text-xl mb-2">Adicionar Item</p>
                <p className="text-sm text-gray-400">Registrar entrada de itens</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Overview Section */}
      <div>
        <h2 className="text-2xl mb-6">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stock Alert */}
          <div className="bg-gradient-to-br from-red-950/60 to-red-950/40 border-2 border-red-900/50 rounded-3xl p-8">
            <div className="flex flex-col">
              <div className="p-3 bg-red-600 rounded-xl w-fit mb-6">
                <AlertTriangle size={28} />
              </div>
              <p className="text-gray-300 mb-2">Alerta de Estoque</p>
              <p className="text-5xl mb-2">
                15<span className="text-xl ml-2">Itens</span>
              </p>
              <p className="text-sm text-gray-400">Abaixo do nível</p>
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-gradient-to-br from-blue-950/60 to-blue-950/40 border-2 border-blue-900/50 rounded-3xl p-8">
            <div className="flex flex-col">
              <div className="p-3 bg-blue-600 rounded-xl w-fit mb-6">
                <ArrowDownUp size={28} />
              </div>
              <p className="text-gray-300 mb-2">Total do Dia</p>
              <p className="text-5xl mb-2">
                08<span className="text-xl ml-2">Saídas</span>
              </p>
              <p className="text-sm text-gray-400">Entradas: 05</p>
            </div>
          </div>

          {/* Weekly Events */}
          <div className="bg-gradient-to-br from-green-950/60 to-green-950/40 border-2 border-green-900/50 rounded-3xl p-8">
            <div className="flex flex-col">
              <div className="p-3 bg-green-600 rounded-xl w-fit mb-6">
                <Calendar size={28} />
              </div>
              <p className="text-gray-300 mb-2">Essa Semana</p>
              <p className="text-5xl mb-2">
                03<span className="text-xl ml-2">Eventos</span>
              </p>
              <p className="text-sm text-gray-400">Atualizado a 05 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
