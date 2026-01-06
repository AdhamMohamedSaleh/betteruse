'use client'

import { motion } from 'framer-motion'
import {
  Hand,
  Speaker,
  LogOut,
  Clock,
  Type,
  Ruler,
} from 'lucide-react'

const features = [
  {
    icon: Speaker,
    title: 'echo',
    description: 'Screen reader announcements with a simple function-based API.',
    href: '/docs/hooks/use-echo',
  },
  {
    icon: Hand,
    title: 'useHold',
    description: 'Long press detection with smooth progress animation.',
    href: '/docs/hooks/use-hold',
  },
  {
    icon: LogOut,
    title: 'useExitIntent',
    description: 'Detect when users are about to leave your page.',
    href: '/docs/hooks/use-exit-intent',
  },
  {
    icon: Clock,
    title: 'useIdle',
    description: 'Track user activity and detect idle states.',
    href: '/docs/hooks/use-idle',
  },
  {
    icon: Type,
    title: 'useSelection',
    description: 'Track text selection with positioning for tooltips.',
    href: '/docs/hooks/use-selection',
  },
  {
    icon: Ruler,
    title: 'useMeasure',
    description: 'Measure element dimensions with ResizeObserver.',
    href: '/docs/hooks/use-measure',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section className="container py-12 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Hooks for Every Need
        </h2>
        <p className="mt-4 text-muted-foreground">
          A curated collection of hooks that solve common UI challenges.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.a
            key={feature.title}
            href={feature.href}
            variants={item}
            className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
