import { useState } from 'react'
import OSMAutocomplete from '../components/OSMAutocomplete.jsx'
import MapView from '../components/MapView.jsx'
import { createTrip } from '../services/trips.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function CreateTrip() {
  const { user } = useAuth()
  const nav = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('Moderate')
  const [traveler, setTraveler] = useState('Just Me')
  const [destination, setDestination] = useState(null)
  const [marker, setMarker] = useState(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (!title || !startDate || !endDate) {
      alert('Please fill out Title, Start Date, and End Date.')
      return
    }
    if (!destination && !marker) {
      alert('Pick a destination via search or clicking on the map.')
      return
    }

    const dest = destination || { name: 'Custom location', lat: marker[0], lng: marker[1] }
    setSaving(true)
    try {
      const id = await createTrip({
        userId: user.uid,
        title,
        description,
        startDate,
        endDate,
        budget,
        traveler,
        destination: dest,
        name: dest.name,
        lat: dest.lat,
        lng: dest.lng,
      })
      nav(`/trip/${id}`)
    } catch (err) {
      console.error('Error saving trip:', err)
      alert('Could not save trip, try again.')
    } finally {
      setSaving(false)
    }
  }

  // Reusable OptionCard (Budget / Traveler selections)
  const OptionCard = ({ label, value, selected, onClick }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 px-5 py-3 rounded-2xl font-medium shadow-md transition-all border 
      ${selected 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 scale-105' 
        : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:shadow-lg'
      }`}
    >
      {label}
    </button>
  )

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        🌍 Plan Your Next Adventure
      </h2>

      <form 
        onSubmit={onSubmit} 
        className="grid md:grid-cols-2 gap-10 bg-white rounded-3xl shadow-xl p-8"
      >
        {/* LEFT FORM */}
        <div className="space-y-7">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">📌 Trip Title</label>
            <input
              className="w-full border rounded-2xl px-4 py-3 shadow focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Summer in Goa"
              required
            />
          </div>

          {/* Destination */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">🧩 Destination of Choice</h3>
            <div className="rounded-2xl shadow border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400">
              <OSMAutocomplete
                value={destination}
                onSelect={(d) => {
                  setDestination(d)
                  setMarker([d.lat, d.lng])
                }}
                placeholder="Type a city, landmark, or address"
              />
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">🏝️ Trip Dates</h3>
            <div className="grid grid-cols-2 gap-5">
              <label className="block text-sm font-medium text-gray-600">
                Start Date
                <input
                  type="date"
                  className="mt-2 w-full border rounded-2xl px-3 py-2 shadow focus:ring-2 focus:ring-blue-400 transition"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-gray-600">
                End Date
                <input
                  type="date"
                  className="mt-2 w-full border rounded-2xl px-3 py-2 shadow focus:ring-2 focus:ring-blue-400 transition"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  required
                />
              </label>
            </div>
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">💰 Budget</h3>
            <div className="flex gap-3">
              <OptionCard label="🪙 Cheap" value="Cheap" selected={budget === 'Cheap'} onClick={setBudget} />
              <OptionCard label="💵 Moderate" value="Moderate" selected={budget === 'Moderate'} onClick={setBudget} />
              <OptionCard label="✨ Luxury" value="Luxury" selected={budget === 'Luxury'} onClick={setBudget} />
            </div>
          </div>

          {/* Traveler */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">👥 Who's Going?</h3>
            <div className="grid grid-cols-2 gap-3">
              <OptionCard label="🚶‍♂️ Just Me" value="Just Me" selected={traveler === 'Just Me'} onClick={setTraveler} />
              <OptionCard label="💑 Couple" value="A Couple" selected={traveler === 'A Couple'} onClick={setTraveler} />
              <OptionCard label="👨‍👩‍👧‍👦 Family" value="Family" selected={traveler === 'Family'} onClick={setTraveler} />
              <OptionCard label="🎉 Friends" value="Friends" selected={traveler === 'Friends'} onClick={setTraveler} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">📝 Description</label>
            <textarea
              className="w-full border rounded-2xl px-4 py-3 shadow focus:ring-2 focus:ring-blue-500 transition min-h-[120px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What do you want to do?"
            />
          </div>

          {/* Save Button */}
          <button
            disabled={saving}
            className="w-full py-3 rounded-2xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition"
          >
            {saving ? '💾 Saving...' : '🚀 Save Trip'}
          </button>
        </div>

        {/* RIGHT - MAP */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <MapView height={420} marker={marker} onClickSetMarker={(p) => setMarker(p)} />
          </div>
          {marker && (
            <div className="text-sm text-gray-700 bg-gray-100 px-4 py-3 rounded-xl shadow border">
              📍 Selected: {marker[0].toFixed(5)}, {marker[1].toFixed(5)}
            </div>
          )}
        </div>
      </form>
    </main>
  )
}
