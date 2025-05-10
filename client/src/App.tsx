import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChatInterface } from './components/chat-interface'
import StreamingAvatar from './components/Avatar'
import { Header } from './components/header'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/login" element={<div>Login page coming soon</div>} />
      </Routes>
    </Router>
  )
}

function AvatarPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">HeyGen Streaming Avatar</h1>
          <StreamingAvatar />
        </div>
      </div>
    </div>
  )
}

export default App