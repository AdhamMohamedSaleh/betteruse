import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useExitIntent } from '../src/use-exit-intent'

describe('useExitIntent', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const onExitIntent = vi.fn()
    const { result } = renderHook(() => useExitIntent({ onExitIntent }))

    expect(result.current.hasExited).toBe(false)
    expect(result.current.reset).toBeInstanceOf(Function)
  })

  it('should trigger on mouse leave near top', () => {
    const onExitIntent = vi.fn()
    renderHook(() => useExitIntent({ onExitIntent, threshold: 20 }))

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 10,
      })
      document.dispatchEvent(event)
    })

    expect(onExitIntent).toHaveBeenCalledOnce()
  })

  it('should not trigger when mouse leaves elsewhere', () => {
    const onExitIntent = vi.fn()
    renderHook(() => useExitIntent({ onExitIntent, threshold: 20 }))

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 100,
      })
      document.dispatchEvent(event)
    })

    expect(onExitIntent).not.toHaveBeenCalled()
  })

  it('should trigger only once when triggerOnce is true', () => {
    const onExitIntent = vi.fn()
    renderHook(() =>
      useExitIntent({ onExitIntent, threshold: 20, triggerOnce: true })
    )

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 10,
      })
      document.dispatchEvent(event)
    })

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 5,
      })
      document.dispatchEvent(event)
    })

    expect(onExitIntent).toHaveBeenCalledOnce()
  })

  it('should respect delay option', () => {
    const onExitIntent = vi.fn()
    renderHook(() =>
      useExitIntent({ onExitIntent, threshold: 20, delayMs: 500 })
    )

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 10,
      })
      document.dispatchEvent(event)
    })

    expect(onExitIntent).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(onExitIntent).toHaveBeenCalledOnce()
  })

  it('should reset exit state', () => {
    const onExitIntent = vi.fn()
    const { result } = renderHook(() =>
      useExitIntent({ onExitIntent, threshold: 20, triggerOnce: true })
    )

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 10,
      })
      document.dispatchEvent(event)
    })

    expect(result.current.hasExited).toBe(true)

    act(() => {
      result.current.reset()
    })

    expect(result.current.hasExited).toBe(false)

    // Should be able to trigger again after reset
    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 5,
      })
      document.dispatchEvent(event)
    })

    expect(onExitIntent).toHaveBeenCalledTimes(2)
  })

  it('should not trigger when disabled', () => {
    const onExitIntent = vi.fn()
    renderHook(() =>
      useExitIntent({ onExitIntent, threshold: 20, enabled: false })
    )

    act(() => {
      const event = new MouseEvent('mouseleave', {
        clientY: 10,
      })
      document.dispatchEvent(event)
    })

    expect(onExitIntent).not.toHaveBeenCalled()
  })
})
