// components/ImageModal.tsx
'use client'

import React, { useEffect, useState } from 'react'

interface ImageModalProps {
  images: string[]
  startIndex?: number
  onClose: () => void
}

export default function ImageModal({ images, startIndex = 0, onClose }: ImageModalProps) {
  const [index, setIndex] = useState(startIndex)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i: number) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setIndex((i: number) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  useEffect(() => setIndex(startIndex), [startIndex])

  if (!images || images.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative max-w-4xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-white/90 rounded-full p-2"
          aria-label="Close gallery"
        >
          ✕
        </button>

        <div className="relative overflow-hidden rounded-lg">
          <img
            src={images[index]}
            alt={`Image ${index + 1}`}
            className="w-full h-[60vh] object-contain bg-black"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setIndex((i: number) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={() => setIndex((i: number) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto py-2">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`thumb-${i}`}
                onClick={() => setIndex(i)}
                className={`h-16 w-24 object-cover rounded-md cursor-pointer border-2 ${i === index ? 'border-blue-500' : 'border-transparent'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
