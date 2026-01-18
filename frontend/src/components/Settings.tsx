import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Globe, Save } from 'lucide-react';

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  // Form states
  const [profile, setProfile] = useState({
    name: 'Charles Alexandre',
    role: 'Estoquista',
    email: 'charles@barflow.com',
    phone: '(11) 98765-4321'
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    movements: false,
    reports: true,
    emailNotifications: true,
    pushNotifications: false
  });

  const [system, setSystem] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY'
  });

  const [inventory, setInventory] = useState({
    autoReorder: true,
    reorderThreshold: 20,
    defaultParLevel: 10,
    enableBarcode: true,
    trackExpiration: true
  });

  const sections = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'system', name: 'Sistema', icon: Globe },
    { id: 'inventory', name: 'Inventário', icon: Database },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'security', name: 'Segurança', icon: Shield }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Configurações</h1>
          <p className="text-gray-400">Personalize o sistema de acordo com suas necessidades</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-fit">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-400 hover:bg-zinc-800 hover:text-gray-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
              
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Informações do Perfil</h2>
                    <p className="text-gray-400">Gerencie suas informações pessoais</p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center text-3xl">
                      CA
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors mr-2">
                        Alterar Foto
                      </button>
                      <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors">
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Cargo</label>
                      <select
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="Estoquista">Estoquista</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Bartender">Bartender</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                      <Save size={20} />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Preferências de Notificação</h2>
                    <p className="text-gray-400">Configure como deseja ser notificado</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Alerta de Estoque Baixo</p>
                        <p className="text-sm text-gray-400">Receber notificações quando produtos atingirem o nível mínimo</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.lowStock}
                          onChange={(e) => setNotifications({ ...notifications, lowStock: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Novos Pedidos</p>
                        <p className="text-sm text-gray-400">Notificar sobre novos pedidos recebidos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.newOrders}
                          onChange={(e) => setNotifications({ ...notifications, newOrders: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Movimentações de Estoque</p>
                        <p className="text-sm text-gray-400">Alertas sobre entradas e saídas importantes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.movements}
                          onChange={(e) => setNotifications({ ...notifications, movements: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Relatórios Semanais</p>
                        <p className="text-sm text-gray-400">Receber resumo semanal de atividades</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.reports}
                          onChange={(e) => setNotifications({ ...notifications, reports: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="mb-4">Canais de Notificação</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <div>
                          <p>Notificações por Email</p>
                          <p className="text-sm text-gray-400">Enviar alertas para seu email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div>
                          <p>Push Notifications</p>
                          <p className="text-sm text-gray-400">Notificações do navegador</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                      <Save size={20} />
                      <span>Salvar Preferências</span>
                    </button>
                  </div>
                </div>
              )}

              {/* System Section */}
              {activeSection === 'system' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Configurações do Sistema</h2>
                    <p className="text-gray-400">Ajustes regionais e de formato</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Idioma</label>
                      <select
                        value={system.language}
                        onChange={(e) => setSystem({ ...system, language: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Fuso Horário</label>
                      <select
                        value={system.timezone}
                        onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="America/Sao_Paulo">São Paulo (UTC-3)</option>
                        <option value="America/New_York">New York (UTC-5)</option>
                        <option value="Europe/London">London (UTC+0)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Moeda</label>
                      <select
                        value={system.currency}
                        onChange={(e) => setSystem({ ...system, currency: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="BRL">Real (R$)</option>
                        <option value="USD">Dólar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Formato de Data</label>
                      <select
                        value={system.dateFormat}
                        onChange={(e) => setSystem({ ...system, dateFormat: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                      <Save size={20} />
                      <span>Salvar Configurações</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Inventory Section */}
              {activeSection === 'inventory' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Configurações de Inventário</h2>
                    <p className="text-gray-400">Personalize o gerenciamento de estoque</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Reordenação Automática</p>
                        <p className="text-sm text-gray-400">Criar pedidos automaticamente quando atingir o nível mínimo</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inventory.autoReorder}
                          onChange={(e) => setInventory({ ...inventory, autoReorder: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Leitor de Código de Barras</p>
                        <p className="text-sm text-gray-400">Habilitar entrada rápida via scanner</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inventory.enableBarcode}
                          onChange={(e) => setInventory({ ...inventory, enableBarcode: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                      <div>
                        <p>Rastreamento de Validade</p>
                        <p className="text-sm text-gray-400">Monitorar datas de vencimento dos produtos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inventory.trackExpiration}
                          onChange={(e) => setInventory({ ...inventory, trackExpiration: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Limite para Reordenação (%)</label>
                      <input
                        type="number"
                        value={inventory.reorderThreshold}
                        onChange={(e) => setInventory({ ...inventory, reorderThreshold: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Criar pedido quando atingir este percentual do Par Level</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Par Level Padrão</label>
                      <input
                        type="number"
                        value={inventory.defaultParLevel}
                        onChange={(e) => setInventory({ ...inventory, defaultParLevel: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1">Quantidade mínima padrão para novos produtos</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                      <Save size={20} />
                      <span>Salvar Configurações</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Aparência</h2>
                    <p className="text-gray-400">Personalize a interface do sistema</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Tema</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-zinc-950 border-2 border-cyan-600 rounded-lg text-left">
                          <div className="w-full h-24 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded mb-3"></div>
                          <p>Escuro (Padrão)</p>
                          <p className="text-sm text-gray-400">Ideal para ambientes com pouca luz</p>
                        </button>

                        <button className="p-4 bg-zinc-800 border-2 border-zinc-700 rounded-lg text-left opacity-50 cursor-not-allowed">
                          <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3"></div>
                          <p>Claro</p>
                          <p className="text-sm text-gray-400">Em breve</p>
                        </button>

                        <button className="p-4 bg-zinc-800 border-2 border-zinc-700 rounded-lg text-left opacity-50 cursor-not-allowed">
                          <div className="w-full h-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded mb-3"></div>
                          <p>Automático</p>
                          <p className="text-sm text-gray-400">Em breve</p>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm text-gray-400 mb-3">Cor de Destaque</label>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308', '#22c55e'].map((color) => (
                          <button
                            key={color}
                            className={`w-12 h-12 rounded-lg border-2 ${color === '#06b6d4' ? 'border-white' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm text-gray-400 mb-2">Tamanho da Fonte</label>
                      <select className="w-full md:w-64 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors">
                        <option value="small">Pequeno</option>
                        <option value="medium">Médio (Padrão)</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                      <Save size={20} />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Segurança</h2>
                    <p className="text-gray-400">Gerencie suas credenciais e permissões</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-zinc-800 rounded-lg">
                      <h3 className="mb-2">Alterar Senha</h3>
                      <p className="text-sm text-gray-400 mb-4">Última alteração: 15 dias atrás</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Senha Atual</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Nova Senha</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Confirmar Nova Senha</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                          />
                        </div>
                        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors">
                          Atualizar Senha
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-800 rounded-lg">
                      <h3 className="mb-2">Autenticação de Dois Fatores</h3>
                      <p className="text-sm text-gray-400 mb-4">Adicione uma camada extra de segurança à sua conta</p>
                      <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 rounded-lg transition-colors">
                        Ativar 2FA
                      </button>
                    </div>

                    <div className="p-6 bg-zinc-800 rounded-lg">
                      <h3 className="mb-2">Sessões Ativas</h3>
                      <p className="text-sm text-gray-400 mb-4">Dispositivos conectados atualmente</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                          <div>
                            <p>iPad Pro - Safari</p>
                            <p className="text-sm text-gray-400">São Paulo, SP • Ativo agora</p>
                          </div>
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm">Atual</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                          <div>
                            <p>iPhone 14 - Safari</p>
                            <p className="text-sm text-gray-400">São Paulo, SP • 2 horas atrás</p>
                          </div>
                          <button className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition-colors">
                            Encerrar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}