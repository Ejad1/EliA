import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'
import { getSession, clearSession } from './utils/session'

export default function App() {
  const [session, setSession] = useState(() => getSession())
  const navigate = useNavigate()

  useEffect(() => {
    const s = getSession()
    if (!s) {
      navigate('/auth')
    } else {
      navigate('/chat')
    }
    setSession(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSignOut() {
    clearSession()
    setSession(null)
    navigate('/auth')
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage onAuth={(s) => setSession(s)} />} />
      <Route path="/chat/*" element={<ChatPage onSignOut={handleSignOut} />} />
      <Route path="/" element={<AuthPage onAuth={(s) => setSession(s)} />} />
    </Routes>
  )
}
