import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signOut as fbSignOut, isFirebaseConfigured } from '../services/firebase';
import { api } from '../services/api';

export interface AuthProfile {
  id: string;
  full_name: string;
  role: string;
  location?: string;
  phone?: string;
  farm_name?: string;
  farm_size?: string;
  farming_type?: string;
  bio?: string;
  avatar_path?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setDemoUser: (user: any, profile: AuthProfile) => void;
  updateProfile: (updated: Partial<AuthProfile>) => Promise<AuthProfile>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  setDemoUser: () => {},
  updateProfile: async () => ({ id: '', full_name: '', role: 'farmer' }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    const savedToken = localStorage.getItem('farmlink-token');
    const savedUser = localStorage.getItem('farmlink-user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed.user);
        setProfile(parsed.profile);
      } catch (e) {
        console.warn('Could not parse saved user session', e);
      }
    }

    if (isFirebaseConfigured) {
      const unsubscribe = auth.onIdTokenChanged(async (currentUser) => {
        if (currentUser) {
          const token = await currentUser.getIdToken();
          localStorage.setItem('farmlink-token', token);
          setUser(currentUser);

          const prof = {
            id: currentUser.uid,
            full_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Farmer',
            role: 'farmer',
            location: 'Zimbabwe',
          };
          setProfile(prof);
          localStorage.setItem('farmlink-user', JSON.stringify({ user: currentUser, profile: prof }));
        } else if (!localStorage.getItem('farmlink-user')) {
          localStorage.removeItem('farmlink-token');
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  function setDemoUser(demoUser: any, demoProfile: AuthProfile) {
    setUser(demoUser);
    setProfile(demoProfile);
    localStorage.setItem('farmlink-token', 'demo-token-' + Date.now());
    localStorage.setItem('farmlink-user', JSON.stringify({ user: demoUser, profile: demoProfile }));
  }

  async function signInWithGoogle() {
    if (isFirebaseConfigured) {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const token = await result.user.getIdToken();
        localStorage.setItem('farmlink-token', token);
        setUser(result.user);
      }
    } else {
      // Instant development mock sign-in
      const mockUser: any = {
        uid: 'google-farmer-' + Math.floor(Math.random() * 1000),
        displayName: 'Google Member',
        email: 'member@gmail.com',
      };
      const mockProfile: AuthProfile = {
        id: mockUser.uid,
        full_name: mockUser.displayName,
        role: 'farmer',
        location: 'Harare, Zimbabwe',
      };
      setDemoUser(mockUser, mockProfile);
    }
  }

  async function updateProfile(updated: Partial<AuthProfile>): Promise<AuthProfile> {
    const current = profile || {
      id: user?.uid || 'user-1',
      full_name: user?.displayName || (user?.email ? user.email.split('@')[0] : 'Farmer'),
      role: 'farmer',
      location: 'Zimbabwe',
    };
    const newProf: AuthProfile = {
      ...current,
      ...updated,
    };
    setProfile(newProf);
    localStorage.setItem('farmlink-user', JSON.stringify({ user, profile: newProf }));

    try {
      await api<{ data: AuthProfile }>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('Could not sync profile to backend', e);
    }

    return newProf;
  }

  async function signOut() {
    if (isFirebaseConfigured) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Could not complete Firebase sign out', e);
      }
    }
    localStorage.removeItem('farmlink-token');
    localStorage.removeItem('farmlink-user');
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, setDemoUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
