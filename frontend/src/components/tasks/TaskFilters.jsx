import React, { useState, useEffect } from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants';
import { useUser } from '../../context/UserContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../common/Button';

export function TaskFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults = 0,
  isLoading = false
}) {
  const { users } = useUser();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Sync debounced search to parent filter state
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  // Keep local search input in sync if parent resets
  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || filters.assignee
  );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {/* Top Search Bar & Action Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title, keywords, or description..."
            className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-10 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
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
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
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
            className="w-full text-sm rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
          >
            <option value="">All Team Assignees</option>
            <option value="unassigned">Unassigned Only</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter summary & Reset Action */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Active filters:</span>
            {filters.search && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                Keyword: "{filters.search}"
              </span>
            )}
            {filters.status && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                Status: {filters.status.replace('_', ' ')}
              </span>
            )}
            {filters.priority && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium">
                Priority: {filters.priority}
              </span>
            )}
            {filters.assignee && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium">
                Assignee:{' '}
                {filters.assignee === 'unassigned'
                  ? 'Unassigned'
                  : users.find((u) => u.id === Number(filters.assignee))?.name || filters.assignee}
              </span>
            )}
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium hover:underline transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
