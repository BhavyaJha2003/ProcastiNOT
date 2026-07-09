import { useState } from 'react'
import TaskCard from './TaskCard'
import AISchedule from './AISchedule'

export default function Dashboard({ tasks, onUpdateTask, onDeleteTask, defaultTab, hideTabs, theme }) {
  const [activeTab, setActiveTab] = useState(defaultTab || 'tasks')

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const scoreA = a.analysis?.priorityScore || 0
    const scoreB = b.analysis?.priorityScore || 0
    return scoreB - scoreA
  })

  const criticalCount = tasks.filter(t => t.analysis?.urgencyLevel === 'Critical').length
  const highCount = tasks.filter(t => t.analysis?.urgencyLevel === 'High').length
  const doneCount = tasks.filter(t => {
    const total = t.subtasks?.length || 0
    const done = t.subtasks?.filter(s => s.done).length || 0
    return total > 0 && done === total
  }).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Tasks', value: tasks.length, color: t.accent1 },
          { label: 'Critical', value: criticalCount, color: '#e91e63' },
          { label: 'High', value: highCount, color: '#ff5722' },
          { label: 'Completed', value: doneCount, color: '#4caf50' }
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: t.card,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
            border: `1px solid ${t.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color }}>{value}</span>
            <span style={{ fontSize: '0.75rem', color: t.subtext }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      {!hideTabs && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              background: activeTab === 'tasks'
                ? `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`
                : t.card,
              color: activeTab === 'tasks' ? '#fff' : t.subtext,
              border: activeTab === 'tasks' ? 'none' : `1px solid ${t.border}`,
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('tasks')}
          >
            📋 My Tasks
          </button>
          <button
            style={{
              background: activeTab === 'schedule'
                ? `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`
                : t.card,
              color: activeTab === 'schedule' ? '#fff' : t.subtext,
              border: activeTab === 'schedule' ? 'none' : `1px solid ${t.border}`,
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('schedule')}
          >
            📅 AI Schedule
          </button>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          maxHeight: '70vh',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {sortedTasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: t.card,
              borderRadius: '14px',
              border: `1px dashed ${t.border}`
            }}>
              <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: t.text, marginBottom: '8px' }}>
                No tasks yet!
              </p>
              <p style={{ fontSize: '0.88rem', color: t.subtext }}>
                Add a task on the left and let AI prioritize it for you.
              </p>
            </div>
          ) : (
            sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                theme={t}
              />
            ))
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <AISchedule tasks={tasks} theme={t} />
      )}
    </div>
  )
}