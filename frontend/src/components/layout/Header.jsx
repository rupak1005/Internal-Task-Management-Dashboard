import { useState, useRef, useEffect } from 'react';
import { Menu, Plus, ChevronDown, Check, Activity, Sun, Moon, LogIn, LogOut, Shield, BookOpen } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export function Header({ onOpenMobileMenu, onOpenCreateTask, onOpenAuthModal, onSelectTab }) {
  const { user, users, switchDemoUser, logout, isDarkMode, toggleDarkMode, isAdmin } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors duration-200">
      {/* Left side: Mobile menu toggle + breadcrumb / context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <span>Workspace Operations</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/80">
            <Activity className="w-3 h-3 text-emerald-500 dark:text-emerald-400 animate-pulse" />
            <span>PostgreSQL Active</span>
          </span>
        </div>
      </div>

      {/* Right side: Dark mode, Swagger, Task Create & User Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Swagger Docs Link */}
        <a
          href="/api/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs transition-colors"
          title="Open interactive Swagger OpenAPI Documentation"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Swagger API</span>
        </a>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all shadow-2xs cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Create Task Button */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={onOpenCreateTask}
        >
          <span className="hidden sm:inline">Create Task</span>
          <span className="sm:hidden">New</span>
        </Button>

        {/* Current User Switcher Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left group shadow-2xs cursor-pointer"
          >
            <div className="relative">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20 dark:ring-blue-400/30"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-1.5">
                <span>{user?.name || 'Guest'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 font-semibold rounded ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300 border border-slate-200/50 dark:border-slate-600/50'
                }`}>
                  {user?.role || 'Member'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">Active User (Me)</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200" />
          </button>

          {/* User Switcher Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200/90 dark:border-slate-700/90 py-2 z-50 animate-slide-up">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Switch Active Account / RBAC</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Switching users re-authenticates JWT and updates permissions immediately.
                </p>
              </div>

              <div className="py-1.5 max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/30">
                {users.map((u) => {
                  const isSelected = user?.id === u.id;
                  const isUserAdmin = u.role === 'Admin';
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchDemoUser(u.email, 'password123');
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100 leading-snug flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isUserAdmin && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-400">{u.email}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions: Admin Audit Logs & Sign In / Out */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (onSelectTab) onSelectTab('audit-logs');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>View Audit Logs</span>
                  </button>
                )}

                <div className="flex items-center gap-1 pt-1">
                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login / Register</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Log out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}