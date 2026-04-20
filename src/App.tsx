import React, { useState } from 'react';
import { Users, LayoutDashboard, Sparkles } from 'lucide-react';
import { LeadsPage } from './pages/LeadsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AISummaryPage } from './pages/AISummaryPage';

type Page = 'leads' | 'dashboard' | 'ai';

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'leads', label: 'Leads', icon: <Users size={20} /> },
  { id: 'ai', label: 'Resumen IA', icon: <Sparkles size={20} /> },
];

export default function App() {
  const [page, setPage] = useState<Page>('leads');

  const renderPage = () => {
    if (page === 'dashboard') return <DashboardPage />;
    if (page === 'ai') return <AISummaryPage />;
    return <LeadsPage />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 hidden md:flex flex-col z-40">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Users size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">OMC Leads</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                page === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">One Million Copy SAS</p>
          <p className="text-xs text-gray-300 mt-0.5">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-3 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
            <Users size={12} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">OMC Leads</span>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs font-medium transition-colors ${
              page === item.id ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <span className={`transition-transform ${page === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {page === item.id && (
              <span className="absolute bottom-0 w-10 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">{renderPage()}</div>
      </main>
    </div>
  );
}
