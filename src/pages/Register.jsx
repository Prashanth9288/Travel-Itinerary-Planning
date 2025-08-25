import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register(email, password)
      nav('/dashboard')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create account</h2>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-3">{error}</div>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded-xl px-4 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-xl px-4 py-2" placeholder="Password (min 6 chars)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full">Create account</button>
      </form>
      <p className="text-sm mt-3">Already registered? <Link className="underline" to="/login">Sign in</Link></p>
    </main>
  )
}
