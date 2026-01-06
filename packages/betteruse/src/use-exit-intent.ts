import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseExitIntentOptions {
  /** Callback when exit intent is detected */
  onExitIntent: () => void
  /** Threshold in pixels from top of viewport (default: 20) */
  threshold?: number
  /** Only trigger once (default: true) */
  triggerOnce?: boolean
  /** Delay before triggering in milliseconds (default: 0) */
  delayMs?: number
  /** Include visibility change events for mobile (default: true) */
  includeVisibilityChange?: boolean
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean
}

export interface UseExitIntentReturn {
  /** Whether exit intent has been triggered */
  hasExited: boolean
  /** Reset the exit state to allow re-triggering */
  reset: () => void
}

/**
 * useExitIntent - Exit Intent Detection
 *
 * Detects when users are about to leave the page. On desktop, it tracks
 * mouse movement toward the browser chrome. On mobile, it uses the
 * visibility change API to detect tab switches.
 *
 * @param options - Configuration options
 * @returns Object containing exit state and reset function
 *
 * @example
 * ```tsx
 * import { useExitIntent } from 'betteruse'
 *
 * function ExitModal() {
 *   const [showModal, setShowModal] = useState(false)
 *
 *   const { hasExited, reset } = useExitIntent({
 *     onExitIntent: () => setShowModal(true),
 *     threshold: 20,
 *     triggerOnce: true,
 *   })
 *
 *   return (
 *     <>
 *       {showModal && (
 *         <Modal onClose={() => {
 *           setShowModal(false)
 *           reset()
 *         }}>
 *           Wait! Don't go yet!
 *         </Modal>
 *       )}
 *     </>
 *   )
 * }
 * ```
 */
export function useExitIntent(options: UseExitIntentOptions): UseExitIntentReturn {
  const {
    onExitIntent,
    threshold = 20,
    triggerOnce = true,
    delayMs = 0,
    includeVisibilityChange = true,
    enabled = true,
  } = options

  const [hasExited, setHasExited] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasTriggeredRef = useRef(false)

  const trigger = useCallback(() => {
    if (triggerOnce && hasTriggeredRef.current) return
    if (!enabled) return

    hasTriggeredRef.current = true
    setHasExited(true)

    if (delayMs > 0) {
      timeoutRef.current = setTimeout(() => {
        onExitIntent()
      }, delayMs)
    } else {
      onExitIntent()
    }
  }, [onExitIntent, triggerOnce, delayMs, enabled])

  const reset = useCallback(() => {
    hasTriggeredRef.current = false
    setHasExited(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < threshold) {
        trigger()
      }
    }

    // Mobile: Visibility change detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trigger()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    if (includeVisibilityChange) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (includeVisibilityChange) {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [threshold, trigger, includeVisibilityChange, enabled])

  return { hasExited, reset }
}
