import { useState, useEffect } from "react";
import { X, ChevronLeft, Check } from "lucide-react";
import { apiFetch } from "../services/api";

interface Item {
  reservaId: number;
  name: string;
  quantidadeEnviada: number;
  unidade: string;
}

interface Evento {
  id: number;
  nome: string;
  dataEvento: string;
  itens: Item[];
}

interface ReceberEventoProps {
  onClose: () => void;
}

function formatarData(data: string) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0"); // meses começam do 0
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}


export function ReceberEvento({ onClose }: ReceberEventoProps) {
  const [eventsList, setEventsList] = useState<Evento[]>([]);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [itensRetornados, setItensRetornados] = useState<
    Record<number, number>
  >({});

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
          (e: any) => e.status === "ENVIADO",
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

  const handleSelectEvento = async (eventoParcial: any) => {
   if (!eventoParcial) {
     setSelectedEvento(null);
     setItensRetornados({});
     return;
   }

   setIsLoadingDetails(true);
   setItensRetornados({});

    try {
      const token = localStorage.getItem("token");

      const resp = await apiFetch<any>(
        `/eventos/${eventoParcial.id}/reservas`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const itens = (resp.reservas || [])
        // se quiser, pode filtrar por status aqui
        // .filter((r: any) => r.status === "ENVIADO")
        .map((r: any) => ({
          reservaId: r.id,
          name: r.item.nome,
          quantidadeEnviada: r.quantidadeReservada,
          unidade: r.item.unidade,
        }));

      setSelectedEvento({
        ...eventoParcial,
        itens,
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar reservas do evento");
    } finally {
      setIsLoadingDetails(false);
    }
  };


  const handleItemRetornadoChange = (itemId: number, quantidade: number) => {
    setItensRetornados((prev) => ({
      ...prev,
      [itemId]: quantidade,
    }));
  };

  const handleConfirmarRecebimento = async () => {
    if (!selectedEvento) return;

    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    // 1️⃣ Receber cada item
    const resultados: {
      sucesso: number[];
      falha: { id: number; erro: string }[];
    } = { sucesso: [], falha: [] };

    for (const item of selectedEvento.itens) {
      const quantidade = itensRetornados[item.reservaId];
      if (quantidade === undefined) continue;

      try {
        await apiFetch(
          `/eventos/${selectedEvento.id}/receber/${item.reservaId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantidade }),
          },
        );
        resultados.sucesso.push(item.reservaId);
      } catch (error: any) {
        resultados.falha.push({
          id: item.reservaId,
          erro: error?.message || "Erro desconhecido",
        });
      }
    }

    // 2️⃣ Verificar se todas as reservas do evento já estão FINALIZADAS
    if (resultados.falha.length === 0) {
      // Todas as reservas foram recebidas → finalizar evento
      try {
        await apiFetch(`/eventos/${selectedEvento.id}/receber`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        //alert("Evento finalizado com sucesso!");
        onClose();
      } catch (error) {
        alert(
          "Erro ao finalizar evento: " +
            (error?.message || "Erro desconhecido"),
        );
      }
    } else {
      // Ainda existem itens com erro → não finalizar o evento
      alert(
        `Alguns itens não puderam ser recebidos:\n` +
          resultados.falha.map((f) => `Reserva ${f.id}: ${f.erro}`).join("\n") +
          `\nItens recebidos com sucesso: ${resultados.sucesso.join(", ")}`,
      );
    }

    setIsSubmitting(false);
  };


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedEvento && (
              <button
                onClick={() => handleSelectEvento(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
            )}
            <div>
              <h2 className="text-white text-xl font-semibold">
                {selectedEvento ? selectedEvento.nome : "Receber Evento"}
              </h2>
              <p className="text-gray-400 text-sm">
                {selectedEvento
                  ? "Conferir itens retornados"
                  : "Selecione um evento em andamento"}
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
              {eventsList.map((evento) => (
                <button
                  key={evento.id}
                  onClick={() => handleSelectEvento(evento)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-lg p-4 flex items-center justify-between transition-colors"
                >
                  <div className="text-left">
                    <h3 className="text-white font-medium mb-1">
                      {evento.nome}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Data: {formatarData(evento.dataEvento)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Evento enviado</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded text-sm">
                    Em andamento
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Evento</p>
                    <p className="text-white font-medium">
                      {selectedEvento.nome}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Data</p>
                    <p className="text-white font-medium">
                      {formatarData(selectedEvento.dataEvento)}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-white font-medium mb-3">Itens Enviados</h3>
              <div className="space-y-3">
                {selectedEvento.itens.map((item) => (
                  <div
                    key={item.reservaId}
                    className="bg-zinc-800 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-gray-400 text-sm">
                          Enviado: {item.quantidadeEnviada} {item.unidade}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Quantidade Retornada
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          min="0"
                          max={item.quantidadeEnviada}
                          value={
                            itensRetornados[item.reservaId] !== undefined
                              ? itensRetornados[item.reservaId]
                              : ""
                          }
                          onChange={(e) =>
                            handleItemRetornadoChange(
                              item.reservaId,
                              parseFloat(e.target.value),
                            )
                          }
                          placeholder="0"
                          className="flex-1 bg-zinc-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-600"
                        />
                        <div className="px-4 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-gray-400 min-w-[60px] flex items-center justify-center">
                          {item.unidade}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedEvento && (
          <div className="p-6 border-t border-gray-800 flex gap-3">
            <button
              onClick={() => handleSelectEvento(null)}
              className="flex-1 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirmarRecebimento}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Confirmar Recebimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
