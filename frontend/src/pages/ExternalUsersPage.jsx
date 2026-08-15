import { useState, useEffect, useCallback } from 'react';
import { externalService } from '../services/external.service';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import {
  RefreshCw,
  Search,
  Mail,
  Phone,
  Building2,
  MapPin,
  ExternalLink,
  AlertCircle,
  Users
} from 'lucide-react';

export function ExternalUsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [warning, setWarning] = useState(null);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await externalService.getExternalUsers();
      setUsers(res.data || []);
      setWarning(res.warning);

      if (isRefresh) {
        toast.success(`Synced ${res.data?.length || 0} team profiles from external integration.`);
      }
    } catch (err) {
      toast.error(`External sync failed: ${err.message}`);
      setWarning(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Client filtering
  const departments = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'Customer Success', 'Operations'];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.companyName.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());

    const matchesDept = !departmentFilter || departmentFilter === 'All' || u.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Team Directory & External Sync
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>External API Active</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Connected via JSONPlaceholder enterprise gateway with automated retry and response transformation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={refreshing}
            onClick={() => fetchUsers(true)}
          >
            Sync from API
          </Button>
        </div>
      </div>

      {/* Warning / Offline Cache Banner if applicable */}
      {warning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Resilient Fallback Mode Active: </span>
            {warning}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchUsers(true)}
            className="text-amber-900 hover:bg-amber-100 text-xs py-1"
          >
            Retry Sync
          </Button>
        </div>
      )}

      {/* Search & Department Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search directory by name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300/90 bg-slate-50/60 pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1">Department:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept === 'All' ? '' : dept)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                (!departmentFilter && dept === 'All') || departmentFilter === dept
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading && users.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800">No team profiles found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or department filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-6 flex flex-col justify-between space-y-5 group"
            >
              <div>
                {/* User Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 bg-slate-50 shadow-sm"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {user.name}
                      </h3>
                      <div className="text-xs text-slate-400">@{user.username}</div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {user.department}
                  </span>
                </div>

                {/* Company Context */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{user.companyName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic line-clamp-1">
                    "{user.companyCatchPhrase}"
                  </p>
                </div>

                {/* Contact & Location Info */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:text-blue-600 truncate transition-colors"
                    >
                      {user.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{user.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{user.addressCity}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{user.status}</span>
                </span>

                {user.website && (
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-400 hover:text-blue-600 font-medium transition-colors"
                  >
                    <span>{user.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
