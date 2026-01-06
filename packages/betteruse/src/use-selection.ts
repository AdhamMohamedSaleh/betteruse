import { RefObject, useCallback, useEffect, useState } from 'react'

export interface SelectionRect {
  x: number
  y: number
  width: number
  height: number
  top: number
  left: number
  right: number
  bottom: number
}

export interface UseSelectionReturn {
  /** The selected text */
  text: string
  /** Bounding rectangle of the selection */
  rect: SelectionRect | null
  /** Whether text is currently selected */
  isSelected: boolean
  /** Clear the current selection */
  clear: () => void
}

const DEBOUNCE_MS = 100

/**
 * useSelection - Text Selection
 *
 * Tracks text selection within a container or the entire document.
 * Returns the selected text and its bounding rectangle for positioning tooltips or popovers.
 *
 * @param containerRef - Optional ref to scope selection to a specific element
 * @returns Object containing selected text, bounding rect, selection state, and clear function
 *
 * @example
 * ```tsx
 * import { useSelection } from 'betteruse'
 * import { useRef } from 'react'
 *
 * function TextWithPopover() {
 *   const containerRef = useRef<HTMLDivElement>(null)
 *   const { text, rect, isSelected, clear } = useSelection(containerRef)
 *
 *   return (
 *     <div ref={containerRef}>
 *       <p>Select some text in this paragraph...</p>
 *
 *       {isSelected && rect && (
 *         <div style={{
 *           position: 'fixed',
 *           top: rect.top - 40,
 *           left: rect.left + rect.width / 2,
 *           transform: 'translateX(-50%)',
 *         }}>
 *           <button onClick={() => navigator.clipboard.writeText(text)}>
 *             Copy "{text}"
 *           </button>
 *         </div>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useSelection(
  containerRef?: RefObject<HTMLElement | null>
): UseSelectionReturn {
  const [text, setText] = useState('')
  const [rect, setRect] = useState<SelectionRect | null>(null)
  const [isSelected, setIsSelected] = useState(false)

  const clear = useCallback(() => {
    if (typeof window === 'undefined') return

    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
    setText('')
    setRect(null)
    setIsSelected(false)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null

    const handleSelectionChange = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }

      debounceTimeout = setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) {
          setText('')
          setRect(null)
          setIsSelected(false)
          return
        }

        const selectedText = selection.toString().trim()

        if (!selectedText) {
          setText('')
          setRect(null)
          setIsSelected(false)
          return
        }

        // Check if selection is within container (if provided)
        if (containerRef?.current) {
          const range = selection.getRangeAt(0)
          const container = containerRef.current

          if (
            !container.contains(range.commonAncestorContainer) &&
            range.commonAncestorContainer !== container
          ) {
            setText('')
            setRect(null)
            setIsSelected(false)
            return
          }
        }

        const range = selection.getRangeAt(0)
        const domRect = range.getBoundingClientRect()

        setText(selectedText)
        setRect({
          x: domRect.x,
          y: domRect.y,
          width: domRect.width,
          height: domRect.height,
          top: domRect.top,
          left: domRect.left,
          right: domRect.right,
          bottom: domRect.bottom,
        })
        setIsSelected(true)
      }, DEBOUNCE_MS)
    }

    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [containerRef])

  return { text, rect, isSelected, clear }
}
