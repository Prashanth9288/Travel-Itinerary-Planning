import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-3">{error}</div>}
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded-xl px-4 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-xl px-4 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
      <p className="text-sm mt-3">No account? <Link className="underline" to="/register">Register</Link></p>
    </main>
  )
}
