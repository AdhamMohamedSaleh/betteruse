import { useState } from 'react'
import { useHold, useIdle, useMeasure, useSelection, useExitIntent, echo } from 'betteruse'

export default function App() {
  return (
    <div>
      <h1>betteruse Playground</h1>
      <p style={{ marginBottom: '2rem', color: '#a1a1aa' }}>
        Test all hooks before publishing to npm
      </p>

      <HoldDemo />
      <IdleDemo />
      <MeasureDemo />
      <SelectionDemo />
      <ExitIntentDemo />
      <EchoDemo />
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
    <div className="demo-section">
      <h2>useHold()</h2>
      <p>Hold the button for 2 seconds to complete</p>
      <button
        {...handlers}
        className="hold-button"
        style={{ marginTop: '1rem' }}
      >
        {completed ? '✓ Completed!' : isHolding ? \`Holding... \${Math.round(progress * 100)}%\` : 'Hold Me'}
        <div style={{ width: \`\${progress * 100}%\` }} />
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
    <div className="demo-section">
      <h2>useIdle()</h2>
      <p>You'll be marked as idle after 5 seconds of inactivity</p>
      <div className="result">
        <div>Status: {isIdle ? '😴 Idle' : '✨ Active'}</div>
        <div>Last Active: {lastActive ? new Date(lastActive).toLocaleTimeString() : 'N/A'}</div>
        <button onClick={reset} style={{ marginTop: '1rem' }}>Reset Timer</button>
      </div>
    </div>
  )
}

function MeasureDemo() {
  const [ref, bounds] = useMeasure<HTMLDivElement>()

  return (
    <div className="demo-section">
      <h2>useMeasure()</h2>
      <p>Resize the box below to see measurements update</p>
      <div
        ref={ref}
        style={{
          marginTop: '1rem',
          padding: '2rem',
          background: '#2a2a2a',
          borderRadius: '8px',
          resize: 'both',
          overflow: 'auto',
          minWidth: '200px',
          minHeight: '100px',
        }}
      >
        Resize me!
      </div>
      <div className="result">
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
    <div className="demo-section">
      <h2>useSelection()</h2>
      <p>Try selecting some text below:</p>
      <div
        style={{
          marginTop: '1rem',
          padding: '1.5rem',
          background: '#2a2a2a',
          borderRadius: '8px',
          userSelect: 'text',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
      </div>
      {isSelected && (
        <div className="result">
          <div>Selected text: "{text}"</div>
          <div>Length: {text.length} characters</div>
          <div>Position: ({Math.round(rect?.left || 0)}, {Math.round(rect?.top || 0)})</div>
          <button onClick={clear} style={{ marginTop: '1rem' }}>Clear Selection</button>
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
    <div className="demo-section">
      <h2>useExitIntent()</h2>
      <p>Move your mouse cursor out of the viewport at the top to trigger exit intent</p>
      <div className="result">
        <div>Exit Intent Detected: {hasExited ? 'Yes' : 'No'}</div>
        <button onClick={reset} style={{ marginTop: '1rem' }}>Reset</button>
      </div>
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '2rem',
            background: '#1a1a1a',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            zIndex: 1000,
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>Wait! Don't leave yet! 👋</h3>
          <p style={{ marginBottom: '1rem', color: '#a1a1aa' }}>
            This is an exit intent modal
          </p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

function EchoDemo() {
  return (
    <div className="demo-section">
      <h2>echo()</h2>
      <p>Screen reader announcements (check your screen reader or browser console)</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => echo('This is a polite announcement')}>
          Polite
        </button>
        <button onClick={() => echo.assertive('This is an assertive announcement')}>
          Assertive
        </button>
        <button onClick={() => echo('Custom timeout message', { timeout: 5000 })}>
          Custom Timeout
        </button>
      </div>
    </div>
  )
}
