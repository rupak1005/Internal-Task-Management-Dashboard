import { STATUS_CONFIG } from '../../utils/constants';
import { Clock, PlayCircle, CheckCircle2, AlertOctagon } from 'lucide-react';

const STATUS_ICONS = {
  pending: Clock,
  in_progress: PlayCircle,
  completed: CheckCircle2,
  blocked: AlertOctagon
};

export function StatusBadge({ status = 'pending', className = '', showIcon = true, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = STATUS_ICONS[status] || Clock;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    md: 'text-sm px-3 py-1.5 gap-2 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ring-1 ring-inset ${config.badgeClass} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showIcon ? (
        <Icon className={size === 'xs' ? 'w-3 h-3 shrink-0' : 'w-3.5 h-3.5 shrink-0'} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
