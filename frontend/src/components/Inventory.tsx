import { useState, useEffect } from "react";
import { Search, Plus, Edit, Settings } from "lucide-react";
import { apiFetch } from "../services/api";
import { ProductDetailsModal } from "./ProductDetailsModal"; // <--- Importe o Modal Novo

interface InventoryProps {
  onOpenAdjustment: (product: any) => void;
  onOpenEdit: (product: any) => void;
  onOpenCreate: () => void;
}

export function Inventory({
  onOpenAdjustment,
  onOpenEdit,
  onOpenCreate,
}: InventoryProps) {
  // --- ESTADOS DE FILTRO ---
  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem("inv_search") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    () => localStorage.getItem("inv_category") || "all",
  );
  const [statusFilter, setStatusFilter] = useState(
    () => localStorage.getItem("inv_status") || "all",
  );

  useEffect(() => {
    localStorage.setItem("inv_search", searchTerm);
    localStorage.setItem("inv_category", categoryFilter);
    localStorage.setItem("inv_status", statusFilter);
  }, [searchTerm, categoryFilter, statusFilter]);

  // --- ESTADOS DE DADOS ---
  const [products, setProducts] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("");

  // Novo estado para o Modal de Detalhes
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  // --- CARREGAMENTO ---
  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        const data = await apiFetch<any>("/estoque/listar", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const produtosMapeados = (data.estoque || []).map((item: any) => ({
          id: item.id,
          name: item.nome,
          brand: "", // Backend ainda não envia marca, fica vazio por enquanto
          category: item.categoria || "Sem Categoria",
          location: "", // Mockado por enquanto
          currentQty: item.quantidade,

          minLevel: item.minimo || 0, // Mínimo
          maxLevel: item.maximo || 0, // Máximo

          size: item.unidade,
          image: "📦",
          stockPercent: item.maximo ? (item.quantidade / item.maximo) * 100 : 100,
        }));

        setProducts(produtosMapeados);
      } catch (error) {
        console.error("Erro ao carregar estoque:", error);
      }
    }
    loadData();
  }, []);

  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.category)),
  ).sort();

  const getStockColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // --- FILTRAGEM ---
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === "low") {
      matchesStatus = product.currentQty <= product.minLevel;
    } else if (statusFilter === "out") {
      matchesStatus = product.currentQty === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Estoque</h1>
          <p className="text-gray-400">Lista mestre de produtos</p>
        </div>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Todas</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-600 transition-colors"
            >
              <option value="all">Tudo</option>
              <option value="low">Estoque Baixo</option>
              <option value="out">Sem Estoque (Zerado)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setCategoryFilter("all");
                setStatusFilter("all");
                setSearchTerm("");
                localStorage.removeItem("inv_search");
                localStorage.removeItem("inv_category");
                localStorage.removeItem("inv_status");
              }}
              className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Produto
                </th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Categoria
                </th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Nível de Estoque
                </th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Qtd. Atual
                </th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Qtd. Mínima
                </th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Unidade
                </th>
                <th className="text-left px-6 py-3 text-sm text-gray-400">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  // ADICIONADO: Clique na linha abre detalhes
                  onClick={() => setSelectedProductDetail(product)}
                  className="hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div>
                        <p>{product.name}</p>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="w-32 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStockColor(product.stockPercent)} transition-all`}
                          style={{
                            width: `${Math.min(product.stockPercent, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.currentQty}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {product.minLevel}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{product.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Impede de abrir o modal de detalhes
                          onOpenEdit(product);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Editar produto"
                      >
                        <Edit size={16} />
                      </button>

                      {userRole === "ADMIN" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Impede de abrir o modal de detalhes
                            onOpenAdjustment(product);
                          }}
                          className="p-2 text-gray-400 hover:text-orange-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Ajuste de Estoque"
                        >
                          <Settings size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm">
        Mostrando {filteredProducts.length} de {products.length} produtos
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL DO MODAL DE DETALHES */}
      {selectedProductDetail && (
        <ProductDetailsModal
          product={selectedProductDetail}
          userRole={userRole} // Passa o papel do usuário
          onClose={() => setSelectedProductDetail(null)}
          onEdit={onOpenEdit}
          onAdjust={onOpenAdjustment}
        />
      )}
    </div>
  );
}
