'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { docsNavigation } from '@/lib/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-[5rem] z-30 hidden h-[calc(100vh-5rem)] w-full shrink-0 md:sticky md:block">
      <ScrollArea className="h-full py-6 pr-6 lg:py-8">
        <nav className="w-full">
          {docsNavigation.map((section) => (
            <div key={section.title} className="pb-6">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                {section.title}
              </h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline',
                      pathname === item.href
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}
