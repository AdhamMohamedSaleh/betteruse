import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMeasure } from '../src/use-measure'

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback
  elements: Element[] = []

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(element: Element) {
    this.elements.push(element)
  }

  unobserve(element: Element) {
    this.elements = this.elements.filter((el) => el !== element)
  }

  disconnect() {
    this.elements = []
  }

  // Helper to trigger resize
  trigger(entries: ResizeObserverEntry[]) {
    this.callback(entries, this)
  }
}

describe('useMeasure', () => {
  let mockObserver: MockResizeObserver | null = null
  let OriginalResizeObserver: typeof ResizeObserver

  beforeEach(() => {
    OriginalResizeObserver = global.ResizeObserver
    global.ResizeObserver = class extends MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super(callback)
        mockObserver = this
      }
    } as any
  })

  afterEach(() => {
    global.ResizeObserver = OriginalResizeObserver
    mockObserver = null
  })

  it('should return initial empty bounds', () => {
    const { result } = renderHook(() => useMeasure())

    const [, bounds] = result.current

    expect(bounds.width).toBe(0)
    expect(bounds.height).toBe(0)
    expect(bounds.top).toBe(0)
    expect(bounds.left).toBe(0)
    expect(bounds.right).toBe(0)
    expect(bounds.bottom).toBe(0)
    expect(bounds.x).toBe(0)
    expect(bounds.y).toBe(0)
  })

  it('should return a ref callback function', () => {
    const { result } = renderHook(() => useMeasure())

    const [ref] = result.current

    expect(typeof ref).toBe('function')
  })

  it('should create ResizeObserver when element is attached', () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>())

    const mockElement = document.createElement('div')
    mockElement.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 50,
      top: 10,
      left: 20,
      right: 120,
      bottom: 60,
      x: 20,
      y: 10,
      toJSON: () => {},
    }))

    act(() => {
      result.current[0](mockElement)
    })

    expect(mockObserver).not.toBeNull()
    expect(mockObserver?.elements).toContain(mockElement)
  })

  it('should set bounds when element is attached', () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>())

    const mockElement = document.createElement('div')
    mockElement.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 100,
      top: 50,
      left: 25,
      right: 225,
      bottom: 150,
      x: 25,
      y: 50,
      toJSON: () => {},
    }))

    act(() => {
      result.current[0](mockElement)
    })

    const [, bounds] = result.current

    expect(bounds.width).toBe(200)
    expect(bounds.height).toBe(100)
    expect(bounds.top).toBe(50)
    expect(bounds.left).toBe(25)
  })

  it('should disconnect observer when element is removed', () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>())

    const mockElement = document.createElement('div')
    mockElement.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      right: 100,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))

    act(() => {
      result.current[0](mockElement)
    })

    const observerDisconnect = vi.spyOn(mockObserver!, 'disconnect')

    act(() => {
      result.current[0](null)
    })

    expect(observerDisconnect).toHaveBeenCalled()
  })

  it('should reset bounds to empty when element is removed', () => {
    const { result } = renderHook(() => useMeasure<HTMLDivElement>())

    const mockElement = document.createElement('div')
    mockElement.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 50,
      top: 10,
      left: 20,
      right: 120,
      bottom: 60,
      x: 20,
      y: 10,
      toJSON: () => {},
    }))

    act(() => {
      result.current[0](mockElement)
    })

    expect(result.current[1].width).toBe(100)

    act(() => {
      result.current[0](null)
    })

    expect(result.current[1].width).toBe(0)
    expect(result.current[1].height).toBe(0)
  })
})
