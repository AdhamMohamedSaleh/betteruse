import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#18181b',
          borderRadius: '32px',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hook shape */}
          <path
            d="M16 4 L16 16 C16 20.4183 19.5817 24 24 24"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow at top */}
          <path
            d="M12 8 L16 4 L20 8"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dot at hook end */}
          <circle cx="24" cy="24" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
