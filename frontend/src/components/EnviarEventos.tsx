import { useState, useEffect } from "react";
import { X, ChevronLeft, Send, Loader2 } from "lucide-react";
import { apiFetch } from "../services/api";

interface ItemNecessario {
  reservaId: number;
  name: string;
  quantidadeCalculada: number;
  unidade: string;
}

interface Evento {
  id: number;
  nome: string;
  data: string;
  tipo: string;
  pessoas: number;
  itensNecessarios: ItemNecessario[];
}

interface EnviarEventosProps {
  onClose: () => void;
}

export function EnviarEventos({ onClose }: EnviarEventosProps) {
  const [eventsList, setEventsList] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [itensEnviar, setItensEnviar] = useState<Record<number, number>>({});

  // Novos estados de loading
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Busca eventos em preparação ao carregar
  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = localStorage.getItem("token");
        const data = await apiFetch<any>("/eventos/listar", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filtra apenas os "EM PREPARACAO"
        const filtered = (data.eventos || []).filter(
          (e: any) => e.status === "EM PREPARACAO",
        );
        setEventsList(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingList(false);
      }
    }
    fetchEvents();
  }, []);

  // Nova função para buscar os itens (drinks/utensílios) do evento
  const handleSelectEvento = async (eventoParcial: any) => {
    setIsLoadingDetails(true);
    setItensEnviar({});

    // setSelectedEvento(eventoParcial);
    
    try {
      const token = localStorage.getItem("token");
      const data = await apiFetch<any>(`/eventos/${eventoParcial.id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservas = await apiFetch<any>(
        `/eventos/${eventoParcial.id}/reservas`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!reservas.reservas || reservas.reservas.length === 0) {
        alert("Este evento ainda não possui itens gerados.");
        setSelectedEvento(null);
        return;
      }

      const itens = reservas.reservas.map((r: any) => ({
        reservaId: r.id,
        name: r.item?.nome ?? `Item ${r.item_id}`,
        quantidadeCalculada: r.quantidadeReservada,
        unidade: r.item?.unidade ?? "UN",
      }));

      setSelectedEvento({
        ...eventoParcial,
        itensNecessarios: itens,
      });
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleItemEnviarChange = (itemId: number, quantidade: number) => {
    setItensEnviar((prev) => ({
      ...prev,
      [itemId]: quantidade,
    }));
  };

  const handleConfirmarEnvio = async () => {
    if (!selectedEvento) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      for (const item of selectedEvento.itensNecessarios) {
        const quantidade = itensEnviar[item.reservaId];

        if (quantidade === undefined) continue;

        if (quantidade < 0) {
          throw new Error("Quantidade inválida");
        }

        await apiFetch(
          `/eventos/${selectedEvento.id}/enviar/${item.reservaId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantidade: quantidade,
            }),
          },
        );
      }

      // 2️⃣ Agora envia o evento
      await apiFetch(`/eventos/${selectedEvento.id}/enviar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar evento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const preencherCalculado = () => {
    if (!selectedEvento) return;
    const novoItens: Record<number, number> = {};
    selectedEvento.itensNecessarios.forEach((item) => {
      novoItens[item.reservaId] = item.quantidadeCalculada;
    });
    setItensEnviar(novoItens);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedEvento && (
              <button
                onClick={() => setSelectedEvento(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-zinc-800 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
            )}
            <div>
              <h2 className="text-white text-xl font-semibold">
                {selectedEvento ? selectedEvento.nome : "Enviar Eventos"}
              </h2>
              <p className="text-gray-400 text-sm">
                {selectedEvento
                  ? "Definir quantidade a enviar"
                  : "Selecione um evento em preparação"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!selectedEvento ? (
            <div className="space-y-3">
              {isLoadingList ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-gray-500" />
                </div>
              ) : eventsList.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum evento pendente.
                </p>
              ) : (
                eventsList.map((evento) => (
                  <button
                    key={evento.id}
                    onClick={() => handleSelectEvento(evento)} // <--- Alterado aqui
                    className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 flex items-center justify-between transition-colors"
                  >
                    {/* ... (conteúdo interno do botão mantém igual) ... */}
                    <div className="text-left">
                      <h3 className="text-white font-medium mb-1">
                        {evento.nome}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Data: {evento.data} • {evento.tipo}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {evento.pessoas} pessoas
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-yellow-600 text-orange-900 rounded text-sm">
                      Em preparação
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Evento</p>
                    <p className="text-white font-medium">
                      {selectedEvento.nome}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Data</p>
                    <p className="text-white font-medium">
                      {selectedEvento.data}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Pessoas</p>
                    <p className="text-white font-medium">
                      {selectedEvento.pessoas}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Itens Necessários</h3>
                <button
                  onClick={preencherCalculado}
                  className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Preencher com calculado
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvento.itensNecessarios.map((item) => (
                    <div
                      key={item.reservaId}
                      className="bg-zinc-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {item.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Calculado: {item.quantidadeCalculada} {item.unidade}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">
                          Quantidade a Enviar
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            min="0.0"
                            value={
                              itensEnviar[item.reservaId] !== undefined
                                ? itensEnviar[item.reservaId]
                                : ""
                            }
                            onChange={(e) =>
                              handleItemEnviarChange(
                                item.reservaId,
                                Number(e.target.value),
                              )
                            }
                            placeholder={item.quantidadeCalculada.toString()}
                            className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-600"
                          />
                          <div className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-400 min-w-[60px] flex items-center justify-center">
                            {item.unidade}
                          </div>
                        </div>
                        {itensEnviar[item.reservaId] !== undefined &&
                          itensEnviar[item.reservaId] !==
                            item.quantidadeCalculada && (
                            <p className="text-yellow-500 text-xs mt-1">
                              {itensEnviar[item.reservaId] >
                              item.quantidadeCalculada
                                ? "Acima do calculado"
                                : "Abaixo do calculado"}
                            </p>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedEvento && (
          <div className="p-6 border-t border-gray-800 flex gap-3">
            <button
              onClick={() => setSelectedEvento(null)}
              className="flex-1 px-6 py-3 bg-[#252525] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirmarEnvio}
              disabled={isSubmitting || isLoadingDetails} // Desabilita
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {isSubmitting ? "Enviando..." : "Confirmar Envio"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
