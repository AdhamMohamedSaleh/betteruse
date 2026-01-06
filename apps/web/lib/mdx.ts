import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface DocMeta {
  title: string
  description: string
  slug: string
}

export interface Doc {
  meta: DocMeta
  content: string
}

export function getDocBySlug(slug: string[]): Doc | null {
  const slugPath = slug.join('/')
  const filePath = path.join(contentDirectory, `${slugPath}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    meta: {
      title: data.title || '',
      description: data.description || '',
      slug: slugPath,
    },
    content,
  }
}

export function getAllDocs(): Doc[] {
  const docs: Doc[] = []

  function walkDir(dir: string, baseSlug: string[] = []) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath, [...baseSlug, file])
      } else if (file.endsWith('.mdx')) {
        const slug = [...baseSlug, file.replace('.mdx', '')]
        const doc = getDocBySlug(slug)
        if (doc) {
          docs.push(doc)
        }
      }
    }
  }

  if (fs.existsSync(contentDirectory)) {
    walkDir(contentDirectory)
  }

  return docs
}

export function getDocsIndex(): Doc | null {
  const filePath = path.join(contentDirectory, 'index.mdx')

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    meta: {
      title: data.title || 'Introduction',
      description: data.description || '',
      slug: '',
    },
    content,
  }
}
