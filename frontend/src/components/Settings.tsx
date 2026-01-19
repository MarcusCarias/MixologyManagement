import { useState, useEffect } from "react";
import { User, Globe, Shield, Save } from "lucide-react";
import { apiFetch } from "../services/api";

interface Usuario {
  nome: string;
  papel: string;
  email: string;
  cpf: string;
}

export function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [system, setSystem] = useState({
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    dateFormat: "DD/MM/YYYY",
  });

  // Buscar dados do usuário logado
  useEffect(() => {
    async function fetchUsuario() {
      try {
        const data = await apiFetch<Usuario>("/auth/me");
        setUsuario(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }
    fetchUsuario();
  }, []);

  const sections = [
    { id: "profile", name: "Perfil", icon: User },
    { id: "system", name: "Sistema", icon: Globe },
    { id: "security", name: "Segurança", icon: Shield },
  ];

  const isAdmin = usuario?.papel === "ADMIN";

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Configurações</h1>
          <p className="text-gray-400">
            Personalize o sistema de acordo com suas necessidades
          </p>
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
                        ? "bg-orange-600 text-white"
                        : "text-gray-400 hover:bg-zinc-800 hover:text-gray-200"
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
              {activeSection === "profile" && usuario && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Informações do Perfil</h2>
                    <p className="text-gray-400">
                      Visualize suas informações pessoais
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={usuario.nome}
                        readOnly={!isAdmin}
                        className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none transition-colors ${
                          isAdmin
                            ? "focus:border-cyan-600"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Cargo
                      </label>
                      <input
                        type="text"
                        value={usuario.papel}
                        readOnly
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg opacity-60 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={usuario.email}
                        readOnly={!isAdmin}
                        className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none transition-colors ${
                          isAdmin
                            ? "focus:border-cyan-600"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={usuario.cpf}
                        readOnly
                        className={`w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none transition-colors ${
                          isAdmin
                            ? "focus:border-cyan-600"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex justify-end pt-4">
                      <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                        <Save size={20} />
                        <span>Salvar Alterações</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* System Section */}
              {activeSection === "system" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Configurações do Sistema</h2>
                    <p className="text-gray-400">
                      Ajustes regionais e de formato
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Idioma
                      </label>
                      <select
                        value={system.language}
                        onChange={(e) =>
                          setSystem({ ...system, language: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Fuso Horário
                      </label>
                      <select
                        value={system.timezone}
                        onChange={(e) =>
                          setSystem({ ...system, timezone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                      >
                        <option value="America/Sao_Paulo">
                          São Paulo (UTC-3)
                        </option>
                        <option value="America/New_York">
                          New York (UTC-5)
                        </option>
                        <option value="Europe/London">London (UTC+0)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Formato de Data
                      </label>
                      <select
                        value={system.dateFormat}
                        onChange={(e) =>
                          setSystem({ ...system, dateFormat: e.target.value })
                        }
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

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl mb-2">Segurança</h2>
                    <p className="text-gray-400">
                      Gerencie suas credenciais e permissões
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-zinc-800 rounded-lg">
                      <h3 className="mb-2">Alterar Senha</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Última alteração: 15 dias atrás
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Senha Atual
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Nova Senha
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-cyan-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Confirmar Nova Senha
                          </label>
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
