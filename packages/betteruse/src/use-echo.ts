/**
 * echo() - Screen Reader Announcements
 *
 * A function-based API for aria-live announcements.
 * Creates a hidden aria-live region on first call and announces messages to screen readers.
 */

export interface EchoOptions {
  /** Use assertive mode (interrupts current speech) */
  assertive?: boolean
  /** Auto-clear timeout in milliseconds (default: 1000) */
  timeout?: number
}

let politeRegion: HTMLDivElement | null = null
let assertiveRegion: HTMLDivElement | null = null
const clearTimeouts: Map<HTMLDivElement, ReturnType<typeof setTimeout>> = new Map()

function createAriaLiveRegion(assertive: boolean): HTMLDivElement {
  if (typeof document === 'undefined') {
    return null as unknown as HTMLDivElement
  }

  const region = document.createElement('div')
  region.setAttribute('aria-live', assertive ? 'assertive' : 'polite')
  region.setAttribute('aria-atomic', 'true')
  region.setAttribute('role', 'status')

  // Hide visually but keep accessible to screen readers
  Object.assign(region.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  })

  document.body.appendChild(region)
  return region
}

function getRegion(assertive: boolean): HTMLDivElement | null {
  if (typeof document === 'undefined') {
    return null
  }

  if (assertive) {
    if (!assertiveRegion) {
      assertiveRegion = createAriaLiveRegion(true)
    }
    return assertiveRegion
  } else {
    if (!politeRegion) {
      politeRegion = createAriaLiveRegion(false)
    }
    return politeRegion
  }
}

function announce(message: string, options: EchoOptions = {}): void {
  const { assertive = false, timeout = 1000 } = options

  const region = getRegion(assertive)
  if (!region) return

  // Clear any pending timeout for this region
  const existingTimeout = clearTimeouts.get(region)
  if (existingTimeout) {
    clearTimeout(existingTimeout)
  }

  // Set the message
  region.textContent = message

  // Schedule clearing the message
  const clearTimeout_ = setTimeout(() => {
    region.textContent = ''
    clearTimeouts.delete(region)
  }, timeout)

  clearTimeouts.set(region, clearTimeout_)
}

/**
 * Announce a message to screen readers
 *
 * @param message - The message to announce
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * import { echo } from 'betteruse'
 *
 * // Polite announcement (default)
 * echo('Item added to cart')
 *
 * // Assertive announcement (interrupts)
 * echo.assertive('Error: Invalid email')
 *
 * // With options
 * echo('Saved!', { assertive: false, timeout: 5000 })
 * ```
 */
function echo(message: string, options?: EchoOptions): void {
  announce(message, options)
}

/**
 * Announce an assertive message (interrupts current speech)
 */
echo.assertive = (message: string, options?: Omit<EchoOptions, 'assertive'>): void => {
  announce(message, { ...options, assertive: true })
}

/**
 * Announce a polite message (waits for current speech to finish)
 */
echo.polite = (message: string, options?: Omit<EchoOptions, 'assertive'>): void => {
  announce(message, { ...options, assertive: false })
}

export { echo }
