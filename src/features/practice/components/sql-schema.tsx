import { Database } from "lucide-react";
import type { SqlTable } from "@/types/practice";

/** Tables the SQL problem runs against: columns with types and the sample rows. */
export function SqlSchema({ tables }: { tables: SqlTable[] }) {
  return (
    <div className="space-y-5 p-4 sm:p-5">
      <p className="text-[13px] text-muted-foreground">
        Queries run on a throwaway PostgreSQL 16 database. Run uses the sample rows below; Submit also runs hidden datasets and compares
        your rows with the reference query.
      </p>
      {tables.map((table) => (
        <section key={table.name} className="overflow-hidden rounded-md border">
          <header className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
            <Database className="size-4 text-muted-foreground" />
            <h3 className="font-mono text-sm font-semibold">{table.name}</h3>
            <span className="ml-auto text-xs text-muted-foreground">{table.rows.length} sample rows</span>
          </header>
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-b px-3 py-2 font-mono text-xs">
            {table.columns.map((c) => (
              <span key={c.name}>
                {c.name} <span className="text-muted-foreground">{c.type}</span>
              </span>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  {table.columns.map((c) => (
                    <th key={c.name} className="px-3 py-1.5 font-medium">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 whitespace-nowrap">
                        {cell === null ? <span className="text-muted-foreground">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
