import {
  AlertTriangle,
  ArrowDownUp,
  Calendar,
  Truck,
  Barcode,
  ClipboardList,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { EnviarEventos } from "./EnviarEventos";
import { ReceberEvento } from "./ReceberEvento";
import {AddProductModal} from "./AddProductModal";

interface DashboardProps {
  onOpenQuickExit?: () => void;
  onCreateProduct?: (newProduct: NewProduct) => void;
}

export function Dashboard({ onOpenQuickExit, onCreateProduct }: DashboardProps) {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    weeklyEventsCount: 0,
    nextWeekEventsCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState<
    "receber" | "enviar" | "adicionar" | null
  >(null);
  // Busca dados reais do Backend
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("token");

        // Vamos usar a rota de listagem para calcular os totais
        const [estoqueRes, eventosRes] = await Promise.all([
          apiFetch<any>("/estoque/listar", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Tenta buscar eventos (se a rota não existir, vai dar erro no catch, mas ok)
          apiFetch<any>("/eventos/listar", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ eventos: [] })), // Fallback se der erro
        ]);

        const lista = estoqueRes.estoque || [];
        const totalUniqueItems = lista.length;

        const lowStock = lista.filter((item: any) => {
          const atual = Number(item.quantidade || 0);
          const min = Number(item.minimo || 0);

          // console.log("Item:", item, "Atual:", atual, "Min:", min, "IsLowStock:", atual < min,);

          return atual <= min;
        }).length;

        const listaEventos = eventosRes.eventos || []; // Ajuste se seu JSON retornar outro nome

        // 1. Define o intervalo da Semana Atual (Domingo a Sábado)
        const hoje = new Date();
        const startOfWeek = new Date(hoje);
        // Volta para o último domingo (0 = Domingo no JS)
        startOfWeek.setDate(hoje.getDate() - hoje.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        // Avança para o próximo sábado
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const startOfNextWeek = new Date(startOfWeek);
        startOfNextWeek.setDate(startOfWeek.getDate() + 7);
        startOfNextWeek.setHours(0, 0, 0, 0); // Zera hora (00:00:00)

        const endOfNextWeek = new Date(startOfNextWeek);
        endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
        endOfNextWeek.setHours(23, 59, 59, 999); // Fim do dia (23:59:59)

        // 2. Filtra usando o campo correto do seu modelo: dataEvento
        const eventosDaSemana = listaEventos.filter((evento: any) => {
          if (!evento.dataEvento) return false;

          // O backend manda "2026-01-18". Ao dar new Date nisso, o JS pode interpretar como UTC.
          // Adicionamos "T00:00:00" para garantir que ele pegue a data local correta e não volte 1 dia.
          const dataString = evento.dataEvento.includes("T")
            ? evento.dataEvento
            : `${evento.dataEvento}T00:00:00`;

          const dataDoEvento = new Date(dataString);

          return dataDoEvento >= startOfWeek && dataDoEvento <= endOfWeek;
        }).length;

        const eventosDaProximaSemana = listaEventos.filter((evento: any) => {
          if (!evento.dataEvento) return false;

          // Parse seguro da data (YYYY-MM-DD)
          const parts = evento.dataEvento.split("-");
          const dataEvento = new Date(
            parseInt(parts[0]), // Ano
            parseInt(parts[1]) - 1, // Mês (0-11)
            parseInt(parts[2]), // Dia
          );

          return dataEvento >= startOfNextWeek && dataEvento <= endOfNextWeek;
        }).length;

        setStats({
          totalItems: totalUniqueItems,
          lowStockCount: lowStock, // Sua lógica de estoque já estava ok
          weeklyEventsCount: eventosDaSemana, // <--- Resultado final
          nextWeekEventsCount: eventosDaProximaSemana,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

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
          <button
            onClick={() => setActiveModal("receber")}
            className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all group"
          >
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
          <button
            onClick={() => setActiveModal("enviar")}
            className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-zinc-700 group-hover:bg-zinc-600 rounded-xl transition-colors">
                <Truck size={36} />
              </div>
              <div>
                <p className="text-xl mb-2">Enviar Eventos</p>
                <p className="text-sm text-gray-400">
                  Fazer despache dos eventos
                </p>
              </div>
            </div>
          </button>

          {/* Add Item */}
          <button
            onClick={() => setActiveModal("adicionar")}
            className="bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl p-8 transition-all group"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-zinc-700 group-hover:bg-zinc-600 rounded-xl transition-colors">
                <Barcode size={36} />
              </div>
              <div>
                <p className="text-xl mb-2">Adicionar Item</p>
                <p className="text-sm text-gray-400">
                  Registrar entrada de itens
                </p>
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
                {stats.lowStockCount}
                <span className="text-xl ml-2">Itens</span>
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
                {stats.weeklyEventsCount}
                <span className="text-xl ml-2">Eventos</span>
              </p>
              <p className="text-sm text-gray-400">
                {stats.nextWeekEventsCount} eventos na próxima semana
              </p>
            </div>
          </div>
        </div>
      </div>

      {activeModal === "receber" && (
        <ReceberEvento onClose={() => setActiveModal(null)} />
      )}

      {activeModal === "enviar" && (
        <EnviarEventos onClose={() => setActiveModal(null)} />
      )}

      {/* Lógica para Adicionar Item - Conecte seu componente aqui */}
      {activeModal === "adicionar" && (
        <AddProductModal
          onClose={() => setActiveModal(null)}
          onSave={onCreateProduct!} // Usa a função passada do App
        />
      )}
    </div>
  );
}
