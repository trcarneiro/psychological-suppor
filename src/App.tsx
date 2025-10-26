import { useState } from 'react'
import { LandingHero } from '@/components/LandingHero'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Dashboard } from '@/components/Dashboard'
import { AdminLogin } from '@/components/AdminLogin'
import { BlogSection } from '@/components/BlogSection'
import { Toaster } from '@/components/ui/sonner'
import { AIAgentConfig } from '@/lib/types'
import { getDefaultAgent } from '@/lib/predefined-agents'

type ViewMode = 'landing' | 'chat' | 'admin-login' | 'dashboard' | 'blog'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [selectedAgent, setSelectedAgent] = useState<AIAgentConfig>(getDefaultAgent())

  const handleChangeAgent = (agent: AIAgentConfig) => {
    setSelectedAgent(agent)
  }

  return (
    <>
      {viewMode === 'landing' && (
        <LandingHero 
          onStartChat={() => setViewMode('chat')} 
          onOpenBlog={() => setViewMode('blog')}
        />
      )}

      {viewMode === 'blog' && (
        <BlogSection onBack={() => setViewMode('landing')} />
      )}

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
