// Utility functions for generating and parsing SEO-friendly vehicle slugs

export function generateVehicleSlug(vehicle: {
  id: number
  year: number
  title: string
  location: string
}): string {
  // Create slug: year-title-location-id
  // Example: 1997-Honda-Civic-Pretoria-1768314156187
  const titleSlug = vehicle.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  const locationSlug = vehicle.location
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return `${vehicle.year}-${titleSlug}-${locationSlug}-${vehicle.id}`
}

export function parseVehicleSlug(slug: string): { id: number } | null {
  // Extract ID from the end of the slug
  // Format: year-title-location-id
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart, 10)
  
  if (isNaN(id)) {
    return null
  }
  
  return { id }
}

export function getVehicleUrl(vehicle: {
  id: number
  year: number
  title: string
  location: string
}): string {
  return `/vehicles/${generateVehicleSlug(vehicle)}`
}

// Blog slug utilities
export function generateBlogSlug(blog: {
  id: number
  title: string
  date?: string
}): string {
  // Create slug: title-words-id
  // Example: why-older-cars-need-more-service-1768334006347
  const titleSlug = blog.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    // Limit to first 8 words for cleaner URLs
    .split('-')
    .slice(0, 8)
    .join('-')
  
  return `${titleSlug}-${blog.id}`
}

export function parseBlogSlug(slug: string): { id: number } | null {
  // Extract ID from the end of the slug
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = parseInt(lastPart, 10)
  
  if (isNaN(id)) {
    return null
  }
  
  return { id }
}

export function getBlogUrl(blog: {
  id: number
  title: string
  date?: string
}): string {
  return `/blog/${generateBlogSlug(blog)}`
}
