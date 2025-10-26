import { useState } from 'react'
import { LandingPage } from '@/components/LandingPage'
import { ChatInterface } from '@/components/ChatInterface'
import { Dashboard } from '@/components/Dashboard'
import { AdminLogin } from '@/components/AdminLogin'
import { Toaster } from '@/components/ui/sonner'

type ViewMode = 'landing' | 'chat' | 'admin-login' | 'dashboard'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing')

  return (
    <>
      {viewMode === 'landing' && (
        <LandingPage
          onStartChat={() => setViewMode('chat')}
          onAdminLogin={() => setViewMode('admin-login')}
        />
      )}

      {viewMode === 'chat' && (
        <ChatInterface onBack={() => setViewMode('landing')} />
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
