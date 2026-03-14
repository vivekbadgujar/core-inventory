export default function Table({ columns, data, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-slate-950/80">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium tracking-wide text-slate-300">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-panel/80">
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row.id ?? index} className="transition hover:bg-slate-900/70">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-slate-200">
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
