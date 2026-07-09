import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import TaskInput from './components/TaskInput'
import Dashboard from './components/Dashboard'
import ChatAssistant from './components/ChatAssistant'
import HabitTracker from './components/HabitTracker'
import ProductivityScore from './components/ProductivityScore'
import './App.css'

// Color theory for studying:
// Dark: deep navy + purple (reduces eye strain, promotes focus)
// Light: warm cream + soft blue (calming, reduces anxiety, improves retention)

const DARK_THEME = {
  bg: '#0a0a1a',
  surface: '#13132a',
  card: '#1a1a35',
  border: '#2a2a50',
  text: '#e8e8ff',
  subtext: '#8888bb',
  input: '#0d0d22',
  accent1: '#6c63ff',
  accent2: '#ff6584',
}

const LIGHT_THEME = {
  bg: '#f5f0e8',
  surface: '#fffdf7',
  card: '#ffffff',
  border: '#e8e0d0',
  text: '#2c2c3e',
  subtext: '#6b6b8a',
  input: '#f0ece0',
  accent1: '#5c54e8',
  accent2: '#e85570',
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [darkMode, setDarkMode] = useState(true)

  const t = darkMode ? DARK_THEME : LIGHT_THEME

  const addTask = (task) => setTasks(prev => [task, ...prev])
  const updateTask = (updatedTask) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  return (
    <BrowserRouter>
      <div style={{
        background: t.bg,
        minHeight: '100vh',
        color: t.text,
        transition: 'all 0.3s ease'
      }}>

        {/* Navbar */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          height: '64px',
          background: t.surface,
          borderBottom: `1px solid ${t.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: darkMode
            ? '0 2px 20px rgba(108, 99, 255, 0.1)'
            : '0 2px 20px rgba(0, 0, 0, 0.06)'
        }}>

          {/* Logo */}
          <span style={{
  fontSize: '1.3rem',
  fontWeight: '900',
  color: t.accent1,
  letterSpacing: '-0.5px',
  marginRight: '16px'
}}>
  ⚡ ProcastiNOT
</span>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto', marginRight: '16px' }}>
            {[
              { to: '/', label: '📋 Tasks' },
              { to: '/schedule', label: '📅 Schedule' },
              { to: '/chat', label: '🤖 AI Coach' },
              { to: '/habits', label: '🔥 Habits' },
              { to: '/score', label: '📊 Score' }
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : t.subtext,
                  textDecoration: 'none',
                  padding: '7px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  background: isActive
                    ? `linear-gradient(135deg, ${t.accent1}, ${t.accent2})`
                    : 'transparent',
                  transition: 'all 0.2s ease'
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: darkMode
                ? 'linear-gradient(135deg, #1a1a35, #2a2a50)'
                : 'linear-gradient(135deg, #fff8e8, #f0ece0)',
              border: `1px solid ${t.border}`,
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              color: t.text,
              transition: 'all 0.3s ease',
              boxShadow: darkMode
                ? 'inset 0 1px 3px rgba(0,0,0,0.3)'
                : 'inset 0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <span style={{ fontSize: '1rem' }}>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </nav>

        {/* Pages */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
          <Routes>
            <Route path="/" element={
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px' }}>
                <TaskInput onAddTask={addTask} theme={t} />
                <Dashboard tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} theme={t} />
              </div>
            } />
            <Route path="/schedule" element={
              <Dashboard tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} defaultTab="schedule" theme={t} />
            } />
            <Route path="/chat" element={
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <ChatAssistant tasks={tasks} theme={t} />
              </div>
            } />
            <Route path="/habits" element={
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <HabitTracker theme={t} />
              </div>
            } />
            <Route path="/score" element={
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <ProductivityScore tasks={tasks} theme={t} />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}