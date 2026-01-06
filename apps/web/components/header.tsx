'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommandMenu } from '@/components/search'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/docs/mobile-nav'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const isDocsPage = pathname.startsWith('/docs')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {isDocsPage && <MobileNav />}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center">
            <Logo />
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/docs"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname.startsWith('/docs')
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            <Button asChild variant="ghost" size="icon" className="h-9 w-9">
              <a
                href="https://github.com/yourusername/betteruse"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
