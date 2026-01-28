import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { VESSELS, TECHNOLOGIES, TECHNICIANS, JOB_STATUSES } from '../config/appConfig'
import { saveDraft, getDraft, deleteDraft } from '../services/draftService'
import { loadEquipmentData } from '../services/equipmentService'
import { generateJobCardPDF } from '../services/pdfService'
import {
  Save,
  FileText,
  Download,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react'

function JobCardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    jobNumber: '',
    vessel: '',
    technology: '',
    technician1: '',
    technician2: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    equipment: [],
    notes: '',
    findings: '',
    recommendations: ''
  })
  
  const [equipmentList, setEquipmentList] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showEquipmentSelector, setShowEquipmentSelector] = useState(false)

  useEffect(() => {
    if (id) {
      loadDraft(id)
    } else {
      generateJobNumber()
    }
  }, [id])

  useEffect(() => {
    if (formData.vessel && formData.technology) {
      loadEquipment()
    }
  }, [formData.vessel, formData.technology])

  const generateJobNumber = () => {
    const date = new Date()
    const prefix = 'JC'
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    setFormData(prev => ({ ...prev, jobNumber: `${prefix}-${year}${month}-${random}` }))
  }

  const loadDraft = async (draftId) => {
    try {
      setLoading(true)
      const draft = await getDraft(draftId)
      if (draft) {
        setFormData(draft.data)
        setSelectedEquipment(draft.data.equipment || [])
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEquipment = async () => {
    try {
      const data = await loadEquipmentData(formData.vessel, formData.technology)
      setEquipmentList(data)
    } catch (error) {
      console.error('Error loading equipment:', error)
      setEquipmentList([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEquipmentToggle = (equipment) => {
    setSelectedEquipment(prev => {
      const exists = prev.find(e => e.id === equipment.id)
      if (exists) {
        return prev.filter(e => e.id !== equipment.id)
      }
      return [...prev, { ...equipment, condition: 'normal', notes: '' }]
    })
  }

  const handleEquipmentCondition = (equipmentId, condition) => {
    setSelectedEquipment(prev =>
      prev.map(e => e.id === equipmentId ? { ...e, condition } : e)
    )
  }

  const handleEquipmentNotes = (equipmentId, notes) => {
    setSelectedEquipment(prev =>
      prev.map(e => e.id === equipmentId ? { ...e, notes } : e)
    )
  }

  const handleSaveDraft = async () => {
    try {
      setSaving(true)
      const draftData = {
        ...formData,
        equipment: selectedEquipment,
        userId: user?.id,
        updatedAt: new Date().toISOString()
      }
      await saveDraft(id || formData.jobNumber, draftData)
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Error saving draft')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDraft = async () => {
    if (!confirm('Are you sure you want to delete this draft?')) return
    try {
      await deleteDraft(id || formData.jobNumber)
      navigate('/drafts')
    } catch (error) {
      console.error('Error deleting draft:', error)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      const pdfData = {
        ...formData,
        equipment: selectedEquipment
      }
      await generateJobCardPDF(pdfData)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Submit to Supabase
    alert('Job card submitted successfully!')
    navigate('/job-cards')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="job-card-page">
      <div className="page-header">
        <h1>{id ? 'Edit Job Card' : 'Create Job Card'}</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleSaveDraft} disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button className="btn btn-secondary" onClick={handleGeneratePDF}>
            <Download size={18} />
            Generate PDF
          </button>
          {id && (
            <button className="btn btn-danger" onClick={handleDeleteDraft}>
              <Trash2 size={18} />
              Delete
            </button>
          )}
        </div>
      </div>

      <form className="job-card-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Job Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Job Number</label>
              <input
                type="text"
                name="jobNumber"
                value={formData.jobNumber}
                readOnly
                className="readonly"
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Vessel</label>
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
              <label>Technology</label>
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

            <div className="form-group">
              <label>Technician 1 *</label>
              <select
                name="technician1"
                value={formData.technician1}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Technician</option>
                {TECHNICIANS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Technician 2</label>
              <select
                name="technician2"
                value={formData.technician2}
                onChange={handleInputChange}
              >
                <option value="">Select Technician (Optional)</option>
                {TECHNICIANS.filter(t => t.id !== formData.technician1).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {JOB_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Equipment Selection</h2>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setShowEquipmentSelector(!showEquipmentSelector)}
            >
              {showEquipmentSelector ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              {showEquipmentSelector ? 'Hide' : 'Show'} Equipment List
            </button>
          </div>

          {showEquipmentSelector && (
            <div className="equipment-selector">
              {equipmentList.length === 0 ? (
                <p className="no-equipment">Select vessel and technology to load equipment</p>
              ) : (
                <div className="equipment-list">
                  {equipmentList.map(eq => (
                    <div
                      key={eq.id}
                      className={`equipment-item ${selectedEquipment.find(e => e.id === eq.id) ? 'selected' : ''}`}
                      onClick={() => handleEquipmentToggle(eq)}
                    >
                      <div className="equipment-checkbox">
                        {selectedEquipment.find(e => e.id === eq.id) && <Check size={16} />}
                      </div>
                      <div className="equipment-info">
                        <span className="equipment-desc">{eq.equipmentDesc}</span>
                        <span className="equipment-location">{eq.area} - {eq.functionLocation}</span>
                      </div>
                      <span className="equipment-sap">{eq.sapNumber}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="selected-equipment">
            <h3>Selected Equipment ({selectedEquipment.length})</h3>
            {selectedEquipment.map(eq => (
              <div key={eq.id} className="selected-equipment-item">
                <div className="equipment-header">
                  <span className="equipment-name">{eq.equipmentDesc}</span>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleEquipmentToggle(eq)}
                  >
                    <Minus size={16} />
                  </button>
                </div>
                <div className="equipment-details">
                  <div className="condition-select">
                    <label>Condition:</label>
                    <select
                      value={eq.condition}
                      onChange={(e) => handleEquipmentCondition(eq.id, e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="attention">Attention Required</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="equipment-notes">
                    <label>Notes:</label>
                    <input
                      type="text"
                      value={eq.notes || ''}
                      onChange={(e) => handleEquipmentNotes(eq.id, e.target.value)}
                      placeholder="Add notes..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Findings & Recommendations</h2>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="General notes..."
            />
          </div>
          <div className="form-group">
            <label>Findings</label>
            <textarea
              name="findings"
              value={formData.findings}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe findings..."
            />
          </div>
          <div className="form-group">
            <label>Recommendations</label>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleInputChange}
              rows={4}
              placeholder="Recommendations..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <FileText size={18} />
            Submit Job Card
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobCardPage
