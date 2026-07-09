import { useState } from 'react'

const DEFAULT_HABITS = [
  { id: 1, name: 'Morning Planning', emoji: '📋' },
  { id: 2, name: 'No Social Media before 10am', emoji: '📵' },
  { id: 3, name: 'Deep Work Session', emoji: '🧠' },
  { id: 4, name: 'Exercise', emoji: '💪' },
  { id: 5, name: 'Review Tasks before Sleep', emoji: '🌙' }
]

const getTodayKey = () => new Date().toISOString().split('T')[0]

export default function HabitTracker({ theme }) {
  const [habits, setHabits] = useState(DEFAULT_HABITS)
  const [completions, setCompletions] = useState({})
  const [newHabit, setNewHabit] = useState('')
  const [streaks, setStreaks] = useState({})

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  const today = getTodayKey()

  const toggleHabit = (id) => {
    setCompletions(prev => {
      const todayCompletions = prev[today] || []
      const isDone = todayCompletions.includes(id)
      const updated = isDone
        ? todayCompletions.filter(h => h !== id)
        : [...todayCompletions, id]
      if (!isDone) {
        setStreaks(s => ({ ...s, [id]: (s[id] || 0) + 1 }))
      } else {
        setStreaks(s => ({ ...s, [id]: Math.max(0, (s[id] || 0) - 1) }))
      }
      return { ...prev, [today]: updated }
    })
  }

  const addHabit = () => {
    if (!newHabit.trim()) return
    setHabits(prev => [...prev, { id: Date.now(), name: newHabit.trim(), emoji: '⭐' }])
    setNewHabit('')
  }

  const deleteHabit = (id) => setHabits(prev => prev.filter(h => h.id !== id))

  const todayCompletions = completions[today] || []
  const completionRate = habits.length > 0
    ? Math.round((todayCompletions.length / habits.length) * 100)
    : 0

  return (
    <div style={{
      background: t.card,
      borderRadius: '16px',
      padding: '20px',
      border: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', fontWeight: '700', color: t.text }}>🔥 Habit Tracker</span>
        <span style={{ fontSize: '0.85rem', color: t.accent1, fontWeight: '700' }}>
          {completionRate}% today
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ background: t.input, borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
        <div style={{
          background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})`,
          height: '100%',
          borderRadius: '10px',
          width: `${completionRate}%`,
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Habits List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {habits.map(habit => {
          const isDone = todayCompletions.includes(habit.id)
          return (
            <div key={habit.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: t.input,
              padding: '10px 12px',
              borderRadius: '10px'
            }}>
              <button
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: isDone ? `2px solid ${t.accent1}` : `2px solid ${t.border}`,
                  background: isDone ? t.accent1 : 'transparent',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.8rem',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => toggleHabit(habit.id)}
              >
                {isDone ? '✓' : ''}
              </button>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{habit.emoji}</span>
              <span style={{
                fontSize: '0.88rem',
                flex: 1,
                textDecoration: isDone ? 'line-through' : 'none',
                color: isDone ? t.subtext : t.text
              }}>
                {habit.name}
              </span>
              {streaks[habit.id] > 0 && (
                <span style={{ fontSize: '0.78rem', color: t.accent2, fontWeight: '700', flexShrink: 0 }}>
                  🔥 {streaks[habit.id]}
                </span>
              )}
              <button
                style={{ background: 'transparent', color: t.subtext, border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                onClick={() => deleteHabit(habit.id)}
              >✕</button>
            </div>
          )
        })}
      </div>

      {/* Add Habit */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{
            flex: 1,
            background: t.input,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: t.text,
            fontSize: '0.88rem'
          }}
          placeholder="Add new habit..."
          value={newHabit}
          onChange={e => setNewHabit(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addHabit()}
        />
        <button
          style={{
            background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            width: '36px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            fontWeight: '700'
          }}
          onClick={addHabit}
        >+</button>
      </div>
    </div>
  )
}