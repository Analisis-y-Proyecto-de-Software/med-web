import React, { useEffect, useState } from 'react'
import { getCurrentUser, signOut } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Profile from './components/Profile/Profile'
import DashboardPage from './components/DashboardPage'
import TaskPage from './components/TaskPage'
import ConcentrationPage from './components/ConcentrationPage'
import CalendarPage from './components/CalendarPage'
import { ChevronRight, LogOut, UserRound } from 'lucide-react'

function AuthShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#141414] p-1">
      <div className="min-h-[calc(100vh-0.5rem)] w-full relative overflow-hidden bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="absolute top-[-14%] left-[-8%] w-[32rem] h-[32rem] rounded-full bg-[#9fc8cf]/45 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-22%] right-[-12%] w-[30rem] h-[30rem] rounded-full bg-[#c9d6dd]/55 blur-[90px] pointer-events-none" />
        <div className="z-10 w-full flex justify-center">{children}</div>
      </div>
    </div>
  )
}

function DashboardShell({ user, onSignOut, children }) {
  const location = useLocation()

  const navButtonClass =
    'block w-full text-center rounded-md bg-[#d8d9dd] text-[#212121] py-2 text-xs font-medium hover:bg-[#ececef] transition-colors'

  const navButtonActiveClass =
    'block w-full text-center rounded-md bg-[#d8d9dd] text-[#212121] py-2 text-xs font-medium ring-1 ring-[#c4c5ca] transition-colors'

  return (
    <div className="min-h-screen w-full bg-[#141414] p-1">
      <div className="min-h-[calc(100vh-0.5rem)] w-full bg-[#f8f9fa] md:grid md:grid-cols-[220px_1fr]">
        <aside className="bg-[#00343a] text-white p-3 flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight mb-5">FocusMind</h1>

          <nav className="space-y-3">
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? navButtonActiveClass : navButtonClass}>
              Dashboard
            </Link>
            <Link to="/tareas" className={location.pathname === '/tareas' ? navButtonActiveClass : navButtonClass}>
              Tareas
            </Link>
            <Link
              to="/registro-emocional"
              className={location.pathname === '/registro-emocional' ? navButtonActiveClass : navButtonClass}
            >
              Registro Emocional
            </Link>
            <Link to="/calendario" className={location.pathname === '/calendario' ? navButtonActiveClass : navButtonClass}>
              Calendario
            </Link>
          </nav>

          <div className="mt-auto space-y-2">
            <Link
              to="/user"
              className="w-full flex items-center gap-2 rounded-md border border-white/20 bg-[#002a2f] px-2 py-2 text-left hover:bg-[#003c43] transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-violet-200 text-[#4a3274] grid place-items-center shrink-0">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium truncate">{user?.username || 'Usuario'}</p>
                <p className="text-[9px] text-white/70 truncate">Seguridad de la Cuenta</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 ml-auto text-white/80" />
            </Link>

            <button
              onClick={onSignOut}
              className="w-full rounded-md border border-white/30 py-2 text-xs font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesion
            </button>
          </div>
        </aside>

        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loadingConfig, setLoadingConfig] = useState(true)

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setLoadingConfig(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void checkUser()
    })

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          queueMicrotask(() => {
            void checkUser()
          })
          break
        case 'signedOut':
          setUser(null)
          navigate('/login', { replace: true })
          break
      }
    })
    return unsubscribe
  }, [navigate])

  useEffect(() => {
    if (loadingConfig) {
      return
    }

    if (!user) {
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login', { replace: true })
      }
      return
    }

    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
      navigate('/dashboard', { replace: true })
    }
  }, [loadingConfig, location.pathname, navigate, user])

  const handleSignOut = async () => {
    try {
      await signOut()
      setUser(null)
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Error signing out: ', err)
    }
  }

  const handleLoginSuccess = async () => {
    await checkUser()
    navigate('/dashboard', { replace: true })
  }

  if (loadingConfig) {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route
            path="/register"
            element={
              <AuthShell>
                <Register onNavigate={() => navigate('/login')} />
              </AuthShell>
            }
          />
          <Route
            path="*"
            element={
              <AuthShell>
                <Login onNavigate={() => navigate('/register')} onLoginSuccess={handleLoginSuccess} />
              </AuthShell>
            }
          />
        </>
      ) : (
        <>
          <Route
            path="/dashboard"
            element={
              <DashboardShell user={user} onSignOut={handleSignOut}>
                <DashboardPage />
              </DashboardShell>
            }
          />
          <Route
            path="/tareas"
            element={
              <DashboardShell user={user} onSignOut={handleSignOut}>
                <TaskPage />
              </DashboardShell>
            }
          />
          <Route
            path="/registro-emocional"
            element={
              <DashboardShell user={user} onSignOut={handleSignOut}>
                <ConcentrationPage />
              </DashboardShell>
            }
          />
          <Route
            path="/calendario"
            element={
              <DashboardShell user={user} onSignOut={handleSignOut}>
                <CalendarPage />
              </DashboardShell>
            }
          />
          <Route
            path="/user"
            element={
              <DashboardShell user={user} onSignOut={handleSignOut}>
                <Profile onBack={() => navigate('/dashboard')} />
              </DashboardShell>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  )
}
