import { Header } from '@/components/header'
import { Sidebar } from '@/components/docs/sidebar'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="container flex-1">
        <div className="flex-1 items-start py-4 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <Sidebar />
          <main id="main-content" className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
