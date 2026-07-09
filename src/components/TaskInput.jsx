import { useState } from 'react'
import { analyzeTask, breakIntoSubtasks } from '../utils/gemini'

const initialForm = {
  name: '',
  deadline: '',
  priority: 'Medium',
  description: ''
}

export default function TaskInput({ onAddTask, theme }) {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

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

    const retry = async (fn, retries = 3, delay = 5000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await fn()
        } catch (err) {
          if (i < retries - 1) {
            await new Promise(res => setTimeout(res, delay))
          } else {
            throw err
          }
        }
      }
    }

    try {
      const [analysis, subtasks] = await Promise.all([
        retry(() => analyzeTask(form)),
        retry(() => breakIntoSubtasks(form))
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
      setError('AI analysis failed. Please wait 1 minute and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: t.card,
      borderRadius: '16px',
      padding: '24px',
      border: `1px solid ${t.border}`,
      height: 'fit-content'
    }}>
      <h2 style={{
        fontSize: '1.2rem',
        fontWeight: '700',
        marginBottom: '20px',
        color: t.text
      }}>➕ Add New Task</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: t.subtext, fontWeight: '500' }}>
            Task Name *
          </label>
          <input
            style={{
              background: t.input,
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: t.text,
              fontSize: '0.95rem',
              width: '100%'
            }}
            type="text"
            name="name"
            placeholder="e.g. Submit project report"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: t.subtext, fontWeight: '500' }}>
            Deadline *
          </label>
          <input
            style={{
              background: t.input,
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: t.text,
              fontSize: '0.95rem',
              width: '100%'
            }}
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: t.subtext, fontWeight: '500' }}>
            Priority
          </label>
          <select
            style={{
              background: t.input,
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: t.text,
              fontSize: '0.95rem',
              width: '100%'
            }}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: t.subtext, fontWeight: '500' }}>
            Description (optional)
          </label>
          <textarea
            style={{
              background: t.input,
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              padding: '10px 14px',
              color: t.text,
              fontSize: '0.95rem',
              width: '100%',
              height: '80px',
              resize: 'vertical'
            }}
            name="description"
            placeholder="Add more context about this task..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p style={{ color: t.accent2, fontSize: '0.85rem' }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`,
            color: '#fff',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '700',
            marginTop: '8px',
            border: 'none',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s'
          }}
          disabled={loading}
        >
          {loading ? '🤖 AI is analyzing...' : '🚀 Add & Analyze Task'}
        </button>
      </form>
    </div>
  )
}