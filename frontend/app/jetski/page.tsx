'use client'

import { useState } from 'react'

interface ViralMoment {
  rank: number
  score: number
  title: string
  excerpt: string
  timestamps: string
  viral_type: string
  reason: string
}

interface Message {
  type: 'bot' | 'user'
  content: React.ReactNode
}

interface Task {
  id: string
  title: string
  date: string
  messages: Message[]
  moment?: ViralMoment
}

export default function JetSkiAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: (
        <div>
          <p className="font-medium mb-2">👋 Send me a YouTube URL and I'll transform it into a comic strip!</p>
          <p className="text-sm opacity-75">
            I'll analyze the video, show you 3 viral moment options to choose from, then generate a 6-panel comic strip ready for social media. 🎨
          </p>
        </div>
      )
    }
  ])

  const [tasks, setTasks] = useState<Task[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [viralMoments, setViralMoments] = useState<ViralMoment[]>([])
  const [awaitingSelection, setAwaitingSelection] = useState(false)

  const addMessage = (type: 'bot' | 'user', content: React.ReactNode) => {
    setMessages(prev => [...prev, { type, content }])
  }

  const startNewComic = () => {
    // Save current conversation if there are messages beyond the initial greeting
    if (messages.length > 1) {
      const lastMoment = viralMoments.find(m => m.rank === 1) // Get the selected moment
      const comicTitle = lastMoment?.title || 'Comic Generation'
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: comicTitle,
        date: new Date().toLocaleTimeString(),
        messages: [...messages],
        moment: lastMoment
      }
      setTasks(prev => [newTask, ...prev])
    }

    // Reset everything for a new comic generation
    setMessages([
      {
        type: 'bot',
        content: (
          <div>
            <p className="font-medium mb-2">👋 Send me a YouTube URL and I'll transform it into a comic strip!</p>
            <p className="text-sm opacity-75">
              I'll analyze the video, show you 3 viral moment options to choose from, then generate a 6-panel comic strip ready for social media. 🎨
            </p>
          </div>
        )
      }
    ])
    setInputValue('')
    setIsLoading(false)
    setViralMoments([])
    setAwaitingSelection(false)
  }

  const loadTask = (task: Task) => {
    // Load a previous conversation
    if (task.messages && task.messages.length > 0) {
      setMessages(task.messages)
    } else {
      // Fallback to initial message if no messages saved
      setMessages([
        {
          type: 'bot',
          content: (
            <div>
              <p className="font-medium mb-2">👋 Send me a YouTube URL and I'll transform it into a comic strip!</p>
              <p className="text-sm opacity-75">
                I'll analyze the video, show you 3 viral moment options to choose from, then generate a 6-panel comic strip ready for social media. 🎨
              </p>
            </div>
          )
        }
      ])
    }
    setViralMoments(task.moment ? [task.moment] : [])
    setAwaitingSelection(false)
    setIsLoading(false)
  }

  const addTask = (title: string) => {
    const task: Task = {
      id: Date.now().toString(),
      title,
      date: new Date().toLocaleDateString(),
      messages: [],
    }
    setTasks(prev => [task, ...prev])
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userInput = inputValue
    setInputValue('')

    // Add user message
    addMessage('user', userInput)
    setIsLoading(true)

    try {
      // Add bot "analyzing" message
      addMessage('bot', (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="italic opacity-75">Analyzing video...</span>
        </div>
      ))

      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: userInput })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to analyze video')
      }

      const data = await res.json()
      setViralMoments(data.viral_moments || [])
      setAwaitingSelection(true)

      // Remove loading message and add viral moments
      setMessages(prev => prev.slice(0, -1))

      addMessage('bot', (
        <div className="space-y-4">
          <p className="font-medium">🎯 Found {data.viral_moments?.length || 0} viral moments! Pick one:</p>

          <div className="space-y-3">
            {data.viral_moments?.map((moment: ViralMoment) => (
              <button
                key={moment.rank}
                onClick={() => handleMomentSelection(moment)}
                className="w-full text-left border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-extrabold text-gray-900">📺 OPTION {moment.rank}</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold">
                    Score: {moment.score}/100
                  </span>
                  {moment.rank === 1 && (
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs font-bold">
                      ⭐ HIGHEST VIRAL POTENTIAL
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm opacity-60">⏱</span>
                  <span className="text-sm opacity-60">Timestamps: {moment.timestamps}</span>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <span className="text-sm">💡</span>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Why it's viral: </span>
                    <span className="text-sm">{moment.reason}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-gray-50 rounded p-2 mt-2">
                  <span className="text-sm">📝</span>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Excerpt: </span>
                    <span className="text-sm italic">"{moment.excerpt}"</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))

    } catch (err: any) {
      setMessages(prev => prev.slice(0, -1))
      addMessage('bot', (
        <div className="text-red-600">
          ❌ {err.message}
        </div>
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleMomentSelection = async (moment: ViralMoment) => {
    if (isLoading) return

    setAwaitingSelection(false)
    setIsLoading(true)

    // Add task to sidebar
    addTask(moment.title)

    // Add user's selection
    addMessage('user', `Option ${moment.rank}: ${moment.title}`)

    // Add bot "creating" message
    addMessage('bot', (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <span className="italic opacity-75">Creating your comic strip...</span>
      </div>
    ))

    try {
      const res = await fetch('/api/create-comic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_moment: moment,
          generate_images: true
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create comic')
      }

      const data = await res.json()

      // Remove loading message
      setMessages(prev => prev.slice(0, -1))

      // Add coherence review section first
      if (data.coherence_review) {
        addMessage('bot', (
          <div className="space-y-2">
            {/* Condition badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Condition</p>
                <p className="text-xs text-gray-600">
                  Condition met: The coherence check shows isCoherent is true or recommendation is proceed
                </p>
              </div>
            </div>

            {/* Write/Review section - collapsible */}
            <details className="bg-white border border-gray-200 rounded-lg" open>
              <summary className="cursor-pointer px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-medium text-gray-900">Write</span>
              </summary>
              <div className="px-4 pb-4 pt-2">
                <p className="text-xs text-gray-500 mb-2">Text</p>
                <div className="bg-gray-50 border border-gray-200 rounded p-3 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
{`{
  "isCoherent": ${data.coherence_review.isCoherent},
  "overallScore": ${data.coherence_review.overallScore},
  "recommendation": "${data.coherence_review.recommendation}",
  "panelReviews": [
${data.coherence_review.panelReviews?.map((review: any, idx: number) => `    {
      "panelNumber": ${review.panelNumber},
      "contextClarity": "✅ ${review.contextClarity.toUpperCase()}",
      "characterConsistency": "✅ ${review.characterConsistency.toUpperCase()}",
      "visualFlow": "✅ ${review.visualFlow.toUpperCase()}",
      "narrativeCoherence": "✅ ${review.narrativeCoherence.toUpperCase()}"${review.notes ? `,
      "notes": "${review.notes}"` : ''}
    }${idx < data.coherence_review.panelReviews.length - 1 ? ',' : ''}`).join('\n')}
  ]${data.coherence_review.strengths?.length > 0 ? `,
  "strengths": [
${data.coherence_review.strengths.map((s: string, i: number) => `    "${s}"${i < data.coherence_review.strengths.length - 1 ? ',' : ''}`).join('\n')}
  ]` : ''}${data.coherence_review.suggestions?.length > 0 ? `,
  "suggestions": [
${data.coherence_review.suggestions.map((s: string, i: number) => `    "${s}"${i < data.coherence_review.suggestions.length - 1 ? ',' : ''}`).join('\n')}
  ]` : ''}
}`}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        ))
      }

      // Add comic result
      addMessage('bot', (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-lg text-green-900 mb-1">🎉 Your comic is ready!</p>
            <p className="text-sm text-green-700">
              Generated in {data.metrics?.total_time_seconds?.toFixed(1)}s • ~$0.04 cost
            </p>
          </div>

          {data.storyboard && (
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                {data.storyboard.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Style: {data.storyboard.style} • Tone: {data.storyboard.tone}
              </p>
            </div>
          )}

          {/* Comic Panels - Vertical Strips */}
          <div className="space-y-4">
            {data.storyboard?.panels?.map((panel: any) => {
              const generatedPanel = data.comic_images?.panels?.find(
                (p: any) => p.panel_number === panel.panel_number
              )
              const hasImage = generatedPanel?.image_base64

              return (
                <div
                  key={panel.panel_number}
                  className="bg-white border-4 border-gray-900 rounded-lg overflow-hidden shadow-lg"
                >
                  {/* Panel Image */}
                  <div className="relative bg-gray-100 w-full" style={{ minHeight: '300px' }}>
                    {hasImage ? (
                      <img
                        src={`data:${generatedPanel.mime_type || 'image/png'};base64,${generatedPanel.image_base64}`}
                        alt={`Panel ${panel.panel_number}`}
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: '500px' }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                        <p className="text-gray-400 text-sm">{panel.visual_description}</p>
                      </div>
                    )}
                  </div>

                  {/* Caption Bar */}
                  <div className="bg-yellow-100 border-t-4 border-yellow-400 p-4">
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded mr-2 text-xs">
                        #{panel.panel_number}
                      </span>
                      {panel.caption}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Comic Summary Breakdown - AFTER the panels */}
          {data.comic_summary && (
            <details className="bg-white border border-gray-200 rounded-lg" open>
              <summary className="cursor-pointer px-4 py-3 hover:bg-gray-50 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="font-medium text-gray-900">Write - Comic Breakdown</span>
              </summary>
              <div className="px-4 pb-4 pt-2">
                <div className="space-y-4">
                  {/* Context */}
                  {data.comic_summary.context && (
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-1">## Context</p>
                      <p className="text-sm text-gray-600">{data.comic_summary.context}</p>
                    </div>
                  )}

                  {/* Viral Potential */}
                  {data.comic_summary.viralPotential && (
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-1">** Viral Potential **</p>
                      <p className="text-sm text-gray-600">{data.comic_summary.viralPotential}</p>
                    </div>
                  )}

                  {/* Panel Breakdown */}
                  {data.comic_summary.panelBreakdown && (
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-2">## Comic Panel Breakdown</p>
                      <div className="space-y-3">
                        {data.comic_summary.panelBreakdown.map((panel: any) => (
                          <div key={panel.panelNumber} className="border-l-2 border-gray-300 pl-3">
                            <p className="text-xs font-bold text-gray-800 mb-1">
                              ### Panel {panel.panelNumber}: {panel.title}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              <span className="font-semibold">**Visual Description:** </span>
                              {panel.visualDescription}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              <span className="font-semibold">**Dialogue/Caption:** </span>
                              "{panel.dialogueCaption}"
                            </p>
                            {panel.narrativePurpose && (
                              <p className="text-xs text-gray-600">
                                <span className="font-semibold">**Purpose:** </span>
                                {panel.narrativePurpose}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Themes */}
                  {data.comic_summary.keyThemes?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-1">** Key Themes **</p>
                      <div className="flex flex-wrap gap-2">
                        {data.comic_summary.keyThemes.map((theme: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Audience */}
                  {data.comic_summary.targetAudience && (
                    <div>
                      <p className="text-xs font-bold text-gray-700 mb-1">** Target Audience **</p>
                      <p className="text-sm text-gray-600">{data.comic_summary.targetAudience}</p>
                    </div>
                  )}
                </div>
              </div>
            </details>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={async () => {
                try {
                  const uploadButton = document.activeElement as HTMLButtonElement;
                  uploadButton.disabled = true;
                  uploadButton.textContent = '⏳ Uploading...';

                  const res = await fetch('/api/upload-to-drive', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      panels: data.comic_images?.panels || [],
                      storyboard: data.storyboard,
                      selected_moment: data.selected_moment,
                      comic_summary: data.comic_summary
                    })
                  });

                  if (res.ok) {
                    const uploadData = await res.json();
                    uploadButton.textContent = '✅ Uploaded!';
                    setTimeout(() => {
                      if (uploadData.drive_folder_url) {
                        window.open(uploadData.drive_folder_url, '_blank');
                      }
                    }, 500);
                  } else {
                    uploadButton.textContent = '❌ Upload Failed';
                    uploadButton.disabled = false;
                  }
                } catch (error) {
                  console.error('Upload error:', error);
                }
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
            >
              📁 Upload to Google Drive
            </button>
            <button
              onClick={() => {
                data.comic_images?.panels?.forEach((panel: any) => {
                  if (panel.image_base64) {
                    const link = document.createElement('a')
                    link.href = `data:${panel.mime_type || 'image/png'};base64,${panel.image_base64}`
                    link.download = `panel-${panel.panel_number}.png`
                    link.click()
                  }
                })
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              📥 Download All Panels
            </button>
            <button
              onClick={startNewComic}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              Create Another Comic
            </button>
          </div>
        </div>
      ))

    } catch (err: any) {
      setMessages(prev => prev.slice(0, -1))
      addMessage('bot', (
        <div className="text-red-600">
          ❌ {err.message}
        </div>
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Chat Area */}
      <div className="flex flex-col">
        {/* Top Header */}
        {messages.length > 1 && (
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">YouTube Video to Comic Clips</h1>
              <p className="text-xs text-gray-500">Turn long-form videos into viral comic strips</p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white relative min-h-screen">
          {messages.length === 1 ? (
            // Landing page view - centered with video background
            <div className="h-screen">
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-screen object-cover"
              >
                <source src="/video2.webm" type="video/webm" />
              </video>
              
              {/* Dark Overlay for better text visibility */}
              <div className="absolute inset-0 h-screen bg-black/40"></div>
              
              {/* Content over video */}
              <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-3xl">
                  {/* Brand Title */}
                  <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl flex items-center justify-center gap-3">
                      <span className="text-7xl">🚤</span> JetSki
                    </h1>
                    <p className="text-2xl text-white font-medium mb-3 drop-shadow-lg">
                      Turning long-form videos into viral comic stories
                    </p>
                    <p className="text-lg text-white/90 italic drop-shadow-lg">
                      "If long-form content is the ocean, I just built a jet ski."
                    </p>
                  </div>

                  {/* Input Box with Ocean Glow */}
                  <div className="relative mt-8">
                    {/* Cyan-blue gradient glow under input */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 blur-xl opacity-50"></div>
                    
                    <div className="flex gap-3 items-center relative">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                          placeholder="Paste YouTube URL here..."
                          className="w-full px-5 py-3.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-base bg-white shadow-2xl transition-all"
                          disabled={isLoading}
                        />
                      </div>
                      
                      {/* Animated Button - transforms on hover, shows "Riding the wave..." on loading */}
                      {isLoading ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-2xl shadow-cyan-400/50">
                          <span className="text-lg animate-bounce">🌊</span>
                          <span className="text-sm font-semibold whitespace-nowrap animate-pulse">Riding the wave...</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim()}
                          className="group relative w-12 h-12 bg-white text-gray-900 rounded-full hover:bg-cyan-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-2xl hover:shadow-cyan-400/50 hover:scale-110 overflow-hidden"
                        >
                          {/* Arrow that rotates and fades on hover */}
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-hover:rotate-90">
                            <span className="text-2xl font-bold">➤</span>
                          </span>
                          
                          {/* Wave that appears on hover */}
                          <span className="absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0 scale-50 rotate-[-90deg] group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0">
                            <span className="text-2xl animate-pulse">🌊</span>
                          </span>
                          
                          {/* Shimmer wave effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat view - normal messages
            <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
              {messages && messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.type === 'bot'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-600 text-white ml-auto'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {msg.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                      U
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
