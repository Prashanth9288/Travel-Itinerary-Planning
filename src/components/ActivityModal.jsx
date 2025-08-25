
import { useState } from 'react'

export default function ActivityModal({ open, onClose, onSave }){
  const [title, setTitle] = useState('')
  const [type, setType] = useState('Activity')
  const [priority, setPriority] = useState('Medium')
  const [start, setStart] = useState('')
  const [duration, setDuration] = useState('2h')
  const [location, setLocation] = useState('')
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')

  if(!open) return null

  function submit(e){
    e.preventDefault()
    onSave({ id: crypto.randomUUID(), title, type, priority, start, duration, location, cost, notes })
    onClose()
    setTitle(''); setLocation(''); setCost(''); setNotes('')
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <form className="bg-white w-full max-w-lg rounded-2xl p-4 space-y-3" onSubmit={submit}>
        <div className="text-lg font-semibold">Add New Activity</div>
        <input className="w-full border rounded-xl px-3 py-2" placeholder="e.g., Visit Louvre Museum" value={title} onChange={e=>setTitle(e.target.value)} required />
        <div className="grid grid-cols-2 gap-2">
          <select className="border rounded-xl px-3 py-2" value={type} onChange={e=>setType(e.target.value)}>
            <option>Activity</option><option>Flight</option><option>Hotel</option><option>Transport</option>
          </select>
          <select className="border rounded-xl px-3 py-2" value={priority} onChange={e=>setPriority(e.target.value)}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded-xl px-3 py-2" type="time" value={start} onChange={e=>setStart(e.target.value)} />
          <select className="border rounded-xl px-3 py-2" value={duration} onChange={e=>setDuration(e.target.value)}>
            <option>30m</option><option>1h</option><option>2h</option><option>3h</option><option>4h</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input className="border rounded-xl px-3 py-2" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
          <input className="border rounded-xl px-3 py-2" placeholder="Cost ($)" value={cost} onChange={e=>setCost(e.target.value)} />
        </div>
        <textarea className="w-full border rounded-xl px-3 py-2 min-h-[80px]" placeholder="Notes..." value={notes} onChange={e=>setNotes(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn">Cancel</button>
          <button className="btn btn-primary">Add Activity</button>
        </div>
      </form>
    </div>
  )
}
