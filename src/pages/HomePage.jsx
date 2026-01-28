import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { CUSTOMER, VESSELS } from '../config/appConfig'
import {
  PlusCircle,
  List,
  Save,
  Settings,
  ClipboardList,
  CheckCircle,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Ship,
  FileText
} from 'lucide-react'

function HomePage() {
  const { user, userRole, hasPermission } = useAuth()
  const navigate = useNavigate()

  const cards = [
    {
      title: 'Create Job Card',
      description: 'Create a new job card for equipment inspection',
      icon: PlusCircle,
      path: '/job-card',
      color: '#10b981',
      show: hasPermission('canCreateJobCard')
    },
    {
      title: 'Job Cards',
      description: 'View and manage all job cards',
      icon: List,
      path: '/job-cards',
      color: '#3b82f6',
      show: true
    },
    {
      title: 'Drafts',
      description: 'Continue working on saved drafts',
      icon: Save,
      path: '/drafts',
      color: '#6b7280',
      show: true
    },
    {
      title: 'Equipment Management',
      description: 'Manage equipment lists for all vessels',
      icon: Settings,
      path: '/equipment',
      color: '#8b5cf6',
      show: hasPermission('canManageEquipment')
    },
    {
      title: 'Request Equipment',
      description: 'Request new equipment to be added',
      icon: ClipboardList,
      path: '/equipment-request',
      color: '#f59e0b',
      show: hasPermission('canRequestEquipment')
    },
    {
      title: 'My Requests',
      description: 'View your equipment requests',
      icon: FileText,
      path: '/my-requests',
      color: '#06b6d4',
      show: true
    },
    {
      title: 'Approve Requests',
      description: 'Review and approve equipment requests',
      icon: CheckCircle,
      path: '/request-approval',
      color: '#10b981',
      show: hasPermission('canApproveRequests')
    },
    {
      title: 'User Management',
      description: 'Manage users and their roles',
      icon: Users,
      path: '/user-management',
      color: '#ec4899',
      show: hasPermission('canManageUsers')
    },
    {
      title: 'Analytics Dashboard',
      description: 'View job statistics and insights',
      icon: BarChart3,
      path: '/analytics',
      color: '#3b82f6',
      show: hasPermission('canViewAnalytics')
    },
    {
      title: 'KPI Timeline',
      description: 'Track KPIs over time',
      icon: TrendingUp,
      path: '/kpi-timeline',
      color: '#10b981',
      show: hasPermission('canViewAnalytics')
    },
    {
      title: 'Deviations',
      description: 'View and manage deviations',
      icon: AlertTriangle,
      path: '/deviations',
      color: '#ef4444',
      show: hasPermission('canViewAnalytics')
    }
  ]

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Welcome to {CUSTOMER.name} Job Report</h1>
        <p>Select an option below to get started</p>
      </div>

      <div className="vessels-section">
        <h2>Vessels</h2>
        <div className="vessels-grid">
          {VESSELS.map(vessel => (
            <div key={vessel.id} className="vessel-card">
              <Ship size={32} />
              <div className="vessel-info">
                <h3>{vessel.name}</h3>
                <span className="vessel-code">{vessel.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.filter(card => card.show).map(card => (
          <div
            key={card.path}
            className="dashboard-card"
            onClick={() => navigate(card.path)}
            style={{ '--card-color': card.color }}
          >
            <div className="card-icon" style={{ backgroundColor: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="user-status">
        <p>Logged in as: <strong>{user?.email}</strong></p>
        <p>Role: <span className="role-badge">{userRole}</span></p>
      </div>
    </div>
  )
}

export default HomePage
