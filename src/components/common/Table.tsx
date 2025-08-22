import React from "react";

export type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  className?: string;
};

export default function Table<T>({
  data,
  columns,
  emptyMessage = "No records found.",
  className = "",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full text-sm text-left ${className}`}>
        <thead className="text-white uppercase tracking-wider bg-[#1A1F2C]">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="py-3 px-4">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[rgb(29,36,54)] text-[#F2F0EF]">
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="border-t border-gray-300">
                {columns.map((col, j) => (
                  <td key={j} className="py-3 px-4">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-4 px-4 text-center" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
