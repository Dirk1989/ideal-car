// components/home/BlogSection.tsx
'use client'

import { useEffect, useState } from 'react'
import BlogCard from '@/components/BlogCard'

const BlogSection = () => {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blogs')
        if (res.ok) {
          const data = await res.json()
          if (mounted) setPosts((data || []).filter((p: any) => p.status === 'published'))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchPosts()
    return () => { mounted = false }
  }, [])

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="heading-2 mb-2">Latest from Our Blog</h2>
            <p className="text-gray-600">Expert insights, tips, and automotive news</p>
          </div>
          <a
            href="/blog"
            className="mt-4 md:mt-0 btn-secondary inline-flex items-center group"
          >
            View All Articles
            <svg 
              className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={{
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              image: post.image || '/blog/default.jpg',
              category: post.category,
              date: post.date ? new Date(post.date).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString(),
              readTime: post.readTime || '3 min read',
              author: post.author || 'Admin'
            }} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection