import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { VESSELS, TECHNOLOGIES } from '../config/appConfig'
import { supabase } from '../config/supabaseClient'
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react'

function MyRequestsPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [user])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('equipment_requests')
        .select('*')
        .eq('requested_by', user?.id)
        .order('created_at', { ascending: false })

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
          equipment: [{ equipmentDesc: 'New Pump Motor', area: 'Engine Room' }],
          status: 'pending',
          created_at: '2026-01-25T10:00:00Z'
        },
        {
          id: '2',
          vessel: 'mondo',
          technology: 'thermography',
          equipment: [{ equipmentDesc: 'Electrical Panel B2', area: 'Electrical Room' }],
          status: 'approved',
          created_at: '2026-01-20T14:30:00Z',
          reviewed_at: '2026-01-22T09:15:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getVesselName = (vesselId) => {
    return VESSELS.find(v => v.id === vesselId)?.name || vesselId
  }

  const getTechnologyName = (techId) => {
    return TECHNOLOGIES.find(t => t.id === techId)?.name || techId
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="status-icon approved" />
      case 'rejected':
        return <XCircle size={20} className="status-icon rejected" />
      default:
        return <Clock size={20} className="status-icon pending" />
    }
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
    <div className="my-requests-page">
      <div className="page-header">
        <h1>My Equipment Requests</h1>
        <p>Track the status of your equipment requests</p>
      </div>

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h2>No Requests Found</h2>
          <p>You haven't submitted any equipment requests yet</p>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map(request => (
            <div key={request.id} className={`request-card ${request.status}`}>
              <div className="request-header">
                <div className="request-status">
                  {getStatusIcon(request.status)}
                  <span className={`status-text ${request.status}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <span className="request-date">{formatDate(request.created_at)}</span>
              </div>

              <div className="request-body">
                <div className="request-meta">
                  <span><strong>Vessel:</strong> {getVesselName(request.vessel)}</span>
                  <span><strong>Technology:</strong> {getTechnologyName(request.technology)}</span>
                </div>

                <div className="request-equipment">
                  <h4>Requested Equipment:</h4>
                  <ul>
                    {request.equipment?.map((eq, index) => (
                      <li key={index}>
                        <strong>{eq.equipmentDesc}</strong>
                        <span>{eq.area} - {eq.functionLocation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {request.reviewed_at && (
                  <div className="request-review">
                    <span>Reviewed: {formatDate(request.reviewed_at)}</span>
                    {request.review_notes && (
                      <p className="review-notes">{request.review_notes}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRequestsPage
