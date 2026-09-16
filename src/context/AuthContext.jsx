import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USER = {
  id: 'u1',
  name: 'Arjun Sharma',
  username: 'arjun_scholar',
  email: 'arjun@rivisonly.app',
  avatar: null,
  level: 14,
  title: 'Scholar',
  subjects: ['Organic Chemistry II', 'Linear Algebra', 'Cognitive Neuroscience', 'Macroeconomics'],
  eloRating: 1840,
  streak: 19,
  joinedAt: '2024-09-01',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const login = (email, password) => {
    // Mock login — always succeeds
    setUser(MOCK_USER)
    setShowLogin(false)
    return Promise.resolve(MOCK_USER)
  }

  const signup = (data) => {
    setUser({ ...MOCK_USER, name: data.name, email: data.email })
    setShowSignup(false)
    return Promise.resolve(MOCK_USER)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout,
      showLogin, setShowLogin,
      showSignup, setShowSignup,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
