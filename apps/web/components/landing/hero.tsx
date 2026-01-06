'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Copy, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoIcon } from '@/components/logo'

interface HeroProps {
  highlightedCode: string
}

export function Hero({ highlightedCode }: HeroProps) {
  const [copied, setCopied] = React.useState(false)
  const installCommand = 'npm install betteruse'

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 py-12 text-center md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          betteruse
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Elegant React hooks for real-world problems.
          <br />
          SSR-safe, fully typed, and under 5kb gzipped.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-2 bg-muted rounded-lg border px-4 py-2">
          <code className="font-mono text-sm">{installCommand}</code>
          <button
            onClick={handleCopy}
            className="rounded p-1 transition-colors hover:bg-muted"
            aria-label={copied ? 'Copied' : 'Copy install command'}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <a
              href="https://github.com/yourusername/betteruse"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl text-left"
      >
        <div className="rounded-lg border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">App.tsx</span>
          </div>
          <div
            className="[&_pre]:!bg-muted/50"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>
      </motion.div>
    </section>
  )
}
