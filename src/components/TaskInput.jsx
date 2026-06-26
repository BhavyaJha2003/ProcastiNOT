import { useState } from 'react'
import { analyzeTask, breakIntoSubtasks } from '../utils/gemini'

const initialForm = {
  name: '',
  deadline: '',
  priority: 'Medium',
  description: ''
}

export default function TaskInput({ onAddTask }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.deadline) {
      setError('Task name and deadline are required.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const [analysis, subtasks] = await Promise.all([
        analyzeTask(form),
        breakIntoSubtasks(form)
      ])

      const newTask = {
        id: Date.now(),
        ...form,
        analysis,
        subtasks,
        createdAt: new Date().toISOString()
      }

      onAddTask(newTask)
      setForm(initialForm)
    } catch (err) {
      setError('AI analysis failed. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Add New Task</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Task Name *</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="e.g. Submit project report"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Deadline *</label>
          <input
            style={styles.input}
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Priority</label>
          <select
            style={styles.input}
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description (optional)</label>
          <textarea
            style={{ ...styles.input, height: '80px', resize: 'vertical' }}
            name="description"
            placeholder="Add more context about this task..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="submit"
          style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
          disabled={loading}
        >
          {loading ? '🤖 AI is analyzing...' : '🚀 Add & Analyze Task'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    background: '#1a1a2e',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #2a2a4a',
    height: 'fit-content'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#fff'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.85rem',
    color: '#aaa',
    fontWeight: '500'
  },
  input: {
    background: '#0f0f1a',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '0.95rem',
    width: '100%'
  },
  button: {
    background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
    color: '#fff',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    marginTop: '8px',
    transition: 'opacity 0.2s'
  },
  error: {
    color: '#ff6584',
    fontSize: '0.85rem'
  }
}