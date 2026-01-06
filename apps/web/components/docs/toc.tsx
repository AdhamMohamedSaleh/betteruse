'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { TocItem } from '@/lib/toc'

interface TocProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = React.useState<string>('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0% -35% 0%', threshold: 0 }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="hidden text-sm xl:block">
      <div className="fixed top-16 right-[max(0px,calc(50%-45rem))] w-[200px] h-[calc(100vh-3.5rem)] pt-10">
        <div className="space-y-2">
          <p className="font-medium">On This Page</p>
          <ul className="m-0 list-none">
            {items.map((item) => (
              <li key={item.id} className="mt-0 pt-2">
                <a
                  href={`#${item.id}`}
                  className={cn(
                    'inline-block no-underline transition-colors hover:text-foreground',
                    item.level === 3 && 'pl-4',
                    item.level === 4 && 'pl-8',
                    activeId === item.id
                      ? 'font-medium text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
