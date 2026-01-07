import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'betteruse - Hooks for every need',
    template: '%s - betteruse',
  },
  description:
    'A collection of elegant, SSR-safe React hooks for common UI patterns. Includes useHold, useIdle, useMeasure, useSelection, useExitIntent, and echo for screen reader announcements.',
  keywords: [
    'react',
    'hooks',
    'react-hooks',
    'typescript',
    'accessibility',
    'aria-live',
    'usehold',
    'useidle',
    'useselection',
    'betteruse',
    'echo',
    'useexitintent',
    'usemeasure',
  ],
  authors: [{ name: 'Adham Mohamed Saleh' }],
  creator: 'Adham Mohamed Saleh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://betteruse.dev',
    siteName: 'betteruse',
    title: 'betteruse - Elegant React hooks for real-world problems',
    description:
      'A collection of elegant, SSR-safe React hooks for common UI patterns.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'betteruse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'betteruse - Elegant React hooks for real-world problems',
    description:
      'A collection of elegant, SSR-safe React hooks for common UI patterns.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
