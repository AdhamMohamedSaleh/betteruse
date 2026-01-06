import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseIdleOptions {
  /** Timeout in milliseconds before considered idle (default: 60000) */
  timeout?: number
  /** Events to track for activity (default: ['mousemove', 'keydown', 'touchstart', 'scroll']) */
  events?: string[]
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean
  /** Callback when user becomes idle */
  onIdle?: () => void
  /** Callback when user becomes active again */
  onActive?: () => void
}

export interface UseIdleReturn {
  /** Whether the user is currently idle */
  isIdle: boolean
  /** Timestamp of last activity */
  lastActive: number
  /** Reset the idle timer */
  reset: () => void
}

const DEFAULT_EVENTS = ['mousemove', 'keydown', 'touchstart', 'scroll', 'mousedown', 'wheel']
const THROTTLE_MS = 500

/**
 * useIdle - Idle Detection
 *
 * Tracks user activity and determines when the user has become idle.
 * Uses throttled event handlers for performance.
 *
 * @param options - Configuration options
 * @returns Object containing idle state, last active timestamp, and reset function
 *
 * @example
 * ```tsx
 * import { useIdle } from 'betteruse'
 *
 * function IdleWarning() {
 *   const { isIdle, lastActive } = useIdle({
 *     timeout: 60000, // 1 minute
 *     onIdle: () => console.log('User is idle'),
 *     onActive: () => console.log('User is active'),
 *   })
 *
 *   return (
 *     <div>
 *       {isIdle ? (
 *         <p>Are you still there?</p>
 *       ) : (
 *         <p>Last active: {new Date(lastActive).toLocaleTimeString()}</p>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIdle(options: UseIdleOptions = {}): UseIdleReturn {
  const {
    timeout = 60000,
    events = DEFAULT_EVENTS,
    enabled = true,
    onIdle,
    onActive,
  } = options

  const [isIdle, setIsIdle] = useState(false)
  const [lastActive, setLastActive] = useState(() => Date.now())

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastThrottleRef = useRef<number>(0)
  const isIdleRef = useRef(false)

  const handleActivity = useCallback(() => {
    const now = Date.now()

    // Throttle updates
    if (now - lastThrottleRef.current < THROTTLE_MS) {
      return
    }
    lastThrottleRef.current = now

    setLastActive(now)

    // If was idle, trigger onActive
    if (isIdleRef.current) {
      isIdleRef.current = false
      setIsIdle(false)
      onActive?.()
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      isIdleRef.current = true
      setIsIdle(true)
      onIdle?.()
    }, timeout)
  }, [timeout, onIdle, onActive])

  const reset = useCallback(() => {
    handleActivity()
  }, [handleActivity])

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return

    // Initial setup
    handleActivity()

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [events, handleActivity, enabled])

  return { isIdle, lastActive, reset }
}
