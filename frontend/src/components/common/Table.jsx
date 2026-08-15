import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export function Table({
  columns,
  data = [],
  sortField,
  sortOrder,
  onSort,
  keyExtractor = (item) => item.id,
  onRowClick,
  className = ''
}) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors ${className}`}>
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
        <thead className="bg-slate-50/80 dark:bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            {columns.map((col) => {
              const isSorted = sortField === col.field;
              const isSortable = col.sortable && onSort;

              return (
                <th
                  key={col.key || col.field}
                  scope="col"
                  onClick={() => {
                    if (isSortable) {
                      const nextOrder = isSorted && sortOrder === 'asc' ? 'desc' : 'asc';
                      onSort(col.field, nextOrder);
                    }
                  }}
                  className={`px-4 py-3.5 ${col.headerClassName || ''} ${
                    isSortable ? 'cursor-pointer select-none hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {isSortable && (
                      <span className="text-slate-400 dark:text-slate-500">
                        {isSorted ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item) || index}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800/60 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key || col.field} className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.render ? col.render(item, index) : item[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}