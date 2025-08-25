
export default function SuggestedPlaces({ items=[] }){
  return (
    <div className="space-y-4">
      {items.map((p, i) => (
        <article key={i} className="border rounded-2xl overflow-hidden">
          {p.img && <img src={p.img} alt={p.title} className="w-full h-40 object-cover" />}
          <div className="p-3">
            <div className="font-semibold">{p.title}</div>
            {p.extract && <p className="text-sm text-gray-600 mt-1">{p.extract}</p>}
            {p.meta && (
              <ul className="text-sm mt-2 grid grid-cols-2 gap-2">
                {p.meta.special && <li><span className="font-medium">What's special:</span> {p.meta.special}</li>}
                {p.meta.food && <li><span className="font-medium">Food to try:</span> {p.meta.food}</li>}
                {p.meta.buy && <li><span className="font-medium">What to buy:</span> {p.meta.buy}</li>}
                {p.meta.sights && <li><span className="font-medium">Famous sights:</span> {p.meta.sights}</li>}
                {p.meta.budget && <li><span className="font-medium">Budget:</span> {p.meta.budget}</li>}
              </ul>
            )}
            {p.sources && p.sources.length>0 && (
              <div className="text-xs text-gray-500 mt-2">Sources: {p.sources.map((s,idx)=>(<a key={idx} href={s} target="_blank" rel="noreferrer" className="underline mr-2">[{idx+1}]</a>))}</div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
