import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { echo } from '../src/use-echo'

describe('echo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should create a polite aria-live region', () => {
    echo('Test message')

    const region = document.querySelector('[aria-live="polite"]')
    expect(region).not.toBeNull()
    expect(region?.textContent).toBe('Test message')
  })

  it('should create an assertive aria-live region for assertive messages', () => {
    echo.assertive('Urgent message')

    const region = document.querySelector('[aria-live="assertive"]')
    expect(region).not.toBeNull()
    expect(region?.textContent).toBe('Urgent message')
  })

  it('should clear message after timeout', () => {
    echo('Test message', { timeout: 1000 })

    const region = document.querySelector('[aria-live="polite"]')
    expect(region?.textContent).toBe('Test message')

    vi.advanceTimersByTime(1100)

    expect(region?.textContent).toBe('')
  })

  it('should use default timeout of 1000ms', () => {
    echo('Test message')

    const region = document.querySelector('[aria-live="polite"]')
    expect(region?.textContent).toBe('Test message')

    vi.advanceTimersByTime(900)
    expect(region?.textContent).toBe('Test message')

    vi.advanceTimersByTime(200)
    expect(region?.textContent).toBe('')
  })

  it('should reuse existing regions', () => {
    echo('First message')
    echo('Second message')

    const regions = document.querySelectorAll('[aria-live="polite"]')
    expect(regions.length).toBe(1)
    expect(regions[0]?.textContent).toBe('Second message')
  })

  it('should have hidden styling for accessibility', () => {
    echo('Test message')

    const region = document.querySelector('[aria-live="polite"]') as HTMLElement
    expect(region).not.toBeNull()
    expect(region?.style.position).toBe('absolute')
    expect(region?.style.width).toBe('1px')
    expect(region?.style.height).toBe('1px')
    expect(region?.style.overflow).toBe('hidden')
  })

  it('should have proper ARIA attributes', () => {
    echo('Test message')

    const region = document.querySelector('[aria-live="polite"]')
    expect(region?.getAttribute('aria-atomic')).toBe('true')
    expect(region?.getAttribute('role')).toBe('status')
  })

  it('should support custom timeout', () => {
    echo('Test message', { timeout: 5000 })

    const region = document.querySelector('[aria-live="polite"]')

    vi.advanceTimersByTime(4900)
    expect(region?.textContent).toBe('Test message')

    vi.advanceTimersByTime(200)
    expect(region?.textContent).toBe('')
  })

  it('should support assertive option', () => {
    echo('Assertive via option', { assertive: true })

    const region = document.querySelector('[aria-live="assertive"]')
    expect(region).not.toBeNull()
    expect(region?.textContent).toBe('Assertive via option')
  })

  it('should have separate regions for polite and assertive', () => {
    echo('Polite message')
    echo.assertive('Assertive message')

    const politeRegion = document.querySelector('[aria-live="polite"]')
    const assertiveRegion = document.querySelector('[aria-live="assertive"]')

    expect(politeRegion?.textContent).toBe('Polite message')
    expect(assertiveRegion?.textContent).toBe('Assertive message')
  })

  it('should expose polite method', () => {
    echo.polite('Polite via method')

    const region = document.querySelector('[aria-live="polite"]')
    expect(region?.textContent).toBe('Polite via method')
  })
})
