import React from 'react'

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Hook Icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Modern hook shape with upward improvement arrow */}
        <path
          d="M16 4 L16 16 C16 20.4183 19.5817 24 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8 L16 4 L20 8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Small connecting dot at hook end */}
        <circle
          cx="24"
          cy="24"
          r="2.5"
          fill="currentColor"
        />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          <span className="font-medium">better</span>
          <span>use</span>
        </span>
      )}
    </div>
  )
}

export function LogoIcon({ className = '' }: { className?: string }) {
  return <Logo className={className} showText={false} />
}
