
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState } from 'react'
import { listTripsByUser } from '../services/trips.js'

export default function Profile(){
  const { user } = useAuth()
  const [trips, setTrips] = useState([])
  useEffect(()=>{
    async function load(){ 
      try{ const data = await listTripsByUser(user.uid); setTrips(data) }catch(e){}
    }
    load()
  }, [user])
  const spent = trips.length * 1200
  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        <div>
          <h2 className="text-xl font-bold">{user?.email || 'Traveler'}</h2>
          <p className="text-gray-600 text-sm">Enthusiastic explorer. Planning the next adventure.</p>
        </div>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="card text-center"><div className="text-2xl font-bold">{trips.length}</div><div className="text-gray-600 text-sm">Trips</div></div>
        <div className="card text-center"><div className="text-2xl font-bold">{Math.max(1,trips.length)}</div><div className="text-gray-600 text-sm">Countries</div></div>
        <div className="card text-center"><div className="text-2xl font-bold">${spent.toLocaleString()}</div><div className="text-gray-600 text-sm">Est. Spent</div></div>
        <div className="card text-center"><div className="text-2xl font-bold">24</div><div className="text-gray-600 text-sm">Collaborations</div></div>
      </section>
      <section className="card">
        <h3 className="font-semibold mb-3">Recent Trips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trips.map(t => (
            <div key={t.id} className="border rounded-xl p-3">
              <div className="font-semibold">{t.title || t.destination?.name || 'Untitled Trip'}</div>
              <div className="text-gray-600 text-sm">{t.destination?.name}</div>
              <div className="text-xs text-gray-500 mt-1">{t.startDate} → {t.endDate}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
