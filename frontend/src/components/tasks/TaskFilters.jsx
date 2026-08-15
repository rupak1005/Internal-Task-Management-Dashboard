import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants';
import { useUser } from '../../context/UserContext';
import { useDebounce } from '../../hooks/useDebounce';

export function TaskFilters({
  filters,
  onFilterChange,
  onReset
}) {
  const { users } = useUser();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Sync debounced search to parent filter state
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, filters.search, onFilterChange]);

  // Keep local search input in sync if parent resets
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || filters.assignee
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
      {/* Top Search Bar & Action Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title, keyword, or description..."
            className="w-full text-sm rounded-xl border border-slate-300/90 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 pl-10 pr-10 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="w-full text-sm rounded-xl border border-slate-300/90 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-medium cursor-pointer shadow-xs"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="w-full md:w-40">
          <select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ priority: e.target.value, page: 1 })}
            className="w-full text-sm rounded-xl border border-slate-300/90 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-medium cursor-pointer shadow-xs"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="w-full md:w-48">
          <select
            value={filters.assignee || ''}
            onChange={(e) => onFilterChange({ assignee: e.target.value, page: 1 })}
            className="w-full text-sm rounded-xl border border-slate-300/90 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 focus:border-blue-500 dark:focus:border-blue-500 transition-all font-medium cursor-pointer shadow-xs"
          >
            <option value="" className="bg-white dark:bg-slate-800">All Team Assignees</option>
            <option value="unassigned" className="bg-white dark:bg-slate-800">Unassigned Only</option>
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-white dark:bg-slate-800">
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter summary & Reset Action */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Active filters:</span>
            {filters.search && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800/60">
                "{filters.search}"
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                {filters.status.replace('_', ' ')}
              </span>
            )}
            {filters.priority && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-800/60">
                {filters.priority}
              </span>
            )}
            {filters.assignee && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800/60">
                {filters.assignee === 'unassigned'
                  ? 'Unassigned'
                  : users.find((u) => u.id === Number(filters.assignee))?.name || filters.assignee}
              </span>
            )}
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium hover:underline transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        </div>
      )}
    </div>
  );
}