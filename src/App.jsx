import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import JobCardPage from './pages/JobCardPage'
import JobCardListPage from './pages/JobCardListPage'
import DraftsPage from './pages/DraftsPage'
import EquipmentManagementPage from './pages/EquipmentManagementPage'
import EquipmentRequestPage from './pages/EquipmentRequestPage'
import MyRequestsPage from './pages/MyRequestsPage'
import RequestApprovalPage from './pages/RequestApprovalPage'
import UserManagementPage from './pages/UserManagementPage'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import KPITimelinePage from './pages/KPITimelinePage'
import DeviationDashboard from './pages/DeviationDashboard'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<HomePage />} />
              <Route path="job-card" element={<JobCardPage />} />
              <Route path="job-card/:id" element={<JobCardPage />} />
              <Route path="job-cards" element={<JobCardListPage />} />
              <Route path="drafts" element={<DraftsPage />} />
              <Route path="equipment" element={<EquipmentManagementPage />} />
              <Route path="equipment-request" element={<EquipmentRequestPage />} />
              <Route path="my-requests" element={<MyRequestsPage />} />
              <Route path="request-approval" element={<ProtectedRoute requiredRole="admin"><RequestApprovalPage /></ProtectedRoute>} />
              <Route path="user-management" element={<ProtectedRoute requiredRole="admin"><UserManagementPage /></ProtectedRoute>} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="kpi-timeline" element={<KPITimelinePage />} />
              <Route path="deviations" element={<DeviationDashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
