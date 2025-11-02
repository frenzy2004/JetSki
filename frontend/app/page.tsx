'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the JetSki page
    router.push('/jetski')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
      <div className="text-white text-center">
        <div className="text-6xl mb-4">🚤</div>
        <p className="text-xl">Redirecting to JetSki...</p>
      </div>
    </div>
  )
}
