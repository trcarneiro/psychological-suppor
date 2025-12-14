import { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { LandingHero } from '@/components/LandingHero'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { getDefaultAgent, AIAgentConfig } from '@/lib/predefined-agents'

// Lazy load heavy components
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })))
const AdminLogin = lazy(() => import('@/components/AdminLogin').then(module => ({ default: module.AdminLogin })))
const BlogSection = lazy(() => import('@/components/BlogSection').then(module => ({ default: module.BlogSection })))
const BlogArticleView = lazy(() => import('@/components/BlogArticleView').then(module => ({ default: module.BlogArticleView })))
const ClientDashboard = lazy(() => import('@/components/ClientDashboard').then(module => ({ default: module.ClientDashboard })))
const ClientArea = lazy(() => import('@/components/ClientArea').then(module => ({ default: module.ClientArea })))
const ResetPassword = lazy(() => import('@/components/ResetPassword').then(module => ({ default: module.ResetPassword })))

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

function ChatRoute() {
  const navigate = useNavigate()
  const [currentAgent, setCurrentAgent] = useState<AIAgentConfig>(getDefaultAgent())

  return (
    <MinimalChatInterface 
      agent={currentAgent}
      onChangeAgent={setCurrentAgent}
      onAdminLogin={() => navigate('/admin')}
      onClose={() => navigate('/')}
    />
  )
}

function AppContent() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check for hash errors from Supabase redirects
    const hash = window.location.hash
    if (hash && hash.includes('error=')) {
      const params = new URLSearchParams(hash.substring(1)) // remove #
      const errorDescription = params.get('error_description')
      
      if (errorDescription) {
        toast.error(`Erro: ${errorDescription.replace(/\+/g, ' ')}`)
        // Clear hash to prevent showing error again on refresh
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LandingHero />} />
      <Route path="/chat" element={<ChatRoute />} />
      <Route path="/blog" element={
        <Suspense fallback={<LoadingScreen />}>
          <BlogSection />
        </Suspense>
      } />
      <Route path="/blog/:slug" element={
        <Suspense fallback={<LoadingScreen />}>
          <BlogArticleView />
        </Suspense>
      } />
      <Route path="/admin" element={
        <Suspense fallback={<LoadingScreen />}>
          <AdminLogin />
        </Suspense>
      } />
      <Route path="/reset-password" element={
        <Suspense fallback={<LoadingScreen />}>
          <ResetPassword />
        </Suspense>
      } />
      <Route path="/dashboard" element={
        <Suspense fallback={<LoadingScreen />}>
          <Dashboard />
        </Suspense>
      } />
      <Route path="/client-dashboard" element={
        <Suspense fallback={<LoadingScreen />}>
          <ClientDashboard />
        </Suspense>
      } />
      <Route path="/client" element={
        <Suspense fallback={<LoadingScreen />}>
          <ClientArea />
        </Suspense>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App
