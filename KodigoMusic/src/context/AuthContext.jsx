import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthCtx = createContext()

const LS_KEY = 'km_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setUser(parsed)
      } catch {}
    }
  }, [])

  const login = (email, password) => {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) throw new Error('No existe usuario registrado. Por favor crea tu cuenta.')
    const { email: em, password: pw } = JSON.parse(raw)
    if (em === email && pw === password) {
      setUser({ email })
      return
    }
    throw new Error('Credenciales inválidas')
  }

  const register = (data) => {
    const toSave = {
      fullName: data.fullName,
      email: data.email,
      password: data.password // Nota: Proyecto educativo; no usar así en producción.
    }
    localStorage.setItem(LS_KEY, JSON.stringify(toSave))
    setUser({ email: data.email })
  }

  const logout = () => {
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
