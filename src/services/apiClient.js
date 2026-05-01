import { fetchAuthSession } from 'aws-amplify/auth'

const API_URL = import.meta.env.VITE_API_URL

async function getAccessToken({ forceRefresh = false } = {}) {
  try {
    const session = await fetchAuthSession({ forceRefresh })
    return session.tokens?.accessToken?.toString() || null
  } catch {
    return null
  }
}

export async function apiFetch(path, options = {}) {
  const token = await getAccessToken()
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status !== 401) {
    return response
  }

  const refreshedToken = await getAccessToken({ forceRefresh: true })
  if (!refreshedToken || refreshedToken === token) {
    return response
  }

  headers.set('Authorization', `Bearer ${refreshedToken}`)
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })
}
