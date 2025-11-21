import { useState } from 'react'
import URLInput from './components/URLInput'
import Results from './components/Results'
import Player from './components/Player'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

async function api(path, params={}) {
  const url = new URL(API_BASE + path)
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error('Request failed')
  return r.json()
}

function App() {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [videoId, setVideoId] = useState(null)
  const [activeClip, setActiveClip] = useState(null)

  const handleSubmit = async (url) => {
    setLoading(true)
    setActiveClip(null)
    setResults(null)
    setLinks([])
    try {
      // If it's a video URL, go straight to suggestions
      const direct = await api('/suggest_clips', { url })
      if (direct?.available && direct?.video_id) {
        const meta = await api('/oembed', { url })
        setVideoId(direct.video_id)
        setResults({ metadata: meta, clips: direct.clips })
        setLoading(false)
        return
      }
      // Otherwise, treat as page/channel and scrape links
      const data = await api('/scrape_links', { url })
      setLinks(data.links)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const handlePickLink = async (link) => {
    setLoading(true)
    setActiveClip(null)
    try {
      const direct = await api('/suggest_clips', { url: link })
      const meta = await api('/oembed', { url: link })
      setVideoId(direct.video_id)
      setResults({ metadata: meta, clips: direct.clips })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Viral Clip Finder</h1>
          <p className="text-slate-300 mt-2">Paste a YouTube URL. We find punchy, shareable moments using free endpoints.</p>
        </header>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8">
          <URLInput onSubmit={handleSubmit} />
          {loading && (
            <div className="mt-6 text-sm text-slate-300">Analyzing…</div>
          )}
        </div>

        {links.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Found {links.length} videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {links.map((l) => (
                <button key={l} onClick={() => handlePickLink(l)} className="text-left p-3 rounded-xl bg-slate-800/60 border border-slate-700 hover:bg-slate-700/40">
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <Player videoId={videoId} clip={activeClip || results?.clips?.[0]} />
            </div>
            <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
              <Results results={results} onPreview={setActiveClip} />
            </div>
          </div>
        )}

        {!loading && !results && links.length === 0 && (
          <div className="text-center text-slate-400">Paste a link to get started</div>
        )}
      </div>
    </div>
  )
}

export default App
