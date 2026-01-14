import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { generateVehicleSlug, generateBlogSlug } from '@/lib/slugify'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://idealcar.co.za'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vehicles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sell-car`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/other-services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic vehicle pages
  let vehiclePages: MetadataRoute.Sitemap = []
  try {
    const vehiclesFile = path.join(process.cwd(), 'data', 'vehicles.json')
    if (fs.existsSync(vehiclesFile)) {
      const vehicles = JSON.parse(fs.readFileSync(vehiclesFile, 'utf8') || '[]')
      vehiclePages = vehicles
        .filter((v: any) => v.status === 'active')
        .map((vehicle: any) => ({
          url: `${baseUrl}/vehicles/${generateVehicleSlug(vehicle)}`,
          lastModified: vehicle.createdAt ? new Date(vehicle.createdAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
    }
  } catch (e) {
    console.error('Failed to generate vehicle sitemap entries', e)
  }

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const blogsFile = path.join(process.cwd(), 'data', 'blogs.json')
    if (fs.existsSync(blogsFile)) {
      const blogs = JSON.parse(fs.readFileSync(blogsFile, 'utf8') || '[]')
      blogPages = blogs
        .filter((b: any) => b.status === 'published')
        .map((blog: any) => ({
          url: `${baseUrl}/blog/${generateBlogSlug(blog)}`,
          lastModified: blog.date ? new Date(blog.date) : new Date(blog.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
    }
  } catch (e) {
    console.error('Failed to generate blog sitemap entries', e)
  }

  return [...staticPages, ...vehiclePages, ...blogPages]
}
