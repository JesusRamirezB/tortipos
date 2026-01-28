import { useState, useCallback, useRef } from 'react'

let nextId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const removeToast = useCallback((id) => {
    clearTimeout(timersRef.current[id])
    delete timersRef.current[id]
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = ++nextId
      setToasts((prev) => [...prev, { id, message, type }])
      timersRef.current[id] = setTimeout(() => removeToast(id), 3000)
      return id
    },
    [removeToast],
  )

  return { toasts, showToast, removeToast }
}
