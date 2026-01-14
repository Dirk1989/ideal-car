import BlogCard from '@/components/BlogCardServer'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Car News & Tips Blog | IdealCar Gauteng',
  description: 'Latest automotive news, car buying tips, maintenance advice and industry insights. Expert advice for car buyers and sellers in South Africa.',
  keywords: 'car blog, automotive news south africa, car buying tips, vehicle maintenance, gauteng car news',
  openGraph: {
    title: 'IdealCar Blog - Car News & Tips',
    description: 'Latest automotive news, tips and insights for car buyers in South Africa.',
    type: 'website',
  },
}

export default async function BlogPage() {
  let posts: any[] = []
  try {
    // Read blogs directly from the data file on the server to avoid API/fetch issues
    const dataFile = path.join(process.cwd(), 'data', 'blogs.json')
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const allPosts = JSON.parse(raw || '[]')
      // Filter only published posts
      posts = allPosts.filter((p: any) => p.status === 'published')
    } else {
      posts = []
    }
  } catch (e) {
    console.error('Failed to read blogs from disk', e)
    posts = []
  }
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Latest news, tips, and insights from the automotive world
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={{
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              image: post.image || '',
              category: post.category,
              date: post.date ? new Date(post.date).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString(),
              readTime: post.readTime || '3 min read',
              author: post.author || 'Admin'
            }} />
          ))}

        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-6">Get the latest automotive news and exclusive offers</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        </div>
      </section>
    </main>
  )
}
