import { useState, useRef, useEffect } from 'react';
import { Menu, Plus, ChevronDown, Check, Activity } from 'lucide-react';
import { Button } from '../common/Button';
import { useUser } from '../../context/UserContext';

export function Header({ onOpenMobileMenu, onOpenCreateTask }) {
  const { users, currentUser, switchUser } = useUser();
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
    <header className="sticky top-0 z-30 h-16 glass-header px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + breadcrumb / context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Workspace Operations</span>
          </div>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-100/90 text-slate-700 font-medium border border-slate-200/60">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>PostgreSQL Active</span>
          </span>
        </div>
      </div>

      {/* Right side: Global Actions & User Profile Switcher */}
      <div className="flex items-center gap-3">
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
            className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-slate-200/90 bg-white/90 hover:bg-slate-50 hover:border-slate-300 transition-all text-left group shadow-sm cursor-pointer"
          >
            <div className="relative">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1.5">
                <span>{currentUser?.name || 'Loading...'}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 font-medium rounded">
                  {currentUser?.role || 'Member'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-normal">Active User (Me)</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
          </button>

          {/* User Switcher Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-slate-200/90 py-2 z-50 animate-slide-up">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-900">Switch Active Team Member</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Controls whose perspective is used for "Assigned to Me" and comment attribution.
                </p>
              </div>

              <div className="py-1.5 max-h-64 overflow-y-auto">
                {users.map((user) => {
                  const isSelected = currentUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/90 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-medium text-slate-900 leading-snug">{user.name}</div>
                          <div className="text-[10px] text-slate-400">{user.email}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
