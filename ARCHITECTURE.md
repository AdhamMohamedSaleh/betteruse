# Architecture

This document describes the internal architecture of the betteruse monorepo.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Build Process](#build-process)
4. [Website Architecture](#website-architecture)
5. [Adding a New Hook](#adding-a-new-hook)
6. [Adding a New Doc Page](#adding-a-new-doc-page)
7. [Commands Reference](#commands-reference)
8. [Publishing to npm](#publishing-to-npm)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Project Overview

betteruse is a monorepo containing:

1. **packages/betteruse**: The React hooks library
2. **apps/web**: The documentation website built with Next.js 15

The monorepo uses pnpm workspaces for package management and Turborepo for task orchestration.

## Folder Structure

```
betteruse/
├── packages/
│   └── betteruse/           # The hooks library
│       ├── src/
│       │   ├── index.ts     # Main exports
│       │   ├── use-hold.ts  # useHold hook
│       │   ├── use-echo.ts  # echo function
│       │   ├── use-exit-intent.ts
│       │   ├── use-idle.ts
│       │   ├── use-selection.ts
│       │   └── use-measure.ts
│       ├── tests/           # Vitest tests
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsup.config.ts   # Build configuration
│       └── vitest.config.ts
│
├── apps/
│   └── web/                 # Documentation website
│       ├── app/             # Next.js App Router
│       │   ├── page.tsx     # Landing page
│       │   ├── layout.tsx   # Root layout
│       │   ├── globals.css  # Global styles
│       │   ├── docs/        # Docs pages
│       │   └── api/og/      # OG image generation
│       ├── content/         # MDX content
│       │   ├── index.mdx
│       │   ├── installation.mdx
│       │   └── hooks/       # Hook documentation
│       ├── components/      # React components
│       │   ├── ui/          # Shadcn-style UI components
│       │   ├── docs/        # Documentation components
│       │   ├── mdx/         # MDX components
│       │   └── landing/     # Landing page components
│       ├── lib/             # Utility functions
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI
│
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
├── README.md
└── ARCHITECTURE.md
```

## Build Process

### Library Build (tsup)

The library uses tsup for building:

```ts
// packages/betteruse/tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: ['react', 'react-dom'],
})
```

This produces:

- `dist/index.js` - CommonJS bundle
- `dist/index.mjs` - ESM bundle
- `dist/index.d.ts` - TypeScript declarations
- `dist/index.d.mts` - ESM TypeScript declarations

### Website Build (Next.js)

The website uses Next.js 15 with:

- App Router for routing
- MDX for documentation content
- Shiki for syntax highlighting
- Static generation for all pages

## Website Architecture

### MDX Pipeline

1. MDX files in `content/` are read at build time
2. Gray-matter extracts frontmatter (title, description)
3. MDX is compiled with:
   - remark-gfm for GitHub Flavored Markdown
   - rehype-slug for heading IDs
   - rehype-shiki for syntax highlighting

### Component Structure

```
components/
├── ui/              # Base UI components (Button, Dialog, etc.)
├── docs/            # Documentation-specific components
│   ├── sidebar.tsx  # Navigation sidebar
│   ├── toc.tsx      # Table of contents
│   ├── mobile-nav.tsx
│   └── pagination.tsx
├── mdx/             # Components used in MDX
│   ├── code-block.tsx
│   ├── package-tabs.tsx
│   ├── props-table.tsx
│   ├── callout.tsx
│   └── demo.tsx
└── landing/         # Landing page components
    ├── hero.tsx
    ├── features.tsx
    └── footer.tsx
```

### Navigation

Navigation is defined in `lib/navigation.ts`:

```ts
export const docsNavigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    title: 'Hooks',
    items: [
      { title: 'echo', href: '/docs/hooks/use-echo' },
      // ...
    ],
  },
]
```

## Adding a New Hook

1. **Create the hook file**:

   ```bash
   # packages/betteruse/src/use-new-hook.ts
   ```

2. **Implement the hook**:

   ```ts
   import { useState, useEffect } from 'react'

   export interface UseNewHookOptions {
     // options
   }

   export interface UseNewHookReturn {
     // return value
   }

   export function useNewHook(options: UseNewHookOptions): UseNewHookReturn {
     // implementation
   }
   ```

3. **Export from index.ts**:

   ```ts
   // packages/betteruse/src/index.ts
   export { useNewHook } from './use-new-hook'
   export type { UseNewHookOptions, UseNewHookReturn } from './use-new-hook'
   ```

4. **Add tests**:

   ```ts
   // packages/betteruse/tests/use-new-hook.test.ts
   import { renderHook } from '@testing-library/react'
   import { useNewHook } from '../src/use-new-hook'

   describe('useNewHook', () => {
     it('should work', () => {
       // tests
     })
   })
   ```

5. **Add documentation** (see next section)

## Adding a New Doc Page

1. **Create MDX file**:

   ```bash
   # apps/web/content/hooks/use-new-hook.mdx
   ```

2. **Add frontmatter**:

   ```mdx
   ---
   title: useNewHook
   description: Description of what the hook does
   ---

   # useNewHook

   Content...
   ```

3. **Update navigation**:

   ```ts
   // apps/web/lib/navigation.ts
   {
     title: 'useNewHook',
     href: '/docs/hooks/use-new-hook',
     description: 'Description',
   }
   ```

4. **Use MDX components**:

   ```mdx
   <PackageTabs />

   <PropsTable data={[...]} />

   <Callout type="info">
     Important note
   </Callout>
   ```

## Commands Reference

```bash
# Development
pnpm dev              # Run all dev servers
pnpm dev:lib          # Run library in watch mode
pnpm dev:web          # Run website dev server

# Building
pnpm build            # Build all packages
pnpm build:lib        # Build library only
pnpm build:web        # Build website only

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode

# Quality
pnpm lint             # Run linting
pnpm type-check       # Run type checking
pnpm format           # Format code with Prettier

# Cleanup
pnpm clean            # Remove all build artifacts and node_modules
```

## Publishing to npm

1. Update version in `packages/betteruse/package.json`

2. Build the library:

   ```bash
   pnpm build:lib
   ```

3. Publish:

   ```bash
   cd packages/betteruse
   npm publish
   ```

Or use the automated CI workflow (uncomment the publish step in `.github/workflows/ci.yml`).

## Deployment

### Vercel (Recommended)

1. Import the repository to Vercel
2. Set the root directory to `apps/web`
3. Build command: `pnpm build`
4. Install command: `pnpm install`

### Manual

1. Build the website:

   ```bash
   pnpm build:web
   ```

2. Deploy the `apps/web/.next` directory

## Troubleshooting

### Common Issues

**1. Module not found errors**

```bash
# Clear caches and reinstall
pnpm clean
pnpm install
```

**2. Type errors after adding a new hook**

Make sure to:
- Export types from `src/index.ts`
- Run `pnpm build:lib` to regenerate declarations

**3. MDX content not updating**

Next.js caches MDX content. Restart the dev server or clear `.next`:

```bash
rm -rf apps/web/.next
pnpm dev:web
```

**4. Tests failing after updates**

Ensure mocks are up to date for browser APIs like ResizeObserver, Selection, etc.

### Getting Help

- Check the [GitHub Issues](https://github.com/yourusername/betteruse/issues)
- Read the [documentation](https://betteruse.dev)
