import { NavLink } from 'react-router-dom'
import { authAPI } from '../services/api'

const topLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Operations', path: '/receipts' },
  { name: 'Products', path: '/stock' },
  { name: 'Move History', path: '/delivery' },
  { name: 'Settings', path: '/settings' },
]

export default function Navbar() {
  const handleLogout = () => {
    authAPI.logout()
    window.location.href = '/login'
  }

  const currentUser = authAPI.getUser()

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-ink/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">CORE</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">INVENTORY</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex flex-wrap items-center gap-2">
            {topLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'border border-transparent text-slate-300 hover:border-line hover:bg-panel'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
          
          {currentUser && (
            <div className="flex items-center gap-3 pl-4 border-l border-line">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm border border-line bg-panelSoft text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
