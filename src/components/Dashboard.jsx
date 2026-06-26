import { useState } from 'react'
import TaskCard from './TaskCard'
import AISchedule from './AISchedule'

export default function Dashboard({ tasks, onUpdateTask, onDeleteTask }) {
  const [activeTab, setActiveTab] = useState('tasks')

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
    <div style={styles.container}>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statNumber}>{tasks.length}</span>
          <span style={styles.statLabel}>Total Tasks</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNumber, color: '#e91e63' }}>{criticalCount}</span>
          <span style={styles.statLabel}>Critical</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNumber, color: '#ff5722' }}>{highCount}</span>
          <span style={styles.statLabel}>High</span>
        </div>
        <div style={styles.stat}>
          <span style={{ ...styles.statNumber, color: '#4caf50' }}>{doneCount}</span>
          <span style={styles.statLabel}>Completed</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'tasks' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('tasks')}
        >
          📋 My Tasks
        </button>
        <button
          style={activeTab === 'schedule' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('schedule')}
        >
          📅 AI Schedule
        </button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={styles.taskList}>
          {sortedTasks.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>🎯</p>
              <p style={styles.emptyText}>No tasks yet!</p>
              <p style={styles.emptySubtext}>Add a task on the left and let AI prioritize it for you.</p>
            </div>
          ) : (
            sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))
          )}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <AISchedule tasks={tasks} />
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
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  stat: {
    background: '#1a1a2e',
    borderRadius: '12px',
    padding: '14px',
    textAlign: 'center',
    border: '1px solid #2a2a4a',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statNumber: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#6c63ff'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#888'
  },
  tabs: {
    display: 'flex',
    gap: '8px'
  },
  tab: {
    background: '#1a1a2e',
    color: '#888',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  activeTab: {
    background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxHeight: '70vh',
    overflowY: 'auto',
    paddingRight: '4px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
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
  }
}