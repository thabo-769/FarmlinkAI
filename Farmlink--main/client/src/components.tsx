import { useState, useEffect, type ReactNode } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout, Menu, X, CloudSun, Bot, Store,
  Bell, Settings, LogOut, ArrowRight, ArrowLeft, ChevronRight,
  MapPin, Heart, Sun, CalendarDays, CircleCheck,
  UserRound,
  ArrowUpRight,
  ScanLine, Moon, Wrench, ChevronDown, LayoutDashboard,
  TrendingUp, BarChart3, Droplets, Mic,
} from 'lucide-react';
import type { Product } from './types';
import { useAuth } from './context/AuthContext';

export const heroImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=90';

/* ── Brand ─────────────────────────────────────────────────── */
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand-light' : ''}`}>
      <span className="brand-mark">
        <Sprout size={18} />
      </span>
      <span>FarmLink <b>AI</b></span>
    </Link>
  );
}

/* ── Public Header ──────────────────────────────────────────── */
export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header
      className="public-header"
      style={{ boxShadow: scrolled ? '0 2px 18px rgba(0,0,0,.07)' : undefined }}
    >
      <Brand />
      <nav className="public-nav">
        <a href="/#how-it-works">How it works</a>
        <a href="/#marketplace">Marketplace</a>
        <a href="/#weather">Weather</a>
        <a href="/#prices">Prices</a>
        <a href="/#ai-assistant">AI Assistant</a>
      </nav>
      <div className="header-actions">
        <Link to="/login" className="btn btn-quiet">Log in</Link>
        <Link to="/register" className="btn btn-primary">
          Get started <ArrowRight size={14} />
        </Link>
      </div>
      <Link className="mobile-nav-link" to="/login">Log in</Link>
    </header>
  );
}

/* ── Sidebar ────────────────────────────────────────────────── */
function SidebarWithOpen({ open, close }: { open: boolean; close: () => void }) {
  return <Sidebar open={open} close={close} />;
}

export function Sidebar({ open = false, close }: { open?: boolean; close?: () => void }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() || 'FL');

  const displayName = profile?.full_name || (user as any)?.displayName || user?.email?.split('@')[0] || 'Farmer';
  const roleDisplay = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : 'Farmer';
  const locDisplay = profile?.location || 'Zimbabwe';

  const isFarmToolsActive =
    location.pathname.startsWith('/farm-tools') ||
    location.pathname === '/crop-health' ||
    location.pathname === '/assistant' ||
    location.pathname === '/weather' ||
    location.pathname === '/prices';

  const [farmToolsOpen, setFarmToolsOpen] = useState(true);

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 14px 16px' }}>
        {/* Top */}
        <div className="side-top">
          <Brand light />
          <button
            className="icon-button mobile-only"
            onClick={close}
            aria-label="Close navigation"
            style={{ color: 'rgba(255,255,255,.5)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* User card */}
        <div
          className="side-user"
          onClick={() => { navigate('/profile'); close?.(); }}
        >
          <div className="avatar">{initials}</div>
          <div>
            <strong>{displayName}</strong>
            <small>{roleDisplay} · {locDisplay}</small>
          </div>
          <ChevronRight size={14} style={{ color: 'rgba(255,255,255,.25)', flexShrink: 0 }} />
        </div>

        <div className="side-label">Menu</div>

        <nav className="side-nav">
          <NavLink
            to="/dashboard"
            onClick={close}
            className={({ isActive }) => `side-link ${isActive ? 'selected' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/marketplace"
            onClick={close}
            className={({ isActive }) => `side-link ${isActive ? 'selected' : ''}`}
          >
            <Store size={16} />
            <span>Marketplace</span>
          </NavLink>

          {/* Farm Tools collapsible */}
          <div className="side-group">
            <button
              type="button"
              className={`side-link side-group-toggle ${isFarmToolsActive ? 'selected' : ''}`}
              onClick={() => setFarmToolsOpen(o => !o)}
              aria-expanded={farmToolsOpen}
            >
              <Wrench size={16} />
              <span>Farm Tools</span>
              <ChevronDown
                size={13}
                style={{
                  marginLeft: 'auto',
                  opacity: 0.5,
                  transform: farmToolsOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform .2s',
                }}
              />
            </button>

            {farmToolsOpen && (
              <div className="side-sub-nav">
                <NavLink
                  to="/farm-tools?tool=assistant"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=assistant') || location.pathname === '/assistant' ? 'selected' : ''}`
                  }
                >
                  <Bot size={14} />
                  <span>AI Farming Assistant</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=crop-doctor"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=crop-doctor') || location.pathname === '/crop-health' ? 'selected' : ''}`
                  }
                >
                  <ScanLine size={14} />
                  <span>AI Crop Doctor</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=weather"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=weather') || location.pathname === '/weather' ? 'selected' : ''}`
                  }
                >
                  <CloudSun size={14} />
                  <span>AI Weather Intelligence</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=market-prices"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=market-prices') || location.pathname === '/prices' ? 'selected' : ''}`
                  }
                >
                  <TrendingUp size={14} />
                  <span>AI Market Prices</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=planting-calendar"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=planting-calendar') ? 'selected' : ''}`
                  }
                >
                  <CalendarDays size={14} />
                  <span>AI Planting Calendar</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=farm-analytics"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=farm-analytics') ? 'selected' : ''}`
                  }
                >
                  <BarChart3 size={14} />
                  <span>AI Farm Analytics</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=smart-irrigation"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=smart-irrigation') ? 'selected' : ''}`
                  }
                >
                  <Droplets size={14} />
                  <span>AI Smart Irrigation</span>
                </NavLink>

                <NavLink
                  to="/farm-tools?tool=voice-assistant"
                  onClick={close}
                  className={() =>
                    `side-sub-link ${location.search.includes('tool=voice-assistant') ? 'selected' : ''}`
                  }
                >
                  <Mic size={14} />
                  <span>AI Voice Assistant</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/profile"
            onClick={close}
            className={({ isActive }) => `side-link ${isActive ? 'selected' : ''}`}
          >
            <UserRound size={16} />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={close}
            className={({ isActive }) => `side-link ${isActive ? 'selected' : ''}`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div style={{ flex: 1 }} />

        {/* Logout */}
        <div className="side-logout-section">
          <button
            type="button"
            className="side-logout-full-btn"
            onClick={async () => {
              await signOut();
              navigate('/login');
              close?.();
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>

        <div className="side-bottom">
          <small className="side-copy">© 2025 FarmLink AI · Zimbabwe</small>
        </div>
      </div>
    </aside>
  );
}

/* ── Product Card ───────────────────────────────────────────── */
export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <article className={`product-card ${compact ? 'compact-card' : ''}`}>
      <Link className="product-photo" to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="photo-tag">{product.category}</span>
        <button
          className="favorite"
          aria-label="Save listing"
          onClick={e => {
            e.preventDefault();
            e.currentTarget.classList.toggle('is-liked');
          }}
        >
          <Heart size={15} />
        </button>
      </Link>
      <div className="product-info">
        <div className="product-title">
          <Link to={`/product/${product.id}`}>
            <h3>{product.name}</h3>
          </Link>
          <span className="availability-dot">In stock</span>
        </div>
        <p className="product-meta">
          <MapPin size={11} />
          {product.location}
        </p>
        <div className="product-footer">
          <div>
            <b>${product.price.toFixed(2)}</b>
            <span> / {product.unit}</span>
            <small>{product.quantity.toLocaleString()} {product.unit} available</small>
          </div>
          <Link to={`/product/${product.id}`} className="btn btn-small">
            View <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── App Shell ──────────────────────────────────────────────── */
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('farmlink-theme') as 'light' | 'dark') || 'light';
  });
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() || 'FL');

  const locDisplay = profile?.location || 'Harare, Zimbabwe';

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('farmlink-theme', theme);
  }, [theme]);

  // Close sidebar on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  function toggleTheme() {
    setTheme(p => p === 'light' ? 'dark' : 'light');
  }

  const crumbMap: Record<string, string> = {
    '/dashboard':   'Dashboard',
    '/marketplace': 'Marketplace',
    '/products':    'My Products',
    '/farm-tools':  'Farm Tools',
    '/crop-health': 'Farm Tools / Crop Health',
    '/assistant':   'Farm Tools / AI Assistance',
    '/weather':     'Farm Tools / Weather',
    '/profile':     'Profile',
    '/settings':    'Settings',
    '/tasks':       'Tasks',
    '/prices':      'Market Prices',
    '/listing/new': 'Marketplace / New Listing',
    '/admin':       'Admin',
  };
  const crumbName = crumbMap[location.pathname]
    ?? (location.pathname.startsWith('/product/') ? 'Marketplace / Product' : 'Page');

  return (
    <div className="app-shell">
      {open && (
        <button
          className="scrim"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      <SidebarWithOpen open={open} close={() => setOpen(false)} />

      <main className="app-main">
        {/* Mobile top bar */}
        <div className="mobile-top">
          <button
            className="icon-button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <Brand />
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Desktop topbar */}
        <div className="topbar">
          <button
            className="icon-button"
            onClick={() => navigate(-1)}
            title="Go back"
            style={{ marginRight: 4 }}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="crumb">
            FarmLink
            <ChevronRight size={13} />
            <span>{crumbName}</span>
          </div>
          <div className="top-actions">
            <span className="top-location">
              <MapPin size={12} /> {locDisplay}
            </span>
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={17} />
              <i />
            </button>
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link to="/profile" aria-label="Go to profile">
              <div className="avatar small-avatar">{initials}</div>
            </Link>
          </div>
        </div>

        <div className="page-content">{children}</div>
        <footer className="app-footer">
          <Brand />
          <span>© {new Date().getFullYear()} FarmLink AI. Built for farmers across Zimbabwe.</span>
          <nav className="app-footer-links" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/farm-tools">Farm Tools</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}

/* ── Page Title ─────────────────────────────────────────────── */
export function PageTitle({
  kicker,
  title,
  sub,
  action,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        {kicker && <span className="section-kicker">{kicker}</span>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/* ── Metric Card ────────────────────────────────────────────── */
export function Metric({
  icon,
  label,
  value,
  foot,
  tint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  foot: string;
  tint: string;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tint}`}>{icon}</div>
      <span>{label}</span>
      <b>{value}</b>
      <small>{foot}</small>
    </div>
  );
}

/* ── Task Row ───────────────────────────────────────────────── */
export function TaskRow({
  icon,
  title,
  detail,
  when,
  kind,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  when: string;
  kind: string;
}) {
  return (
    <div className="task-row">
      <div className={`task-icon ${kind}`}>{icon}</div>
      <div className="task-copy">
        <b>{title}</b>
        <small>{detail}</small>
      </div>
      <span className={`task-date ${when === 'Today' ? 'due' : ''}`}>
        <CalendarDays size={12} />
        {when}
      </span>
      <button className="check-task" aria-label="Mark task complete">
        <CircleCheck size={17} />
      </button>
    </div>
  );
}

/* ── Quick Action ───────────────────────────────────────────── */
export function QuickAction({
  icon,
  title,
  to,
}: {
  icon: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <Link className="quick-action" to={to}>
      <span>{icon}</span>
      <b>{title}</b>
      <ArrowUpRight size={12} />
    </Link>
  );
}

/* ── Field ──────────────────────────────────────────────────── */
export function Field({
  label,
  required,
  placeholder,
  type = 'text',
  name,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  type?: string;
  name?: string;
}) {
  return (
    <label className="field">
      <span>
        {label} {required && <i>*</i>}
      </span>
      <input
        name={name || label.toLowerCase().replaceAll(' ', '_')}
        type={type}
        placeholder={placeholder}
        required={required}
        min={type === 'number' ? '0' : undefined}
      />
    </label>
  );
}

/* ── Empty State ────────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}
