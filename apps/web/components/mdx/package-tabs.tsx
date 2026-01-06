'use client'

import * as React from 'react'
import { Check, Copy, TerminalSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PackageTabsProps {
  commands?: {
    npm?: string
    pnpm?: string
    yarn?: string
    bun?: string
  }
}

const packageManagers = [
  { id: 'npm', label: 'npm' },
  { id: 'pnpm', label: 'pnpm' },
  { id: 'yarn', label: 'yarn' },
  { id: 'bun', label: 'bun' },
] as const

export function PackageTabs({
  commands = {
    npm: 'npm install betteruse',
    pnpm: 'pnpm add betteruse',
    yarn: 'yarn add betteruse',
    bun: 'bun add betteruse',
  },
}: PackageTabsProps) {
  const [activeTab, setActiveTab] = React.useState<string>('npm')
  const [copied, setCopied] = React.useState(false)

  // Load saved preference from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('preferred-package-manager')
    if (saved && commands[saved as keyof typeof commands]) {
      setActiveTab(saved)
    }
  }, [commands])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem('preferred-package-manager', tab)
  }

  const handleCopy = async () => {
    const command = commands[activeTab as keyof typeof commands]
    if (command) {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const activeCommand = commands[activeTab as keyof typeof commands]

  return (
    <div className="my-4 overflow-hidden rounded-lg border">
      <div className="flex px-3 items-center gap-2 border-b bg-muted/50">
      <TerminalSquare size={20} />
      <div className='flex space-x-1 py-1'>
        {packageManagers.map((pm) => {
          if (!commands[pm.id]) return null
          return (

            <button
              key={pm.id}
              onClick={() => handleTabChange(pm.id)}
              className={cn(
                'px-2 select-none py-1 text-sm font-medium transition-colors',
                activeTab === pm.id
                ? 'border-b-[1px] border-foreground rounded-md bg-background text-foreground'
                : 'text-muted-foreground hover:text-foreground'
              )}
              >
              {pm.label}
            </button>
          )
        })}
        </div>
      </div>
      <div className="group relative flex items-center justify-between bg-background px-3 py-3">
        <code className="font-mono bg-background text-muted-foreground text-sm before:content-none after:content-none">{activeCommand}</code>
        <button
          onClick={handleCopy}
          className="rounded-md p-1.5 transition-colors hover:bg-muted"
          aria-label={copied ? 'Copied' : 'Copy command'}
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
