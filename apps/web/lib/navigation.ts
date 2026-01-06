export interface NavItem {
  title: string
  href: string
  description?: string
  disabled?: boolean
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const docsNavigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        description: 'Learn about betteruse hooks',
      },
      {
        title: 'Installation',
        href: '/docs/installation',
        description: 'How to install betteruse in your project',
      },
    ],
  },
  {
    title: 'Hooks',
    items: [
      {
        title: 'echo',
        href: '/docs/hooks/use-echo',
        description: 'Screen reader announcements',
      },
      {
        title: 'useHold',
        href: '/docs/hooks/use-hold',
        description: 'Long press with progress',
      },
      {
        title: 'useExitIntent',
        href: '/docs/hooks/use-exit-intent',
        description: 'Exit intent detection',
      },
      {
        title: 'useIdle',
        href: '/docs/hooks/use-idle',
        description: 'Idle detection',
      },
      {
        title: 'useSelection',
        href: '/docs/hooks/use-selection',
        description: 'Text selection tracking',
      },
      {
        title: 'useMeasure',
        href: '/docs/hooks/use-measure',
        description: 'Element measurement',
      },
    ],
  },
]

export function getNavigation() {
  return docsNavigation
}

export function flattenNavigation(): NavItem[] {
  return docsNavigation.flatMap((section) => section.items)
}

export function findAdjacentPages(currentPath: string): {
  prev: NavItem | null
  next: NavItem | null
} {
  const flattened = flattenNavigation()
  const currentIndex = flattened.findIndex((item) => item.href === currentPath)

  return {
    prev: currentIndex > 0 ? flattened[currentIndex - 1] : null,
    next:
      currentIndex < flattened.length - 1 ? flattened[currentIndex + 1] : null,
  }
}
