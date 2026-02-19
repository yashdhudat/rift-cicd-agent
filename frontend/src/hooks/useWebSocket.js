import { useEffect, useRef, useCallback } from 'react'

export function useWebSocket(url, onMessage) {
  const ws = useRef(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    ws.current = new WebSocket(url)

    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        onMessageRef.current(data)
      } catch {
        onMessageRef.current({ type: 'log', msg: e.data })
      }
    }

    ws.current.onerror = () => console.error('WebSocket error')
    ws.current.onclose = () => console.log('WebSocket closed')
  }, [url])

  const send = useCallback((data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data))
    }
  }, [])

  const disconnect = useCallback(() => {
    ws.current?.close()
  }, [])

  useEffect(() => {
    return () => ws.current?.close()
  }, [])

  return { connect, send, disconnect }
}