import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Reports } from './components/Reports';
import { Movements } from './components/Movements';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { QuickExitModal } from './components/QuickExitModal';
import { AdjustmentModal } from './components/AdjustmentModal';

type View = 'dashboard' | 'inventory' | 'movements' | 'reports';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [quickExitModalOpen, setQuickExitModalOpen] = useState(false);
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleOpenQuickExit = () => {
    setQuickExitModalOpen(true);
  };

  const handleOpenAdjustment = (product: any) => {
    setSelectedProduct(product);
    setAdjustmentModalOpen(true);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Settings Modal
  if (showSettings) {
    return (
      <div className="flex h-screen bg-zinc-950 text-gray-100">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} onSettingsClick={handleSettingsClick} />
        <main className="flex-1 overflow-auto">
          <Settings />
          <button 
            onClick={() => setShowSettings(false)}
            className="fixed bottom-8 right-8 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-lg"
          >
            Voltar
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-gray-100">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} onSettingsClick={handleSettingsClick} />
      
      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && (
          <Dashboard onOpenQuickExit={handleOpenQuickExit} />
        )}
        {currentView === 'inventory' && (
          <Inventory onOpenAdjustment={handleOpenAdjustment} />
        )}
        {currentView === 'movements' && (
          <Movements />
        )}
        {currentView === 'reports' && (
          <Reports />
        )}
      </main>

      {quickExitModalOpen && (
        <QuickExitModal onClose={() => setQuickExitModalOpen(false)} />
      )}
      
      {adjustmentModalOpen && selectedProduct && (
        <AdjustmentModal 
          product={selectedProduct} 
          onClose={() => setAdjustmentModalOpen(false)} 
        />
      )}
    </div>
  );
}
