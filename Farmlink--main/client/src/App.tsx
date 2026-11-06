import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicHome } from './pages/Home';
import { Marketplace, ProductDetail } from './pages/Marketplace';
import { FarmTools } from './pages/FarmTools';
import { Dashboard, Assistant, Tasks, Weather, Prices, Profile, Admin, MyProducts } from './pages/Workspace';
import { Settings } from './pages/Settings';
import { CropHealth } from './pages/CropHealth';
import { ListingForm, AuthPage } from './pages/Forms';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage register />} />

      {/* ── 1. Dashboard ── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── 2. Market Place ── */}
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <AppShell>
              <Marketplace />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProductDetail />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── 3. Farm Tools  (Weather Forecast · Crop Health · AI Assistance) ── */}
      <Route
        path="/farm-tools"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools />
            </AppShell>
          </ProtectedRoute>
        }
      />
      {/* Legacy direct routes still work, forwarding into the farm-tools tab view */}
      <Route
        path="/crop-health"
        element={
          <ProtectedRoute>
            <AppShell>
              <CropHealth />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <AppShell>
              <Assistant />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <AppShell>
              <Weather />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── 4. Profile ── */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppShell>
              <Profile />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── 5. Settings ── */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <Settings />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ── Supporting Pages ── */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AppShell>
              <MyProducts />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/listing/new"
        element={
          <ProtectedRoute>
            <AppShell>
              <ListingForm />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AppShell>
              <Tasks />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prices"
        element={
          <ProtectedRoute>
            <AppShell>
              <Prices />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AppShell>
              <Admin />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<PublicHome />} />
    </Routes>
  );
}
