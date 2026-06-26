import { useState } from 'react'
import { generateSchedule } from '../utils/gemini'

export default function AISchedule({ tasks }) {
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hoursPerDay, setHoursPerDay] = useState(4)

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
    <div style={styles.container}>
      <div style={styles.controls}>
        <div style={styles.hoursControl}>
          <label style={styles.label}>Available hours per day</label>
          <div style={styles.hoursRow}>
            {[2, 3, 4, 5, 6, 8].map(h => (
              <button
                key={h}
                style={hoursPerDay === h ? styles.hourBtnActive : styles.hourBtn}
                onClick={() => setHoursPerDay(h)}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        <button
          style={loading ? { ...styles.generateBtn, opacity: 0.7 } : styles.generateBtn}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '🤖 Building your schedule...' : '✨ Generate AI Schedule'}
        </button>
      </div>

      {!schedule && !loading && (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📅</p>
          <p style={styles.emptyText}>No schedule yet</p>
          <p style={styles.emptySubtext}>
            Set your daily hours and click Generate to let AI plan your week.
          </p>
        </div>
      )}

      {schedule && (
        <div style={styles.scheduleList}>
          {schedule.map((day, i) => (
            <div key={i} style={styles.dayCard}>
              <div style={styles.dayHeader}>
                <span style={styles.dayName}>{day.day}</span>
                <span style={styles.dayDate}>{day.date}</span>
              </div>
              <div style={styles.dayTasks}>
                {day.tasks.map((t, j) => (
                  <div key={j} style={styles.dayTask}>
                    <div style={styles.dayTaskLeft}>
                      <span style={styles.dayTaskName}>{t.taskName}</span>
                      <span style={styles.dayTaskAction}>{t.action}</span>
                    </div>
                    <span style={styles.dayTaskTime}>⏱ {t.minutes}m</span>
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  controls: {
    background: '#1a1a2e',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #2a2a4a',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  hoursControl: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  label: {
    fontSize: '0.85rem',
    color: '#aaa',
    fontWeight: '500'
  },
  hoursRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  hourBtn: {
    background: '#0f0f1a',
    color: '#888',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '0.88rem',
    cursor: 'pointer'
  },
  hourBtnActive: {
    background: '#6c63ff',
    color: '#fff',
    border: '1px solid #6c63ff',
    borderRadius: '8px',
    padding: '6px 14px',
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontWeight: '700'
  },
  generateBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
    color: '#fff',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    border: 'none'
  },
  empty: {
    textAlign: 'center',
    padding: '50px 20px',
    background: '#1a1a2e',
    borderRadius: '14px',
    border: '1px dashed #2a2a4a'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px'
  },
  emptySubtext: {
    fontSize: '0.88rem',
    color: '#666'
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '60vh',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  dayCard: {
    background: '#1a1a2e',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #2a2a4a'
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  dayName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#6c63ff'
  },
  dayDate: {
    fontSize: '0.8rem',
    color: '#666'
  },
  dayTasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  dayTask: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: '#0f0f1a',
    padding: '10px 12px',
    borderRadius: '8px',
    gap: '12px'
  },
  dayTaskLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    flex: 1
  },
  dayTaskName: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#fff'
  },
  dayTaskAction: {
    fontSize: '0.8rem',
    color: '#888'
  },
  dayTaskTime: {
    fontSize: '0.78rem',
    color: '#6c63ff',
    flexShrink: 0
  }
}