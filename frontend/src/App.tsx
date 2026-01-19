import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Inventory } from "./components/Inventory";
import { Reports } from "./components/Reports";
import { Movements } from "./components/Movements";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { QuickExitModal } from "./components/QuickExitModal";
import { AdjustmentModal } from "./components/AdjustmentModal";
import { EditProductModal } from "./components/EditProductModal";
import { AddProductModal } from "./components/AddProductModal"; // Modal de Criação
import { apiFetch } from "./services/api";

type View = "dashboard" | "inventory" | "movements" | "reports";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const [currentView, setCurrentView] = useState<View>(() => {
    const savedView = localStorage.getItem("lastView");
    return (savedView as View) || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("lastView", currentView);
  }, [currentView]);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // Tenta fazer uma chamada leve ao backend para ver se o token funciona
        // Se a rota /estoque/listar for pesada, crie uma rota /auth/verify no futuro
        await apiFetch("/estoque/listar", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Se chegou aqui, o token é válido
        setIsLoggedIn(true);
      } catch (error) {
        // Se der erro (ex: 401 Unauthorized), o token expirou
        console.warn("Sessão expirada ou inválida.");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setIsLoggedIn(false);
      }
    };

    validateSession();
  }, []);

  const [showSettings, setShowSettings] = useState(false);

  // --- Estados dos Modais ---
  const [quickExitModalOpen, setQuickExitModalOpen] = useState(false);
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Versão do inventário: altera esse número para forçar o React a recarregar a tabela
  const [inventoryVersion, setInventoryVersion] = useState(0);

  // --- Handlers de Autenticação e Navegação ---
  const handleLogin = () => setIsLoggedIn(true);
  const handleSettingsClick = () => setShowSettings(true);

  // --- Handlers de Abertura de Modais ---
  const handleOpenQuickExit = () => setQuickExitModalOpen(true);

  // Abre modal de Ajuste Rápido (Engrenagem)
  const handleOpenAdjustment = (product: any) => {
    setSelectedProduct(product);
    setAdjustmentModalOpen(true);
  };

  // Abre modal de Edição (Lápis)
  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setEditProductModalOpen(true);
  };

  // Abre modal de Criação (Botão Novo Produto)
  const handleOpenCreate = () => {
    setCreateProductModalOpen(true);
  };

  // --- LÓGICA DE SALVAR: EDIÇÃO (Patch) ---
  const handleSaveProduct = async (updatedProduct: any) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Dados para a tabela Item (Categoria)
      const payloadItem = {
        categoria: updatedProduct.category,
      };

      // 2. Dados para a tabela Estoque (Limites)
      const payloadEstoque = {
        estoqueMin: updatedProduct.minLevel,
        estoqueMax: updatedProduct.maxLevel,
      };

      // Executa as duas atualizações em paralelo
      await Promise.all([
        // Atualiza Categoria
        apiFetch(`/itens/${updatedProduct.id}/atualizar`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadItem),
        }),

        // Atualiza Limites
        apiFetch(`/estoque/${updatedProduct.id}/atualizar`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadEstoque),
        }),
      ]);

      console.log("Produto atualizado com sucesso!");
      setInventoryVersion((v) => v + 1); // Recarrega a tabela
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar as alterações. Verifique se você tem permissão.");
    }
  };

  // --- LÓGICA DE SALVAR: CRIAÇÃO (Post + Get + Patch) ---
  const handleCreateProduct = async (newProductData: any) => {
    try {
      const token = localStorage.getItem("token");

      // 1. Cria o Item (Backend cria Estoque Vazio automaticamente)
      // Adicionamos 'tipo' e 'ativo' hardcoded para passar na validação do seu Schema backend
      const itemPayload = {
        nome: newProductData.name,
        categoria: newProductData.category,
        unidade: newProductData.unit,
        tipo: "Insumo",
        ativo: true,
      };

      // Passo A: Cadastra o item
      await apiFetch<any>("/itens/cadastrar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemPayload),
      });

      // Passo B: Busca o ID do item recém criado
      // (Necessário pois o backend retorna texto, não o ID JSON)
      const listResponse = await apiFetch<any>("/estoque/listar", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Encontra o item pelo nome exato
      const createdItem = (listResponse.estoque || []).find(
        (i: any) => i.nome === newProductData.name,
      );

      if (!createdItem || !createdItem.id) {
        // Se não achou, pode ser delay do banco, mas geralmente é instantâneo
        throw new Error(
          "Erro ao localizar o ID do novo produto para configurar limites.",
        );
      }

      // Passo C: Atualiza os limites (Min/Max) usando o ID encontrado
      const estoquePayload = {
        estoqueMin: newProductData.minLevel,
        estoqueMax: newProductData.maxLevel,
      };

      await apiFetch(`/estoque/${createdItem.id}/atualizar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estoquePayload),
      });

      console.log("Produto criado e configurado com sucesso!");
      setInventoryVersion((v) => v + 1); // Recarrega a tabela
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert(
        "Erro ao criar produto. Verifique se já existe um item com esse nome.",
      );
    }
  };

  // --- Renderização ---

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Tela de Configurações (Sobreposta)
  if (showSettings) {
    return (
      <div className="flex h-screen bg-zinc-950 text-gray-100">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          onSettingsClick={handleSettingsClick}
        />
        <main className="flex-1 overflow-auto relative">
          <Settings />
          <button
            onClick={() => setShowSettings(false)}
            className="fixed bottom-8 right-8 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-colors"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-gray-100">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onSettingsClick={handleSettingsClick}
      />

      <main className="flex-1 overflow-auto">
        {currentView === "dashboard" && (
          <Dashboard
            onOpenQuickExit={handleOpenQuickExit}
            onCreateProduct={handleCreateProduct}
          />
        )}

        {currentView === "inventory" && (
          <Inventory
            key={inventoryVersion} // Força recarregamento quando muda
            onOpenAdjustment={handleOpenAdjustment}
            onOpenEdit={handleOpenEdit}
            onOpenCreate={handleOpenCreate} // Passa a função para abrir o modal de criar
          />
        )}

        {currentView === "movements" && <Movements />}

        {currentView === "reports" && <Reports />}
      </main>

      {/* --- MODAIS --- */}

      {quickExitModalOpen && (
        <QuickExitModal onClose={() => setQuickExitModalOpen(false)} />
      )}

      {adjustmentModalOpen && selectedProduct && (
        <AdjustmentModal
          product={selectedProduct}
          onClose={() => setAdjustmentModalOpen(false)}
        />
      )}

      {editProductModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setEditProductModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {createProductModalOpen && (
        <AddProductModal
          onClose={() => setCreateProductModalOpen(false)}
          onSave={handleCreateProduct}
        />
      )}
    </div>
  );
}
