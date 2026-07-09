import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export default function ChatAssistant({ tasks, theme }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '👋 Hi! I\'m your AI productivity coach. Ask me anything about your tasks, time management, or how to beat procrastination!'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const t = theme || {
    card: '#1a1a35',
    border: '#2a2a50',
    text: '#e8e8ff',
    subtext: '#8888bb',
    input: '#0d0d22',
    accent1: '#6c63ff',
    accent2: '#ff6584'
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const taskContext = tasks.length > 0
        ? `User's current tasks: ${tasks.map(t => `${t.name} (deadline: ${t.deadline}, priority: ${t.priority}, urgency: ${t.analysis?.urgencyLevel})`).join(', ')}`
        : 'User has no tasks yet.'

      const prompt = `
        You are a helpful AI productivity coach inside an app called ProcastiNOT.
        ${taskContext}
        Answer the user's question in a helpful, concise, and motivating way.
        Keep responses under 100 words. Use emojis sparingly.
        User: ${input}
      `

      const result = await model.generateContent(prompt)
      const text = result.response.text()
      setMessages(prev => [...prev, { role: 'assistant', text }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ I\'m having trouble connecting right now. Please try again in a moment.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      background: t.card,
      borderRadius: '16px',
      padding: '20px',
      border: `1px solid ${t.border}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      height: '420px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', fontWeight: '700', color: t.text }}>🤖 AI Coach</span>
        <span style={{ fontSize: '0.78rem', color: t.subtext }}>Ask me anything</span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        paddingRight: '4px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '8px',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start'
          }}>
            {msg.role === 'assistant' && <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🤖</span>}
            <p style={{
              background: t.input,
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              color: t.text,
              lineHeight: '1.5',
              maxWidth: '85%',
              margin: 0
            }}>
              {msg.text}
            </p>
            {msg.role === 'user' && <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>👤</span>}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem' }}>🤖</span>
            <p style={{
              background: t.input,
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.88rem',
              color: t.subtext,
              margin: 0
            }}>
              Thinking...
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{
            flex: 1,
            background: t.input,
            border: `1px solid ${t.border}`,
            borderRadius: '10px',
            padding: '10px 14px',
            color: t.text,
            fontSize: '0.9rem'
          }}
          placeholder="Ask about your tasks, productivity tips..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          style={{
            background: `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`,
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            width: '42px',
            fontSize: '1rem',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
          onClick={handleSend}
          disabled={loading}
        >
          ➤
        </button>
      </div>
    </div>
  )
}