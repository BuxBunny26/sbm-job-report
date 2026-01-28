import { useState, useEffect } from 'react'
import { VESSELS } from '../config/appConfig'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

function KPITimelinePage() {
  const [selectedVessel, setSelectedVessel] = useState('all')
  const [timeRange, setTimeRange] = useState('6months')
  const [kpiData, setKpiData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateKPIData()
  }, [selectedVessel, timeRange])

  const generateKPIData = () => {
    setLoading(true)
    
    const months = timeRange === '12months' ? 12 : timeRange === '6months' ? 6 : 3
    const data = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' })
      
      data.push({
        month: monthName,
        completionRate: Math.floor(70 + Math.random() * 25),
        equipmentCoverage: Math.floor(60 + Math.random() * 35),
        criticalFindings: Math.floor(Math.random() * 10),
        responseTime: Math.floor(24 + Math.random() * 48)
      })
    }
    
    setKpiData(data)
    setLoading(false)
  }

  const kpiMetrics = [
    { key: 'completionRate', name: 'Completion Rate (%)', color: '#10b981', target: 90 },
    { key: 'equipmentCoverage', name: 'Equipment Coverage (%)', color: '#3b82f6', target: 85 },
    { key: 'criticalFindings', name: 'Critical Findings', color: '#ef4444', target: null },
    { key: 'responseTime', name: 'Avg Response Time (hrs)', color: '#f59e0b', target: 48 }
  ]

  const getLatestValue = (key) => {
    if (kpiData.length === 0) return 'N/A'
    return kpiData[kpiData.length - 1][key]
  }

  const getTrend = (key) => {
    if (kpiData.length < 2) return 'neutral'
    const current = kpiData[kpiData.length - 1][key]
    const previous = kpiData[kpiData.length - 2][key]
    if (key === 'criticalFindings' || key === 'responseTime') {
      return current < previous ? 'up' : current > previous ? 'down' : 'neutral'
    }
    return current > previous ? 'up' : current < previous ? 'down' : 'neutral'
  }

  return (
    <div className="kpi-timeline-page">
      <div className="page-header">
        <h1>KPI Timeline</h1>
        <div className="header-controls">
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value)}
          >
            <option value="all">All Vessels</option>
            {VESSELS.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading KPI data...</div>
      ) : (
        <>
          <div className="kpi-cards">
            {kpiMetrics.map(metric => (
              <div key={metric.key} className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-name">{metric.name}</span>
                  <TrendingUp 
                    size={20} 
                    className={`trend-icon ${getTrend(metric.key)}`}
                  />
                </div>
                <div className="kpi-value" style={{ color: metric.color }}>
                  {getLatestValue(metric.key)}
                  {metric.key.includes('Rate') || metric.key.includes('Coverage') ? '%' : ''}
                </div>
                {metric.target && (
                  <div className="kpi-target">
                    Target: {metric.target}{metric.key.includes('Rate') || metric.key.includes('Coverage') ? '%' : ' hrs'}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="charts-section">
            <div className="chart-card full-width">
              <h3>Performance Metrics Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={kpiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="completionRate"
                    name="Completion Rate (%)"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="equipmentCoverage"
                    name="Equipment Coverage (%)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="criticalFindings"
                    name="Critical Findings"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card full-width">
              <h3>Response Time Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kpiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="responseTime"
                    name="Avg Response Time (hrs)"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default KPITimelinePage
