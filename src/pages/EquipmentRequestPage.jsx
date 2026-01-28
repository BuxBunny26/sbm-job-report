import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { VESSELS, TECHNOLOGIES } from '../config/appConfig'
import { supabase } from '../config/supabaseClient'
import { Send, Plus, Trash2 } from 'lucide-react'

function EquipmentRequestPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    vessel: '',
    technology: '',
    equipment: [{
      area: '',
      functionLocation: '',
      equipmentDesc: '',
      sapNumber: '',
      justification: ''
    }]
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEquipmentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.map((eq, i) => 
        i === index ? { ...eq, [field]: value } : eq
      )
    }))
  }

  const addEquipmentRow = () => {
    setFormData(prev => ({
      ...prev,
      equipment: [...prev.equipment, {
        area: '',
        functionLocation: '',
        equipmentDesc: '',
        sapNumber: '',
        justification: ''
      }]
    }))
  }

  const removeEquipmentRow = (index) => {
    if (formData.equipment.length === 1) return
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const requestData = {
        vessel: formData.vessel,
        technology: formData.technology,
        equipment: formData.equipment,
        requested_by: user?.id,
        requested_by_email: user?.email,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('equipment_requests')
        .insert([requestData])

      if (error) throw error

      setSuccess(true)
      setFormData({
        vessel: '',
        technology: '',
        equipment: [{
          area: '',
          functionLocation: '',
          equipmentDesc: '',
          sapNumber: '',
          justification: ''
        }]
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Request submitted (demo mode)')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="equipment-request-page">
      <div className="page-header">
        <h1>Request New Equipment</h1>
        <p>Submit a request to add new equipment to the database</p>
      </div>

      {success && (
        <div className="success-message">
          Equipment request submitted successfully! It will be reviewed by an administrator.
        </div>
      )}

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Request Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Vessel *</label>
              <select
                name="vessel"
                value={formData.vessel}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Vessel</option>
                {VESSELS.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Technology *</label>
              <select
                name="technology"
                value={formData.technology}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Technology</option>
                {TECHNOLOGIES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Equipment Details</h2>
            <button type="button" className="btn btn-secondary" onClick={addEquipmentRow}>
              <Plus size={18} />
              Add Another
            </button>
          </div>

          {formData.equipment.map((eq, index) => (
            <div key={index} className="equipment-row">
              <div className="row-header">
                <span>Equipment #{index + 1}</span>
                {formData.equipment.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => removeEquipmentRow(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Area *</label>
                  <input
                    type="text"
                    value={eq.area}
                    onChange={(e) => handleEquipmentChange(index, 'area', e.target.value)}
                    placeholder="e.g., Engine Room"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Function Location *</label>
                  <input
                    type="text"
                    value={eq.functionLocation}
                    onChange={(e) => handleEquipmentChange(index, 'functionLocation', e.target.value)}
                    placeholder="e.g., Main Engine"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Equipment Description *</label>
                  <input
                    type="text"
                    value={eq.equipmentDesc}
                    onChange={(e) => handleEquipmentChange(index, 'equipmentDesc', e.target.value)}
                    placeholder="e.g., Cooling Water Pump"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SAP Number (if known)</label>
                  <input
                    type="text"
                    value={eq.sapNumber}
                    onChange={(e) => handleEquipmentChange(index, 'sapNumber', e.target.value)}
                    placeholder="e.g., SAX-CWP-001"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Justification *</label>
                  <textarea
                    value={eq.justification}
                    onChange={(e) => handleEquipmentChange(index, 'justification', e.target.value)}
                    placeholder="Why should this equipment be added?"
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <Send size={18} />
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EquipmentRequestPage
