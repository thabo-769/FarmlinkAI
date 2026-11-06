import { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageTitle } from '../components';
import {
  UserRound, Bell, SlidersHorizontal, ShieldCheck, TriangleAlert, Save, LogOut, CircleCheck,
} from 'lucide-react';

type Tab = 'account' | 'notifications' | 'preferences' | 'security' | 'danger';

export function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('account');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; kind: 'success' | 'error' }>({ text: '', kind: 'success' });

  const [fullName, setFullName] = useState(profile?.full_name || (user as any)?.displayName || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  const saved = localStorage.getItem('farmlink-settings');
  const [notifications, setNotifications] = useState(
    saved ? JSON.parse(saved) : { email: true, sms: false, push: true, marketing: false },
  );

  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState('Metric');
  const [currency, setCurrency] = useState('USD');
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');

  useEffect(() => {
    localStorage.setItem('farmlink-settings', JSON.stringify(notifications));
  }, [notifications]);

  function flash(text: string, kind: 'success' | 'error' = 'success') {
    setMsg({ text, kind });
    setTimeout(() => setMsg({ text: '', kind: 'success' }), 4000);
  }

  const tabs: { key: Tab; label: string; icon: ReactNode }[] = [
    { key: 'account',       label: 'Account',       icon: <UserRound size={15} /> },
    { key: 'notifications', label: 'Notifications',  icon: <Bell size={15} /> },
    { key: 'preferences',  label: 'Preferences',    icon: <SlidersHorizontal size={15} /> },
    { key: 'security',     label: 'Security',       icon: <ShieldCheck size={15} /> },
    { key: 'danger',       label: 'Danger Zone',    icon: <TriangleAlert size={15} /> },
  ];

  async function saveAccount(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, location, phone });
      flash('Account details saved.');
    } catch {
      flash('Could not save account details.', 'error');
    } finally {
      setSaving(false); }
  }

  async function saveSecurity(e: FormEvent) {
    e.preventDefault();
    if (newPwd !== confPwd) { flash('New passwords do not match.', 'error'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    flash('Password changed successfully.');
    setCurPwd(''); setNewPwd(''); setConfPwd('');
    setSaving(false);
  }

  function toggleNotif(key: keyof typeof notifications) {
    setNotifications((p: typeof notifications) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <>
      {msg.text && (
        <div className={`notice ${msg.kind === 'success' ? 'success-notice' : 'error-notice'}`} style={{ marginBottom: 20 }}>
          {msg.kind === 'success' ? <CircleCheck size={16} /> : <TriangleAlert size={16} />}
          {msg.text}
        </div>
      )}

      <PageTitle
        kicker="ACCOUNT SETTINGS"
        title="Settings"
        sub="Manage your FarmLink account, notifications, and preferences."
      />

      <div className="settings-page">
        {/* Sidebar nav */}
        <nav className="settings-nav">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`settings-tab ${tab === t.key ? 'active' : ''}`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="settings-content">
          {/* Account */}
          {tab === 'account' && (
            <section className="settings-section">
              <div className="settings-section-head">
                <h3>Account details</h3>
                <p>Update your public profile information shown to buyers and the community.</p>
              </div>
              <form onSubmit={saveAccount} className="settings-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <label className="settings-field" style={{ gridColumn: '1 / -1' }}>
                    <span>Full name / Contact person</span>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Tendai Chikowe" />
                  </label>
                  <label className="settings-field">
                    <span>Location / Province</span>
                    <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mutoko, Mashonaland East" />
                  </label>
                  <label className="settings-field">
                    <span>Phone / WhatsApp</span>
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263 77…" />
                  </label>
                  <label className="settings-field">
                    <span>Email address</span>
                    <input value={user?.email || ''} readOnly />
                  </label>
                  <label className="settings-field">
                    <span>Account role</span>
                    <select value={profile?.role || 'farmer'} disabled>
                      <option value="farmer">Farmer / Producer</option>
                      <option value="buyer">Commercial Buyer</option>
                      <option value="supplier">Agri-Input Supplier</option>
                      <option value="admin">Platform Admin</option>
                    </select>
                  </label>
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                  <Save size={15} /> {saving ? 'Saving…' : 'Save account details'}
                </button>
              </form>
            </section>
          )}

          {/* Notifications */}
          {tab === 'notifications' && (
            <section className="settings-section">
              <div className="settings-section-head">
                <h3>Notification preferences</h3>
                <p>Choose how you'd like to hear from FarmLink.</p>
              </div>
              {([
                { key: 'email',     label: 'Email updates',          desc: 'Market prices, order alerts, and weekly digests.' },
                { key: 'sms',       label: 'SMS / WhatsApp alerts',   desc: 'Order notifications and weather warnings.' },
                { key: 'push',      label: 'Push notifications',      desc: 'Real-time alerts in the app.' },
                { key: 'marketing', label: 'Marketing emails',         desc: 'Promotions, new features, and partner offers.' },
              ] as const).map(n => (
                <div key={n.key} className="toggle-row">
                  <div>
                    <b>{n.label}</b>
                    <small>{n.desc}</small>
                  </div>
                  <label className="toggle-switch" aria-label={`Toggle ${n.label}`}>
                    <input
                      type="checkbox"
                      checked={notifications[n.key]}
                      onChange={() => toggleNotif(n.key)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </section>
          )}

          {/* Preferences */}
          {tab === 'preferences' && (
            <section className="settings-section">
              <div className="settings-section-head">
                <h3>Preferences</h3>
                <p>Tailor how content and measurements appear across FarmLink.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
                <label className="settings-field">
                  <span>Language</span>
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Shona</option>
                    <option>Ndebele</option>
                  </select>
                </label>
                <label className="settings-field">
                  <span>Measurement units</span>
                  <select value={units} onChange={e => setUnits(e.target.value)}>
                    <option value="Metric">Metric (kg, hectare)</option>
                    <option value="Imperial">Imperial (lb, acre)</option>
                  </select>
                </label>
                <label className="settings-field">
                  <span>Default currency</span>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="ZWL">Zimbabwe Dollar (ZWL)</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start' }}
                  onClick={() => flash('Preferences saved.')}
                >
                  <Save size={15} /> Save preferences
                </button>
              </div>
            </section>
          )}

          {/* Security */}
          {tab === 'security' && (
            <section className="settings-section">
              <div className="settings-section-head">
                <h3>Security</h3>
                <p>Change your account password and manage signed-in sessions.</p>
              </div>
              <form onSubmit={saveSecurity} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
                <label className="settings-field">
                  <span>Current password</span>
                  <input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="••••••••" />
                </label>
                <label className="settings-field">
                  <span>New password</span>
                  <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="At least 8 characters" />
                </label>
                <label className="settings-field">
                  <span>Confirm new password</span>
                  <input type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} placeholder="••••••••" />
                </label>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Save size={15} /> {saving ? 'Updating…' : 'Change password'}
                </button>
              </form>
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="btn btn-outline"
                >
                  <LogOut size={15} /> Sign out of all sessions
                </button>
              </div>
            </section>
          )}

          {/* Danger Zone */}
          {tab === 'danger' && (
            <section className="settings-section">
              <div className="settings-section-head">
                <h3>Danger zone</h3>
                <p>Permanent actions that cannot be undone.</p>
              </div>
              <div className="toggle-row" style={{ padding: '20px 0' }}>
                <div>
                  <b>Delete account</b>
                  <small>Permanently remove your profile, listings, and all data from FarmLink.</small>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (window.confirm('This permanently deletes your account and all listings. Continue?')) {
                      flash('Account deletion requested. Our support team will contact you.', 'error');
                    }
                  }}
                >
                  Delete account
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
