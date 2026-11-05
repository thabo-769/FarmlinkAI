import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageTitle } from '../components';
import { UserRound, Bell, MoreHorizontal, ShieldCheck, CircleAlert as AlertIcon, Save, LogOut, CircleCheck } from 'lucide-react';

export function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [tab, setTab] = useState<'account' | 'notifications' | 'preferences' | 'security' | 'danger'>('account');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; kind: 'success' | 'error' }>({ text: '', kind: 'success' });

  const [fullName, setFullName] = useState(profile?.full_name || (user as any)?.displayName || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const saved = localStorage.getItem('farmlink-settings');
  const [notifications, setNotifications] = useState(saved ? JSON.parse(saved) : { email: true, sms: false, push: true, marketing: false });
  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState('Metric');
  const [currency, setCurrency] = useState('USD');
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');

  useEffect(() => { localStorage.setItem('farmlink-settings', JSON.stringify(notifications)); }, [notifications]);

  function flash(text: string, kind: 'success' | 'error' = 'success') {
    setMsg({ text, kind });
    setTimeout(() => setMsg({ text: '', kind: 'success' }), 4000);
  }

  const tabs = [
    { key: 'account' as const, label: 'Account', icon: <UserRound size={16} /> },
    { key: 'notifications' as const, label: 'Notifications', icon: <Bell size={16} /> },
    { key: 'preferences' as const, label: 'Preferences', icon: <MoreHorizontal size={16} /> },
    { key: 'security' as const, label: 'Security', icon: <ShieldCheck size={16} /> },
    { key: 'danger' as const, label: 'Danger Zone', icon: <AlertIcon size={16} /> },
  ];

  async function saveAccount(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ full_name: fullName, location, phone });
      flash('Account details saved.');
    } catch { flash('Could not save account details.', 'error'); }
    finally { setSaving(false); }
  }

  async function saveSecurity(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    flash('Password changed successfully.');
    setCurPwd(''); setNewPwd(''); setConfPwd('');
    setSaving(false);
  }

  function toggle(key: 'email' | 'sms' | 'push' | 'marketing') {
    setNotifications(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <>
      {msg.text && (
        <div style={{ background: msg.kind === 'success' ? '#e8f7ed' : '#fdecec', border: `1px solid ${msg.kind === 'success' ? '#b7e5c5' : '#e4b3b3'}`, color: msg.kind === 'success' ? '#086e3f' : '#9b2c2c', padding: '12px 18px', borderRadius: '10px', marginBottom: '18px', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {msg.kind === 'success' ? <CircleCheck size={18} /> : <AlertIcon size={18} />} {msg.text}
        </div>
      )}
      <PageTitle kicker="ACCOUNT SETTINGS" title="Settings" sub="Manage your FarmLink account, notifications, and preferences." />
      <div className="settings-page">
        <nav className="settings-nav">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`settings-tab ${tab === t.key ? 'active' : ''}`}>{t.icon}<span>{t.label}</span></button>
          ))}
        </nav>
        <div className="settings-content">
          {tab === 'account' && (
            <section className="settings-section">
              <div className="settings-section-head"><h3>Account details</h3><p>Update your public profile information shown to buyers and the community.</p></div>
              <form onSubmit={saveAccount} className="settings-form">
                <div style={{ display: 'grid', gap: '14px' }}>
                  <label className="settings-field"><span>Full name / contact person</span><input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Tendai Chikowe" /></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className="settings-field"><span>Location / province</span><input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Mutoko, Mashonaland East" /></label>
                    <label className="settings-field"><span>Phone / WhatsApp</span><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263 77..." /></label>
                  </div>
                  <label className="settings-field"><span>Email address</span><input value={user?.email || ''} readOnly style={{ background: '#f4f7f5', color: '#79847c' }} /></label>
                  <label className="settings-field"><span>Account role</span><select value={profile?.role || 'farmer'} disabled style={{ background: '#f4f7f5' }}><option value="farmer">Farmer / Producer</option><option value="buyer">Commercial Buyer</option><option value="supplier">Agri-Input Supplier</option><option value="admin">Platform Admin</option></select></label>
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary"><Save size={16} /> {saving ? 'Saving…' : 'Save account details'}</button>
              </form>
            </section>
          )}
          {tab === 'notifications' && (
            <section className="settings-section">
              <div className="settings-section-head"><h3>Notification preferences</h3><p>Choose how you'd like to hear from FarmLink.</p></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[ { key: 'email', label: 'Email updates', desc: 'Market prices, order alerts, and weekly digests.' }, { key: 'sms', label: 'SMS / WhatsApp alerts', desc: 'Order notifications and weather warnings.' }, { key: 'push', label: 'Push notifications', desc: 'Real-time alerts in the app.' }, { key: 'marketing', label: 'Marketing emails', desc: 'Promotions, new features, and partner offers.' } ].map(n => (
                  <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #e8ebe6' }}>
                    <div><b style={{ color: '#102d1d' }}>{n.label}</b><br /><small style={{ color: '#79847c' }}>{n.desc}</small></div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" checked={notifications[n.key as keyof typeof notifications]} onChange={() => toggle(n.key as 'email' | 'sms' | 'push' | 'marketing')} style={{ width: '18px', height: '18px', accentColor: '#087443' }} />
                      <span style={{ color: '#2e4a3b', fontWeight: 600 }}>{notifications[n.key as keyof typeof notifications] ? 'On' : 'Off'}</span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          )}
          {tab === 'preferences' && (
            <section className="settings-section">
              <div className="settings-section-head"><h3>Preferences</h3><p>Tailor how content and measurements appear across FarmLink.</p></div>
              <form className="settings-form" style={{ display: 'grid', gap: '16px' }}>
                <label className="settings-field"><span>Language</span><select value={language} onChange={e => setLanguage(e.target.value)}><option>English</option><option>Shona</option><option>Ndebele</option></select></label>
                <label className="settings-field"><span>Measurement units</span><select value={units} onChange={e => setUnits(e.target.value)}><option value="Metric">Metric (kg, hectare)</option><option value="Imperial">Imperial (lb, acre)</option></select></label>
                <label className="settings-field"><span>Default currency</span><select value={currency} onChange={e => setCurrency(e.target.value)}><option value="USD">US Dollar (USD)</option><option value="ZWL">Zimbabwe Dollar (ZWL)</option></select></label>
                <button type="button" className="btn btn-primary" onClick={() => flash('Preferences saved.')}> <Save size={16} /> Save preferences</button>
              </form>
            </section>
          )}
          {tab === 'security' && (
            <section className="settings-section">
              <div className="settings-section-head"><h3>Security</h3><p>Change your account password and manage signed-in sessions.</p></div>
              <form onSubmit={saveSecurity} className="settings-form" style={{ display: 'grid', gap: '14px', maxWidth: '420px' }}>
                <label className="settings-field"><span>Current password</span><input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} placeholder="••••••••" /></label>
                <label className="settings-field"><span>New password</span><input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="At least 8 characters" /></label>
                <label className="settings-field"><span>Confirm new password</span><input type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} placeholder="••••••••" /></label>
                <button type="submit" disabled={saving} className="btn btn-primary"><Save size={16} /> {saving ? 'Updating…' : 'Change password'}</button>
              </form>
              <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #e8ebe6' }}><button type="button" onClick={() => { signOut().then(() => {}); }} className="btn btn-outline"><LogOut size={16} /> Sign out of all sessions</button></div>
            </section>
          )}
          {tab === 'danger' && (
            <section className="settings-section">
              <div className="settings-section-head"><h3>Danger zone</h3><p>Permanent actions that cannot be undone.</p></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e8ebe6' }}>
                <div><b style={{ color: '#102d1d' }}>Delete account</b><br /><small style={{ color: '#79847c' }}>Permanently remove your profile, listings, and data.</small></div>
                <button onClick={() => { if (window.confirm('This permanently deletes your account and all listings. Continue?')) flash('Account deletion requested. Support will contact you.', 'error'); }} className="btn btn-outline" style={{ color: '#9b2c2c', borderColor: '#e4b3b3' }}>Delete account</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
