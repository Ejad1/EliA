import React, { useState } from 'react'

export default function Sidebar({ user, conversations, onCreate, onSelect, onDelete, onRename, onSignOut }) {
  const [open, setOpen] = useState(true)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light')

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next === 'dark' ? 'dark' : '')
  }

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      {/* floating toggle when collapsed so it's always reachable */}
      {!open && (
        <button
          className="sidebar-toggle-floating"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir la barre latérale"
          title="Ouvrir"
        >
          ☰
        </button>
      )}
      <div className="sidebar-top">
        <div className="user-box">
          <div className="avatar">{(user.firstName || 'U')[0].toUpperCase()}</div>
          <div className="user-info">
            <div className="name">{user.firstName} {user.lastName}</div>
            <div className="email">{user.email}</div>
          </div>
        </div>
        <div className="sidebar-controls">
          <button onClick={() => setOpen(!open)} className="icon-btn" aria-label="Toggle sidebar">{open ? '⟨' : '⟩'}</button>
          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">{theme === 'light' ? '🌙' : '☀️'}</button>
          <button onClick={onSignOut} className="icon-btn" aria-label="Sign out">⇦</button>
        </div>
      </div>

      <div className="sidebar-actions">
        <button className="btn-primary full" onClick={onCreate}>+ Nouvelle discussion</button>
      </div>

      <div className="convo-list">
        {conversations.length === 0 && <div className="empty">Aucune conversation</div>}
        {conversations.map((c) => (
          <ConvoItem key={c.id} convo={c} onSelect={() => onSelect(c.id)} onDelete={() => onDelete(c.id)} onRename={(t) => onRename(c.id, t)} />
        ))}
      </div>
    </aside>
  )
}

function ConvoItem({ convo, onSelect, onDelete, onRename }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(convo.title)

  function save() {
    onRename(title)
    setEditing(false)
    setMenuOpen(false)
  }

  return (
    <div className="convo-item">
      <div className="convo-main" onClick={onSelect}>
        <div className="convo-title">{convo.title}</div>
        <div className="convo-count">{convo.messages?.length || 0}</div>
      </div>
      <div className="convo-menu">
        <button className="dot" onClick={() => setMenuOpen((s) => !s)}>⋯</button>
        {menuOpen && (
          <div className="menu">
            {!editing ? (
              <>
                <button onClick={() => setEditing(true)}>Renommer</button>
                <button onClick={onDelete}>Supprimer</button>
              </>
            ) : (
              <div className="rename-row">
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <button onClick={save}>OK</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
