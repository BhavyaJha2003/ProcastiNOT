import { useState } from 'react'
import { generateActionPlan } from '../utils/gemini'
import ActionPlan from './ActionPlan'

const urgencyColors = {
  Low: '#4caf50',
  Medium: '#ff9800',
  High: '#ff5722',
  Critical: '#e91e63'
}

export default function TaskCard({ task, onUpdateTask, onDeleteTask }) {
  const [expanded, setExpanded] = useState(false)
  const [actionPlan, setActionPlan] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(false)

  const urgencyColor = urgencyColors[task.analysis?.urgencyLevel] || '#6c63ff'

  const toggleSubtask = (id) => {
    const updatedSubtasks = task.subtasks.map(s =>
      s.id === id ? { ...s, done: !s.done } : s
    )
    onUpdateTask({ ...task, subtasks: updatedSubtasks })
  }

  const completedCount = task.subtasks?.filter(s => s.done).length || 0
  const totalCount = task.subtasks?.length || 0
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleActionPlan = async () => {
    if (actionPlan) {
      setActionPlan(null)
      return
    }
    setLoadingPlan(true)
    try {
      const plan = await generateActionPlan(task)
      setActionPlan(plan)
    } catch {
      alert('Could not generate action plan. Try again in a moment.')
    } finally {
      setLoadingPlan(false)
    }
  }

  const daysLeft = Math.ceil(
    (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <div style={styles.topRow}>
            <span
              style={{
                ...styles.urgencyBadge,
                background: urgencyColor + '22',
                color: urgencyColor,
                border: `1px solid ${urgencyColor}`
              }}
            >
              {task.analysis?.urgencyLevel || 'Analyzing...'}
            </span>
            <span style={styles.score}>
              ⚡ {task.analysis?.priorityScore}/10
            </span>
          </div>
          <h3 style={styles.taskName}>{task.name}</h3>
          <p style={styles.deadline}>
            📅 {task.deadline} &nbsp;·&nbsp;
            <span style={{ color: daysLeft <= 2 ? '#ff6584' : '#aaa' }}>
              {daysLeft <= 0 ? '⚠️ Overdue!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </span>
          </p>
        </div>
        <button style={styles.deleteBtn} onClick={() => onDeleteTask(task.id)}>✕</button>
      </div>

      {/* Reasoning */}
      {task.analysis?.reasoning && (
        <p style={styles.reasoning}>💡 {task.analysis.reasoning}</p>
      )}

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>
            <span>Progress</span>
            <span>{completedCount}/{totalCount} subtasks</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Toggle Subtasks */}
      <button style={styles.toggleBtn} onClick={() => setExpanded(!expanded)}>
        {expanded ? '▲ Hide Subtasks' : '▼ Show Subtasks'}
      </button>

      {/* Subtasks */}
      {expanded && (
        <div style={styles.subtasks}>
          {task.subtasks?.map(subtask => (
            <div key={subtask.id} style={styles.subtask}>
              <input
                type="checkbox"
                checked={subtask.done}
                onChange={() => toggleSubtask(subtask.id)}
                style={styles.checkbox}
              />
              <span style={{
                ...styles.subtaskTitle,
                textDecoration: subtask.done ? 'line-through' : 'none',
                color: subtask.done ? '#555' : '#ddd'
              }}>
                {subtask.title}
              </span>
              <span style={styles.subtaskTime}>⏱ {subtask.estimatedMinutes}m</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Plan Button */}
      <button
        style={styles.actionBtn}
        onClick={handleActionPlan}
        disabled={loadingPlan}
      >
        {loadingPlan ? '🤖 Generating...' : actionPlan ? '✕ Hide Plan' : '🎯 Get Action Plan'}
      </button>

      {/* Action Plan */}
      {actionPlan && <ActionPlan plan={actionPlan} />}
    </div>
  )
}

const styles = {
  card: {
    background: '#1a1a2e',
    borderRadius: '14px',
    padding: '20px',
    border: '1px solid #2a2a4a',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  header: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  topRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '6px'
  },
  urgencyBadge: {
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px'
  },
  score: {
    fontSize: '0.8rem',
    color: '#6c63ff',
    fontWeight: '600'
  },
  taskName: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '4px'
  },
  deadline: {
    fontSize: '0.82rem',
    color: '#aaa'
  },
  deleteBtn: {
    background: '#2a2a4a',
    color: '#888',
    border: 'none',
    borderRadius: '6px',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    flexShrink: 0
  },
  reasoning: {
    fontSize: '0.85rem',
    color: '#aaa',
    background: '#0f0f1a',
    padding: '10px 14px',
    borderRadius: '8px',
    lineHeight: '1.5'
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#888'
  },
  progressBar: {
    background: '#0f0f1a',
    borderRadius: '10px',
    height: '6px',
    overflow: 'hidden'
  },
  progressFill: {
    background: 'linear-gradient(90deg, #6c63ff, #ff6584)',
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.4s ease'
  },
  toggleBtn: {
    background: 'transparent',
    color: '#6c63ff',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '0'
  },
  subtasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  subtask: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#0f0f1a',
    padding: '8px 12px',
    borderRadius: '8px'
  },
  checkbox: {
    accentColor: '#6c63ff',
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  subtaskTitle: {
    fontSize: '0.88rem',
    flex: 1
  },
  subtaskTime: {
    fontSize: '0.78rem',
    color: '#666'
  },
  actionBtn: {
    background: 'linear-gradient(135deg, #6c63ff22, #ff658422)',
    color: '#6c63ff',
    border: '1px solid #6c63ff',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  }
}