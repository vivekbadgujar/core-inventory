import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import ConnectionStatus from './components/ConnectionStatus'
import Dashboard from './pages/Dashboard'
import Delivery from './pages/Delivery'
import Location from './pages/Location'
import Login from './pages/Login'
import NewDelivery from './pages/NewDelivery'
import NewReceipt from './pages/NewReceipt'
import Receipts from './pages/Receipts'
import Settings from './pages/Settings'
import Stock from './pages/Stock'
import Warehouse from './pages/Warehouse'

function AppLayout() {
  return (
    <ProtectedRoute>
      <>
        <div className="min-h-screen bg-mesh">
          <div className="flex min-h-screen text-slate-100">
            <Sidebar />
            <div className="flex min-h-screen flex-1 flex-col">
              <Navbar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
        <ConnectionStatus />
      </>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stock" element={<Stock />} />
          <Route path="warehouse" element={<Warehouse />} />
          <Route path="location" element={<Location />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="receipts/new" element={<NewReceipt />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="delivery/new" element={<NewDelivery />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
