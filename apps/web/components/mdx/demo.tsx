'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DemoProps {
  children: React.ReactNode
  className?: string
}

export function Demo({ children, className }: DemoProps) {
  return (
    <div
      className={cn(
        'my-6 flex min-h-[200px] items-center justify-center rounded-lg border bg-muted/30 p-8',
        className
      )}
    >
      {children}
    </div>
  )
}
