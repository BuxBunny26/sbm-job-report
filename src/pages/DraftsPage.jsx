import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDrafts, deleteDraft } from '../services/draftService'
import { VESSELS, TECHNOLOGIES } from '../config/appConfig'
import { Edit, Trash2, Clock, FileText } from 'lucide-react'

function DraftsPage() {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    try {
      setLoading(true)
      const allDrafts = await getAllDrafts()
      setDrafts(allDrafts)
    } catch (error) {
      console.error('Error loading drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (draftId) => {
    if (!confirm('Are you sure you want to delete this draft?')) return
    try {
      await deleteDraft(draftId)
      setDrafts(prev => prev.filter(d => d.id !== draftId))
    } catch (error) {
      console.error('Error deleting draft:', error)
    }
  }

  const getVesselName = (vesselId) => {
    return VESSELS.find(v => v.id === vesselId)?.name || vesselId || 'Not set'
  }

  const getTechnologyName = (techId) => {
    return TECHNOLOGIES.find(t => t.id === techId)?.name || techId || 'Not set'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="drafts-page">
      <div className="page-header">
        <h1>Saved Drafts</h1>
        <p>Continue working on your saved job cards</p>
      </div>

      {loading ? (
        <div className="loading">Loading drafts...</div>
      ) : drafts.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h2>No Drafts Found</h2>
          <p>Your saved drafts will appear here</p>
          <button className="btn btn-primary" onClick={() => navigate('/job-card')}>
            Create New Job Card
          </button>
        </div>
      ) : (
        <div className="drafts-grid">
          {drafts.map(draft => (
            <div key={draft.id} className="draft-card">
              <div className="draft-header">
                <span className="draft-job-number">{draft.data?.jobNumber || 'Untitled'}</span>
                <span className="draft-time">
                  <Clock size={14} />
                  {formatDate(draft.data?.updatedAt)}
                </span>
              </div>
              <div className="draft-body">
                <div className="draft-info">
                  <span>Vessel: {getVesselName(draft.data?.vessel)}</span>
                  <span>Technology: {getTechnologyName(draft.data?.technology)}</span>
                  <span>Equipment: {draft.data?.equipment?.length || 0} items</span>
                </div>
              </div>
              <div className="draft-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/job-card/${draft.id}`)}
                >
                  <Edit size={16} />
                  Continue Editing
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(draft.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DraftsPage
