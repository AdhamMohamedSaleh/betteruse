import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseHoldOptions {
  /** Hold duration in milliseconds (default: 500) */
  duration?: number
  /** Callback when hold starts */
  onStart?: () => void
  /** Callback when hold completes */
  onComplete?: () => void
  /** Callback when hold is cancelled */
  onCancel?: () => void
  /** Touch move threshold in pixels before cancelling (default: 10) */
  moveThreshold?: number
}

export interface UseHoldReturn {
  /** Event handlers to spread on the target element */
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void
    onMouseUp: (e: React.MouseEvent) => void
    onMouseLeave: (e: React.MouseEvent) => void
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
  }
  /** Progress from 0 to 1 */
  progress: number
  /** Whether currently holding */
  isHolding: boolean
}

/**
 * useHold - Long Press with Progress
 *
 * A hook for detecting long press interactions with visual progress feedback.
 * Uses requestAnimationFrame for smooth progress updates.
 *
 * @param options - Configuration options
 * @returns Object containing event handlers, progress, and holding state
 *
 * @example
 * ```tsx
 * import { useHold } from 'betteruse'
 *
 * function DeleteButton() {
 *   const { handlers, progress, isHolding } = useHold({
 *     duration: 500,
 *     onStart: () => console.log('Hold started'),
 *     onComplete: () => deleteItem(),
 *     onCancel: () => console.log('Hold cancelled'),
 *   })
 *
 *   return (
 *     <button {...handlers}>
 *       Hold to Delete ({Math.round(progress * 100)}%)
 *     </button>
 *   )
 * }
 * ```
 */
export function useHold(options: UseHoldOptions = {}): UseHoldReturn {
  const { duration = 500, onStart, onComplete, onCancel, moveThreshold = 10 } = options

  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)

  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)
  const completedRef = useRef(false)

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startTimeRef.current = null
    startPosRef.current = null
    setProgress(0)
    setIsHolding(false)
  }, [])

  const cancel = useCallback(() => {
    const wasHolding = isHolding
    reset()
    if (wasHolding && !completedRef.current) {
      onCancel?.()
    }
    completedRef.current = false
  }, [isHolding, reset, onCancel])

  const updateProgress = useCallback(() => {
    if (!startTimeRef.current) return

    const elapsed = Date.now() - startTimeRef.current
    const newProgress = Math.min(elapsed / duration, 1)

    setProgress(newProgress)

    if (newProgress >= 1) {
      completedRef.current = true
      reset()
      onComplete?.()
    } else {
      rafRef.current = requestAnimationFrame(updateProgress)
    }
  }, [duration, onComplete, reset])

  const startHold = useCallback(
    (clientX: number, clientY: number) => {
      startTimeRef.current = Date.now()
      startPosRef.current = { x: clientX, y: clientY }
      completedRef.current = false
      setIsHolding(true)
      setProgress(0)
      onStart?.()
      rafRef.current = requestAnimationFrame(updateProgress)
    },
    [onStart, updateProgress]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault()
      startHold(e.clientX, e.clientY)
    },
    onMouseUp: () => {
      cancel()
    },
    onMouseLeave: () => {
      cancel()
    },
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        startHold(touch.clientX, touch.clientY)
      }
    },
    onTouchEnd: () => {
      cancel()
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!startPosRef.current || !isHolding) return

      const touch = e.touches[0]
      if (!touch) return

      const deltaX = Math.abs(touch.clientX - startPosRef.current.x)
      const deltaY = Math.abs(touch.clientY - startPosRef.current.y)

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        cancel()
      }
    },
  }

  return {
    handlers,
    progress,
    isHolding,
  }
}
