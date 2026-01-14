// components/BlogCard.tsx
'use client'

import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { getBlogUrl } from '@/lib/slugify'

interface BlogCardProps {
  post: {
    id: number
    title: string
    excerpt: string
    image: string
    category: string
    date: string
    readTime: string
    author: string
  }
}

const BlogCard = ({ post }: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} />
        ) : (
          <div 
            className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          >
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-4xl">📰</div>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {post.date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime}
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {post.author}
          </div>
        </div>

        {/* Title & Excerpt */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read More */}
        <a
          href={getBlogUrl(post)}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group"
        >
          Read More
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  )
}

export default BlogCard