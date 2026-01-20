import { useEffect, useState } from 'react'

type UUID = string
interface FormSession {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  data: Record<string, any> // { 'english-name': 'Dao De Jing', ... }
  action_text: 'edit' | 'create' | undefined
  textId: UUID | undefined
  authorId: UUID | undefined
  action_author: 'edit' | 'create' | undefined
  region: string | undefined
  // step: number
}

const SESSIONS_KEY = 'form-sessions' // localStorage key

export function useFormSessions() {
  const [sessions, setSessions] = useState<FormSession[]>([])
  const [sessionsLoaded, setSessionsLoaded] = useState(false)

  // 1. Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SESSIONS_KEY)
    if (stored) {
      setSessions(JSON.parse(stored))
    }
    setSessionsLoaded(true)
  }, [])

  // 2. Save to localStorage whenever sessions change (only after initial load)
  useEffect(() => {
    if (sessionsLoaded) {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
      // console.log('all sessions:', sessions)
    }
  }, [sessions, sessionsLoaded])

  // 3. Functions to manipulate sessions
  const createSession = (initialData = {}) => {
    const id = crypto.randomUUID() // generates unique ID
    const now = new Date().toISOString()

    const session: FormSession = {
      id,
      name: `Session ${sessions.length + 1}`,
      createdAt: now,
      updatedAt: now,
      data: initialData,
      action_text: undefined,
      textId: undefined,
      authorId: undefined,
      action_author: undefined,
      region: undefined,
      // step: 1
    }

    setSessions((prev) => [...prev, session])
    return id // return ID so caller can navigate to it
  }

  const updateSessionData = (id: string, newData: Record<string, any>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              data: { ...session.data, ...newData },
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    )
  }

  const updateSession = (id: string, updates: Partial<FormSession>) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    )
  }

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }

  const getSession = (id: string) => {
    return sessions.find((session) => session.id === id)
  }

  const clearSessionData = (id: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              data: {},
              action_text: undefined,
              textId: undefined,
              authorId: undefined,
              region: undefined,
              action_author: undefined,
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    )
  }

  return {
    sessions,
    sessionsLoaded,
    createSession,
    updateSession,
    updateSessionData,
    clearSessionData, // Add to return object
    deleteSession,
    getSession,
  }
}
