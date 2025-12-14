import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { LandingHero } from '@/components/LandingHero'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Toaster } from '@/components/ui/sonner'
import { getDefaultAgent, AIAgentConfig } from '@/lib/predefined-agents'

// Lazy load heavy components
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })))
const AdminLogin = lazy(() => import('@/components/AdminLogin').then(module => ({ default: module.AdminLogin })))
const BlogSection = lazy(() => import('@/components/BlogSection').then(module => ({ default: module.BlogSection })))
const BlogArticleView = lazy(() => import('@/components/BlogArticleView').then(module => ({ default: module.BlogArticleView })))
const ClientDashboard = lazy(() => import('@/components/ClientDashboard').then(module => ({ default: module.ClientDashboard })))
const ClientArea = lazy(() => import('@/components/ClientArea').then(module => ({ default: module.ClientArea })))

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

function App() {
  return (
    <BrowserRouter>
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
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App
