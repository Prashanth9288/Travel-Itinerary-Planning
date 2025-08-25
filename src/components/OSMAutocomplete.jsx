
import { useEffect, useRef, useState } from 'react'

export default function OSMAutocomplete({ value, onSelect, placeholder='Search a place...' }) {
  const [q, setQ] = useState(value?.name || '')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onClick(e){
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // fetch Nominatim
  useEffect(() => {
    if (!q || q.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&q=${encodeURIComponent(q)}`, {
          headers: { 'Accept': 'application/json' }
        })
        const data = await res.json()
        const items = (data||[]).map(d => ({
          name: d.display_name,
          lat: parseFloat(d.lat),
          lng: parseFloat(d.lon)
        }))
        setResults(items)
        setOpen(true)
      } catch (e) {
        console.error('nominatim error', e)
      }
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="relative" ref={containerRef}>
      <input
        className="w-full border rounded-2xl px-4 py-3 outline-none"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={placeholder}
        onFocus={() => q.length>=2 && setOpen(true)}
      />
      {open && results.length>0 && (
        <div className="absolute z-20 top-full left-0 right-0 bg-white border rounded-xl shadow max-h-72 overflow-auto">
          {results.map((r, idx) => (
            <button
              key={idx}
              type="button"
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              onMouseDown={(e)=> e.preventDefault()}
              onClick={()=> { onSelect(r); setQ(r.name); setOpen(false); }}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
