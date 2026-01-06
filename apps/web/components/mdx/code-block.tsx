'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  filename?: string
}

export function CodeBlock({ children, className, filename }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const codeRef = React.useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    if (codeRef.current) {
      const code = codeRef.current.textContent || ''
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn('group relative my-4', className)}>
      {filename && (
        <div className="flex items-center gap-2 rounded-t-lg border border-b-0 bg-muted px-4 py-2 text-sm text-muted-foreground">
          <span>{filename}</span>
        </div>
      )}
      <div className="relative">
        <div ref={codeRef}>{children}</div>
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 rounded-md border bg-background p-2 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  )
}
