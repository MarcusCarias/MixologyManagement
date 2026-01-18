import { useState } from 'react';
import { X, Search, Minus, Plus } from 'lucide-react';

interface QuickExitModalProps {
  onClose: () => void;
}

export function QuickExitModal({ onClose }: QuickExitModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedReason, setSelectedReason] = useState('transfer');
  const [quantity, setQuantity] = useState(1);

  const products = [
    { id: 1, name: 'Jack Daniels No.7', brand: 'Jack Daniels', currentStock: 8, image: '🥃' },
    { id: 2, name: 'Vodka Absolut', brand: 'Absolut', currentStock: 14, image: '🍸' },
    { id: 3, name: 'Gin Tanqueray', brand: 'Tanqueray', currentStock: 12, image: '🍸' },
    { id: 4, name: 'Whisky Jameson', brand: 'Jameson', currentStock: 5, image: '🥃' },
  ];

  const reasons = [
    { id: 'transfer', label: 'Transferência para Bar', color: 'bg-blue-600' },
    { id: 'broken', label: 'Quebra/Derramamento', color: 'bg-red-600' },
    { id: 'house', label: 'Consumo da Casa/Promoção', color: 'bg-purple-600' },
    { id: 'loss', label: 'Perda/Roubo', color: 'bg-orange-600' },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    console.log('Saída confirmada:', { product: selectedProduct, reason: selectedReason, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl">Registrar Saída de Estoque</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search Field */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Buscar Produto (Digite o nome ou escaneie o código de barras)
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-lg text-lg focus:outline-none focus:border-orange-600 transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && !selectedProduct && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Resultados da busca:</p>
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setSearchTerm('');
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-orange-600 rounded-lg transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center text-2xl">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Estoque Atual</p>
                    <p className="text-lg">{product.currentStock} garrafas</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Product */}
          {selectedProduct && (
            <>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center text-3xl">
                    {selectedProduct.image}
                  </div>
                  <div className="flex-1">
                    <p className="text-xl mb-1">{selectedProduct.name}</p>
                    <p className="text-gray-400">{selectedProduct.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Atual</p>
                    <p className="text-2xl">{selectedProduct.currentStock}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Motivo da Saída
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {reasons.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedReason === reason.id
                          ? `${reason.color} border-current`
                          : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Quantidade
                </label>
                <div className="flex items-center justify-center gap-6 bg-zinc-800 border border-zinc-700 rounded-lg p-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                  >
                    <Minus size={24} />
                  </button>
                  <div className="text-center">
                    <p className="text-5xl">{quantity}</p>
                    <p className="text-sm text-gray-400 mt-2">unidade(s)</p>
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.currentStock, quantity + 1))}
                    className="p-4 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-green-600 hover:bg-green-700 rounded-lg text-lg transition-colors"
              >
                Confirmar Saída
              </button>
            </>
          )}

          {!selectedProduct && !searchTerm && (
            <div className="text-center py-12 text-gray-400">
              <p>Digite o nome do produto ou escaneie o código de barras</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}