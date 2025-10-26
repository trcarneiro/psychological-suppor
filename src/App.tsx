import { useState } from 'react'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Dashboard } from '@/components/Dashboard'
import { AdminLogin } from '@/components/AdminLogin'
import { Toaster } from '@/components/ui/sonner'
import { AIAgentConfig } from '@/lib/types'
import { getDefaultAgent } from '@/lib/predefined-agents'

type ViewMode = 'chat' | 'admin-login' | 'dashboard'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('chat')
  const [selectedAgent, setSelectedAgent] = useState<AIAgentConfig>(getDefaultAgent())

  const handleChangeAgent = (agent: AIAgentConfig) => {
    setSelectedAgent(agent)
  }

  return (
    <>
      {viewMode === 'chat' && (
        <MinimalChatInterface
          agent={selectedAgent}
          onChangeAgent={handleChangeAgent}
          onAdminLogin={() => setViewMode('admin-login')}
        />
      )}

      {viewMode === 'admin-login' && (
        <AdminLogin
          onLogin={() => setViewMode('dashboard')}
          onCancel={() => setViewMode('chat')}
        />
      )}

      {viewMode === 'dashboard' && (
        <Dashboard onLogout={() => setViewMode('chat')} />
      )}

      <Toaster position="top-center" />
    </>
  )
}

export default App
