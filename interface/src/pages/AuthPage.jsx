import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveSession } from '../utils/session'

// This page implements Register and Login forms. Backend endpoints are placeholders.

function fakeServerRegister(payload) {
  // simulate server: return token and user object
  return new Promise((res) => {
    setTimeout(() => {
      const token = 'fake-token-' + Math.random().toString(36).slice(2)
      const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour
      res({ token, expiresAt, user: { firstName: payload.firstName, lastName: payload.lastName, email: payload.email } })
    }, 700)
  })
}

function fakeServerLogin(payload) {
  return new Promise((res) => {
    setTimeout(() => {
      const token = 'fake-token-' + Math.random().toString(36).slice(2)
      const expiresAt = Date.now() + 60 * 60 * 1000 // 1 hour
      res({ token, expiresAt, user: { firstName: 'Jean', lastName: 'Dupont', email: payload.email } })
    }, 500)
  })
}

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', gender: '', email: '', age: '', password: '' })
  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('AuthPage: handleRegister start', { mode: 'register', form })
      const resp = await fakeServerRegister(form)
      saveSession(resp.token, resp.user, resp.expiresAt)
      onAuth({ token: resp.token, expiresAt: resp.expiresAt, user: resp.user })
      // after successful registration navigate to chat
      navigate('/chat')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('AuthPage: handleLogin start', { mode: 'login', form })
      const resp = await fakeServerLogin(form)
      saveSession(resp.token, resp.user, resp.expiresAt)
      onAuth({ token: resp.token, expiresAt: resp.expiresAt, user: resp.user })
      // navigate to chat after login
      navigate('/chat')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>EliA — Connexion / Inscription</h2>
        <div className="tabs">
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Connexion</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Inscription</button>
        </div>

        <div className="form-stack">
          <form onSubmit={handleRegister} className={`auth-form panel ${mode === 'register' ? 'visible' : ''}`} aria-hidden={mode !== 'register'}>
            <div className="row">
              <input required placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              <input required placeholder="Prénom(s)" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="row">
              <select required value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Sexe</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
              <input required placeholder="Âge" type="number" min="1" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
            <input required placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required placeholder="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div className="actions">
              <button className="btn-primary" type="submit" disabled={loading}>{loading ? '...' : 'Créer un compte'}</button>
            </div>
          </form>

          <form onSubmit={handleLogin} className={`auth-form panel ${mode === 'login' ? 'visible' : ''}`} aria-hidden={mode !== 'login'}>
            <input required placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input required placeholder="Mot de passe" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div className="actions">
              <button className="btn-primary" type="submit" disabled={loading}>{loading ? '...' : 'Se connecter'}</button>
            </div>
          </form>
        </div>

        <div className="note">Les données utilisateurs doivent être stockées en base AWS (placeholder pour l'instant).</div>
      </div>
    </div>
  )
}
