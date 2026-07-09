import { useState } from 'react'
import { generateSchedule } from '../utils/gemini'

export default function AISchedule({ tasks, theme }) {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hoursPerDay, setHoursPerDay] = useState(4)

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  const handleGenerate = async () => {
    if (tasks.length === 0) {
      alert('Add at least one task first!')
      return
    }
    setLoading(true)
    try {
      const result = await generateSchedule(tasks, hoursPerDay)
      setSchedule(result)
    } catch {
      alert('Could not generate schedule. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Controls */}
      <div style={{
        background: t.card,
        borderRadius: '14px',
        padding: '20px',
        border: `1px solid ${t.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', color: t.subtext, fontWeight: '500' }}>
            Available hours per day
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[2, 3, 4, 5, 6, 8].map(h => (
              <button
                key={h}
                style={{
                  background: hoursPerDay === h ? t.accent1 : t.input,
                  color: hoursPerDay === h ? '#fff' : t.subtext,
                  border: `1px solid ${hoursPerDay === h ? t.accent1 : t.border}`,
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontWeight: hoursPerDay === h ? '700' : '400'
                }}
                onClick={() => setHoursPerDay(h)}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        <button
          style={{
            background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`,
            color: '#fff',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            border: 'none',
            opacity: loading ? 0.7 : 1
          }}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '🤖 Building your schedule...' : '✨ Generate AI Schedule'}
        </button>
      </div>

      {/* Empty State */}
      {!schedule && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          background: t.card,
          borderRadius: '14px',
          border: `1px dashed ${t.border}`
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>📅</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '700', color: t.text, marginBottom: '8px' }}>
            No schedule yet
          </p>
          <p style={{ fontSize: '0.88rem', color: t.subtext }}>
            Set your daily hours and click Generate to let AI plan your week.
          </p>
        </div>
      )}

      {/* Schedule List */}
      {schedule && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {schedule.map((day, i) => (
            <div key={i} style={{
              background: t.card,
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid ${t.border}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: t.accent1 }}>
                  {day.day}
                </span>
                <span style={{ fontSize: '0.8rem', color: t.subtext }}>
                  {day.date}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {day.tasks.map((task, j) => (
                  <div key={j} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    background: t.input,
                    padding: '10px 12px',
                    borderRadius: '8px',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: '600', color: t.text }}>
                        {task.taskName}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: t.subtext }}>
                        {task.action}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: t.accent1, flexShrink: 0 }}>
                      ⏱ {task.minutes}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}