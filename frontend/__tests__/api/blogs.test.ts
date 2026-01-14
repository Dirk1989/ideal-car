// __tests__/api/blogs.test.ts
import { describe, it, expect } from '@jest/globals'

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'

describe('Blogs API', () => {
  let createdBlogId: number

  it('should fetch all blogs', async () => {
    const res = await fetch(`${BASE_URL}/api/blogs`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('should create a new blog post', async () => {
    const payload = {
      title: 'Test Blog Post',
      excerpt: 'This is a test excerpt for the blog post',
      content: 'Full content of the test blog post goes here. It can be much longer.',
      category: 'Tips',
      author: 'Test Author',
      status: 'published',
      readTime: '5 min read'
    }

    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.title).toBe('Test Blog Post')
    expect(data.excerpt).toBe('This is a test excerpt for the blog post')
    expect(data.category).toBe('Tips')
    expect(data.status).toBe('published')
    expect(data.id).toBeDefined()
    expect(data.views).toBe(0)
    
    createdBlogId = data.id
  })

  it('should delete a blog post', async () => {
    if (!createdBlogId) {
      throw new Error('No blog to delete')
    }

    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: createdBlogId })
    })

    expect(res.status).toBe(200)
    
    // Verify it's deleted
    const allBlogs = await fetch(`${BASE_URL}/api/blogs`)
    const data = await allBlogs.json()
    const found = data.find((b: any) => b.id === createdBlogId)
    expect(found).toBeUndefined()
  })

  it('should return 404 for non-existent blog delete', async () => {
    const res = await fetch(`${BASE_URL}/api/blogs`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 999999999 })
    })

    expect(res.status).toBe(404)
  })
})
