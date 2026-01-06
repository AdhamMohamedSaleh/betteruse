import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypeShiki from '@shikijs/rehype'
import { getDocBySlug, getDocsIndex, getAllDocs } from '@/lib/mdx'
import { extractToc } from '@/lib/toc'
import { findAdjacentPages } from '@/lib/navigation'
import { mdxComponents } from '@/components/mdx'
import { TableOfContents } from '@/components/docs/toc'
import { Pagination } from '@/components/docs/pagination'

interface DocsPageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export async function generateStaticParams() {
  const docs = getAllDocs()
  const params = docs.map((doc) => ({
    slug: doc.meta.slug.split('/'),
  }))
  // Add the index page
  params.push({ slug: [] })
  return params
}

export async function generateMetadata({ params }: DocsPageProps) {
  const { slug } = await params
  const doc = slug?.length ? getDocBySlug(slug) : getDocsIndex()

  if (!doc) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: doc.meta.title,
    description: doc.meta.description,
  }
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params
  const doc = slug?.length ? getDocBySlug(slug) : getDocsIndex()

  if (!doc) {
    notFound()
  }

  const toc = extractToc(doc.content)
  const currentPath = slug?.length ? `/docs/${slug.join('/')}` : '/docs'
  const { prev, next } = findAdjacentPages(currentPath)

  return (
    <>
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="mb-4 space-y-1">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
            {doc.meta.title}
          </h1>
          {doc.meta.description && (
            <p className="text-lg text-muted-foreground">
              {doc.meta.description}
            </p>
          )}
        </div>
        <div className="pb-12 pt-8">
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypeShiki,
                      {
                        themes: {
                          light: 'github-light',
                          dark: 'github-dark',
                        },
                      },
                    ],
                  ],
                },
              }}
            />
          </article>
        </div>
        <Pagination prev={prev} next={next} />
      </div>
      <TableOfContents items={toc} />
    </>
  )
}
