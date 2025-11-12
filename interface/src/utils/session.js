const TOKEN_KEY = 'elia_token'
const USER_KEY = 'elia_user'

export function saveSession(token, user, expiresAt) {
  // token: opaque string, expiresAt: epoch ms
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expiresAt }))
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getSession() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const { token, expiresAt } = JSON.parse(raw)
    if (!token || !expiresAt) return null
    if (Date.now() > expiresAt) {
      // expired
      clearSession()
      return null
    }
    const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    return { token, expiresAt, user }
  } catch (e) {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
