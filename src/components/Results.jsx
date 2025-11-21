import ClipCard from './ClipCard'

export default function Results({ results, onPreview }) {
  if (!results) return null
  const { metadata, clips } = results
  return (
    <div className="space-y-6">
      {metadata && (
        <div className="flex items-center gap-4">
          {metadata.thumbnail_url && (
            <img src={metadata.thumbnail_url} alt="thumb" className="w-24 h-24 rounded-lg object-cover" />
          )}
          <div>
            <h3 className="text-white font-semibold">{metadata.title || 'Video'}</h3>
            {metadata.author_name && (
              <p className="text-slate-300 text-sm">by {metadata.author_name}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clips?.map((clip, i) => (
          <ClipCard key={`${clip.start}-${clip.end}-${i}`} clip={clip} index={i} onPreview={onPreview} />
        ))}
      </div>
    </div>
  )
}
