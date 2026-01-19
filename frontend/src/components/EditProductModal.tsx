import { useState, useEffect } from "react";
import { X, Save, Sliders, Tag, RotateCcw } from "lucide-react"; 
import { apiFetch } from "../services/api";

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave: (updatedProduct: any) => void;
}

export function EditProductModal({
  product,
  onClose,
  onSave,
}: EditProductModalProps) {
  // Estado do formulário
  const [formData, setFormData] = useState({
    minLevel: product.minLevel || 0,
    maxLevel: product.maxLevel || 0,
    category: product.category || "",
  });

  // Estado para lista de categorias existentes
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  // Estado para controlar se está digitando uma nova categoria
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    // 1. Carrega os dados iniciais do produto
    setFormData({
      minLevel: product.minLevel || 0,
      maxLevel: product.maxLevel || 0,
      category: product.category || "",
    });

    // 2. Busca todas as categorias já existentes no banco para preencher a lista
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");
        const data = await apiFetch<any>("/estoque/listar", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extrai categorias únicas e remove vazios/nulos
        const unique = Array.from(
          new Set(
            (data.estoque || [])
              .map((item: any) => item.categoria)
              .filter(Boolean),
          ),
        ).sort() as string[];

        setExistingCategories(unique);
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    }
    fetchCategories();
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.maxLevel > 0 && formData.minLevel > formData.maxLevel) {
      alert("O Estoque Mínimo não pode ser maior que o Máximo!");
      return;
    }

    onSave({
      ...product,
      minLevel: formData.minLevel,
      maxLevel: formData.maxLevel,
      category: formData.category, // Envia o texto (seja do select ou do input)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-black-900 border-b border-zinc-800 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-700 text-blue-500 rounded-xl">
              <Sliders size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Editar Produto</h2>
              <p className="text-sm text-gray-400">Dados e Limites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-800 mb-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">
              Produto
            </p>
            <p className="text-lg text-white font-medium">{product.name}</p>
            <p className="text-sm text-gray-400">{product.size}</p>
          </div>

          {/* Campo de Categoria Inteligente */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Tag size={14} /> Categoria
            </label>

            {isCustomCategory ? (
              // MODO TEXTO (Criar Nova)
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Digite o nome da nova categoria..."
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-orange-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 transition-colors animate-in fade-in"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className="p-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg"
                  title="Voltar para a lista"
                >
                  <RotateCcw size={20} className="text-gray-400" />
                </button>
              </div>
            ) : (
              // MODO LISTA (Selecionar Existente)
              <select
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === "NEW_CATEGORY_OPTION") {
                    setIsCustomCategory(true);
                    setFormData({ ...formData, category: "" }); // Limpa para digitar
                  } else {
                    setFormData({ ...formData, category: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Selecione...</option>

                {/* Lista dinâmica do banco */}
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}

                {/* Opção de Nova Categoria */}
                <option
                  value="NEW_CATEGORY_OPTION"
                  className="font-bold text-blue-400"
                >
                  Nova Categoria...
                </option>
              </select>
            )}

            {isCustomCategory && (
              <p className="text-xs text-blue-400 mt-2">
                Ao salvar, esta categoria será adicionada à lista global.
              </p>
            )}
          </div>

          {/* Campos de Limites */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mínimo</label>
              <input
                type="number"
                min="0"
                value={formData.minLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minLevel: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-center font-mono text-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Máximo Ideal
              </label>
              <input
                type="number"
                min="0"
                value={formData.maxLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxLevel: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-center font-mono text-lg"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Save size={18} />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
