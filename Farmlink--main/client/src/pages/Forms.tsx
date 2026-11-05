import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Plus, ArrowRight, MapPin, Eye, ShieldCheck, Upload, CircleAlert, Check, User, ShoppingBag, Truck } from 'lucide-react';
import { api } from '../services/api';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Brand, Field } from '../components';
import { PageTitle } from '../components';

const farmShowcaseImage = 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=85';

export function ListingForm(){
  const [saved,setSaved]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  async function submit(e:FormEvent){
    e.preventDefault();
    setBusy(true);
    setError('');
    const v=Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
    try{
      await api('/products',{
        method:'POST',
        body:JSON.stringify({
          name:v.name,
          category:v.category,
          description:v.description,
          price:Number(v.price),
          currency:v.currency,
          quantity:Number(v.quantity),
          unit:v.unit,
          location:v.location
        })
      });
      setSaved(true);
    }catch(e){
      setError(e instanceof Error?e.message:'Could not create listing.');
    }finally{
      setBusy(false);
    }
  }

  return (
    <>
      <Link to="/marketplace" className="back-link">← Back to Marketplace</Link>
      <PageTitle kicker="REACH MORE BUYERS" title="Create a product listing" sub="Share what you’re growing with Zimbabwe’s farming community."/>
      <div className="form-layout">
        <form className="panel listing-form" onSubmit={submit}>
          <div className="form-section-heading"><span>01</span><div><b>Product information</b><small>Tell buyers a little about your product.</small></div></div>
          <div className="form-grid">
            <Field label="Product name" name="name" required placeholder="e.g. Fresh sweet corn"/>
            <label className="field"><span>Category <i>*</i></span>
              <select name="category" required defaultValue="">
                <option value="" disabled>Select category</option>
                {['Vegetables', 'Fruits', 'Grains & Cereals', 'Livestock & Poultry', 'Equipment & Tools', 'Inputs & Seeds', 'Agro-Processed', 'Other'].map(x=><option key={x} value={x}>{x}</option>)}
              </select>
            </label>
            <label className="field full-field"><span>Description <i>*</i></span>
              <textarea name="description" required placeholder="Describe quality, harvest date, and anything buyers should know..." rows={4}/>
            </label>
          </div>
          <div className="form-section-heading separated"><span>02</span><div><b>Price & availability</b><small>Set your price and quantity.</small></div></div>
          <div className="form-grid">
            <Field label="Price per unit" name="price" required type="number" placeholder="e.g. 0.45"/>
            <label className="field"><span>Currency</span>
              <select name="currency"><option>USD</option><option>ZWL</option></select>
            </label>
            <Field label="Quantity available" name="quantity" required type="number" placeholder="e.g. 500"/>
            <label className="field"><span>Unit</span>
              <select name="unit"><option>kg</option><option>tonne</option><option>bag</option><option>head</option><option>unit</option></select>
            </label>
            <Field label="Location" name="location" required placeholder="e.g. Murehwa, Mashonaland East"/>
          </div>
          <div className="form-section-heading separated"><span>03</span><div><b>Product photos</b><small>Good photos help buyers understand your product.</small></div></div>
          <label className="upload-box"><Upload size={20}/><b>Drop images here, or browse</b><span>JPEG, PNG or WebP · Up to 5 images, 5 MB each</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>{if([...e.target.files||[]].some(f=>f.size>5*1024*1024))alert('Images must be 5 MB or less.')}}/></label>
          <div className="form-actions">
            <Link to="/marketplace" className="btn btn-outline">Cancel</Link>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy?'Saving…':<><Plus size={16}/> Create listing</>}</button>
          </div>
          {error&&<div className="error-note"><CircleAlert size={15}/>{error}</div>}
          {saved&&<div className="form-result"><CircleAlert size={16}/> Listing saved to your FarmLink account. It will appear publicly when its status is active.</div>}
        </form>
        <aside className="form-aside">
          <div className="listing-tip">
            <div className="feature-icon mint"><Sprout/></div>
            <span className="section-kicker">HELPFUL TIP</span>
            <h3>A little detail goes a long way.</h3>
            <p>Clear descriptions, honest quantities and good photos can help buyers make informed choices.</p>
          </div>
          <div className="listing-rules">
            <h3>Before you publish</h3>
            <p><Check size={15}/> Use clear, recent product photos</p>
            <p><Check size={15}/> Add an accurate location</p>
            <p><Check size={15}/> Keep quantity and price up to date</p>
            <small>Only list products you are authorised to sell.</small>
          </div>
        </aside>
      </div>
    </>
  );
}

export function AuthPage({ register = false }: { register?: boolean }) {
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer' | 'supplier'>('farmer');
  const [password, setPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const navigate = useNavigate();
  const { user, signInWithGoogle, setDemoUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
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
        const mockProfile = {
          id: mockUser.uid,
          full_name: mockUser.displayName,
          role: selectedRole,
          location: raw.location ? String(raw.location) : 'Harare, Zimbabwe',
        };
        setDemoUser(mockUser, mockProfile);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please verify your credentials.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div
        className="auth-photo"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(6,78,59,0.88) 0%, rgba(5,47,38,0.75) 100%), url(${farmShowcaseImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Brand light />
        <div className="auth-photo-copy">
          <span className="section-kicker" style={{ color: '#d9f99d' }}>ZIMBABWE'S PREMIER AGRI-COMMUNITY</span>
          <h1>Fresh harvests.<br />Empowered producers.</h1>
          <p>Connecting smallholders, commercial growers, grain buyers, and agricultural input distributors nationwide.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px', borderRadius: '10px' }}>
              <b style={{ color: '#fff', fontSize: '18px' }}>100%</b>
              <p style={{ margin: 0, fontSize: '11px', color: '#e2f5e8' }}>Direct Trade</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px', borderRadius: '10px' }}>
              <b style={{ color: '#fff', fontSize: '18px' }}>Mbare & Depots</b>
              <p style={{ margin: 0, fontSize: '11px', color: '#e2f5e8' }}>Price Tracking</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '12px', borderRadius: '10px' }}>
              <b style={{ color: '#fff', fontSize: '18px' }}>AI Advisor</b>
              <p style={{ margin: 0, fontSize: '11px', color: '#e2f5e8' }}>Agronomic Help</p>
            </div>
          </div>
          <div className="auth-photo-foot" style={{ marginTop: '35px' }}><Sprout size={16} /> FarmLink AI · Empowering Zimbabwean Agriculture</div>
        </div>
      </div>

      <div className="auth-form-side">
        <Link to="/" className="back-home">← Back to homepage</Link>
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-brand-mobile"><Brand /></div>
          <div className="auth-symbol"><Sprout size={24} /></div>
          <span className="section-kicker">{register ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}</span>
          <h2>{register ? 'Create your account' : 'Sign in'}</h2>
          <p>{register ? 'Select your role and start trading or managing farm operations.' : 'Sign in to access your farm workspace and active trade orders.'}</p>

          {/* Role Selection Tabs */}
          {register && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                I am signing up as:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRole('farmer')}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '10px',
                    border: selectedRole === 'farmer' ? '2px solid #087443' : '1px solid #d1d5db',
                    background: selectedRole === 'farmer' ? '#eaf5ed' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  <User size={18} color={selectedRole === 'farmer' ? '#087443' : '#64748b'} />
                  <b style={{ fontSize: '11px', color: selectedRole === 'farmer' ? '#087443' : '#1e293b' }}>Farmer / Grower</b>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('buyer')}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '10px',
                    border: selectedRole === 'buyer' ? '2px solid #087443' : '1px solid #d1d5db',
                    background: selectedRole === 'buyer' ? '#eaf5ed' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  <ShoppingBag size={18} color={selectedRole === 'buyer' ? '#087443' : '#64748b'} />
                  <b style={{ fontSize: '11px', color: selectedRole === 'buyer' ? '#087443' : '#1e293b' }}>Buyer / Trader</b>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('supplier')}
                  style={{
                    padding: '12px 6px',
                    borderRadius: '10px',
                    border: selectedRole === 'supplier' ? '2px solid #087443' : '1px solid #d1d5db',
                    background: selectedRole === 'supplier' ? '#eaf5ed' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all .2s ease',
                  }}
                >
                  <Truck size={18} color={selectedRole === 'supplier' ? '#087443' : '#64748b'} />
                  <b style={{ fontSize: '11px', color: selectedRole === 'supplier' ? '#087443' : '#1e293b' }}>Agri-Supplier</b>
                </button>
              </div>
            </div>
          )}

          <button type="button" className="btn-google" onClick={handleGoogleLogin} disabled={googleBusy}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleBusy ? 'Connecting to Google...' : register ? `Sign up as ${selectedRole} with Google` : 'Sign in with Google'}
          </button>

          <div className="auth-divider"><span>or continue with email</span></div>

          {register && (
            <>
              <Field label="Full name / Business Name" name="fullName" required placeholder="e.g. Tendai Chikore / Mashonaland Farms" />
              <Field label="Primary Location / Province" name="location" required placeholder="e.g. Harare, Mazowe, Mutare" />
            </>
          )}

          <Field label="Email address" name="email" required type="email" placeholder="you@farmmail.co.zw" />
          <label className="field">
            <span>Password</span>
            <div className="password-wrap">
              <input name="password" type={password ? 'text' : 'password'} placeholder="At least 8 characters" required minLength={8} />
              <button type="button" onClick={() => setPassword(!password)} aria-label="Toggle password">
                <Eye size={16} />
              </button>
            </div>
          </label>

          {error && <div className="error-note"><CircleAlert size={15} />{error}</div>}
          <button disabled={busy} className="btn btn-primary full-btn auth-submit" style={{ marginTop: '12px' }}>
            {busy ? 'Please wait…' : register ? `Create ${selectedRole} account` : 'Sign in'} <ArrowRight size={15} />
          </button>
          <div className="auth-switch">
            {register ? 'Already have an account?' : 'Don’t have an account?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create one'}</Link>
          </div>
        </form>
        <div className="auth-secure"><ShieldCheck size={14} /> Your data and trade listings are encrypted and secure</div>
      </div>
    </div>
  );
}
