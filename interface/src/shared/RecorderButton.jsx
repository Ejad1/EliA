import React, { useEffect, useRef, useState } from 'react'

export default function RecorderButton({ onSend }) {
  const [rec, setRec] = useState(false)
  const [supported, setSupported] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && window.MediaRecorder) {
      setSupported(true)
    }
  }, [])

  async function start() {
    if (!supported) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => chunksRef.current.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onSend(blob)
        // stop tracks
        stream.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      setRec(true)
    } catch (e) {
      console.error('Microphone error', e)
    }
  }

  function stop() {
    const mr = mediaRef.current
    if (mr && mr.state !== 'inactive') mr.stop()
    setRec(false)
  }

  return (
    <button className={`recorder ${rec ? 'recording' : ''}`} type="button" onClick={() => (rec ? stop() : start())} title="Enregistrer audio">
      {rec ? '⏹️' : '🎤'}
    </button>
  )
}
