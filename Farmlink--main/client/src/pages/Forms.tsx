import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout, Plus, ArrowRight, Eye, ShieldCheck, Upload, CircleAlert,
  Check, User, ShoppingBag, Truck, EyeOff, ArrowLeft,
} from 'lucide-react';
import { api } from '../services/api';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Brand, Field } from '../components';
import { PageTitle } from '../components';

const farmShowcaseImage = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=85';

/* ── Listing Form ─────────────────────────────────────────── */
export function ListingForm() {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const v = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
    try {
      await api('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: v.name,
          category: v.category,
          description: v.description,
          price: Number(v.price),
          currency: v.currency,
          quantity: Number(v.quantity),
          unit: v.unit,
          location: v.location,
        }),
      });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create listing.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Link to="/marketplace" className="back-link">
        <ArrowLeft size={14} /> Back to Marketplace
      </Link>
      <PageTitle
        kicker="REACH MORE BUYERS"
        title="Create a product listing"
        sub="Share what you're growing with Zimbabwe's farming community."
      />
      <div className="form-layout">
        <form className="panel listing-form" onSubmit={submit}>
          {/* Section 01 */}
          <div className="form-section-heading">
            <span>01</span>
            <div>
              <b>Product information</b>
              <small>Tell buyers about your product.</small>
            </div>
          </div>
          <div className="form-grid">
            <Field label="Product name" name="name" required placeholder="e.g. Fresh sweet corn" />
            <label className="field">
              <span>Category <i>*</i></span>
              <select name="category" required defaultValue="">
                <option value="" disabled>Select category</option>
                {['Vegetables', 'Fruits', 'Grains & Cereals', 'Livestock & Poultry', 'Equipment & Tools', 'Inputs & Seeds', 'Agro-Processed', 'Other'].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="field full-field">
              <span>Description <i>*</i></span>
              <textarea
                name="description"
                required
                placeholder="Describe quality, harvest date, and anything buyers should know..."
                rows={4}
              />
            </label>
          </div>

          {/* Section 02 */}
          <div className="form-section-heading separated">
            <span>02</span>
            <div>
              <b>Price & availability</b>
              <small>Set your price and quantity.</small>
            </div>
          </div>
          <div className="form-grid">
            <Field label="Price per unit" name="price" required type="number" placeholder="0.45" />
            <label className="field">
              <span>Currency</span>
              <select name="currency">
                <option>USD</option>
                <option>ZWL</option>
              </select>
            </label>
            <Field label="Quantity available" name="quantity" required type="number" placeholder="500" />
            <label className="field">
              <span>Unit</span>
              <select name="unit">
                <option>kg</option>
                <option>tonne</option>
                <option>bag</option>
                <option>head</option>
                <option>crate</option>
                <option>pocket (10kg)</option>
                <option>unit</option>
              </select>
            </label>
            <Field label="Location" name="location" required placeholder="e.g. Murehwa, Mashonaland East" />
          </div>

          {/* Section 03 */}
          <div className="form-section-heading separated">
            <span>03</span>
            <div>
              <b>Product photos</b>
              <small>Good photos help buyers understand your product.</small>
            </div>
          </div>
          <label className="upload-box">
            <Upload size={22} />
            <b>Drop images here, or browse</b>
            <span>JPEG, PNG or WebP · Up to 5 images, 5 MB each</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={e => {
                if ([...(e.target.files || [])].some(f => f.size > 5 * 1024 * 1024)) {
                  alert('Images must be 5 MB or less.');
                }
              }}
            />
          </label>

          <div className="form-actions">
            <Link to="/marketplace" className="btn btn-outline">Cancel</Link>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : <><Plus size={15} /> Create listing</>}
            </button>
          </div>

          {error && (
            <div className="error-note">
              <CircleAlert size={14} /> {error}
            </div>
          )}
          {saved && (
            <div className="form-result">
              <Check size={15} /> Listing saved! It will appear publicly once approved.
            </div>
          )}
        </form>

        {/* Aside */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="listing-tip">
            <div style={{ width: 36, height: 36, background: '#edfaf3', borderRadius: 10, display: 'grid', placeItems: 'center', color: '#087443', marginBottom: 10, border: '1px solid #a7e8c4' }}>
              <Sprout size={18} />
            </div>
            <span className="section-kicker" style={{ marginBottom: 8 }}>HELPFUL TIP</span>
            <h3>A little detail goes a long way.</h3>
            <p>Clear descriptions, honest quantities, and good photos help buyers make informed choices.</p>
          </div>
          <div className="listing-rules">
            <h3>Before you publish</h3>
            <p><Check size={14} /> Use clear, recent product photos</p>
            <p><Check size={14} /> Add an accurate location</p>
            <p><Check size={14} /> Keep quantity and price up to date</p>
            <small>Only list products you are authorised to sell.</small>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ── Auth Page ────────────────────────────────────────────── */
export function AuthPage({ register = false }: { register?: boolean }) {
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | 'supplier'>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const navigate = useNavigate();
  const { user, signInWithGoogle, setDemoUser } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  async function handleGoogleLogin() {
    setGoogleBusy(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.message || 'Google sign in failed');
    } finally {
      setGoogleBusy(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const raw = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
    const email = String(raw.email);
    const pass = String(raw.password);
    try {
      const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      const isConfigured = Boolean(rawApiKey && rawApiKey !== 'AIzaSyDemoKeyForFarmLink' && !rawApiKey.includes('Demo'));
      if (isConfigured) {
        if (register) {
          await createUserWithEmailAndPassword(auth, email, pass);
        } else {
          await signInWithEmailAndPassword(auth, email, pass);
        }
      } else {
        const mockUser: any = {
          uid: 'user-' + Date.now(),
          email,
          displayName: raw.fullName ? String(raw.fullName) : email.split('@')[0],
        };
        setDemoUser(mockUser, {
          id: mockUser.uid,
          full_name: mockUser.displayName,
          role: selectedRole,
          location: raw.location ? String(raw.location) : 'Harare, Zimbabwe',
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please verify your credentials.');
    } finally {
      setBusy(false);
    }
  }

  const roles = [
    { id: 'farmer' as const, label: 'Farmer', sub: 'Grow & sell', icon: <User size={18} /> },
    { id: 'buyer' as const, label: 'Buyer', sub: 'Buy produce', icon: <ShoppingBag size={18} /> },
    { id: 'supplier' as const, label: 'Supplier', sub: 'Sell inputs', icon: <Truck size={18} /> },
  ];

  return (
    <div className="auth-page">
      {/* Left photo panel */}
      <div
        className="auth-photo"
        style={{
          backgroundImage: `linear-gradient(145deg, rgba(5,46,28,.92) 0%, rgba(6,78,48,.78) 100%), url(${farmShowcaseImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Brand light />
        <div className="auth-photo-copy">
          <span className="section-kicker" style={{ color: '#c8f07a', marginBottom: 14 }}>
            ZIMBABWE'S PREMIER AGRI-COMMUNITY
          </span>
          <h1>Fresh harvests.<br />Empowered producers.</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 28 }}>
            {[
              { val: '100%', label: 'Direct Trade' },
              { val: 'Mbare+', label: 'Price Tracking' },
              { val: 'AI 24/7', label: 'Agronomic Help' },
            ].map(s => (
              <div key={s.val} style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', padding: '13px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,.12)', textAlign: 'center' }}>
                <b style={{ color: '#fff', fontSize: 17, display: 'block', fontWeight: 800 }}>{s.val}</b>
                <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,.6)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-photo-foot">
          <Sprout size={15} /> FarmLink AI · Empowering Zimbabwean Agriculture
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className="auth-form-inner">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 28, background: 'var(--gray-50)', border: '1px solid var(--border)', padding: '7px 12px', borderRadius: 'var(--r)', transition: 'all .15s' }}>
            <ArrowLeft size={13} /> Back to homepage
          </Link>

          <span className="section-kicker" style={{ marginBottom: 8, display: 'block' }}>
            {register ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}
          </span>
          <h2>{register ? 'Create your account' : 'Sign in to FarmLink'}</h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24, marginTop: 6 }}>
            {register
              ? 'Select your role and start trading or managing farm operations.'
              : 'Sign in to access your farm workspace and trade listings.'}
          </p>

          {/* Role picker (register only) */}
          {register && (
            <div style={{ marginBottom: 22 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                I am signing up as:
              </span>
              <div className="role-picker">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    className={`role-btn ${selectedRole === r.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRole(r.id)}
                  >
                    {r.icon}
                    <b style={{ fontSize: 11.5 }}>{r.label}</b>
                    <span style={{ fontSize: 10, fontWeight: 400, color: 'inherit', opacity: .7 }}>{r.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Google button */}
          <button type="button" className="google-btn" onClick={handleGoogleLogin} disabled={googleBusy}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleBusy
              ? 'Connecting…'
              : register
                ? `Sign up as ${selectedRole} with Google`
                : 'Sign in with Google'}
          </button>

          <div className="auth-divider"><span>or continue with email</span></div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {register && (
              <>
                <Field label="Full name / Business name" name="fullName" required placeholder="e.g. Tendai Chikore" />
                <Field label="Location / Province" name="location" required placeholder="e.g. Harare, Mashonaland East" />
              </>
            )}
            <Field label="Email address" name="email" required type="email" placeholder="you@farmmail.co.zw" />
            <label className="field">
              <span>Password</span>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label="Toggle password visibility"
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="error-note">
                <CircleAlert size={14} /> {error}
              </div>
            )}

            <button
              disabled={busy}
              className="btn btn-primary full-btn"
              style={{ height: 44, fontSize: 13.5, marginTop: 4 }}
            >
              {busy
                ? 'Please wait…'
                : register
                  ? `Create ${selectedRole} account`
                  : 'Sign in to FarmLink'}
              {!busy && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="auth-form-footer" style={{ marginTop: 18 }}>
            {register ? 'Already have an account? ' : "Don't have an account? "}
            <Link to={register ? '/login' : '/register'}>
              {register ? 'Sign in' : 'Create one free'}
            </Link>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 14 }}>
            <ShieldCheck size={13} style={{ color: 'var(--brand-500)' }} />
            Your data and trade listings are encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
}
