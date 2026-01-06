interface PropDefinition {
  prop: string
  type: string
  default?: string
  description: string
  required?: boolean
}

interface PropsTableProps {
  data: PropDefinition[]
}

export function PropsTable({ data }: PropsTableProps) {
  return (
    <div className="my-6 w-full overflow-auto">
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="m-0 p-0">
            <th className="border text-foreground bg-muted/50 border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              Prop
            </th>
            <th className="border text-foreground bg-muted/50 border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              Type
            </th>
            <th className="border text-foreground bg-muted/50 border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              Default
            </th>
            <th className="border text-foreground bg-muted/50 border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.prop} className="m-0 p-0">
              <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                <code className="relative text-foreground before:content-none after:content-none rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {row.prop}
                  {row.required && <span className="text-destructive">*</span>}
                </code>
              </td>
              <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                <code className="relative text-foreground before:content-none after:content-none rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {row.type}
                </code>
              </td>
              <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                {row.default ? (
                  <code className="relative text-foreground before:content-none after:content-none rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {row.default}
                  </code>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="border border-border px-4 py-2 text-left text-sm [&[align=center]]:text-center [&[align=right]]:text-right">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
