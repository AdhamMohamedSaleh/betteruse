import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSelection } from '../src/use-selection'

describe('useSelection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useSelection())

    expect(result.current.text).toBe('')
    expect(result.current.rect).toBe(null)
    expect(result.current.isSelected).toBe(false)
    expect(result.current.clear).toBeInstanceOf(Function)
  })

  it('should update on selection change', () => {
    const { result } = renderHook(() => useSelection())

    const mockRange = {
      getBoundingClientRect: () => ({
        x: 10,
        y: 20,
        width: 100,
        height: 20,
        top: 20,
        left: 10,
        right: 110,
        bottom: 40,
      }),
      commonAncestorContainer: document.body,
    }

    const mockSelection = {
      toString: () => 'selected text',
      rangeCount: 1,
      getRangeAt: () => mockRange,
      removeAllRanges: vi.fn(),
    }

    vi.spyOn(window, 'getSelection').mockReturnValue(
      mockSelection as unknown as Selection
    )

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
      vi.advanceTimersByTime(150) // Account for debounce
    })

    expect(result.current.text).toBe('selected text')
    expect(result.current.isSelected).toBe(true)
    expect(result.current.rect).toEqual({
      x: 10,
      y: 20,
      width: 100,
      height: 20,
      top: 20,
      left: 10,
      right: 110,
      bottom: 40,
    })
  })

  it('should clear selection on empty text', () => {
    const { result } = renderHook(() => useSelection())

    const mockSelection = {
      toString: () => '',
      rangeCount: 1,
      getRangeAt: () => ({}),
      removeAllRanges: vi.fn(),
    }

    vi.spyOn(window, 'getSelection').mockReturnValue(
      mockSelection as unknown as Selection
    )

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
      vi.advanceTimersByTime(150)
    })

    expect(result.current.text).toBe('')
    expect(result.current.isSelected).toBe(false)
    expect(result.current.rect).toBe(null)
  })

  it('should clear selection when clear() is called', () => {
    const { result } = renderHook(() => useSelection())

    const removeAllRanges = vi.fn()
    const mockRange = {
      getBoundingClientRect: () => ({
        x: 10,
        y: 20,
        width: 100,
        height: 20,
        top: 20,
        left: 10,
        right: 110,
        bottom: 40,
      }),
      commonAncestorContainer: document.body,
    }

    const mockSelection = {
      toString: () => 'selected text',
      rangeCount: 1,
      getRangeAt: () => mockRange,
      removeAllRanges,
    }

    vi.spyOn(window, 'getSelection').mockReturnValue(
      mockSelection as unknown as Selection
    )

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
      vi.advanceTimersByTime(150)
    })

    expect(result.current.isSelected).toBe(true)

    act(() => {
      result.current.clear()
    })

    expect(removeAllRanges).toHaveBeenCalled()
    expect(result.current.text).toBe('')
    expect(result.current.isSelected).toBe(false)
    expect(result.current.rect).toBe(null)
  })

  it('should handle no selection gracefully', () => {
    const { result } = renderHook(() => useSelection())

    vi.spyOn(window, 'getSelection').mockReturnValue(null)

    act(() => {
      document.dispatchEvent(new Event('selectionchange'))
      vi.advanceTimersByTime(150)
    })

    expect(result.current.text).toBe('')
    expect(result.current.isSelected).toBe(false)
  })
})
