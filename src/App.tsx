import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LandingHero } from '@/components/LandingHero'
import { MinimalChatInterface } from '@/components/MinimalChatInterface'
import { Toaster } from '@/components/ui/sonner'
import { getDefaultAgent } from '@/lib/predefined-agents'

// Lazy load heavy components
const Dashboard = lazy(() => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })))
const AdminLogin = lazy(() => import('@/components/AdminLogin').then(module => ({ default: module.AdminLogin })))
const BlogSection = lazy(() => import('@/components/BlogSection').then(module => ({ default: module.BlogSection })))
const BlogArticleView = lazy(() => import('@/components/BlogArticleView').then(module => ({ default: module.BlogArticleView })))

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingHero />} />
        <Route path="/chat" element={<MinimalChatInterface agent={getDefaultAgent()} />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  )
}

export default App
