import { useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../services/api";

interface AdjustmentModalProps {
  product: any;
  onClose: () => void;
}

export function AdjustmentModal({ product, onClose }: AdjustmentModalProps) {
  const [physicalCount, setPhysicalCount] = useState("");
  const [notes, setNotes] = useState("");

  const difference = physicalCount
    ? parseInt(physicalCount) - product.currentQty
    : 0;

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        qntAtual: parseFloat(physicalCount),
      };

      await apiFetch(`/estoque/${product.id}/atualizar-estoque`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Erro no ajuste:", error);
      alert(
        "Erro ao confirmar ajuste. Verifique se você tem permissão de ADMIN.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl">Ajuste de Inventário</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center text-3xl">
                {product.image}
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">{product.name}</h3>
                <p className="text-gray-400"> {product.size}</p>
                <p className="text-sm text-gray-400">{product.location}</p>
              </div>
            </div>
          </div>

          {/* Comparison View */}
          <div className="grid grid-cols-2 gap-4">
            {/* System Count */}
            <div className="bg-blue-900/30 border border-blue-800/50 rounded-xl p-6">
              <p className="text-sm text-blue-400 mb-2">Sistema</p>
              <p className="text-5xl mb-2">{product.currentQty}</p>
              <p className="text-gray-400">{product.size}</p>
            </div>

            {/* Physical Count */}
            <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-xl p-6">
              <p className="text-sm text-emerald-400 mb-2">Contagem Física</p>
              <input
                type="number"
                value={physicalCount}
                onChange={(e) => setPhysicalCount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-4xl focus:outline-none focus:border-emerald-600 transition-colors mb-2"
                autoFocus
              />
              <p className="text-gray-400">{product.size}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!physicalCount}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Ajuste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
