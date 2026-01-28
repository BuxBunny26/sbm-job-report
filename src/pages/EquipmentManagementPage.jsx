import { useState, useEffect } from 'react'
import { VESSELS, TECHNOLOGIES } from '../config/appConfig'
import { loadEquipmentData } from '../services/equipmentService'
import { Settings, Search, Plus, Edit, Trash2, Save } from 'lucide-react'

function EquipmentManagementPage() {
  const [selectedVessel, setSelectedVessel] = useState('')
  const [selectedTechnology, setSelectedTechnology] = useState('')
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    id: '',
    area: '',
    functionLocation: '',
    equipmentDesc: '',
    sapNumber: ''
  })

  useEffect(() => {
    if (selectedVessel && selectedTechnology) {
      loadEquipment()
    }
  }, [selectedVessel, selectedTechnology])

  const loadEquipment = async () => {
    try {
      setLoading(true)
      const data = await loadEquipmentData(selectedVessel, selectedTechnology)
      setEquipment(data)
    } catch (error) {
      console.error('Error loading equipment:', error)
      setEquipment([])
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = equipment.filter(eq => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      eq.equipmentDesc?.toLowerCase().includes(search) ||
      eq.area?.toLowerCase().includes(search) ||
      eq.sapNumber?.toLowerCase().includes(search)
    )
  })

  const handleAddNew = () => {
    const vessel = VESSELS.find(v => v.id === selectedVessel)
    const prefix = vessel?.code || 'EQ'
    const techPrefix = selectedTechnology === 'thermography' ? 'THM' : 'VIB'
    const nextNum = (equipment.length + 1).toString().padStart(3, '0')
    
    setFormData({
      id: `${prefix}-${techPrefix}-${nextNum}`,
      area: '',
      functionLocation: '',
      equipmentDesc: '',
      sapNumber: ''
    })
    setEditingItem(null)
    setShowAddModal(true)
  }

  const handleEdit = (item) => {
    setFormData({ ...item })
    setEditingItem(item.id)
    setShowAddModal(true)
  }

  const handleDelete = (itemId) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return
    setEquipment(prev => prev.filter(eq => eq.id !== itemId))
  }

  const handleSave = () => {
    if (editingItem) {
      setEquipment(prev => prev.map(eq => eq.id === editingItem ? formData : eq))
    } else {
      setEquipment(prev => [...prev, formData])
    }
    setShowAddModal(false)
    setEditingItem(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="equipment-management-page">
      <div className="page-header">
        <h1>Equipment Management</h1>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Vessel</label>
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value)}
          >
            <option value="">Select Vessel</option>
            {VESSELS.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Technology</label>
          <select
            value={selectedTechnology}
            onChange={(e) => setSelectedTechnology(e.target.value)}
          >
            <option value="">Select Technology</option>
            {TECHNOLOGIES.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group search">
          <label>Search</label>
          <div className="search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddNew}
          disabled={!selectedVessel || !selectedTechnology}
        >
          <Plus size={18} />
          Add Equipment
        </button>
      </div>

      {!selectedVessel || !selectedTechnology ? (
        <div className="empty-state">
          <Settings size={48} />
          <h2>Select Vessel and Technology</h2>
          <p>Choose a vessel and technology type to manage equipment</p>
        </div>
      ) : loading ? (
        <div className="loading">Loading equipment...</div>
      ) : (
        <div className="equipment-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Area</th>
                <th>Function Location</th>
                <th>Description</th>
                <th>SAP Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No equipment found</td>
                </tr>
              ) : (
                filteredEquipment.map(eq => (
                  <tr key={eq.id}>
                    <td>{eq.id}</td>
                    <td>{eq.area}</td>
                    <td>{eq.functionLocation}</td>
                    <td>{eq.equipmentDesc}</td>
                    <td>{eq.sapNumber}</td>
                    <td className="actions">
                      <button className="btn-icon" onClick={() => handleEdit(eq)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(eq.id)}>
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
              <h2>{editingItem ? 'Edit Equipment' : 'Add New Equipment'}</h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Equipment ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  readOnly={!!editingItem}
                />
              </div>
              <div className="form-group">
                <label>Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g., Engine Room"
                />
              </div>
              <div className="form-group">
                <label>Function Location</label>
                <input
                  type="text"
                  name="functionLocation"
                  value={formData.functionLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Engine"
                />
              </div>
              <div className="form-group">
                <label>Equipment Description</label>
                <input
                  type="text"
                  name="equipmentDesc"
                  value={formData.equipmentDesc}
                  onChange={handleInputChange}
                  placeholder="e.g., Main Engine - Port Side"
                />
              </div>
              <div className="form-group">
                <label>SAP Number</label>
                <input
                  type="text"
                  name="sapNumber"
                  value={formData.sapNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., SAX-ME-001"
                />
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

export default EquipmentManagementPage
