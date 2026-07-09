import { useState, useEffect, useRef } from 'react'

export default function PomodoroTimer({ taskName, theme }) {
  const [mode, setMode] = useState('work')
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef(null)

  const WORK_TIME = 25
  const BREAK_TIME = 5

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(m => {
              if (m === 0) {
                handleCycleEnd()
                return mode === 'work' ? BREAK_TIME : WORK_TIME
              }
              return m - 1
            })
            return 59
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const handleCycleEnd = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    if (mode === 'work') {
      setCycles(c => c + 1)
      setMode('break')
      setMinutes(BREAK_TIME)
      setSeconds(0)
      alert('✅ Pomodoro complete! Take a 5 min break.')
    } else {
      setMode('work')
      setMinutes(WORK_TIME)
      setSeconds(0)
      alert('💪 Break over! Back to work.')
    }
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode('work')
    setMinutes(WORK_TIME)
    setSeconds(0)
  }

  const progress = mode === 'work'
    ? ((WORK_TIME * 60 - (minutes * 60 + seconds)) / (WORK_TIME * 60)) * 100
    : ((BREAK_TIME * 60 - (minutes * 60 + seconds)) / (BREAK_TIME * 60)) * 100

  return (
    <div style={{
      background: t.input,
      borderRadius: '14px',
      padding: '16px',
      border: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: t.text }}>🍅 Pomodoro</span>
        <span style={{ fontSize: '0.82rem', color: t.accent2 }}>🔥 {cycles} cycles</span>
      </div>

      {/* Mode Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          style={{
            background: mode === 'work' ? t.accent1 : t.input,
            color: mode === 'work' ? '#fff' : t.subtext,
            border: `1px solid ${mode === 'work' ? t.accent1 : t.border}`,
            borderRadius: '8px',
            padding: '4px 14px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontWeight: mode === 'work' ? '700' : '400'
          }}
          onClick={() => { reset(); setMode('work') }}
        >Work</button>
        <button
          style={{
            background: mode === 'break' ? '#4caf50' : t.input,
            color: mode === 'break' ? '#fff' : t.subtext,
            border: `1px solid ${mode === 'break' ? '#4caf50' : t.border}`,
            borderRadius: '8px',
            padding: '4px 14px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontWeight: mode === 'break' ? '700' : '400'
          }}
          onClick={() => { reset(); setMode('break'); setMinutes(BREAK_TIME) }}
        >Break</button>
      </div>

      {/* Task Label */}
      {taskName && (
        <p style={{ fontSize: '0.78rem', color: t.subtext, textAlign: 'center' }}>
          📌 {taskName}
        </p>
      )}

      {/* Circle Timer */}
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg width="120" height="120" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="60" cy="60" r="54" fill="none" stroke={t.border} strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={mode === 'work' ? t.accent1 : '#4caf50'}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.4rem', fontWeight: '800', color: t.text }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.7rem', color: t.subtext }}>
            {mode === 'work' ? 'Focus' : 'Break'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          style={{
            background: t.border,
            color: t.subtext,
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={reset}
        >↺</button>
        <button
          style={{
            background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`,
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
          onClick={() => setRunning(r => !r)}
        >
          {running ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  )
}