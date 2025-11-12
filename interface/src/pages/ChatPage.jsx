import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../shared/Sidebar'
import ChatWindow from '../shared/ChatWindow'
import { getSession } from '../utils/session'

export default function ChatPage({ onSignOut }) {
  const session = getSession()
  const user = session?.user || { firstName: 'Invité', lastName: '' }

  // Conversations stored in localStorage per user
  const storageKey = useMemo(() => `elia_convos_${user.email || 'anon'}`, [user.email])
  const [conversations, setConversations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(conversations))
  }, [conversations, storageKey])

  const [activeId, setActiveId] = useState(() => (conversations[0] ? conversations[0].id : null))

  function createConversation() {
    const id = Date.now().toString()
    const c = { id, title: new Date().toLocaleString(), messages: [] }
    setConversations((s) => [c, ...s])
    setActiveId(id)
  }

  function deleteConversation(id) {
    setConversations((s) => s.filter((c) => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  function renameConversation(id, title) {
    setConversations((s) => s.map((c) => (c.id === id ? { ...c, title } : c)))
  }

  function appendMessageToActive(message) {
    if (!activeId) return
    setConversations((s) => s.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, message] } : c)))
  }

  const activeConversation = conversations.find((c) => c.id === activeId) || null

  return (
    <div className="chat-page">
      <Sidebar
        user={user}
        conversations={conversations}
        onCreate={createConversation}
        onSelect={(id) => setActiveId(id)}
        onDelete={deleteConversation}
        onRename={renameConversation}
        onSignOut={onSignOut}
      />

      <ChatWindow
        user={user}
        conversation={activeConversation}
        onSend={(txt) => appendMessageToActive({ role: 'user', text: txt, ts: Date.now() })}
        onReceive={(txt) => appendMessageToActive({ role: 'assistant', text: txt, ts: Date.now() })}
      />
    </div>
  )
}
