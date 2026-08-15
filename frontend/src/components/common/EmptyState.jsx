import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon = ClipboardList,
  title = 'No tasks found',
  description = 'Try adjusting your search query or filters to find what you are looking for.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 ${className}`}>
      <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-sm ring-1 ring-blue-500/10">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" icon={Plus} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
