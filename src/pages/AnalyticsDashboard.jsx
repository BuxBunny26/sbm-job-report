import { useState, useEffect } from 'react'
import { VESSELS, TECHNOLOGIES, JOB_STATUSES } from '../config/appConfig'
import { supabase } from '../config/supabaseClient'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { BarChart3, TrendingUp, CheckCircle, Clock, Ship } from 'lucide-react'

function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    byVessel: [],
    byTechnology: [],
    byStatus: [],
    monthlyTrend: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('job_cards')
        .select('*')

      if (error) throw error
      processAnalytics(data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Demo data
      const demoData = generateDemoData()
      processAnalytics(demoData)
    } finally {
      setLoading(false)
    }
  }

  const generateDemoData = () => {
    const jobs = []
    const statuses = ['draft', 'in_progress', 'completed', 'approved']
    const vessels = ['saxi', 'mondo', 'ngoma']
    const techs = ['vibration', 'thermography']
    
    for (let i = 0; i < 50; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 180))
      jobs.push({
        id: i.toString(),
        vessel: vessels[Math.floor(Math.random() * vessels.length)],
        technology: techs[Math.floor(Math.random() * techs.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        created_at: date.toISOString()
      })
    }
    return jobs
  }

  const processAnalytics = (data) => {
    const byVessel = VESSELS.map(v => ({
      name: v.name,
      count: data.filter(d => d.vessel === v.id).length
    }))

    const byTechnology = TECHNOLOGIES.map(t => ({
      name: t.name,
      count: data.filter(d => d.technology === t.id).length
    }))

    const byStatus = JOB_STATUSES.map(s => ({
      name: s.name,
      count: data.filter(d => d.status === s.id).length,
      color: s.color
    }))

    // Monthly trend for last 6 months
    const monthlyTrend = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()
      const monthStart = new Date(year, date.getMonth(), 1)
      const monthEnd = new Date(year, date.getMonth() + 1, 0)
      
      const monthJobs = data.filter(d => {
        const jobDate = new Date(d.created_at)
        return jobDate >= monthStart && jobDate <= monthEnd
      })

      monthlyTrend.push({
        month: `${monthName} ${year}`,
        total: monthJobs.length,
        completed: monthJobs.filter(j => j.status === 'completed' || j.status === 'approved').length
      })
    }

    setStats({
      totalJobs: data.length,
      completedJobs: data.filter(d => d.status === 'completed' || d.status === 'approved').length,
      inProgressJobs: data.filter(d => d.status === 'in_progress').length,
      byVessel,
      byTechnology,
      byStatus,
      monthlyTrend
    })
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  if (loading) {
    return <div className="loading">Loading analytics...</div>
  }

  return (
    <div className="analytics-dashboard">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon blue">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalJobs}</span>
            <span className="stat-label">Total Job Cards</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.completedJobs}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.inProgressJobs}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Ship size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{VESSELS.length}</span>
            <span className="stat-label">Vessels</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Jobs" fill="#3b82f6" />
              <Bar dataKey="completed" name="Completed" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Jobs by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Jobs by Vessel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byVessel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Jobs by Technology</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byTechnology}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
