'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Comic {
  id: string
  video_title: string
  storyboard_title: string
  google_doc_url: string | null
  drive_folder_url: string | null
  generation_time_seconds: number
  cost_estimate: number
  created_at: string
  status: string
}

export default function History() {
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    try {
      const res = await fetch(`${apiUrl}/comics?limit=20`)
      if (!res.ok) throw new Error('Failed to fetch history')

      const data = await res.json()
      setComics(data.comics || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">
              Comic History
            </h1>
            <p className="text-xl text-white/70">
              Your previously generated comics
            </p>
          </div>
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all"
          >
            + Generate New Comic
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Loading your comics...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Comics Grid */}
        {!loading && !error && (
          <>
            {comics.length === 0 ? (
              <div className="text-center text-white/60 py-12">
                <p className="text-xl mb-4">No comics generated yet</p>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Create Your First Comic
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comics.map((comic) => (
                  <ComicCard key={comic.id} comic={comic} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ComicCard({ comic }: { comic: Comic }) {
  const formattedDate = new Date(comic.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
        <h3 className="text-white font-bold text-lg line-clamp-2">
          {comic.storyboard_title || comic.video_title}
        </h3>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div className="text-sm text-gray-600">
          <p className="line-clamp-1">{comic.video_title}</p>
        </div>

        {/* Metrics */}
        <div className="flex gap-4 text-xs text-gray-500">
          <span>⏱️ {comic.generation_time_seconds.toFixed(1)}s</span>
          <span>💰 ${comic.cost_estimate.toFixed(2)}</span>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400">
          {formattedDate}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            comic.status === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {comic.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {comic.google_doc_url && (
            <a
              href={comic.google_doc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition-all text-center"
            >
              📄 Doc
            </a>
          )}
          {comic.drive_folder_url && (
            <a
              href={comic.drive_folder_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-cyan-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-cyan-700 transition-all text-center"
            >
              📂 Drive
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
