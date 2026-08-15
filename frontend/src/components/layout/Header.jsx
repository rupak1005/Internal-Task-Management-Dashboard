import { useState, useRef, useEffect } from 'react';
import { Menu, Plus, ChevronDown, Check } from 'lucide-react';
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
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left side: Mobile menu toggle + breadcrumb / search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <div className="text-sm font-semibold text-slate-800 tracking-tight">
            Internal Operations
          </div>
          <span className="text-slate-300">/</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
            Workspace Hub
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
          className="shadow-sm font-medium"
        >
          <span className="hidden xs:inline">Create Task</span>
          <span className="xs:hidden">New</span>
        </Button>

        {/* Current User Switcher Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left group shadow-sm"
          >
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
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1">
                <span>{currentUser?.name || 'Loading...'}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-600 font-bold rounded">
                  {currentUser?.role || 'User'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-normal">Active User (Me)</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
          </button>

          {/* User Switcher Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">Switch Active Team Member</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Changes who is considered "Me" for dashboard stats & comments.
                </p>
              </div>

              <div className="py-1 max-h-60 overflow-y-auto">
                {users.map((user) => {
                  const isSelected = currentUser?.id === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                        isSelected ? 'bg-blue-50/80 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
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
