import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export default function ProductivityScore({ tasks, theme }) {
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  const generateScore = async () => {
    if (tasks.length === 0) {
      alert('Add some tasks first!')
      return
    }
    setLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const completedSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks?.filter(s => s.done).length || 0), 0)
      const totalSubtasks = tasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0)
      const overdueTasks = tasks.filter(t => new Date(t.deadline) < new Date()).length

      const prompt = `
        You are a productivity coach. Rate this user's productivity.
        Return ONLY a JSON object (no markdown):
        {
          "score": <number 0-100>,
          "grade": "<A+ | A | B | C | D>",
          "summary": "<one encouraging sentence>",
          "strengths": ["<strength 1>", "<strength 2>"],
          "improvements": ["<improvement 1>", "<improvement 2>"]
        }
        User stats:
        - Total tasks: ${tasks.length}
        - Overdue tasks: ${overdueTasks}
        - Completed subtasks: ${completedSubtasks}/${totalSubtasks}
        - Critical tasks: ${tasks.filter(t => t.analysis?.urgencyLevel === 'Critical').length}
        - Today: ${new Date().toDateString()}
      `
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const data = JSON.parse(text.replace(/```json|```/g, '').trim())
      setScore(data.score)
      setFeedback(data)
    } catch {
      alert('Could not generate score. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (s) => {
    if (s >= 80) return '#4caf50'
    if (s >= 60) return '#ff9800'
    if (s >= 40) return '#ff5722'
    return '#e91e63'
  }

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
      <span style={{ fontSize: '1rem', fontWeight: '700', color: t.text }}>
        📊 Productivity Score
      </span>

      {!feedback ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 0' }}>
          <p style={{ color: t.subtext, fontSize: '0.88rem' }}>
            Get your AI productivity rating
          </p>
          <button
            style={{
              background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
            onClick={generateScore}
            disabled={loading}
          >
            {loading ? '🤖 Analyzing...' : '✨ Generate My Score'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>

          {/* Score Circle */}
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg width="100" height="100">
              <circle cx="50" cy="50" r="42" fill="none" stroke={t.border} strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={getScoreColor(score)}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
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
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: getScoreColor(score) }}>
                {score}
              </span>
              <span style={{ fontSize: '0.75rem', color: t.subtext }}>
                {feedback.grade}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: t.subtext, textAlign: 'center', lineHeight: '1.5' }}>
            {feedback.summary}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '700', color: t.text, marginBottom: '6px' }}>
                💪 Strengths
              </p>
              {feedback.strengths.map((s, i) => (
                <p key={i} style={{ fontSize: '0.82rem', color: t.subtext, marginBottom: '4px', lineHeight: '1.4' }}>
                  ✅ {s}
                </p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '700', color: t.text, marginBottom: '6px' }}>
                🎯 Improve
              </p>
              {feedback.improvements.map((s, i) => (
                <p key={i} style={{ fontSize: '0.82rem', color: t.subtext, marginBottom: '4px', lineHeight: '1.4' }}>
                  📌 {s}
                </p>
              ))}
            </div>
          </div>

          <button
            style={{
              background: t.border,
              color: t.subtext,
              border: 'none',
              borderRadius: '8px',
              padding: '6px 16px',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
            onClick={() => { setScore(null); setFeedback(null) }}
          >
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  )
}