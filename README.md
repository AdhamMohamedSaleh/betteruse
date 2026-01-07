# betteruse

Elegant React hooks for real-world problems.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://reactjs.org/)
[![GitHub](https://img.shields.io/github/stars/AdhamMohamedSaleh/betteruse?style=social)](https://github.com/AdhamMohamedSaleh/betteruse)

## Install

```bash
npm install betteruse
```

## Hooks

| Hook | Description |
|------|-------------|
| `echo()` | Screen reader announcements |
| `useHold()` | Long press with progress |
| `useExitIntent()` | Exit intent detection |
| `useIdle()` | Idle detection |
| `useSelection()` | Text selection tracking |
| `useMeasure()` | Element measurement |

## Example

```tsx
import { useHold, echo } from 'betteruse'

function DeleteButton() {
  const { handlers, progress, isHolding } = useHold({
    duration: 500,
    onComplete: () => {
      deleteItem()
      echo('Item deleted')
    },
  })

  return (
    <button {...handlers}>
      {isHolding
        ? `Deleting... ${Math.round(progress * 100)}%`
        : 'Hold to Delete'}
    </button>
  )
}
```

## Features

- **Small bundle size**: Under 5kb gzipped
- **SSR-safe**: Works with Next.js, Remix, and other SSR frameworks
- **Fully typed**: Written in TypeScript with complete type definitions
- **Tree-shakeable**: Only import what you need
- **Zero dependencies**: No external runtime dependencies

## Documentation

Visit [betteruse.dev](https://betteruse.dev) for full documentation.

## API Reference

### echo(message, options?)

Announces a message to screen readers.

```tsx
import { echo } from 'betteruse'

// Polite announcement (default)
echo('Item added to cart')

// Assertive announcement
echo.assertive('Error: Invalid email')

// With options
echo('Saved!', { timeout: 5000 })
```

### useHold(options)

Returns handlers and progress for long press interactions.

```tsx
import { useHold } from 'betteruse'

const { handlers, progress, isHolding } = useHold({
  duration: 500,
  onComplete: () => console.log('Complete!'),
})

<button {...handlers}>Hold me</button>
```

### useExitIntent(options)

Detects when users are about to leave the page.

```tsx
import { useExitIntent } from 'betteruse'

const { hasExited, reset } = useExitIntent({
  onExitIntent: () => setShowModal(true),
  triggerOnce: true,
})
```

### useIdle(options)

Tracks user activity and detects idle states.

```tsx
import { useIdle } from 'betteruse'

const { isIdle, lastActive, reset } = useIdle({
  timeout: 60000,
  onIdle: () => console.log('User is idle'),
})
```

### useSelection(containerRef?)

Tracks text selection with positioning.

```tsx
import { useSelection } from 'betteruse'

const { text, rect, isSelected, clear } = useSelection(containerRef)
```

### useMeasure()

Measures element dimensions using ResizeObserver.

```tsx
import { useMeasure } from 'betteruse'

const [ref, bounds] = useMeasure()

<div ref={ref}>
  {bounds.width}px x {bounds.height}px
</div>
```

## Contributing

1. Fork & clone the repository
2. Install dependencies: `pnpm install`
3. Start development: `pnpm dev`
4. Make your changes
5. Run tests: `pnpm test`
6. Submit a pull request

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build library
pnpm build:lib

# Build website
pnpm build:web

# Run tests
pnpm test

# Type check
pnpm type-check
```

## License

MIT
