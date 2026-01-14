'use client'

import { useState, useEffect } from 'react'
import { Share2, Check } from 'lucide-react'

interface BlogShareButtonsProps {
  url: string
  title: string
}

export default function BlogShareButtons({ url, title }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={handleTwitterShare}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Twitter
        </button>
        <button 
          onClick={handleFacebookShare}
          className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors"
        >
          Facebook
        </button>
        <button 
          onClick={handleWhatsAppShare}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          WhatsApp
        </button>
        <button 
          onClick={handleCopyLink}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            'Copy Link'
          )}
        </button>
        {canShare && (
          <button 
            onClick={handleShare}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        )}
      </div>
    </div>
  )
}
