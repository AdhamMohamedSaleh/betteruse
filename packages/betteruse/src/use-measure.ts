import { useCallback, useEffect, useRef, useState } from 'react'

export interface Bounds {
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
  x: number
  y: number
}

const EMPTY_BOUNDS: Bounds = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0,
}

/**
 * useMeasure - Element Measurement
 *
 * Measures an element's dimensions using ResizeObserver.
 * Returns a ref callback and the current bounds.
 *
 * @returns Tuple of [ref callback, bounds object]
 *
 * @example
 * ```tsx
 * import { useMeasure } from 'betteruse'
 *
 * function ResponsiveComponent() {
 *   const [ref, bounds] = useMeasure()
 *
 *   return (
 *     <div ref={ref}>
 *       <p>Width: {bounds.width}px</p>
 *       <p>Height: {bounds.height}px</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Responsive layout based on size
 * function AdaptiveLayout() {
 *   const [ref, { width }] = useMeasure()
 *
 *   return (
 *     <div ref={ref}>
 *       {width > 768 ? <DesktopLayout /> : <MobileLayout />}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMeasure<T extends Element = Element>(): [
  (element: T | null) => void,
  Bounds
] {
  const [bounds, setBounds] = useState<Bounds>(EMPTY_BOUNDS)
  const observerRef = useRef<ResizeObserver | null>(null)
  const elementRef = useRef<T | null>(null)

  // Cleanup observer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  const ref = useCallback((element: T | null) => {
    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Store element reference
    elementRef.current = element

    if (!element) {
      setBounds(EMPTY_BOUNDS)
      return
    }

    // SSR safety check
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') {
      return
    }

    // Create new observer
    observerRef.current = new ResizeObserver(([entry]) => {
      if (!entry) return

      const { contentRect } = entry
      const domRect = element.getBoundingClientRect()

      setBounds({
        width: contentRect.width,
        height: contentRect.height,
        top: domRect.top,
        left: domRect.left,
        right: domRect.right,
        bottom: domRect.bottom,
        x: domRect.x,
        y: domRect.y,
      })
    })

    // Start observing
    observerRef.current.observe(element)

    // Set initial bounds
    const domRect = element.getBoundingClientRect()
    setBounds({
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left,
      right: domRect.right,
      bottom: domRect.bottom,
      x: domRect.x,
      y: domRect.y,
    })
  }, [])

  return [ref, bounds]
}
