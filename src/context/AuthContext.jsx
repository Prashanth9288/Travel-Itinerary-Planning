import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password)

  // ✅ logout now redirects to home page
  const logout = async () => {
    await signOut(auth)
    setUser(null)
    navigate("/")  
  }

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
