import { useState, useEffect } from "react";
import {
  X,
  Edit,
  Settings,
  Scroll,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2,
} from "lucide-react";
import { apiFetch } from "../services/api";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  location: string;
  currentQty: number;
  minLevel: number;
  size: string;
  stockPercent: number;
  image: string;
  recipe?: Ingredient[];
}

interface ProductDetailsModalProps {
  product: Product;
  userRole?: string;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onAdjust: (product: Product) => void;
}

export function ProductDetailsModal({
  product,
  userRole,
  onClose,
  onEdit,
  onAdjust,
}: ProductDetailsModalProps) {
  // --- NOVOS ESTADOS E EFEITO ---
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setIsLoadingRecipe(true);
        const token = localStorage.getItem("token");

        // Consome a rota específica: GET /itens/{id}/receita
        const data = await apiFetch<any>(`/itens/${product.id}/receita`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mapeia a resposta do backend (item_nome, quantidade, unidade)
        const mappedIngredients = (data.receita || []).map((item: any) => ({
          name: item.item_nome,
          quantity: item.quantidade,
          unit: item.unidade,
        }));

        setIngredients(mappedIngredients);
      } catch (error) {
        // Se der erro ou não tiver receita, lista fica vazia
        setIngredients([]);
      } finally {
        setIsLoadingRecipe(false);
      }
    }

    fetchRecipe();
  }, [product.id]);

  const showRightColumn = isLoadingRecipe || ingredients.length > 0;

  const getStockStatus = () => {
    if (product.stockPercent >= 50) {
      return {
        label: "Normal",
        badgeClasses:
          "bg-green-500/20 text-green-400 border border-green-500/30",
        textClasses: "text-green-400",
        barClasses: "bg-green-500",
      };
    }
    if (product.stockPercent >= 25) {
      return {
        label: "Atenção",
        badgeClasses:
          "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        textClasses: "text-yellow-400",
        barClasses: "bg-yellow-500",
      };
    }
    return {
      label: "Crítico",
      badgeClasses: "bg-red-500/20 text-red-400 border border-red-500/30",
      textClasses: "text-red-400",
      barClasses: "bg-red-500",
    };
  };

  const status = getStockStatus();

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600/20 to-zinc-900 border-b border-zinc-800 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-4xl">
                {product.image}
              </div>
              <div>
                <h2 className="text-3xl">{product.name}</h2>
                <p className="text-gray-400 mt-1">{product.brand}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm">
                    {product.size}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${status.badgeClasses}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stock Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quantidade Atual */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Package size={18} />
                <span className="text-sm">Quantidade Atual</span>
              </div>
              <p className="text-3xl">{product.currentQty}</p>
              <p className="text-sm text-gray-500 mt-1">unidades em estoque</p>
            </div>

            {/* Par Level */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Activity size={18} />
                <span className="text-sm">Qtd. Min</span>
              </div>
              <p className="text-3xl">{product.minLevel}</p>
              <p className="text-sm text-gray-500 mt-1">limite inferior</p>
            </div>

            {/* Percentual */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-5">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                {product.stockPercent >= 50 ? (
                  <TrendingUp size={18} />
                ) : (
                  <TrendingDown size={18} />
                )}
                <span className="text-sm">Nível de Estoque</span>
              </div>
              <p className={`text-3xl ${status.textClasses}`}>
                {Math.round(product.stockPercent)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">em relação ao máximo</p>
            </div>
          </div>

          {/* Visual Stock Bar */}
          <div className="bg-zinc-800/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">
                Visualização do Estoque
              </span>
              <span className="text-sm">
                {product.currentQty} / {product.maxLevel} un
              </span>
            </div>
            <div className="w-full h-4 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${status.barClasses}`}
                style={{
                  width: `${Math.min(product.stockPercent, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0</span>
              {/* <span className="text-yellow-400">Mínimo (25%)</span> */}
              <span className="text-green-400">Máximo {product.maxLevel}</span>
            </div>
          </div>

          {/* Product Information */}
          <div className={"grid grid-cols-2 md:grid-cols-2 gap-6"}>
            {/* Informações do Produto */}
            <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-5 col-span-1 md:col-span-1">
              <h3 className="text-lg font-medium mb-4">
                Informações do Produto
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID do Produto</span>
                  <span className="font-mono text-sm">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nome</span>
                  <span>{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Categoria</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tamanho</span>
                  <span>{product.size}</span>
                </div>
              </div>
            </div>

            {/* Localização e Estoque */}
            <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-5 col-span-1 md:col-span-1">
              <h3 className="text-lg font-medium mb-4">
                Informações do Estoque
              </h3>
              <div className="space-y-3">
                {/* <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg">
                  <MapPin size={20} className="text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">Localização</p>
                    <p className="font-medium">{product.location}</p>
                  </div>
                </div> */}
                <div className="flex justify-between pt-3 border-t border-zinc-700">
                  <span className="text-gray-400">Quantidade Atual</span>
                  <span className="font-medium">{product.currentQty} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Qtd. Mín</span>
                  <span className="font-medium">{product.minLevel} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Qtd. Máx</span>
                  <span className="font-medium">{product.maxLevel} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Necessidade de Reposição
                  </span>
                  <span
                    className={`font-medium ${product.minLevel - product.currentQty > 0 ? "text-orange-400" : "text-green-400"}`}
                  >
                    {product.minLevel - product.currentQty > 0
                      ? `${product.minLevel - product.currentQty} un`
                      : "OK"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Recipe (Only renders if showRightColumn is true) */}
            {showRightColumn && (
              // <div className="grid-flow-row-dense col-span-2 space-y-6  bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-full relative">
              <div className="bg-zinc-800/30 border border-zinc-800 rounded-xl p-5 col-start-1 col-end-3">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Scroll size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Receita
                    </h3>
                    <p className="text-xs text-zinc-500">Composição do item</p>
                  </div>
                </div>

                {/* Content: Loading or List */}
                {isLoadingRecipe ? (
                  <div className="flex flex-col items-center justify-center flex-1 py-12 text-zinc-500">
                    <Loader2
                      size={32}
                      className="animate-spin mb-3 text-orange-500"
                    />
                    <p className="text-sm">Buscando receita...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-0 divide-y divide-zinc-800/50 flex-1">
                      {ingredients.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 hover:bg-zinc-800/30 px-2 rounded transition-colors"
                        >
                          <span className="text-zinc-300 font-medium">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">
                              {item.quantity}
                            </span>
                            <span className="text-xs text-zinc-500 uppercase  px-1.5 py-0.5 ">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
                      <p className="text-xs text-zinc-500">
                        Total de {ingredients.length} itens na composição
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={() => {
                onEdit(product);
                onClose();
              }}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={20} />
              <span>Editar Produto</span>
            </button>
            {userRole === "ADMIN" && (
              <button
                onClick={() => {
                  onAdjust(product);
                  onClose();
                }}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Settings size={20} />
                <span>Ajustar Estoque</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
