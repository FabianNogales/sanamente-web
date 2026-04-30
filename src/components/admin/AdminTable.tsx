import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  title: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T, index: number) => string;
};

export function AdminTable<T>({ rows, columns, rowKey }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-[980px] w-full border-collapse">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-500 border-b border-slate-200 ${
                  column.className ?? ""
                }`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={rowKey(row, index)} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
              {columns.map((column) => (
                <td key={column.key} className={`px-3 py-2 text-sm text-slate-800 border-b border-slate-100 ${column.className ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
