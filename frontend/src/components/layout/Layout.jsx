import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ currentTab, onSelectTab, counts, onOpenCreateTask, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        counts={counts}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateTask={onOpenCreateTask}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
