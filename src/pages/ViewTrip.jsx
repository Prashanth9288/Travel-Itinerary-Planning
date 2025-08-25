
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { listenToTrip, updateTrip } from '../services/trips.js'
import MapView from '../components/MapView.jsx'
import ActivityModal from '../components/ActivityModal.jsx'
import SuggestedPlaces from '../components/SuggestedPlaces.jsx'

const WIKI_ENDPOINT = "https://en.wikipedia.org/w/api.php"

async function wikiGeoSearch(lat, lng){
  const url = `${WIKI_ENDPOINT}?action=query&list=geosearch&gscoord=${lat}%7C${lng}&gsradius=8000&gslimit=10&format=json&origin=*`
  const res = await fetch(url)
  if(!res.ok) throw new Error('GeoSearch failed')
  const json = await res.json()
  return (json.query?.geosearch || []).map(p => ({ pageid: p.pageid, title: p.title }))
}
async function wikiDetails(ids){
  if(!ids.length) return []
  const url = `${WIKI_ENDPOINT}?action=query&prop=pageimages|extracts&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=1200&pageids=${ids.join('|')}&format=json&origin=*`
  const res = await fetch(url)
  if(!res.ok) throw new Error('Details failed')
  const json = await res.json()
  const pages = Object.values(json.query?.pages || {})
  return pages.map(p => ({
    pageid: p.pageid,
    title: p.title,
    extract: p.extract || '',
    img: p.thumbnail?.source || null,
    url: `https://en.wikipedia.org/?curid=${p.pageid}`
  }))
}

const enrich = {
  "Paris": {
    special: "Romantic boulevards, art history, chic cafés",
    sights: "Eiffel Tower, Louvre, Notre‑Dame",
    food: "Croissants, crêpes, steak frites, macarons",
    buy: "French perfumes, vintage books along the Seine",
    budget: "Daily budget: $80–250 per person",
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400&auto=format&fit=crop"
    ]
  },
  "Rome": {
    special: "Ancient ruins + vibrant piazzas",
    sights: "Colosseum, Trevi Fountain, Vatican Museums",
    food: "Cacio e pepe, gelato, supplì",
    buy: "Leather goods from artisan shops",
    budget: "Daily budget: $70–220 per person",
    images: ["https://images.unsplash.com/photo-1549890762-0a3f8933bcf1?q=80&w=1400&auto=format&fit=crop"]
  },
  "Tokyo": {
    special: "Neon nights meets serene shrines",
    sights: "Senso‑ji, Meiji Shrine, Shibuya Crossing",
    food: "Sushi, ramen, okonomiyaki",
    buy: "Gachapon toys, matcha sweets, stationery",
    budget: "Daily budget: $90–260 per person",
    images: ["https://images.unsplash.com/photo-1526481280698-8fcc13fd0c88?q=80&w=1400&auto=format&fit=crop"]
  }
}

export default function ViewTrip(){
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [suggested, setSuggested] = useState([])

  useEffect(() => {
    const unsub = listenToTrip(id, setTrip)
    return () => unsub && unsub()
  }, [id])

  useEffect(() => {
    async function go(){
      if(!trip?.lat || !trip?.lng) return
      try {
        const pages = await wikiGeoSearch(trip.lat, trip.lng)
        const details = await wikiDetails(pages.slice(0,6).map(p=>p.pageid))
        const cityKey = (trip.destination?.name || '').split(',')[0]
        const meta = enrich[cityKey]
        const items = details.map((d, idx)=> ({
          ...d,
          img: d.img || meta?.images?.[0] || null,
          meta: idx===0 && meta ? meta : undefined,
          sources: [d.url, 'https://www.openstreetmap.org/', 'https://commons.wikimedia.org/']
        }))
        setSuggested(items)
      } catch(e){ console.error(e) }
    }
    go()
  }, [trip?.lat, trip?.lng])

  async function addActivity(a){
    const activities = Array.isArray(trip.activities) ? [...trip.activities, a] : [a]
    await updateTrip(id, { activities })
  }

  const header = useMemo(()=>{
    if(!trip) return null
    return (
      <div className="card flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{trip.startDate} → {trip.endDate} • {trip.budget} • {trip.traveler}</div>
          <h1 className="text-2xl font-bold">{trip.title || trip.destination?.name || 'Trip'}</h1>
          <div className="text-gray-600">{trip.destination?.name}</div>
        </div>
        <button className="btn btn-primary" onClick={()=>setOpenModal(true)}>+ Add Activity</button>
      </div>
    )
  }, [trip])

  if(!trip) return <main className="max-w-6xl mx-auto p-6">Loading...</main>

  return (
    <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        {header}
        <div className="card">
          <h3 className="font-semibold mb-2">Schedule</h3>
          {Array.isArray(trip.activities) && trip.activities.length>0 ? (
            <ul className="space-y-2">
              {trip.activities.map(a => (
                <li key={a.id} className="border rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-xs text-gray-600">{a.type} • {a.priority} • {a.start || '--:--'} • {a.duration}</div>
                    {a.location && <div className="text-xs text-gray-500">{a.location}</div>}
                  </div>
                  {a.cost && <div className="text-sm font-semibold">${a.cost}</div>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-600">No activities yet. Use “Add Activity”.</div>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Trip Map</h3>
          <MapView height={280} marker={[trip.lat, trip.lng]} />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Suggested Places</h3>
          <SuggestedPlaces items={suggested} />
        </div>
      </aside>

      <ActivityModal open={openModal} onClose={()=>setOpenModal(false)} onSave={addActivity} />
    </main>
  )
}
