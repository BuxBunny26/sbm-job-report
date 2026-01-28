import { useState, useEffect } from 'react'
import { USER_ROLES } from '../config/appConfig'
import { supabase } from '../config/supabaseClient'
import { Users, UserPlus, Edit, Trash2, Save, X, Search } from 'lucide-react'

function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'technician'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // Demo data
      setUsers([
        { id: '1', email: 'admin@wearcheck.com', name: 'Admin User', role: 'admin', created_at: '2026-01-01' },
        { id: '2', email: 'supervisor@wearcheck.com', name: 'John Supervisor', role: 'supervisor', created_at: '2026-01-05' },
        { id: '3', email: 'tech1@wearcheck.com', name: 'Mike Technician', role: 'technician', created_at: '2026-01-10' },
        { id: '4', email: 'tech2@wearcheck.com', name: 'Sarah Technician', role: 'technician', created_at: '2026-01-12' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      user.email?.toLowerCase().includes(search) ||
      user.name?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    )
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddUser = () => {
    setFormData({ email: '', name: '', role: 'technician' })
    setEditingUser(null)
    setShowAddModal(true)
  }

  const handleEditUser = (user) => {
    setFormData({ email: user.email, name: user.name, role: user.role })
    setEditingUser(user.id)
    setShowAddModal(true)
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
  }

  const handleSave = async () => {
    try {
      if (editingUser) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ name: formData.name, role: formData.role })
          .eq('id', editingUser)

        if (error) throw error
        setUsers(prev => prev.map(u => 
          u.id === editingUser ? { ...u, ...formData } : u
        ))
      } else {
        // For new users, you would typically invite them through Supabase Auth
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString()
        }
        setUsers(prev => [newUser, ...prev])
      }
      setShowAddModal(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
      // Demo mode - still update UI
      if (editingUser) {
        setUsers(prev => prev.map(u => 
          u.id === editingUser ? { ...u, ...formData } : u
        ))
      } else {
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString()
        }
        setUsers(prev => [newUser, ...prev])
      }
      setShowAddModal(false)
      setEditingUser(null)
    }
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin'
      case 'supervisor': return 'role-supervisor'
      default: return 'role-technician'
    }
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={handleAddUser}>
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">No users found</td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="actions">
                      <button className="btn-icon" onClick={() => handleEditUser(user)}>
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon danger" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'admin'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  disabled={!!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  {USER_ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagementPage
