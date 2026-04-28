import { Search, Bell, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Header = ({ onMenuToggle }) => {
  const { user } = useAuth()
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'A'

  return (
    <header className="bg-white px-4 md:px-6 py-3 flex items-center justify-between shadow-sm border-b border-gray-100 gap-3">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden cursor-pointer flex-shrink-0">
          <Menu size={20} className="text-gray-600" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-800 truncate">RTI Management</h1>
          <p className="text-xs text-gray-400 hidden sm:block">RTI Management</p>
        </div>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        {/* Search */}
        <div className="hidden sm:flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 md:w-52"
          />
          <button className="px-3 py-1.5 rounded-r-md text-white" style={{ backgroundColor: '#1e3a5f' }}>
            <Search size={16} />
          </button>
        </div>

        {/* Bell */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            9
          </span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium cursor-pointer overflow-hidden">
          <span className="text-gray-700 font-semibold">{avatarLetter}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
