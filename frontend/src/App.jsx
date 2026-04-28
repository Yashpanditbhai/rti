import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import RTIListPage from './pages/RTIListPage'
import RTIFormPage from './pages/RTIFormPage'
import RTIDetailsPage from './pages/RTIDetailsPage'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import PlaceholderPage from './pages/PlaceholderPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<RTIListPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rti/new" element={<RTIFormPage />} />
        <Route path="/rti/:id" element={<RTIDetailsPage />} />
        <Route path="/rti/:id/edit" element={<RTIFormPage />} />
        <Route path="/legal-cases" element={<PlaceholderPage title="Legal Cases" />} />
        <Route path="/hearings" element={<PlaceholderPage title="Hearings Calendar" />} />
        <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports & Analytics" />} />
        <Route path="/notifications" element={<PlaceholderPage title="Notifications & Settings" />} />
      </Route>
    </Routes>
  )
}

export default App
