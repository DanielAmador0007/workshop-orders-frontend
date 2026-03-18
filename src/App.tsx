import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage, RegisterPage } from './pages/auth';
import { CustomersPage } from './pages/customers';
import { VehiclesPage } from './pages/vehicles';
import { WorkOrdersPage } from './pages/work-orders';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/work-orders" element={<WorkOrdersPage />} />
              <Route path="/" element={<Navigate to="/work-orders" replace />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
