import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { VESSELS, TECHNOLOGIES, JOB_STATUSES } from '../config/appConfig'
import { supabase } from '../config/supabaseClient'
import { Eye, Edit, Download, Filter, Search, Trash2 } from 'lucide-react'

function JobCardListPage() {
  const navigate = useNavigate()
  const [jobCards, setJobCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    vessel: '',
    technology: '',
    status: '',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchJobCards()
  }, [])

  const fetchJobCards = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('job_cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setJobCards(data || [])
    } catch (error) {
      console.error('Error fetching job cards:', error)
      // Demo data for when Supabase is not configured
      setJobCards([
        {
          id: '1',
          job_number: 'JC-2601-001',
          vessel: 'saxi',
          technology: 'vibration',
          status: 'completed',
          date: '2026-01-15',
          technician: 'John Smith'
        },
        {
          id: '2',
          job_number: 'JC-2601-002',
          vessel: 'mondo',
          technology: 'thermography',
          status: 'in_progress',
          date: '2026-01-20',
          technician: 'David Wilson'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredJobCards = jobCards.filter(jc => {
    if (filters.vessel && jc.vessel !== filters.vessel) return false
    if (filters.technology && jc.technology !== filters.technology) return false
    if (filters.status && jc.status !== filters.status) return false
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        jc.job_number?.toLowerCase().includes(search) ||
        jc.technician?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const getVesselName = (vesselId) => {
    return VESSELS.find(v => v.id === vesselId)?.name || vesselId
  }

  const getTechnologyName = (techId) => {
    return TECHNOLOGIES.find(t => t.id === techId)?.name || techId
  }

  const getStatusInfo = (statusId) => {
    return JOB_STATUSES.find(s => s.id === statusId) || { name: statusId, color: '#6b7280' }
  }

  const handleDelete = async (jobCard) => {
    if (!confirm(`Are you sure you want to delete job card ${jobCard.job_number}?`)) return
    
    try {
      const { error } = await supabase
        .from('job_cards')
        .delete()
        .eq('id', jobCard.id)

      if (error) throw error
      setJobCards(prev => prev.filter(jc => jc.id !== jobCard.id))
    } catch (error) {
      console.error('Error deleting job card:', error)
      // Demo mode - still remove from UI
      setJobCards(prev => prev.filter(jc => jc.id !== jobCard.id))
    }
  }

  return (
    <div className="job-card-list-page">
      <div className="page-header">
        <h1>Job Cards</h1>
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Search</label>
            <div className="search-input">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search job number or technician..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Vessel</label>
            <select
              value={filters.vessel}
              onChange={(e) => setFilters(prev => ({ ...prev, vessel: e.target.value }))}
            >
              <option value="">All Vessels</option>
              {VESSELS.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Technology</label>
            <select
              value={filters.technology}
              onChange={(e) => setFilters(prev => ({ ...prev, technology: e.target.value }))}
            >
              <option value="">All Technologies</option>
              {TECHNOLOGIES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              {JOB_STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading job cards...</div>
      ) : (
        <div className="job-cards-table">
          <table>
            <thead>
              <tr>
                <th>Job Number</th>
                <th>Date</th>
                <th>Vessel</th>
                <th>Technology</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobCards.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No job cards found</td>
                </tr>
              ) : (
                filteredJobCards.map(jc => {
                  const status = getStatusInfo(jc.status)
                  return (
                    <tr key={jc.id}>
                      <td className="job-number">{jc.job_number}</td>
                      <td>{jc.date}</td>
                      <td>{getVesselName(jc.vessel)}</td>
                      <td>{getTechnologyName(jc.technology)}</td>
                      <td>{jc.technician}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: status.color }}
                        >
                          {status.name}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/job-card/${jc.id}`)}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/job-card/${jc.id}`)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button className="btn-icon" title="Download PDF">
                          <Download size={18} />
                        </button>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => handleDelete(jc)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default JobCardListPage
