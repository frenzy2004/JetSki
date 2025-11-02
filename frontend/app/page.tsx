'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [generateImages, setGenerateImages] = useState(true)
  const [createGoogleDoc, setCreateGoogleDoc] = useState(false)
  const [processingStage, setProcessingStage] = useState('')

  // Example video URLs for quick demo
  const exampleVideos = [
    { title: 'Joe Rogan Podcast', url: 'https://www.youtube.com/watch?v=PssKpzB0Ah0' },
    { title: 'Huberman Lab', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    setProcessingStage('Extracting transcript...')

    try {
      const res = await fetch('/api/jetski', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: url,
          generate_images: generateImages,
          create_google_doc: createGoogleDoc
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to process video' }))
        throw new Error(errorData.error || 'Failed to process video')
      }

      const data = await res.json()
      setResult(data)
      setProcessingStage('Done!')
    } catch (err: any) {
      setError(err.message)
      setProcessingStage('')
    } finally {
      setLoading(false)
    }
  }

  const downloadAllPanels = () => {
    if (!result?.comic_images?.panels) return

    result.comic_images.panels.forEach((panel: any) => {
      if (panel.image_base64) {
        const link = document.createElement('a')
        link.href = `data:${panel.mime_type || 'image/png'};base64,${panel.image_base64}`
        link.download = `panel-${panel.panel_number}.png`
        link.click()
      }
    })
  }

  const estimatedCost = generateImages ? '$0.04' : '$0.01'
  const estimatedTime = generateImages ? '~30 sec' : '~10 sec'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <a
              href="/history"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all font-medium"
            >
              📚 View History
            </a>
          </div>
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

        {/* How It Works Section */}
        <div className="mb-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            ⚡ How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="text-white/80">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-sm font-semibold">Extract Transcript</div>
            </div>
            <div className="text-white/80">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm font-semibold">Find Viral Moments</div>
            </div>
            <div className="text-white/80">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-sm font-semibold">AI Auto-Selects Best</div>
            </div>
            <div className="text-white/80">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-sm font-semibold">Generate 6-Panel Comic</div>
            </div>
            <div className="text-white/80">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-sm font-semibold">Upload to Drive</div>
            </div>
          </div>
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

            {/* Quick Example Buttons */}
            <div className="flex gap-2 mt-3">
              <span className="text-sm text-gray-500 py-2">Quick demo:</span>
              {exampleVideos.map((video, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setUrl(video.url)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all"
                >
                  {video.title}
                </button>
              ))}
            </div>

            {/* Toggle Controls */}
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generateImages}
                  onChange={(e) => setGenerateImages(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 font-medium">
                  Generate Comic Images (NanoBanana)
                </span>
                <span className="text-sm text-gray-500">+$0.03</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createGoogleDoc}
                  onChange={(e) => setCreateGoogleDoc(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-700 font-medium">
                  Create Google Doc & Upload to Drive
                </span>
                <span className="text-sm text-gray-500">Free</span>
              </label>
            </div>

            {/* Cost & Time Estimate */}
            <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <span>💰 Estimated cost: <strong>{estimatedCost}</strong></span>
              <span>⏱️ Estimated time: <strong>{estimatedTime}</strong></span>
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all shadow-lg"
            >
              {loading ? `⏳ ${processingStage}` : '🚀 Generate Comic Strip'}
            </button>
          </div>
        </form>

        {/* Loading State with Progress Bar */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="animate-spin text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI is working its magic...
            </h2>
            <div className="mb-6">
              <div className="text-lg font-semibold text-blue-600">{processingStage}</div>
            </div>
            <div className="space-y-3 text-left max-w-md mx-auto">
              <ProcessingStep label="Extracting transcript" active={processingStage.includes('transcript')} />
              <ProcessingStep label="Finding viral moments" active={processingStage.includes('viral') || processingStage.includes('moment')} />
              <ProcessingStep label="Generating storyboard" active={processingStage.includes('storyboard')} />
              {generateImages && <ProcessingStep label="Creating comic images" active={processingStage.includes('image')} />}
              {createGoogleDoc && <ProcessingStep label="Uploading to Google Drive" active={processingStage.includes('Doc') || processingStage.includes('Drive')} />}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">❌</div>
              <h3 className="text-xl text-red-600 font-semibold mb-4">Something went wrong</h3>
              <p className="text-red-600 mb-4">{error}</p>
            </div>

            {/* Common Error Solutions */}
            <div className="mt-6 text-left space-y-2 max-w-2xl mx-auto">
              <p className="font-semibold text-gray-800">Common solutions:</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Check if the YouTube URL is valid and has captions/transcript</li>
                <li>• Verify your API keys are set in .env.local (OPENAI_API_KEY, GOOGLE_API_KEY)</li>
                <li>• Make sure Supabase credentials are configured correctly</li>
                <li>• Try a different video - some videos may not have transcripts available</li>
              </ul>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setError('')
                  setResult(null)
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Try Again
              </button>
            </div>
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
                <span>💰 Cost: ~$0.04</span>
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
                  {result.storyboard.panels?.map((panel: any) => {
                    const generatedPanel = result.comic_images?.panels?.find(
                      (p: any) => p.panel_number === panel.panel_number
                    )
                    const hasImage = generatedPanel?.image_base64

                    return (
                      <div
                        key={panel.panel_number}
                        className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 shadow-lg border-4 border-gray-800 transform hover:scale-105 transition-all"
                      >
                        <div className="bg-white rounded-lg h-64 mb-4 flex items-center justify-center overflow-hidden">
                          {hasImage ? (
                            <img
                              src={`data:${generatedPanel.mime_type || 'image/png'};base64,${generatedPanel.image_base64}`}
                              alt={`Panel ${panel.panel_number}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-sm p-4 text-center">
                              {panel.visual_description || panel.scene_description}
                            </div>
                          )}
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
                    )
                  })}
                </div>

                {/* Download Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="font-bold text-lg mb-3">📱 Ready to Share!</h4>

                  {/* Hashtags */}
                  {result.storyboard.hashtags && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {result.storyboard.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Posting Tip */}
                  {result.storyboard.posting_tip && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Tip:</strong> {result.storyboard.posting_tip}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.google_doc?.doc_url && (
                      <a
                        href={result.google_doc.doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all text-center"
                      >
                        📄 View Google Doc
                      </a>
                    )}
                    {result.google_doc?.drive_folder_url && (
                      <a
                        href={result.google_doc.drive_folder_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-all text-center"
                      >
                        📂 Open Drive Folder
                      </a>
                    )}
                    {result.comic_images?.panels?.some((p: any) => p.image_base64) && (
                      <button
                        onClick={downloadAllPanels}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
                      >
                        📸 Download All Panels
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-white/60 text-sm">
          <p>Built with GPT-4o-mini + NanoBanana (Gemini 2.5 Flash Image) • ~$0.04 per comic • ~30 sec generation</p>
          <p className="mt-2">If long-form was the ocean, we just built a jet ski 🚤</p>
        </div>
      </div>
    </div>
  )
}

// Helper component for processing steps
function ProcessingStep({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${
        active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
      }`}></div>
      <span className={`text-sm ${
        active ? 'text-gray-800 font-semibold' : 'text-gray-500'
      }`}>{label}</span>
      {active && <span className="text-green-600 text-xs">✓</span>}
    </div>
  )
}
