import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import { parseBlogSlug, generateBlogSlug } from '@/lib/slugify'
import BlogShareButtons from '@/components/BlogShareButtons'
import type { Metadata } from 'next'

// Simple markdown-to-HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Line breaks to paragraphs
    .split('\n\n')
    .map(para => para.trim())
    .filter(para => para.length > 0)
    .map(para => {
      // Don't wrap if already HTML tag
      if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) {
        return para
      }
      // Handle list items
      if (para.includes('\n') && !para.startsWith('<')) {
        const lines = para.split('\n')
        if (lines.every(l => l.trim().length === 0 || l.match(/^[A-Z]/) || l.startsWith('-'))) {
          const listItems = lines
            .filter(l => l.trim().length > 0)
            .map(l => `<li>${l.replace(/^-\s*/, '')}</li>`)
            .join('')
          return `<ul>${listItems}</ul>`
        }
      }
      return `<p>${para}</p>`
    })
    .join('')
    
  return html
}

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  image: string
  category: string
  date: string
  readTime: string
  author: string
  createdAt: string
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let post: BlogPost | null = null
  
  try {
    const parsed = parseBlogSlug(params.id)
    const blogId = parsed ? parsed.id.toString() : params.id
    
    const dataFile = path.join(process.cwd(), 'data', 'blogs.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const posts: BlogPost[] = JSON.parse(raw || '[]')
      post = posts.find((p) => p.id.toString() === blogId) || null
    }
  } catch (e) {
    console.error('Failed to read blog for metadata', e)
  }

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  const blogUrl = `https://idealcar.co.za/blog/${generateBlogSlug(post)}`
  const imageUrl = post.image ? `https://idealcar.co.za${post.image}` : 'https://idealcar.co.za/logo.png'

  return {
    title: `${post.title} | IdealCar Blog`,
    description: post.excerpt,
    keywords: `${post.category}, car blog, automotive news south africa, ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: blogUrl,
      siteName: 'IdealCar',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_ZA',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  let post: BlogPost | null = null
  
  try {
    // Parse slug to get ID (supports both slug and numeric ID)
    const parsed = parseBlogSlug(params.id)
    const blogId = parsed ? parsed.id.toString() : params.id
    
    const dataFile = path.join(process.cwd(), 'data', 'blogs.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const posts: BlogPost[] = JSON.parse(raw || '[]')
      post = posts.find((p) => p.id.toString() === blogId) || null
    }
  } catch (e) {
    console.error('Failed to read blog', e)
  }

  if (!post) {
    notFound()
  }

  const displayDate = post.date ? new Date(post.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : new Date(post.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Tag className="w-4 h-4" />
              <span className="font-semibold text-sm">{post.category}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{displayDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime || '3 min read'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="container-custom -mt-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {post.content ? (
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} 
                  style={{
                    lineHeight: '1.8',
                  }}
                />
              ) : (
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                    <p className="text-gray-600 italic">
                      Full content for this blog post is coming soon. Check back later for more details.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Share Section */}
            <BlogShareButtons 
              url={`https://idealcar.co.za/blog/${generateBlogSlug(post)}`}
              title={post.title}
            />
          </article>

          {/* Related Articles / CTA */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center border-2 border-blue-100">
            <h3 className="text-2xl font-bold mb-4">Want More Automotive Insights?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest car news, tips, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'blogs.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const posts = JSON.parse(raw || '[]')
      const { generateBlogSlug } = await import('@/lib/slugify')
      return posts.map((post: any) => ({
        id: generateBlogSlug(post),
      }))
    }
  } catch (e) {
    console.error('Failed to generate blog params', e)
  }
  return []
}
