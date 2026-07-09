import { useState } from 'react'
import { generateActionPlan } from '../utils/gemini'
import ActionPlan from './ActionPlan'
import PomodoroTimer from './PomodoroTimer'

const urgencyColors = {
  Low: '#4caf50',
  Medium: '#ff9800',
  High: '#ff5722',
  Critical: '#e91e63'
}

export default function TaskCard({ task, onUpdateTask, onDeleteTask, theme }) {
  const [expanded, setExpanded] = useState(false)
  const [actionPlan, setActionPlan] = useState(null)
  const [loadingPlan, setLoadingPlan] = useState(false)

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  const urgencyColor = urgencyColors[task.analysis?.urgencyLevel] || t.accent1

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
    <div style={{
      background: t.card,
      borderRadius: '14px',
      padding: '20px',
      border: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '20px',
              background: urgencyColor + '22',
              color: urgencyColor,
              border: `1px solid ${urgencyColor}`
            }}>
              {task.analysis?.urgencyLevel || 'Analyzing...'}
            </span>
            <span style={{ fontSize: '0.8rem', color: t.accent1, fontWeight: '600' }}>
              ⚡ {task.analysis?.priorityScore}/10
            </span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: t.text, marginBottom: '4px' }}>
            {task.name}
          </h3>
          <p style={{ fontSize: '0.82rem', color: t.subtext }}>
            📅 {task.deadline} &nbsp;·&nbsp;
            <span style={{ color: daysLeft <= 2 ? t.accent2 : t.subtext }}>
              {daysLeft <= 0 ? '⚠️ Overdue!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </span>
          </p>
        </div>
        <button
          style={{
            background: t.border,
            color: t.subtext,
            border: 'none',
            borderRadius: '6px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            flexShrink: 0
          }}
          onClick={() => onDeleteTask(task.id)}
        >✕</button>
      </div>

      {/* Reasoning */}
      {task.analysis?.reasoning && (
        <p style={{
          fontSize: '0.85rem',
          color: t.subtext,
          background: t.input,
          padding: '10px 14px',
          borderRadius: '8px',
          lineHeight: '1.5'
        }}>
          💡 {task.analysis.reasoning}
        </p>
      )}

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: t.subtext }}>
            <span>Progress</span>
            <span>{completedCount}/{totalCount} subtasks</span>
          </div>
          <div style={{ background: t.input, borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              background: `linear-gradient(90deg, ${t.accent1}, ${t.accent2})`,
              height: '100%',
              borderRadius: '10px',
              width: `${progress}%`,
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      )}

      {/* Toggle Subtasks */}
      <button
        style={{
          background: 'transparent',
          color: t.accent1,
          fontSize: '0.82rem',
          fontWeight: '600',
          cursor: 'pointer',
          textAlign: 'left',
          padding: '0',
          border: 'none'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▲ Hide Subtasks' : '▼ Show Subtasks'}
      </button>

      {/* Subtasks */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {task.subtasks?.map(subtask => (
            <div key={subtask.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: t.input,
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              <input
                type="checkbox"
                checked={subtask.done}
                onChange={() => toggleSubtask(subtask.id)}
                style={{ accentColor: t.accent1, width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span style={{
                fontSize: '0.88rem',
                flex: 1,
                textDecoration: subtask.done ? 'line-through' : 'none',
                color: subtask.done ? t.subtext : t.text
              }}>
                {subtask.title}
              </span>
              <span style={{ fontSize: '0.78rem', color: t.subtext }}>
                ⏱ {subtask.estimatedMinutes}m
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Plan Button */}
      <button
        style={{
          background: t.accent1 + '22',
          color: t.accent1,
          border: `1px solid ${t.accent1}`,
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
        onClick={handleActionPlan}
        disabled={loadingPlan}
      >
        {loadingPlan ? '🤖 Generating...' : actionPlan ? '✕ Hide Plan' : '🎯 Get Action Plan'}
      </button>

      {/* Action Plan */}
      {actionPlan && <ActionPlan plan={actionPlan} theme={t} />}

      {/* Pomodoro Timer */}
      <PomodoroTimer taskName={task.name} theme={t} />
    </div>
  )
}