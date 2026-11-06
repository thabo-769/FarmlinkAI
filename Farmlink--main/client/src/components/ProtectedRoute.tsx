import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';
import { Sprout } from 'lucide-react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #087843, #064e30)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(8,120,67,.3)',
          }}>
            <Sprout size={26} />
          </div>
          <div>
            <div style={{
              width: 180,
              height: 4,
              background: 'var(--gray-100)',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--brand-600), var(--brand-300))',
                borderRadius: 4,
                animation: 'slideIn 1.4s ease infinite',
              }} />
            </div>
            <p style={{ fontWeight: 600, color: 'var(--brand-700)', marginTop: 12, fontSize: 14 }}>
              Loading FarmLink AI…
            </p>
          </div>
        </div>
        <style>{`
          @keyframes slideIn {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
