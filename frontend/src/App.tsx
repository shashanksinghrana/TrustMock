import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ServiceMonitor from './pages/ServiceMonitor'

export default function App() {
  const loc = useLocation()
  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="w-72 bg-primary text-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <img src="/tiaa-logo.png" alt="TIAA" className="h-8" />
            <div>
              <div className="font-bold text-xl">TrustMock</div>
              <div className="text-sm opacity-75">Mock Management</div>
            </div>
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          <NavLink to="/" active={loc.pathname === '/'} icon="📊">
            Dashboard
          </NavLink>
          <NavLink to="/monitor" active={loc.pathname === '/monitor'} icon="🚨">
            Service Monitor
          </NavLink>
          <NavLink to="/settings" active={loc.pathname === '/settings'} icon="⚙️">
            Mock Management
          </NavLink>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-600">
          <div className="text-xs opacity-75">
            Version 1.0.0
          </div>
          <div className="text-xs opacity-60">
            Enterprise QA Testing
          </div>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitor" element={<ServiceMonitor />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

function NavLink({ to, active, icon, children }: { to: string; active: boolean; icon: string; children: React.ReactNode }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-accent text-white shadow-md' 
          : 'text-blue-100 hover:bg-blue-600 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  )
}
