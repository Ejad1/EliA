import React, { useEffect, useRef, useState } from 'react'
import RecorderButton from './RecorderButton'

export default function ChatWindow({ user, conversation, onSend, onReceive }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [sentAnim, setSentAnim] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [conversation])

  // Pulse the header when the assistant sends a new reply
  useEffect(() => {
    if (!conversation || !conversation.messages?.length) return
    const last = conversation.messages[conversation.messages.length - 1]
    if (last?.role === 'assistant') {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 900)
      return () => clearTimeout(t)
    }
  }, [conversation?.messages?.length])

  async function handleSend(e) {
    e?.preventDefault()
    const txt = input.trim()
    if (!txt) return
    setInput('')
    onSend(txt)
    // small send animation
    setSentAnim(true)
    setTimeout(() => setSentAnim(false), 480)
    setLoading(true)
    // placeholder for backend call: simulate assistant reply
    setTimeout(() => {
      onReceive('EliA (simulée): ' + txt)
      setLoading(false)
    }, 800)
  }

  async function handleAudioSend(blob) {
    // placeholder: send audio blob to backend for transcription and reply
    onSend('[Audio envoyé]')
    setTimeout(() => onReceive('EliA (simulée): transcription audio...'), 1000)
  }

  return (
    <div className="chat-window">
      <div className={`chat-top ${pulse ? 'pulse' : ''}`}>
        <span className="assistant-name">EliA — Assistant Biblique</span>
      </div>

      <div className="messages" ref={listRef}>
        {!conversation && <div className="no-convo">Sélectionnez ou créez une conversation.</div>}
        {conversation?.messages?.map((m, idx) => (
          <div key={idx} className={`msg ${m.role}`}>
            <div className="bubble">
              <div className="text">{m.text}</div>
              <div className="ts">{new Date(m.ts || Date.now()).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>

      <form className="composer" onSubmit={handleSend}>
        <input placeholder="Écrivez un message..." value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="controls">
          <input aria-hidden type="file" style={{ display: 'none' }} />
          <button type="button" title="Uploader un fichier" className="btn-ghost" disabled>📎</button>
          <RecorderButton onSend={handleAudioSend} />
          <button type="submit" className={`btn-primary send-btn ${sentAnim ? 'sent' : ''}`} disabled={loading}>{loading ? '...' : '🚀 Envoyer'}</button>
        </div>
      </form>
    </div>
  )
}
