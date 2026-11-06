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

      {/* ── 2. Marketplace ── */}
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

      {/* ── 3. Farm Tools (AI-Powered 8 Tools Suite) ── */}
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
      {/* Direct routes forwarding into dedicated farm tools */}
      <Route
        path="/crop-health"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="crop-doctor" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="assistant" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="weather" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/planting-calendar"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="planting-calendar" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/farm-analytics"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="farm-analytics" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/smart-irrigation"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="smart-irrigation" />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/voice-assistant"
        element={
          <ProtectedRoute>
            <AppShell>
              <FarmTools defaultTab="voice-assistant" />
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
              <FarmTools defaultTab="market-prices" />
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
