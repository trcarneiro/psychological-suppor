import { useState } from 'react'
import { ModernLandingPage } from '@/components/ModernLandingPage'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Dashboard } from '@/components/Dashboard'
import { AdminLogin } from '@/components/AdminLogin'
import { Toaster } from '@/components/ui/sonner'
import { AIAgentConfig } from '@/lib/types'

type ViewMode = 'landing' | 'chat' | 'admin-login' | 'dashboard'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [selectedAgent, setSelectedAgent] = useState<AIAgentConfig | null>(null)

  const handleStartChat = (agent: AIAgentConfig) => {
    setSelectedAgent(agent)
    setViewMode('chat')
  }

  return (
    <>
      {viewMode === 'landing' && (
        <ModernLandingPage
          onStartChat={handleStartChat}
          onAdminLogin={() => setViewMode('admin-login')}
        />
      )}

      {viewMode === 'chat' && selectedAgent && (
        <MinimalChatInterface
          agent={selectedAgent}
          onBack={() => setViewMode('landing')}
        />
      )}

      {viewMode === 'admin-login' && (
        <AdminLogin
          onLogin={() => setViewMode('dashboard')}
          onCancel={() => setViewMode('landing')}
        />
      )}

      {viewMode === 'dashboard' && (
        <Dashboard onLogout={() => setViewMode('landing')} />
      )}

      <Toaster position="top-center" />
    </>
  )
}

export default App
