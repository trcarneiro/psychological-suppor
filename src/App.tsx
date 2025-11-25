import { useState, Suspense, lazy } from 'react'
import { LandingHero } from '@/components/LandingHero'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Toaster } from '@/components/ui/sonner'
import { AIAgentConfig } from '@/lib/types'
import { getDefaultAgent } from '@/lib/predefined-agents'

// Lazy load heavy components
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })))
const AdminLogin = lazy(() => import('@/components/AdminLogin').then(module => ({ default: module.AdminLogin })))
const BlogSection = lazy(() => import('@/components/BlogSection').then(module => ({ default: module.BlogSection })))

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-200"></div>
        <div className="h-4 w-32 rounded bg-slate-200"></div>
      </div>
    </div>
  )
}

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
        <Suspense fallback={<LoadingScreen />}>
          <BlogSection onBack={() => setViewMode('landing')} />
        </Suspense>
      )}

      {viewMode === 'chat' && (
        <MinimalChatInterface
          agent={selectedAgent}
          onChangeAgent={handleChangeAgent}
          onAdminLogin={() => setViewMode('admin-login')}
          onClose={() => setViewMode('landing')}
        />
      )}

      {viewMode === 'admin-login' && (
        <Suspense fallback={<LoadingScreen />}>
          <AdminLogin
            onLogin={() => setViewMode('dashboard')}
            onCancel={() => setViewMode('chat')}
          />
        </Suspense>
      )}

      {viewMode === 'dashboard' && (
        <Suspense fallback={<LoadingScreen />}>
          <Dashboard onLogout={() => setViewMode('chat')} />
        </Suspense>
      )}

      <Toaster position="top-center" />
    </>
  )
}

export default App
