import { getItem, setItem } from '../utils/localStorage'
import { useEffect, useState } from 'react'

export function usePersistedState(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    const item = getItem(key)
    return item || initialValue
  })

  useEffect(() => {
    setItem(key, value)
  }, [value])

  return [value, setValue]
}
