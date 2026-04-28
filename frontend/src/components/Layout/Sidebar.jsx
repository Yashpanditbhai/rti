import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Scale,
  Calendar,
  FolderOpen,
  BarChart3,
  Bell,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'RTI Management', icon: FileText, path: '/' },
  { label: 'Legal Cases', icon: Scale, path: '/legal-cases' },
  { label: 'Hearings Calendar', icon: Calendar, path: '/hearings' },
  { label: 'Documents', icon: FolderOpen, path: '/documents' },
  { label: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
  { label: 'Notifications & Settings', icon: Bell, path: '/notifications' },
]

const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/rti')
    return location.pathname.startsWith(path)
  }

  const handleNav = (path) => {
    navigate(path)
    onClose?.()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose?.()
  }

  return (
    <aside className="w-56 h-full flex-shrink-0 flex flex-col bg-white border-r border-gray-200">
      {/* Logo area - Dark blue */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-3 relative" style={{ backgroundColor: '#1e3a5f' }}>
        {/* Mobile close */}
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded hover:bg-white/20 lg:hidden cursor-pointer text-white">
          <X size={18} />
        </button>
        <div className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white tracking-wide">SAU</span>
        </div>
        <div className="text-white leading-tight">
          <span className="text-sm font-bold">SAU</span>
          <p className="text-[9px] text-white/60 uppercase">South Asian<br />University</p>
        </div>
      </div>

      {/* Navigation - White background */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <button
              key={item.label}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                active
                  ? 'text-blue-700 font-medium border-l-[3px] border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-l-[3px] border-transparent'
              }`}
            >
              <Icon size={17} className={active ? 'text-blue-600' : 'text-gray-400'} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 py-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer border-l-[3px] border-transparent"
        >
          <LogOut size={17} className="text-gray-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
