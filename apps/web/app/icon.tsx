import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hook shape */}
          <path
            d="M16 4 L16 16 C16 20.4183 19.5817 24 24 24"
            stroke="#71717a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow at top */}
          <path
            d="M12 8 L16 4 L20 8"
            stroke="#71717a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dot at hook end */}
          <circle cx="24" cy="24" r="3" fill="#71717a" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
