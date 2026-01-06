import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useIdle } from '../src/use-idle'

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useIdle({ timeout: 1000 }))

    expect(result.current.isIdle).toBe(false)
    expect(result.current.lastActive).toBeDefined()
    expect(typeof result.current.lastActive).toBe('number')
    expect(result.current.reset).toBeInstanceOf(Function)
  })

  it('should become idle after timeout', () => {
    const onIdle = vi.fn()
    const { result } = renderHook(() => useIdle({ timeout: 1000, onIdle }))

    expect(result.current.isIdle).toBe(false)

    act(() => {
      vi.advanceTimersByTime(1100)
    })

    expect(result.current.isIdle).toBe(true)
    expect(onIdle).toHaveBeenCalledOnce()
  })

  it('should reset idle state on activity', () => {
    const onActive = vi.fn()
    const { result } = renderHook(() => useIdle({ timeout: 1000, onActive }))

    // Become idle first
    act(() => {
      vi.advanceTimersByTime(1100)
    })

    expect(result.current.isIdle).toBe(true)

    // Simulate activity
    act(() => {
      result.current.reset()
    })

    expect(result.current.isIdle).toBe(false)
    expect(onActive).toHaveBeenCalled()
  })

  it('should use default timeout of 60000ms', () => {
    const onIdle = vi.fn()
    const { result } = renderHook(() => useIdle({ onIdle }))

    expect(result.current.isIdle).toBe(false)

    act(() => {
      vi.advanceTimersByTime(59000)
    })

    expect(result.current.isIdle).toBe(false)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.isIdle).toBe(true)
    expect(onIdle).toHaveBeenCalledOnce()
  })

  it('should not track when disabled', () => {
    const onIdle = vi.fn()
    const { result } = renderHook(() => useIdle({ timeout: 1000, onIdle, enabled: false }))

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(result.current.isIdle).toBe(false)
    expect(onIdle).not.toHaveBeenCalled()
  })
})
