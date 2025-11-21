import { useEffect, useRef } from 'react'

export default function Player({ videoId, clip }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!videoId || !clip) return
    const start = Math.max(0, clip.start - 0.5)
    const end = clip.end
    const src = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(start)}&end=${Math.ceil(end)}&autoplay=1&modestbranding=1&controls=1`
    if (ref.current) {
      ref.current.src = src
    }
  }, [videoId, clip])

  if (!videoId || !clip) return null

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-700">
      <iframe
        ref={ref}
        className="w-full h-full"
        src=""
        title="Clip preview"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
