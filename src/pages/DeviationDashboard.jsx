import { useState, useEffect } from 'react'
import { VESSELS, TECHNOLOGIES } from '../config/appConfig'
import { AlertTriangle, CheckCircle, Clock, Filter, Search } from 'lucide-react'

function DeviationDashboard() {
  const [deviations, setDeviations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    vessel: '',
    severity: '',
    status: '',
    search: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchDeviations()
  }, [])

  const fetchDeviations = () => {
    setLoading(true)
    // Demo data
    const demoDeviations = [
      {
        id: '1',
        vessel: 'saxi',
        equipment: 'Main Engine - Port Side',
        type: 'Vibration Anomaly',
        severity: 'critical',
        status: 'open',
        description: 'High vibration levels detected at bearing #2',
        detectedDate: '2026-01-25',
        assignedTo: 'John Smith'
      },
      {
        id: '2',
        vessel: 'mondo',
        equipment: 'Generator #1',
        type: 'Temperature Warning',
        severity: 'warning',
        status: 'investigating',
        description: 'Elevated temperature on exhaust manifold',
        detectedDate: '2026-01-24',
        assignedTo: 'David Wilson'
      },
      {
        id: '3',
        vessel: 'ngoma',
        equipment: 'Main Switchboard Panel A',
        type: 'Thermal Hotspot',
        severity: 'attention',
        status: 'resolved',
        description: 'Hotspot detected on circuit breaker connections',
        detectedDate: '2026-01-20',
        resolvedDate: '2026-01-22',
        assignedTo: 'Michael Brown'
      },
      {
        id: '4',
        vessel: 'saxi',
        equipment: 'Cargo Pump #1',
        type: 'Vibration Anomaly',
        severity: 'warning',
        status: 'open',
        description: 'Imbalance detected in impeller',
        detectedDate: '2026-01-26',
        assignedTo: 'James Taylor'
      }
    ]
    setDeviations(demoDeviations)
    setLoading(false)
  }

  const filteredDeviations = deviations.filter(dev => {
    if (filters.vessel && dev.vessel !== filters.vessel) return false
    if (filters.severity && dev.severity !== filters.severity) return false
    if (filters.status && dev.status !== filters.status) return false
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        dev.equipment?.toLowerCase().includes(search) ||
        dev.description?.toLowerCase().includes(search) ||
        dev.type?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const getVesselName = (vesselId) => {
    return VESSELS.find(v => v.id === vesselId)?.name || vesselId
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'severity-critical'
      case 'warning': return 'severity-warning'
      case 'attention': return 'severity-attention'
      default: return ''
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} className="status-resolved" />
      case 'investigating':
        return <Clock size={16} className="status-investigating" />
      default:
        return <AlertTriangle size={16} className="status-open" />
    }
  }

  const stats = {
    total: deviations.length,
    critical: deviations.filter(d => d.severity === 'critical').length,
    open: deviations.filter(d => d.status === 'open').length,
    resolved: deviations.filter(d => d.status === 'resolved').length
  }

  return (
    <div className="deviation-dashboard">
      <div className="page-header">
        <h1>Deviation Dashboard</h1>
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="deviation-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Deviations</span>
        </div>
        <div className="stat-card critical">
          <span className="stat-value">{stats.critical}</span>
          <span className="stat-label">Critical</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-value">{stats.open}</span>
          <span className="stat-label">Open</span>
        </div>
        <div className="stat-card success">
          <span className="stat-value">{stats.resolved}</span>
          <span className="stat-label">Resolved</span>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Search</label>
            <div className="search-input">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search deviations..."
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
            <label>Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="attention">Attention</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading deviations...</div>
      ) : (
        <div className="deviations-grid">
          {filteredDeviations.length === 0 ? (
            <div className="empty-state">
              <CheckCircle size={48} />
              <h2>No Deviations Found</h2>
              <p>No deviations match your filter criteria</p>
            </div>
          ) : (
            filteredDeviations.map(dev => (
              <div key={dev.id} className={`deviation-card ${getSeverityClass(dev.severity)}`}>
                <div className="deviation-header">
                  <div className="deviation-type">
                    <AlertTriangle size={18} />
                    {dev.type}
                  </div>
                  <span className={`severity-badge ${getSeverityClass(dev.severity)}`}>
                    {dev.severity}
                  </span>
                </div>

                <div className="deviation-body">
                  <h3>{dev.equipment}</h3>
                  <p className="vessel">{getVesselName(dev.vessel)}</p>
                  <p className="description">{dev.description}</p>
                </div>

                <div className="deviation-footer">
                  <div className="deviation-meta">
                    <span className="detected">Detected: {dev.detectedDate}</span>
                    <span className="assigned">Assigned: {dev.assignedTo}</span>
                  </div>
                  <div className={`deviation-status ${dev.status}`}>
                    {getStatusIcon(dev.status)}
                    <span>{dev.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default DeviationDashboard
