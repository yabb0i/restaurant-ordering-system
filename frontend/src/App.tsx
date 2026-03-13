import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout';
import {
  HomePage,
  NotFoundPage,
  MenuPage,
  CartPage,
  ReservationPage,
  ModifyReservationPage,
  OrderConfirmationPage,
  ReservationConfirmationPage,
  LoginPage,
  RegisterPage,
  ProtectedRoute,
  StaffDashboard,
  ReservationListPage,
  OrderListPage,
  AssignTablePage,
  ManagerDashboard,
  MenuManagementPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/reservation/modify/:id" element={<ModifyReservationPage />} />
              <Route path="/order/confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/reservation/confirmation/:id" element={<ReservationConfirmationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Staff routes */}
              <Route
                path="/staff"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/reservations"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <ReservationListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/orders"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <OrderListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/tables"
                element={
                  <ProtectedRoute requiredRole="staff">
                    <AssignTablePage />
                  </ProtectedRoute>
                }
              />

              {/* Manager routes */}
              <Route
                path="/manager"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/menu"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <MenuManagementPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
