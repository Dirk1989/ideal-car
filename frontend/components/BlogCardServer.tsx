import React from 'react'
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

export default function BlogCardServer({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-4xl">📰</div>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">{post.date}</div>
          <div className="flex items-center">{post.readTime}</div>
          <div className="flex items-center">{post.author}</div>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>

        <a href={getBlogUrl(post)} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
          Read More
        </a>
      </div>
    </div>
  )
}
