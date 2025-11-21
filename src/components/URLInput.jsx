import { useState } from 'react'

export default function URLInput({ onSubmit }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!url.trim()) return
    setLoading(true)
    try {
      await onSubmit(url.trim())
    } catch (e) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-3">
      <input
        type="url"
        placeholder="Paste a YouTube video, channel, or playlist URL"
        className="flex-1 px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium"
      >
        {loading ? 'Processing...' : 'Find Clips'}
      </button>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
    </form>
  )
}
