import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/navigation'

interface PaginationProps {
  prev: NavItem | null
  next: NavItem | null
}

export function Pagination({ prev, next }: PaginationProps) {
  return (
    <div className="flex flex-row items-center justify-between border-t pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className={cn(
            'flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className={cn(
            'flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
          )}
        >
          <span>{next.title}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
