import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useHold } from '../src/use-hold'

describe('useHold', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useHold({ duration: 500 }))

    expect(result.current.progress).toBe(0)
    expect(result.current.isHolding).toBe(false)
    expect(result.current.handlers).toBeDefined()
    expect(result.current.handlers.onMouseDown).toBeInstanceOf(Function)
    expect(result.current.handlers.onMouseUp).toBeInstanceOf(Function)
    expect(result.current.handlers.onMouseLeave).toBeInstanceOf(Function)
    expect(result.current.handlers.onTouchStart).toBeInstanceOf(Function)
    expect(result.current.handlers.onTouchEnd).toBeInstanceOf(Function)
    expect(result.current.handlers.onTouchMove).toBeInstanceOf(Function)
  })

  it('should set isHolding to true on mousedown', () => {
    const onStart = vi.fn()
    const { result } = renderHook(() => useHold({ duration: 500, onStart }))

    act(() => {
      const event = {
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent
      result.current.handlers.onMouseDown(event)
    })

    expect(result.current.isHolding).toBe(true)
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('should cancel on mouse up', () => {
    const onCancel = vi.fn()
    const { result } = renderHook(() => useHold({ duration: 500, onCancel }))

    act(() => {
      const event = {
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent
      result.current.handlers.onMouseDown(event)
    })

    expect(result.current.isHolding).toBe(true)

    act(() => {
      result.current.handlers.onMouseUp({} as React.MouseEvent)
    })

    expect(result.current.isHolding).toBe(false)
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should cancel on mouse leave', () => {
    const onCancel = vi.fn()
    const { result } = renderHook(() => useHold({ duration: 500, onCancel }))

    act(() => {
      const event = {
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent
      result.current.handlers.onMouseDown(event)
    })

    act(() => {
      result.current.handlers.onMouseLeave({} as React.MouseEvent)
    })

    expect(result.current.isHolding).toBe(false)
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('should use default duration of 500ms', () => {
    const { result } = renderHook(() => useHold({}))

    act(() => {
      const event = {
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
      } as unknown as React.MouseEvent
      result.current.handlers.onMouseDown(event)
    })

    expect(result.current.isHolding).toBe(true)
  })
})
