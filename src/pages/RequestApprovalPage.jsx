import { useState, useEffect } from 'react'
import { VESSELS, TECHNOLOGIES } from '../config/appConfig'
import { supabase } from '../config/supabaseClient'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

function RequestApprovalPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const fetchPendingRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('equipment_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
      // Demo data
      setRequests([
        {
          id: '1',
          vessel: 'saxi',
          technology: 'vibration',
          equipment: [
            { equipmentDesc: 'Cooling Water Pump #3', area: 'Engine Room', functionLocation: 'Cooling System', justification: 'New pump installed during last maintenance' }
          ],
          requested_by_email: 'tech@wearcheck.com',
          status: 'pending',
          created_at: '2026-01-26T10:00:00Z'
        },
        {
          id: '2',
          vessel: 'ngoma',
          technology: 'thermography',
          equipment: [
            { equipmentDesc: 'Emergency Generator Panel', area: 'Electrical Room', functionLocation: 'Emergency Power', justification: 'Panel upgraded, needs thermal inspection' }
          ],
          requested_by_email: 'senior.tech@wearcheck.com',
          status: 'pending',
          created_at: '2026-01-27T08:30:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request) => {
    setProcessing(true)
    try {
      const { error } = await supabase
        .from('equipment_requests')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', request.id)

      if (error) throw error
      
      setRequests(prev => prev.filter(r => r.id !== request.id))
      setSelectedRequest(null)
      setReviewNotes('')
      alert('Request approved successfully!')
    } catch (error) {
      console.error('Error approving request:', error)
      // Demo mode
      setRequests(prev => prev.filter(r => r.id !== request.id))
      setSelectedRequest(null)
      setReviewNotes('')
      alert('Request approved (demo mode)')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (request) => {
    if (!reviewNotes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    
    setProcessing(true)
    try {
      const { error } = await supabase
        .from('equipment_requests')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', request.id)

      if (error) throw error
      
      setRequests(prev => prev.filter(r => r.id !== request.id))
      setSelectedRequest(null)
      setReviewNotes('')
      alert('Request rejected')
    } catch (error) {
      console.error('Error rejecting request:', error)
      // Demo mode
      setRequests(prev => prev.filter(r => r.id !== request.id))
      setSelectedRequest(null)
      setReviewNotes('')
      alert('Request rejected (demo mode)')
    } finally {
      setProcessing(false)
    }
  }

  const getVesselName = (vesselId) => {
    return VESSELS.find(v => v.id === vesselId)?.name || vesselId
  }

  const getTechnologyName = (techId) => {
    return TECHNOLOGIES.find(t => t.id === techId)?.name || techId
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="request-approval-page">
      <div className="page-header">
        <h1>Equipment Request Approval</h1>
        <p>Review and approve equipment requests from technicians</p>
      </div>

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h2>No Pending Requests</h2>
          <p>All equipment requests have been processed</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request.id} className="approval-card">
              <div className="card-header">
                <div className="request-info">
                  <span className="vessel-badge">{getVesselName(request.vessel)}</span>
                  <span className="tech-badge">{getTechnologyName(request.technology)}</span>
                </div>
                <span className="request-date">
                  <Clock size={14} />
                  {formatDate(request.created_at)}
                </span>
              </div>

              <div className="card-body">
                <p className="requester">Requested by: {request.requested_by_email}</p>
                
                <div className="equipment-list">
                  {request.equipment?.map((eq, index) => (
                    <div key={index} className="equipment-item">
                      <strong>{eq.equipmentDesc}</strong>
                      <span>{eq.area} - {eq.functionLocation}</span>
                      <p className="justification">{eq.justification}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(request)}
                >
                  <Eye size={16} />
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Request</h2>
            </div>
            <div className="modal-body">
              <div className="review-details">
                <p><strong>Vessel:</strong> {getVesselName(selectedRequest.vessel)}</p>
                <p><strong>Technology:</strong> {getTechnologyName(selectedRequest.technology)}</p>
                <p><strong>Requested by:</strong> {selectedRequest.requested_by_email}</p>
                <p><strong>Date:</strong> {formatDate(selectedRequest.created_at)}</p>
              </div>

              <div className="review-equipment">
                <h4>Equipment Requested:</h4>
                {selectedRequest.equipment?.map((eq, index) => (
                  <div key={index} className="review-equipment-item">
                    <p><strong>Description:</strong> {eq.equipmentDesc}</p>
                    <p><strong>Area:</strong> {eq.area}</p>
                    <p><strong>Function Location:</strong> {eq.functionLocation}</p>
                    <p><strong>SAP Number:</strong> {eq.sapNumber || 'Not provided'}</p>
                    <p><strong>Justification:</strong> {eq.justification}</p>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Review Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes (required for rejection)..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedRequest(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleReject(selectedRequest)}
                disabled={processing}
              >
                <XCircle size={16} />
                Reject
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleApprove(selectedRequest)}
                disabled={processing}
              >
                <CheckCircle size={16} />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestApprovalPage
