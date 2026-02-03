import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { CUSTOMER } from '../config/appConfig'
import {
  Home,
  FileText,
  List,
  Save,
  Settings,
  PlusCircle,
  ClipboardList,
  CheckCircle,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  Sun,
  Moon
} from 'lucide-react'
import wearCheckLogo from '../WearCheck Logo.png'

function Layout() {
  const { user, userRole, signOut, hasPermission } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
      navigate('/login')
    } catch (err) {
      console.error('Sign out exception:', err)
      navigate('/login')
    }
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Home', show: true },
    { to: '/job-card', icon: PlusCircle, label: 'New Job Card', show: hasPermission('canCreateJobCard') },
    { to: '/job-cards', icon: List, label: 'Job Cards', show: true },
    { to: '/drafts', icon: Save, label: 'Drafts', show: true },
    { to: '/equipment', icon: Settings, label: 'Equipment', show: hasPermission('canManageEquipment') },
    { to: '/equipment-request', icon: ClipboardList, label: 'Request Equipment', show: hasPermission('canRequestEquipment') },
    { to: '/my-requests', icon: FileText, label: 'My Requests', show: true },
    { to: '/request-approval', icon: CheckCircle, label: 'Approve Requests', show: hasPermission('canApproveRequests') },
    { to: '/user-management', icon: Users, label: 'User Management', show: hasPermission('canManageUsers') },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', show: hasPermission('canViewAnalytics') },
    { to: '/kpi-timeline', icon: TrendingUp, label: 'KPI Timeline', show: hasPermission('canViewAnalytics') },
    { to: '/deviations', icon: AlertTriangle, label: 'Deviations', show: hasPermission('canViewAnalytics') }
  ]

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="header-logo">
          <img src={wearCheckLogo} alt="WearCheck" style={{ height: 24 }} />
          <span>{CUSTOMER.name} Job Report</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={wearCheckLogo} alt="WearCheck" style={{ height: 32 }} />
            <div className="logo-text">
              <span className="logo-title">{CUSTOMER.name}</span>
              <span className="logo-subtitle">Job Report</span>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.filter(item => item.show).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
              end={item.to === '/'}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-email">{user?.email}</span>
              <span className="user-role">{userRole}</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="theme-toggle-sidebar" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="logout-btn" onClick={handleSignOut}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
