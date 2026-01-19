import { useState, useEffect } from "react";
import { X, Plus, Package, RotateCcw } from "lucide-react";
import { apiFetch } from "../services/api";

interface NewProduct {
  name: string;
  category: string;
  unit: string;
  minLevel: number;
  maxLevel: number;
}

interface AddProductModalProps {
  onClose: () => void;
  onSave: (newProduct: NewProduct) => void;
}

export function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [formData, setFormData] = useState<NewProduct>({
    name: "",
    category: "",
    unit: "",
    minLevel: 0,
    maxLevel: 0,
  });

  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewProduct, string>>
  >({});

  // Carrega categorias existentes
  useEffect(() => {
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");
        const data = await apiFetch<any>("/estoque/listar", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, []);

  const handleChange = (field: keyof NewProduct, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof NewProduct, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.category) newErrors.category = "Categoria é obrigatória";
    if (!formData.unit) newErrors.unit = "Unidade é obrigatória";

    // Validação de limites
    if (formData.maxLevel > 0 && formData.minLevel > formData.maxLevel) {
      newErrors.maxLevel = "Máximo deve ser maior que o mínimo";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-600 rounded-xl">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Novo Produto
              </h2>
              <p className="text-sm text-gray-400">Cadastro de Item</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Dados Cadastrais</h3>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Vodka Absolut"
                className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:outline-none transition-colors ${
                  errors.name
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-orange-600"
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Categoria *
                </label>
                {isCustomCategory ? (
                  <div className="flex gap-2 animate-in fade-in">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      placeholder="Nova categoria..."
                      className="flex-1 px-4 py-3 bg-zinc-800 border border-orange-600 rounded-lg focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="p-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg"
                    >
                      <RotateCcw size={20} className="text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === "NEW_CATEGORY_OPTION") {
                        setIsCustomCategory(true);
                        handleChange("category", "");
                      } else {
                        handleChange("category", e.target.value);
                      }
                    }}
                    className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:outline-none transition-colors ${
                      errors.category
                        ? "border-red-500"
                        : "border-zinc-700 focus:border-orange-600"
                    }`}
                  >
                    <option value="">Selecione...</option>
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option
                      value="NEW_CATEGORY_OPTION"
                      className="font-bold text-blue-400"
                    >
                      Nova Categoria...
                    </option>
                  </select>
                )}
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Unidade *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange("unit", e.target.value)}
                  className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg focus:outline-none transition-colors ${
                    errors.unit
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-orange-600"
                  }`}
                >
                  <option value="">Selecione...</option>
                  <option value="un">Unidade (un)</option>
                  <option value="ml">Mililitro (ml)</option>
                  <option value="L">Litro (L)</option>
                  <option value="kg">Quilograma (kg)</option>
                  <option value="cx">Caixa (cx)</option>
                  <option value="grf">Garrafa (grf)</option>
                  <option value="lt">Lata (lt)</option>
                </select>
                {errors.unit && (
                  <p className="text-red-400 text-xs mt-1">{errors.unit}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <h3 className="text-lg font-medium text-white">
              Limites de Estoque (Configuração)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Mínimo (Alerta)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minLevel || ""}
                  onChange={(e) =>
                    handleChange("minLevel", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 text-center"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Máximo (Ideal)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxLevel || ""}
                  onChange={(e) =>
                    handleChange("maxLevel", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              <span>Cadastrar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
