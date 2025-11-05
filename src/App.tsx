import { useState, lazy, Suspense } from 'react'
import { LandingHero } from '@/components/LandingHero'
import { Toaster } from '@/components/ui/sonner'
import { AIAgentConfig } from '@/lib/types'
import { getDefaultAgent } from '@/lib/predefined-agents'

// Lazy load heavy components for better initial load performance
const MinimalChatInterface = lazy(() => import('@/components/MinimalChatInterface'))
const Dashboard = lazy(() => import('@/components/Dashboard'))
const AdminLogin = lazy(() => import('@/components/AdminLogin'))
const BlogSection = lazy(() => import('@/components/BlogSection'))

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

      <Suspense fallback={<div className="h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Carregando...</div></div>}>
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
      </Suspense>

      <Toaster position="top-center" />
    </>
  )
}

export default App
