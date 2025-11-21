export default function ClipCard({ clip, index, onPreview }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">Clip {index + 1} • {clip.duration}s</span>
        <button
          onClick={() => onPreview(clip)}
          className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        >
          Preview
        </button>
      </div>
      <p className="text-slate-100 text-sm leading-relaxed line-clamp-4">{clip.text}</p>
    </div>
  )
}
