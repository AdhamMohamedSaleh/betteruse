import { MetadataRoute } from 'next'
import { flattenNavigation } from '@/lib/navigation'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://betteruse.dev'

  const navItems = flattenNavigation()

  const docPages = navItems.map((item) => ({
    url: `${baseUrl}${item.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...docPages,
  ]
}
