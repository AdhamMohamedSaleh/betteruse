import { Header } from '@/components/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Footer } from '@/components/landing/footer'
import { codeToHtml } from 'shiki'

const codeExample = `import { useHold, echo } from 'betteruse'

function DeleteButton() {
  const { handlers, progress, isHolding } = useHold({
    duration: 500,
    onComplete: () => {
      deleteItem()
      echo('Item deleted')
    },
  })

  return (
    <button {...handlers}>
      {isHolding
        ? \`Deleting... \${Math.round(progress * 100)}%\`
        : 'Hold to Delete'}
    </button>
  )
}`

export default async function HomePage() {
  const highlightedCode = await codeToHtml(codeExample, {
    lang: 'tsx',
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <Hero highlightedCode={highlightedCode} />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
