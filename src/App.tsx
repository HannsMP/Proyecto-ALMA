import { useMemo, useState } from 'react';
import { BookOpen, Cpu, Download, FileText, FolderArchive, Presentation } from 'lucide-react';
import { EntregablesView } from './components/EntregablesView';
import { InformeView } from './components/InformeView';
import { PresentacionView } from './components/PresentacionView';
import { ReferenciasView } from './components/ReferenciasView';
import { SistemaAlmaView } from './components/SistemaAlmaView';
import { TEAM_MEMBERS, type TeamMember } from './data/teamMembers';
import { generateAlmaT3WordDocx } from './lib/exportWordDocx';

type AppTab = 'alma' | 'entregables' | 'informe' | 'presentacion' | 'referencias';

const NAV_ITEMS: Array<{ id: AppTab; label: string; icon: typeof Cpu }> = [
  { id: 'alma', label: 'Sistema ALMA', icon: Cpu },
  { id: 'entregables', label: 'Entregables', icon: FolderArchive },
  { id: 'informe', label: 'Informe', icon: FileText },
  { id: 'presentacion', label: 'Presentación', icon: Presentation },
  { id: 'referencias', label: 'Referencias', icon: BookOpen },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('alma');
  const [activeMemberId, setActiveMemberId] = useState<TeamMember['id']>('gabriel');
  const [exportingWord, setExportingWord] = useState(false);

  const activeMember = useMemo(
    () => TEAM_MEMBERS.find((m) => m.id === activeMemberId) ?? TEAM_MEMBERS[0],
    [activeMemberId],
  );

  const handleExportWord = async () => {
    setExportingWord(true);
    try {
      await generateAlmaT3WordDocx(activeMember);
    } finally {
      setExportingWord(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Barra superior fija de 3 zonas: Wordmark · Navegación (5 vistas) · CTA Exportar Word */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:gap-8">
          {/* Zona 1: Wordmark */}
          <div className="flex items-baseline gap-2.5 shrink-0">
            <span className="font-display text-base font-bold tracking-tight text-slate-950">
              Proyecto ALMA
            </span>
            <span className="hidden text-xs text-slate-500 sm:inline">
              UPN · Mecatrónica T3
            </span>
          </div>

          {/* Zona 2: Navegación principal de 5 vistas */}
          <nav aria-label="Navegación principal" className="flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zona 3: Acción primaria única */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void handleExportWord()}
              disabled={exportingWord}
              title={`Exportar Word para ${activeMember.fullName}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-blue-700 bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {exportingWord ? 'Generando .docx...' : 'Exportar Word'}
            </button>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'alma' && <SistemaAlmaView />}
        {activeTab === 'entregables' && (
          <EntregablesView
            activeMember={activeMember}
            onSelectMember={setActiveMemberId}
          />
        )}
        {activeTab === 'informe' && (
          <InformeView
            activeMember={activeMember}
            onSelectMember={setActiveMemberId}
            onExportWord={handleExportWord}
            exportingWord={exportingWord}
          />
        )}
        {activeTab === 'presentacion' && (
          <PresentacionView
            activeMemberId={activeMemberId}
            onSelectMember={setActiveMemberId}
          />
        )}
        {activeTab === 'referencias' && <ReferenciasView />}
      </main>
    </div>
  );
}
