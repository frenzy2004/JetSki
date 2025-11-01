'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('http://localhost:8000/jetski', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: url,
          generate_images: false,  // Skip images for faster demo
          create_google_doc: false
        })
      })

      if (!res.ok) throw new Error('Failed to process video')

      const data = await res.json()
      setResult(data)
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
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black text-white mb-4 drop-shadow-lg">
            🚤 JetSki
          </h1>
          <p className="text-2xl text-white/90 font-medium mb-2">
            Turn YouTube videos into viral comic strips
          </p>
          <p className="text-lg text-white/70">
            AI analyzes the video, picks the viral moment, creates a 6-panel manga/vintage comic
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL (Joe Rogan, Huberman, Diary of a CEO...)"
              className="w-full p-5 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              required
            />

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all shadow-lg"
            >
              {loading ? '⏳ Analyzing Video... (2 min)' : '🚀 Generate Comic Strip'}
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="animate-spin text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI is working its magic...
            </h2>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Extracting transcript...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Finding viral moments...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">AI selecting best moment...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Generating 6-panel storyboard...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-xl text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Video Info */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {result.video_title}
              </h2>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>⏱️ Total time: {result.metrics?.total_time_seconds.toFixed(1)}s</span>
                <span>💰 Cost: ~$0.25</span>
              </div>
            </div>

            {/* Viral Analysis */}
            {result.viral_analysis && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  🎯 Viral Moment Selected
                </h3>
                <div className="bg-white rounded-xl p-6">
                  {result.viral_analysis.segments?.map((segment: any, i: number) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg mb-3 ${
                        segment.rank === result.viral_analysis.selected.rank
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black text-green-600">
                          #{segment.rank}
                        </span>
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {segment.score}/100
                        </span>
                        <span className="text-gray-500 text-sm">
                          {segment.viral_type}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-1">
                        {segment.hook}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {segment.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storyboard */}
            {result.storyboard && (
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  🎬 {result.storyboard.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  Style: {result.storyboard.style} • Tone: {result.storyboard.tone}
                </p>

                {/* Comic Panels Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {result.storyboard.panels?.map((panel: any) => (
                    <div
                      key={panel.panel_number}
                      className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 shadow-lg border-4 border-gray-800"
                    >
                      <div className="bg-white rounded-lg h-64 mb-4 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                        {panel.scene_description}
                      </div>
                      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-2xl font-black text-yellow-700">
                            {panel.panel_number}
                          </span>
                          <p className="text-sm font-medium text-gray-800 leading-tight">
                            "{panel.caption}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Download Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-lg mb-3">📱 Ready to Share!</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                      📄 View Google Doc
                    </button>
                    <button className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-all">
                      📂 Open Drive Folder
                    </button>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all">
                      📸 Download All Panels
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-white/60 text-sm">
          <p>Built with GPT-4o-mini + NanoBanana • ~$0.25 per comic • &lt;2 min generation</p>
          <p className="mt-2">If long-form was the ocean, we just built a jet ski 🚤</p>
        </div>
      </div>
    </div>
  )
}
