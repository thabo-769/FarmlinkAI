import { Link } from 'react-router-dom';
import {
  Sprout, Bot, Store, CloudSun, BarChart3, ArrowRight,
  Check, ChevronRight, Camera,
  Award, Clock,
} from 'lucide-react';
import { Brand, PublicHeader } from '../components';

const heroAfricanFarm = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=90';
const farmerInField   = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85';
const womanFarmer     = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
const pfumvudzaPlot   = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef2364c?auto=format&fit=crop&w=800&q=80';

const FEATURES = [
  {
    id: 'ai-assistant',
    tag: '24/7 Agro AI',
    tagColor: '#087443',
    img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'AI farming assistant',
    title: 'AI Farming Assistant',
    desc: 'Ask complex questions in plain language about fertilizer rates, crop rotations, soil acidity, and livestock healthcare. Available 24/7 with Zimbabwean agronomic context.',
    to: '/assistant',
    cta: 'Ask AI Assistant',
    icon: <Bot size={15} />,
  },
  {
    id: 'crop-health',
    tag: 'Camera Vision',
    tagColor: '#c45a1b',
    img: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Crop disease scanner',
    title: 'Crop Disease Scanner',
    desc: 'Snap a photo of diseased leaves or stems. Our AI vision system inspects symptoms and suggests safe, effective treatments immediately.',
    to: '/farm-tools?tool=crop-health',
    cta: 'Scan Crops',
    icon: <Camera size={15} />,
  },
  {
    id: 'weather',
    tag: 'Live Satellite',
    tagColor: '#1e6eb5',
    img: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Agro weather forecast',
    title: 'Agro Weather',
    desc: 'Real-time satellite forecasts for Harare, Mutoko, Masvingo, Bulawayo and regional hubs. Rain chances, wind speeds, and spraying condition alerts.',
    to: '/farm-tools?tool=weather',
    cta: 'Check Forecast',
    icon: <CloudSun size={15} />,
  },
  {
    id: 'tasks',
    tag: 'Fieldwork',
    tagColor: '#7a31b8',
    img: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Farm irrigation timer',
    title: 'Fieldwork Timers',
    desc: 'Organize your seasonal field schedule with built-in activity timers for irrigation blocks, chemical agitation, fertilizer soaking, and fieldwork sessions.',
    to: '/tasks',
    cta: 'Manage Tasks',
    icon: <Clock size={15} />,
  },
  {
    id: 'marketplace',
    tag: 'Direct Trade',
    tagColor: '#087443',
    img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Agricultural marketplace',
    title: 'Agri Marketplace',
    desc: 'Buy and sell vegetables, fruits, certified seeds, fertilisers, solar pumps, and livestock directly. Transparent listings with real contact info.',
    to: '/marketplace',
    cta: 'Browse Listings',
    icon: <Store size={15} />,
  },
  {
    id: 'prices',
    tag: 'Sourced Daily',
    tagColor: '#b88909',
    img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=900&q=80',
    imgAlt: 'Market prices',
    title: 'Market Prices',
    desc: 'Live price records from AMA, Mbare Musika, Bulawayo Wholesale, Sakubva and GMB depot floor prices — stop distress selling.',
    to: '/prices',
    cta: 'Explore Prices',
    icon: <BarChart3 size={15} />,
  },
];

const TESTIMONIALS = [
  {
    quote: 'Before FarmLink, I lost 25% of every tomato harvest to predatory middlemen at Mbare Musika. Now I sell directly to grocery retailers in Harare and set my own price.',
    name: 'Tendai Moyo', role: 'Horticulture Smallholder', location: 'Mutoko, Mashonaland East',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The camera disease scanner detected early fall armyworm on my maize 5 days before I noticed it myself. The treatment saved over 4 hectares of crop.',
    name: 'Rudo Chikowe', role: 'Grain & Poultry Farmer', location: 'Bindura, Mashonaland Central',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'As a wholesale buyer in Bulawayo, FarmLink lets us trace produce directly to the grower. The quality is fresher and farmers get paid immediately.',
    name: 'Farai Dube', role: 'Fresh Produce Buyer', location: 'Bulawayo, Matabeleland',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

export function PublicHome() {
  return (
    <div className="landing-wrapper">
      <PublicHeader />

      <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section
          id="home"
          className="hero"
          style={{
            backgroundImage: `linear-gradient(105deg, rgba(3,30,18,.96) 0%, rgba(3,38,26,.88) 55%, rgba(3,38,26,.42) 100%), url(${heroAfricanFarm})`,
            minHeight: '640px',
          }}
        >
          <div className="hero-copy fade-up">
            <span className="section-kicker" style={{ color: '#c8f07a', marginBottom: 12, display: 'block' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c8f07a', display: 'inline-block', marginRight: 7 }} />
              ZIMBABWE'S PREMIER AGRI-PLATFORM
            </span>
            <h1>
              Empowering Farmers with{' '}
              <em>AI Agronomy</em> &{' '}
              <em>Fair Direct Markets.</em>
            </h1>
            <p>
              No middlemen. No guesswork. Sell at fair prices, diagnose crop diseases instantly, and get 24/7 AI farming guidance — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-lime" style={{ padding: '14px 26px', fontSize: '15px', fontWeight: 700 }}>
                <Sprout size={18} /> Get Started Free
              </Link>
              <a href="#features" className="hero-secondary">
                See how it works <ChevronRight size={15} />
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                <span>TM</span><span>RC</span><span>FD</span>
              </div>
              Trusted by thousands of Zimbabwean farmers
            </div>
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────── */}
        <section id="about" className="section-wrap" style={{ background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: '52px', alignItems: 'center' }}>
            <div className="fade-up">
              <span className="section-kicker" style={{ marginBottom: 12 }}>WHY FARMLINK AI EXISTS</span>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,38px)', fontWeight: 900, letterSpacing: '-1px', margin: '8px 0 20px', lineHeight: 1.18 }}>
                Tackling the Real Challenges of Zimbabwean Agriculture
              </h2>
              <p style={{ fontSize: 15, color: '#455a4e', lineHeight: 1.75, marginBottom: 24 }}>
                Smallholder farmers across Zimbabwe shoulder massive risks while taking home the smallest profits. Informal middlemen extract up to 30% of product value, while unpredictable climate shocks and delayed disease diagnoses wipe out yields.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                {[
                  { title: 'Eliminating Exploitative Middlemen', desc: 'Farmers deal directly with supermarkets, hotels, millers, and retail aggregators — zero broker commissions.' },
                  { title: 'Instant Disease & Pest Identification', desc: 'Identify fall armyworm, bacterial wilt, and nutritional deficiencies before they destroy your entire field.' },
                  { title: 'Localized African Agronomic Intelligence', desc: 'Trained on Zimbabwean agro-ecological zones I–V, optimal planting calendars, and Pfumvudza methods.' },
                  { title: 'Data-Backed Market Decision Making', desc: 'Real-time price feeds prevent distress selling and empower farmers to negotiate with confidence.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#edfaf3', color: '#087443', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2, border: '1px solid #a7e8c4' }}>
                      <Check size={13} />
                    </div>
                    <div>
                      <b style={{ fontSize: 13.5, color: '#0f2318', display: 'block', fontWeight: 700 }}>{item.title}</b>
                      <span style={{ fontSize: 12.5, color: '#566e60', lineHeight: 1.55 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Join the FarmLink Movement <ArrowRight size={15} />
              </Link>
            </div>

            {/* Image mosaic */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, position: 'relative' }}>
              <div style={{ borderRadius: 20, overflow: 'hidden', height: 420, boxShadow: '0 16px 48px rgba(0,0,0,.12)' }}>
                <img src={farmerInField} alt="Farmer with harvest" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ borderRadius: 20, overflow: 'hidden', height: 200, boxShadow: '0 8px 24px rgba(0,0,0,.08)' }}>
                  <img src={womanFarmer} alt="Farmer inspecting harvest" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ borderRadius: 20, overflow: 'hidden', height: 206, boxShadow: '0 8px 24px rgba(0,0,0,.08)' }}>
                  <img src={pfumvudzaPlot} alt="Conservation farming plot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -18, left: 18, background: '#fff', padding: '13px 16px', borderRadius: 14, boxShadow: '0 12px 32px rgba(0,0,0,.14)', border: '1px solid #e1ebe3', display: 'flex', alignItems: 'center', gap: 12, zIndex: 2 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#c8f07a', color: '#052e1c', display: 'grid', placeItems: 'center' }}>
                  <Award size={20} />
                </div>
                <div>
                  <b style={{ fontSize: 13, color: '#0f2318', display: 'block', fontWeight: 700 }}>Pfumvudza & Tech Aligned</b>
                  <span style={{ fontSize: 11, color: '#687e71' }}>Built for African smallholder realities</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────── */}
        <section id="features" className="section-wrap" style={{ background: 'linear-gradient(180deg,#f4f8f5 0%,#f9fbf9 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap', marginBottom: 40 }}>
            <div style={{ maxWidth: 680 }}>
              <span className="section-kicker" style={{ background: '#edfaf3', padding: '7px 12px', borderRadius: 999, marginBottom: 14, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#087443', display: 'inline-block' }} /> The FarmLink toolkit
              </span>
              <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-1.4px', lineHeight: 1.1, color: '#0f2318', margin: '0 0 12px' }}>
                Your whole farm, <span style={{ color: '#087443' }}>working together.</span>
              </h2>
              <p style={{ fontSize: 15.5, color: '#4d6456', lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
                Plan with local weather, catch crop problems early, manage fieldwork and sell with confidence — all from one place.
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: '#fff', border: '1px solid #e0ebe2', borderRadius: 14, boxShadow: '0 6px 20px rgba(6,78,48,.05)' }}>
              <span style={{ fontSize: 30, fontWeight: 900, color: '#087443', fontFamily: 'var(--font-display)', lineHeight: 1 }}>06</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4d6456', lineHeight: 1.35 }}>connected tools<br />for every season</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,280px),1fr))', gap: 22 }}>
            {FEATURES.map(f => (
              <div key={f.id} id={f.id} className="feature-card">
                <div className="feature-card-img">
                  <img src={f.img} alt={f.imgAlt} loading="lazy" />
                  <span style={{ position: 'absolute', top: 18, left: 18, background: f.tagColor, color: '#fff', padding: '9px 14px', borderRadius: 9, fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    {f.icon} {f.tag}
                  </span>
                </div>
                <div className="feature-card-body">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <Link to={f.to} style={{ marginTop: 16, fontSize: 13, fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {f.cta} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── IMPACT METRICS ───────────────────────────────── */}
        <section className="section-wrap" style={{ background: '#fff', paddingTop: 0, paddingBottom: 0 }}>
          <div className="impact-strip">
            {[
              { val: '+35%', label: 'Average Farmer Income Increase' },
              { val: '92%',  label: 'Crop Disease Detection Accuracy' },
              { val: '14+',  label: 'Trading Hubs Connected' },
              { val: '24/7', label: 'AI Agronomic Support' },
            ].map((item, i) => (
              <div key={i} className="impact-item">
                <b>{item.val}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        <section id="impact" className="section-wrap" style={{ background: '#fff' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 44px' }}>
            <span className="section-kicker" style={{ marginBottom: 12 }}>PROVEN RESULTS</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,36px)', fontWeight: 900, letterSpacing: '-0.8px', margin: '8px 0 14px' }}>
              Real impact for Zimbabwean growers
            </h2>
            <p style={{ fontSize: 15, color: '#4d6456', lineHeight: 1.65, margin: 0 }}>
              Hear how direct trade, live agro-weather, and AI disease diagnosis are transforming harvest outcomes across Zimbabwe.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <img src={t.photo} alt={t.name} />
                  <div>
                    <b>{t.name}</b>
                    <span>{t.role} · {t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="section-wrap" style={{ paddingTop: 0, paddingBottom: '80px' }}>
          <div className="cta-section">
            <span className="section-kicker" style={{ color: '#c8f07a', marginBottom: 10, display: 'block' }}>START FOR FREE TODAY</span>
            <h2>Join Zimbabwe's Digital Farming Revolution</h2>
            <p>Whether you cultivate 1 hectare of maize in Mashonaland or manage a tomato greenhouse in Mutoko — FarmLink AI is built for you.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/register" className="btn btn-lime" style={{ padding: '14px 30px', fontSize: '15px', fontWeight: 700 }}>
                <Sprout size={18} /> Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ padding: '14px 24px', background: 'rgba(255,255,255,.1)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', fontSize: '14px' }}>
                Sign In <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="landing-footer">
        <Brand />
        <span>© {new Date().getFullYear()} FarmLink AI · Empowering Zimbabwean Agriculture</span>
        <div className="footer-links">
          <a href="#features">Features</a>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
}
