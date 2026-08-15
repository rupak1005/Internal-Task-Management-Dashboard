import { PRIORITY_CONFIG } from '../../utils/constants';
import { ArrowDown, Minus, ArrowUp, AlertTriangle } from 'lucide-react';

const PRIORITY_ICONS = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  urgent: AlertTriangle
};

export function PriorityBadge({ priority = 'medium', className = '', showIcon = true, size = 'sm' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const Icon = PRIORITY_ICONS[priority] || Minus;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    md: 'text-sm px-3 py-1.5 gap-2 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border transition-colors ${config.badgeClass} ${sizeClasses[size] || sizeClasses.sm} ${className}`}
    >
      {showIcon && <Icon className={`${config.iconColor} ${size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
}