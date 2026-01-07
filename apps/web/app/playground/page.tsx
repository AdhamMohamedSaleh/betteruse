'use client'

import { useState } from 'react'
import { useHold, useIdle, useMeasure, useSelection, useExitIntent, echo } from 'betteruse'
import { Header } from '@/components/header'
import { Footer } from '@/components/landing/footer'

export default function PlaygroundPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Interactive Playground</h1>
            <p className="text-muted-foreground">
              Try out all betteruse hooks with live interactive demos
            </p>
          </div>

          <div className="grid gap-6">
            <HoldDemo />
            <IdleDemo />
            <MeasureDemo />
            <SelectionDemo />
            <ExitIntentDemo />
            <EchoDemo />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function HoldDemo() {
  const [completed, setCompleted] = useState(false)
  const { handlers, progress, isHolding } = useHold({
    duration: 2000,
    onComplete: () => {
      setCompleted(true)
      echo('Hold completed!')
      setTimeout(() => setCompleted(false), 2000)
    },
    onCancel: () => echo('Hold cancelled'),
  })

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-2">useHold()</h2>
      <p className="text-muted-foreground mb-4">Hold the button for 2 seconds to complete</p>
      <button
        {...handlers}
        className="relative overflow-hidden px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <span className="relative z-10">
          {completed ? '✓ Completed!' : isHolding ? \`Holding... \${Math.round(progress * 100)}%\` : 'Hold Me'}
        </span>
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-75"
          style={{ width: \`\${progress * 100}%\` }}
        />
      </button>
    </div>
  )
}

function IdleDemo() {
  const { isIdle, lastActive, reset } = useIdle({
    timeout: 5000,
    onIdle: () => echo('User is idle'),
    onActive: () => echo('User is active'),
  })

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-2">useIdle()</h2>
      <p className="text-muted-foreground mb-4">You'll be marked as idle after 5 seconds of inactivity</p>
      <div className="space-y-2 rounded-md bg-muted p-4 font-mono text-sm">
        <div>Status: {isIdle ? '😴 Idle' : '✨ Active'}</div>
        <div>Last Active: {lastActive ? new Date(lastActive).toLocaleTimeString() : 'N/A'}</div>
        <button onClick={reset} className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
          Reset Timer
        </button>
      </div>
    </div>
  )
}

function MeasureDemo() {
  const [ref, bounds] = useMeasure<HTMLDivElement>()

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-2">useMeasure()</h2>
      <p className="text-muted-foreground mb-4">Resize the box below to see measurements update</p>
      <div
        ref={ref}
        className="p-6 rounded-md bg-muted resize overflow-auto min-w-[200px] min-h-[100px] mb-4"
      >
        Resize me! (drag from bottom-right corner)
      </div>
      <div className="space-y-1 rounded-md bg-muted p-4 font-mono text-sm">
        <div>Width: {Math.round(bounds.width)}px</div>
        <div>Height: {Math.round(bounds.height)}px</div>
        <div>Top: {Math.round(bounds.top)}px</div>
        <div>Left: {Math.round(bounds.left)}px</div>
      </div>
    </div>
  )
}

function SelectionDemo() {
  const { text, rect, isSelected, clear } = useSelection()

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-2">useSelection()</h2>
      <p className="text-muted-foreground mb-4">Try selecting some text below:</p>
      <div className="p-6 rounded-md bg-muted select-text mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </div>
      {isSelected && (
        <div className="space-y-2 rounded-md bg-muted p-4 font-mono text-sm">
          <div>Selected text: "{text}"</div>
          <div>Length: {text.length} characters</div>
          <div>Position: ({Math.round(rect?.left || 0)}, {Math.round(rect?.top || 0)})</div>
          <button onClick={clear} className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
            Clear Selection
          </button>
        </div>
      )}
    </div>
  )
}

function ExitIntentDemo() {
  const [showModal, setShowModal] = useState(false)
  const { hasExited, reset } = useExitIntent({
    onExitIntent: () => {
      setShowModal(true)
      echo.assertive('Exit intent detected!')
    },
    triggerOnce: true,
  })

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-2">useExitIntent()</h2>
      <p className="text-muted-foreground mb-4">Move your mouse cursor out of the viewport at the top to trigger exit intent</p>
      <div className="space-y-2 rounded-md bg-muted p-4 font-mono text-sm">
        <div>Exit Intent Detected: {hasExited ? 'Yes' : 'No'}</div>
        <button onClick={reset} className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
          Reset
        </button>
      </div>
      
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-8 rounded-lg border bg-card shadow-lg max-w-md">
            <h3 className="text-xl font-semibold mb-2">Wait! Don't leave yet! 👋</h3>
            <p className="text-muted-foreground mb-4">
              This is an exit intent modal
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function EchoDemo() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-2xl font-semibold mb-2">echo()</h2>
      <p className="text-muted-foreground mb-4">Screen reader announcements (check your screen reader or browser console)</p>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => echo('This is a polite announcement')}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Polite
        </button>
        <button 
          onClick={() => echo.assertive('This is an assertive announcement')}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Assertive
        </button>
        <button 
          onClick={() => echo('Custom timeout message', { timeout: 5000 })}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Custom Timeout
        </button>
      </div>
    </div>
  )
}
