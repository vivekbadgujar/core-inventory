import { useState, useEffect } from 'react'

export default function ConnectionStatus() {
  const [status, setStatus] = useState('checking')
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const healthUrl = import.meta.env.VITE_API_URL?.replace('/api', '/health') || 'http://localhost:8080/health';
        const response = await fetch(healthUrl)
        if (response.ok) {
          setStatus('connected')
        } else {
          setStatus('disconnected')
        }
      } catch (error) {
        setStatus('disconnected')
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowStatus(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!showStatus) return null

  const statusColors = {
    connected: 'bg-green-500',
    checking: 'bg-yellow-500',
    disconnected: 'bg-red-500'
  }

  const statusText = {
    connected: 'Backend Connected',
    checking: 'Checking...',
    disconnected: 'Backend Offline'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 px-3 py-2 bg-panel border border-line rounded-lg">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        <span className="text-xs text-slate-400">{statusText[status]}</span>
      </div>
    </div>
  )
}
