import { useState } from 'react'
import TaskInput from './components/TaskInput'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])

  const addTask = (task) => {
    setTasks(prev => [task, ...prev])
  }

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="app">
      <div className="header">
        <h1>ProcastiNOT</h1>
        <p>Stop procrastinating. Start doing.</p>
      </div>
      <div className="main-layout">
        <TaskInput onAddTask={addTask} />
        <Dashboard tasks={tasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
      </div>
    </div>
  )
}

export default App