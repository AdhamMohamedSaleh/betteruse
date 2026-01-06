'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { docsNavigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 md:hidden"
        aria-label="Open menu"
        disabled
      >
        <Menu className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[300px] p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="p-6">
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
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex w-full items-center rounded-md px-2 py-1.5',
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
      </DialogContent>
    </Dialog>
  )
}
