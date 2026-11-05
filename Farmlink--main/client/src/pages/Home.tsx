import { Link } from 'react-router-dom';
import {
  Sprout, Bot, Store, CloudSun, BarChart3, ArrowRight, MapPin, Sparkles,
  ShieldCheck, TrendingUp, CheckCircle2, ChevronRight, Activity, Users,
  Clock, Leaf, Wheat, Smartphone, Award, Camera, Droplets, Check, Zap, Globe, Heart
} from 'lucide-react';
import { Brand, PublicHeader } from '../components';

// High-resolution African agriculture & farming imagery
const heroAfricanFarm = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=90'; // Sunlit African farmland & crops
const farmerInField = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85'; // Farmer with fresh harvest produce
const womanFarmer = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'; // African farmer inspecting harvest
const pfumvudzaPlot = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef2364c?auto=format&fit=crop&w=800&q=80'; // Healthy green crops and mulch

const marketplaceSample = [
  {
    name: 'Roma Field Tomatoes',
    category: 'Fresh Produce',
    price: '$12.00 / crate (20kg)',
    location: 'Mutoko, Mashonaland East',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80',
    quality: 'Grade A Crated',
    seller: 'Blessing Moyo',
  },
  {
    name: 'Waltham Butternut Squash',
    category: 'Fresh Produce',
    price: '$0.65 / kg',
    location: 'Mazowe, Mashonaland Central',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    quality: 'Cured & Graded',
    seller: 'Farai Dube',
  },
  {
    name: 'Texas Grano Red Onions',
    category: 'Fresh Produce',
    price: '$7.50 / pocket (10kg)',
    location: 'Gweru, Midlands',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
    quality: 'Cured Red Bulbs',
    seller: 'Midlands Agro Hub',
  },
  {
    name: 'Export-Grade Hass Avocados',
    category: 'Fresh Fruits',
    price: '$1.40 / kg',
    location: 'Chipinge, Manicaland',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    quality: 'High-Oil Content',
    seller: 'Eastern Valley Orchards',
  },
  {
    name: 'Sweet Cavendish Bananas',
    category: 'Fresh Fruits',
    price: '$0.35 / kg',
    location: 'Honde Valley, Manicaland',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    quality: 'Irrigated Bunches',
    seller: 'Tariro Chikowe',
  },
  {
    name: 'Solar Borehole Pump Kit',
    category: 'Farm Equipment',
    price: '$420.00 / set',
    location: 'Harare CBD Depot',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    quality: 'Complete Solar Set',
    seller: 'ZimSolar Supplies',
  },
  {
    name: 'Certified Seed Maize SC719',
    category: 'Seeds & Inputs',
    price: '$48.00 / 25kg bag',
    location: 'National Seed Depot',
    image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=600&q=80',
    quality: 'Certified Hybrid',
    seller: 'National Seed Network',
  },
  {
    name: 'Raw Mountain Forest Honey',
    category: 'Natural Goods',
    price: '$8.50 / 1kg jar',
    location: 'Nyanga, Manicaland',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    quality: '100% Pure Organic',
    seller: 'Nyanga Apiaries',
  },
];

// Harvest gallery items showcasing agricultural diversity
const harvestGallery = [
  { title: 'Fresh Roma Tomatoes', loc: 'Mutoko', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { title: 'Sweet Citrus Oranges', loc: 'Mazowe Valley', img: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80' },
  { title: 'Hass Avocados', loc: 'Chipinge Highlands', img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80' },
  { title: 'Cavendish Bananas', loc: 'Honde Valley', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
  { title: 'Giant Drumhead Cabbage', loc: 'Goromonzi', img: 'https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?auto=format&fit=crop&w=600&q=80' },
  { title: 'Golden Maize Harvest', loc: 'Mashonaland Central', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80' },
];

export function PublicHome() {
  return (
    <div className="landing-wrapper">
      <PublicHeader />

      <main>
        {/* ==============================================================
            SECTION 1: HOME / HERO SECTION
            ============================================================== */}
        <section
          id="home"
          className="hero parallax-hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(3, 38, 26, 0.95) 0%, rgba(3, 38, 26, 0.84) 55%, rgba(3, 38, 26, 0.40) 100%), url(${heroAfricanFarm})`,
            minHeight: '660px',
          }}
        >
          <div className="hero-copy hero-animated">
            <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', marginBottom: '16px' }}>
              <span className="eyebrow-dot" />
              <Sparkles size={14} style={{ color: '#b0e46f' }} />
              <span>INTELLIGENT AGRICULTURAL PLATFORM FOR AFRICA</span>
            </div>

            <h1 style={{ fontSize: '48px', lineHeight: 1.15, fontWeight: 900, letterSpacing: '-1.2px', margin: '0 0 18px', color: '#ffffff' }}>
              Empowering Zimbabwean Farmers with <em style={{ color: '#d8f39d', fontStyle: 'normal' }}>AI Agronomy</em> & <em style={{ color: '#d8f39d', fontStyle: 'normal' }}>Fair Direct Markets</em>.
            </h1>

            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#e5ece7', maxWidth: '560px', margin: '0 0 28px' }}>
              FarmLink AI bridges the technology divide for African smallholders. Diagnose crop diseases with your camera, access 14-day local weather forecasts, track Mbare Musika commodity prices, and sell directly to wholesale buyers without predatory middleman markups.
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/register" className="btn btn-lime glow-btn" style={{ padding: '14px 28px', fontSize: '15px' }}>
                <Sprout size={18} /> Get Started Free <ArrowRight size={16} />
              </Link>
              <a href="#about" className="hero-secondary glass-pill" style={{ padding: '13px 22px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Explore Platform Features <ChevronRight size={16} />
              </a>
            </div>

            {/* Quick Statistics Banner */}
            <div
              className="hero-trust"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '16px',
                marginTop: '36px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                maxWidth: '640px',
              }}
            >
              <div>
                <b style={{ display: 'block', fontSize: '22px', color: '#d8f39d', fontWeight: 800 }}>12,500+</b>
                <span style={{ fontSize: '11px', color: '#dbe7df' }}>Farmers Supported</span>
              </div>
              <div>
                <b style={{ display: 'block', fontSize: '22px', color: '#d8f39d', fontWeight: 800 }}>45,000+</b>
                <span style={{ fontSize: '11px', color: '#dbe7df' }}>Hectares Monitored</span>
              </div>
              <div>
                <b style={{ display: 'block', fontSize: '22px', color: '#d8f39d', fontWeight: 800 }}>10 Provinces</b>
                <span style={{ fontSize: '11px', color: '#dbe7df' }}>Zimbabwe Coverage</span>
              </div>
              <div>
                <b style={{ display: 'block', fontSize: '22px', color: '#d8f39d', fontWeight: 800 }}>$0 Fees</b>
                <span style={{ fontSize: '11px', color: '#dbe7df' }}>Zero Middleman Cuts</span>
              </div>
            </div>
          </div>

          {/* Floating Live Card */}
          <div className="hero-float float-card" style={{ maxWidth: '280px' }}>
            <div className="float-icon" style={{ background: '#eaf5eb', color: '#087443' }}>
              <TrendingUp size={22} />
            </div>
            <span style={{ fontSize: '10px', letterSpacing: '1px', fontWeight: 700, color: '#087443' }}>VERIFIED COMMODITY SPOT</span>
            <b style={{ fontSize: '16px', display: 'block', margin: '4px 0' }}>Mbare Musika Benchmark</b>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#4b5563', lineHeight: 1.4 }}>
              Roma Tomatoes: <b>$12.00/crate</b> · White Maize: <b>$0.38/kg</b> · Sugar Beans: <b>$1.45/kg</b>
            </p>
            <a href="#prices" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#087443' }}>
              View all regional prices <ArrowRight size={13} />
            </a>
          </div>

          <div className="hero-caption">
            <MapPin size={13} /> Agricultural Hubs: Harare, Mutoko, Mazowe, Chipinge, Bulawayo & Midlands
          </div>
        </section>

        {/* Quick Highlights Bar */}
        <section className="feature-strip">
          <div className="feature-item hover-lift">
            <div className="feature-icon mint"><Bot size={22} /></div>
            <div>
              <b>AI Farming Assistant</b>
              <p>Localized crop advice for Pfumvudza & commercial plots.</p>
            </div>
          </div>
          <div className="feature-item hover-lift">
            <div className="feature-icon peach"><Camera size={22} /></div>
            <div>
              <b>Crop Health Scanner</b>
              <p>Camera diagnostic for pests, armyworm, and blights.</p>
            </div>
          </div>
          <div className="feature-item hover-lift">
            <div className="feature-icon sky"><CloudSun size={22} /></div>
            <div>
              <b>14-Day Agro Weather</b>
              <p>Live rain probabilities & spraying advisories.</p>
            </div>
          </div>
          <div className="feature-item hover-lift">
            <div className="feature-icon butter"><Store size={22} /></div>
            <div>
              <b>Direct Marketplace</b>
              <p>Connect with vetted buyers at transparent farm prices.</p>
            </div>
          </div>
        </section>

        {/* ==============================================================
            HARVEST RIBBON GALLERY (VISUAL SHOWCASE OF AFRICAN PRODUCE)
            ============================================================== */}
        <section style={{ padding: '30px 0', background: '#f0f5f1', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1336px', margin: '0 auto', padding: '0 24px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#087443', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
              🌾 HARVEST FROM ZIMBABWE'S TEN PROVINCES
            </span>
            <span style={{ fontSize: '12px', color: '#66806f' }}>Fresh harvests uploaded daily</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(180px, 1fr))', gap: '14px', maxWidth: '1336px', margin: '0 auto', padding: '0 24px', overflowX: 'auto' }}>
            {harvestGallery.map((item, i) => (
              <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', height: '140px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px', color: '#fff' }}>
                  <b style={{ fontSize: '12px', lineHeight: 1.2 }}>{item.title}</b>
                  <span style={{ fontSize: '10px', opacity: 0.85 }}><MapPin size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {item.loc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==============================================================
            SECTION 2: ABOUT FARMLINK AI (WITH 3-PHOTO PHOTO MOSAIC)
            ============================================================== */}
        <section id="about" className="section-wrap" style={{ padding: '80px max(calc((100vw - 1336px) / 2), 5.5vw)', background: '#ffffff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: '48px', alignItems: 'center' }}>
            <div>
              <span className="section-kicker" style={{ color: '#087443', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px' }}>
                WHY FARMLINK AI EXISTS
              </span>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f291e', margin: '8px 0 20px', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
                Tackling the Real Challenges of Zimbabwean & African Agriculture
              </h2>
              <p style={{ fontSize: '15px', color: '#455a4e', lineHeight: 1.7, marginBottom: '20px' }}>
                For decades, smallholder farmers across Zimbabwe have shouldered massive risks while taking home the smallest share of profits. When crops are harvested, informal middlemen and unverified brokers extract up to 30% of product value, while unpredictable climate shocks and delayed disease diagnoses wipe out yields.
              </p>

              {/* Challenge vs Solution bullets */}
              <div style={{ display: 'grid', gap: '14px', marginBottom: '28px' }}>
                {[
                  {
                    title: 'Eliminating Exploitative Middlemen',
                    desc: 'Farmers deal directly with supermarkets, hotels, millers, and retail aggregators with zero broker commissions.',
                  },
                  {
                    title: 'Instant Disease & Pest Identification',
                    desc: 'Identify fall armyworm, bacterial wilt, and nutritional deficiencies before they destroy your entire field.',
                  },
                  {
                    title: 'Localized African Agronomic Intelligence',
                    desc: 'Trained on Zimbabwean agro-ecological zones I to V, optimal planting calendars, and Pfumvudza conservation methods.',
                  },
                  {
                    title: 'Data-Backed Market Decision Making',
                    desc: 'Real-time price feeds prevent distress selling and empower farmers to negotiate with confidence.',
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#eaf4eb', color: '#087443', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <Check size={14} />
                    </div>
                    <div>
                      <b style={{ fontSize: '14px', color: '#133022', display: 'block' }}>{item.title}</b>
                      <span style={{ fontSize: '13px', color: '#566e60', lineHeight: 1.5 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Join the FarmLink Movement <ArrowRight size={15} />
              </Link>
            </div>

            {/* Visual 3-Image Mosaic */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', position: 'relative' }}>
              <div style={{ borderRadius: '18px', overflow: 'hidden', height: '420px', boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}>
                <img
                  src={farmerInField}
                  alt="African farmer with fresh market produce"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{ borderRadius: '18px', overflow: 'hidden', height: '200px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                  <img
                    src={womanFarmer}
                    alt="African woman farmer harvesting crops"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ borderRadius: '18px', overflow: 'hidden', height: '206px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
                  <img
                    src={pfumvudzaPlot}
                    alt="Pfumvudza conservation plot"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Float badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '20px',
                  background: '#ffffff',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.14)',
                  border: '1px solid #e1ebe3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  zIndex: 2,
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#d8f39d', color: '#0b4728', display: 'grid', placeItems: 'center' }}>
                  <Award size={22} />
                </div>
                <div>
                  <b style={{ fontSize: '13px', color: '#0f291e', display: 'block' }}>Pfumvudza & Tech Aligned</b>
                  <span style={{ fontSize: '11px', color: '#687e71' }}>Built specifically for African smallholder realities</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 3: FEATURES AND SERVICES (WITH RICH PHOTO BANNERS)
            ============================================================== */}
        <section id="features" className="section-wrap" style={{ padding: '80px max(calc((100vw - 1336px) / 2), 5.5vw)', background: '#f8faf8' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
            <span className="section-kicker" style={{ color: '#087443', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px' }}>
              SUITE OF TOOLS
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f291e', margin: '8px 0 14px', letterSpacing: '-0.8px' }}>
              Everything a Modern Farmer Needs in One Platform
            </h2>
            <p style={{ fontSize: '15px', color: '#4f6458', lineHeight: 1.6 }}>
              From pre-planting weather analysis and live camera pest detection to guaranteed farm-gate sales, FarmLink AI supports your entire seasonal lifecycle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Feature 1: AI Assistant */}
            <div id="ai-assistant" className="panel hover-lift" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2ece4', overflow: 'hidden' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80"
                  alt="Digital agronomy assistant"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#087443', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bot size={13} /> 24/7 Agro AI
                </span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#112c1f' }}>AI Farming Assistant</h3>
                <p style={{ fontSize: '14px', color: '#566e60', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Ask complex questions in plain language about fertilizer rates, crop rotations, soil acidity, and livestock healthcare. Available 24/7 with local Zimbabwean agronomic context.
                </p>
                <Link to="/assistant" style={{ fontSize: '13px', fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Ask AI Assistant <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 2: Crop Disease Camera Diagnosis */}
            <div className="panel hover-lift" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2ece4', overflow: 'hidden' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=600&q=80"
                  alt="Camera crop disease diagnosis"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#c45a1b', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={13} /> Camera Vision
                </span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#112c1f' }}>Crop Disease Camera Scanner</h3>
                <p style={{ fontSize: '14px', color: '#566e60', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Snap a live photo of diseased leaves or stems using your phone camera. Our AI vision system inspects symptoms and suggests safe, effective treatments immediately.
                </p>
                <Link to="/crop-health" style={{ fontSize: '13px', fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Try Crop Scanner <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 3: Live Agro-Weather */}
            <div id="weather" className="panel hover-lift" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2ece4', overflow: 'hidden' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=600&q=80"
                  alt="African weather over green fields"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#1e6eb5', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CloudSun size={13} /> Open-Meteo Live
                </span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#112c1f' }}>14-Day Agro Weather & Date Picker</h3>
                <p style={{ fontSize: '14px', color: '#566e60', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Real-time satellite forecasts for Harare, Mutoko, Masvingo, Bulawayo, and regional farming hubs. Select any date to view rain chances, wind speeds, and spraying alerts.
                </p>
                <Link to="/weather" style={{ fontSize: '13px', fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Check Live Weather <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 4: Fieldwork & Irrigation Timers */}
            <div className="panel hover-lift" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2ece4', overflow: 'hidden' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80"
                  alt="Drip irrigation in garden"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#7a31b8', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Fieldwork Timer
                </span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#112c1f' }}>Task Planning & Timers</h3>
                <p style={{ fontSize: '14px', color: '#566e60', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Organize your seasonal field schedule with built-in activity timers for drip irrigation blocks, chemical agitation, fertilizer soaking, and fieldwork sessions.
                </p>
                <Link to="/tasks" style={{ fontSize: '13px', fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  View Farm Tasks <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 5: Agricultural Marketplace */}
            <div className="panel hover-lift" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2ece4', overflow: 'hidden' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80"
                  alt="Direct marketplace produce"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#087443', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Store size={13} /> Direct Trade
                </span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#112c1f' }}>Agricultural Marketplace</h3>
                <p style={{ fontSize: '14px', color: '#566e60', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Buy and sell vegetables, fruits, certified seeds, fertilisers, solar water pumps, and livestock directly. Transparent listings with real contact info and farm locations.
                </p>
                <Link to="/marketplace" style={{ fontSize: '13px', fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Browse Marketplace <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Feature 6: Market Prices */}
            <div id="prices" className="panel hover-lift" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2ece4', overflow: 'hidden' }}>
              <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80"
                  alt="Market prices trading floor"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#b88909', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BarChart3 size={13} /> Sourced Daily
                </span>
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', color: '#112c1f' }}>Verified Spot Market Prices</h3>
                <p style={{ fontSize: '14px', color: '#566e60', lineHeight: 1.6, margin: '0 0 18px' }}>
                  Live price records sourced from Agricultural Marketing Authority (AMA), Mbare Musika, Bulawayo Wholesale, Sakubva, and GMB depot floor prices.
                </p>
                <Link to="/prices" style={{ fontSize: '13px', fontWeight: 700, color: '#087443', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Explore Spot Prices <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 4: MARKETPLACE PREVIEW (8 DIVERSE PRODUCE CARDS)
            ============================================================== */}
        <section id="marketplace" className="section-wrap" style={{ padding: '80px max(calc((100vw - 1336px) / 2), 5.5vw)', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <div>
              <span className="section-kicker" style={{ color: '#087443', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px' }}>
                DIRECT COMMERCE
              </span>
              <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#0f291e', margin: '6px 0 0', letterSpacing: '-0.8px' }}>
                Marketplace Preview: Fresh Produce, Inputs & Equipment
              </h2>
            </div>
            <Link to="/marketplace" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Explore Full Marketplace <ArrowRight size={15} />
            </Link>
          </div>

          <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {marketplaceSample.map((item, idx) => (
              <div key={idx} className="showcase-card hover-lift" style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e5ebe6', background: '#fff' }}>
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#087443', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>
                    {item.quality}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#087443', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <h4 style={{ margin: '4px 0 8px', fontSize: '16px', color: '#112c1f' }}>{item.name}</h4>
                  <div style={{ fontSize: '12px', color: '#688271', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    <MapPin size={13} /> {item.location}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f0f4f1' }}>
                    <b style={{ fontSize: '14px', color: '#0b3d22' }}>{item.price}</b>
                    <Link to="/marketplace" className="btn btn-small" style={{ fontSize: '11px', padding: '6px 12px' }}>
                      View <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '36px', textAlign: 'center' }}>
            <Link to="/marketplace" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Browse All Marketplace Listings Across Zimbabwe <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* ==============================================================
            SECTION 5: HOW IT WORKS (WITH PHOTO THUMBNAILS)
            ============================================================== */}
        <section id="how-it-works" className="section-wrap" style={{ padding: '80px max(calc((100vw - 1336px) / 2), 5.5vw)', background: '#f4f9f5' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px' }}>
            <span className="section-kicker" style={{ color: '#087443', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px' }}>
              SIMPLE & ACCESSIBLE
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f291e', margin: '8px 0 14px', letterSpacing: '-0.8px' }}>
              How FarmLink AI Works in 4 Steps
            </h2>
            <p style={{ fontSize: '15px', color: '#4d6457', lineHeight: 1.6 }}>
              Whether you are an individual Pfumvudza smallholder, a commercial grower, or an urban produce buyer, getting started takes less than two minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                step: '01',
                title: 'Create Your Account',
                desc: 'Sign up with Google or your email. Choose your role as a Farmer, Commercial Buyer, or Input Supplier.',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
              },
              {
                step: '02',
                title: 'Add Farm Information',
                desc: 'Set your farm location (e.g. Mutoko, Mazowe, Chipinge), acreage, and primary crops to tailor your forecasts.',
                img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80',
              },
              {
                step: '03',
                title: 'Use AI Tools & Resources',
                desc: 'Scan crops with your camera for disease, track 14-day rainfall probabilities, and run fieldwork timers.',
                img: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=500&q=80',
              },
              {
                step: '04',
                title: 'Connect & Trade Fairly',
                desc: 'List your produce, inspect daily verified spot prices, and contract directly with vetted buyers with zero broker fees.',
                img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="panel hover-lift"
                style={{
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e1ebe3',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '130px', overflow: 'hidden', position: 'relative' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#087443', color: '#fff', fontSize: '13px', fontWeight: 900, padding: '3px 8px', borderRadius: '6px' }}>
                    {s.step}
                  </span>
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '17px', color: '#112c1f', margin: '0 0 8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', color: '#566e60', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==============================================================
            SECTION 6: IMPACT AND SUCCESS STORIES (WITH FARMER PORTRAITS)
            ============================================================== */}
        <section id="impact" className="section-wrap" style={{ padding: '80px max(calc((100vw - 1336px) / 2), 5.5vw)', background: '#ffffff' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
            <span className="section-kicker" style={{ color: '#087443', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px' }}>
              VERIFIED PROVEN RESULTS
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0f291e', margin: '8px 0 14px', letterSpacing: '-0.8px' }}>
              Real Impact for Zimbabwean Growers
            </h2>
            <p style={{ fontSize: '15px', color: '#4d6457', lineHeight: 1.6 }}>
              Hear how direct trade, live agro-weather, and AI disease diagnosis are transforming harvest outcomes and household incomes across Zimbabwe.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {[
              {
                quote:
                  'Before FarmLink, I lost 25% of every tomato harvest to predatory middlemen brokers at Mbare Musika. Now I sell directly to grocery retailers in Harare and set my own farm gate price.',
                name: 'Tendai Moyo',
                role: 'Horticulture Smallholder',
                location: 'Mutoko, Mashonaland East',
                crop: 'Field Tomatoes & Butternut',
                photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
              },
              {
                quote:
                  'The camera disease scanner detected early fall armyworm on my maize field 5 days before I would have noticed it myself. The treatment suggested saved over 4 hectares of crop.',
                name: 'Rudo Chikowe',
                role: 'Grain & Poultry Farmer',
                location: 'Bindura, Mashonaland Central',
                crop: 'Hybrid Maize SC719 & Broilers',
                photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
              },
              {
                quote:
                  'As a supermarket wholesale buyer in Bulawayo, FarmLink allows us to trace produce directly to the grower. The quality is fresher, and farmers receive payment immediately without delay.',
                name: 'Farai Dube',
                role: 'Fresh Produce Buyer',
                location: 'Bulawayo, Matabeleland',
                crop: 'Wholesale Retail Aggregator',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="panel hover-lift"
                style={{
                  padding: '28px',
                  borderRadius: '16px',
                  background: '#f8faf8',
                  border: '1px solid #e2ebe4',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ color: '#087443', fontSize: '24px', lineHeight: 1, marginBottom: '10px' }}>“</div>
                  <p style={{ fontSize: '14px', color: '#264332', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                    {t.quote}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid #e6eee8' }}>
                  <img
                    src={t.photo}
                    alt={t.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #087443' }}
                  />
                  <div>
                    <b style={{ fontSize: '14px', color: '#102d1d', display: 'block' }}>{t.name}</b>
                    <span style={{ fontSize: '11px', color: '#688271', display: 'block' }}>{t.role} · {t.location}</span>
                    <span style={{ fontSize: '11px', color: '#087443', fontWeight: 600 }}>🌾 {t.crop}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Metric Highlights */}
          <div
            style={{
              background: 'linear-gradient(135deg, #094729 0%, #136a3e 100%)',
              color: '#fff',
              borderRadius: '16px',
              padding: '32px 40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            <div>
              <b style={{ fontSize: '36px', color: '#d8f39d', fontWeight: 900, display: 'block' }}>+35%</b>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>Average Farmer Income Increase</span>
            </div>
            <div>
              <b style={{ fontSize: '36px', color: '#d8f39d', fontWeight: 900, display: 'block' }}>92%</b>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>Crop Disease Detection Accuracy</span>
            </div>
            <div>
              <b style={{ fontSize: '36px', color: '#d8f39d', fontWeight: 900, display: 'block' }}>14 Hubs</b>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>Verified Trading Depots Linked</span>
            </div>
            <div>
              <b style={{ fontSize: '36px', color: '#d8f39d', fontWeight: 900, display: 'block' }}>24/7</b>
              <span style={{ fontSize: '13px', opacity: 0.9 }}>Instant AI Agronomic Support</span>
            </div>
          </div>
        </section>

        {/* ==============================================================
            SECTION 7: FINAL CALL TO ACTION
            ============================================================== */}
        <section
          className="home-cta premium-cta"
          style={{
            margin: '40px max(calc((100vw - 1336px) / 2), 5.5vw) 60px',
            borderRadius: '20px',
            padding: '48px',
            background: 'linear-gradient(135deg, #063c22 0%, #0d5f38 60%, #15804d 100%)',
            boxShadow: '0 20px 50px rgba(6,60,34,0.25)',
          }}
        >
          <div className="cta-mark" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Sprout size={36} color="#d8f39d" />
          </div>
          <div>
            <h2 style={{ fontSize: '34px', color: '#fff', margin: '0 0 12px', fontWeight: 900, letterSpacing: '-0.8px' }}>
              Join Zimbabwe's Digital Farming Revolution Today
            </h2>
            <p style={{ color: '#dcfce7', margin: 0, fontSize: '16px', lineHeight: 1.6, maxWidth: '620px' }}>
              Whether you are cultivating 1 hectare of maize in Mashonaland, managing a tomato greenhouse in Mutoko, or sourcing bulk produce for a city supermarket, FarmLink AI is built for you.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lime glow-btn" style={{ padding: '14px 32px', fontSize: '15px' }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: '14px 26px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Sign In to Your Farm <ChevronRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

export function PublicFooter() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid #e5e7eb', padding: '40px max(calc((100vw - 1336px) / 2), 5.5vw)', background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <Brand />
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          © {new Date().getFullYear()} FarmLink AI · Empowering Zimbabwean & African Agriculture
        </span>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#4b5563', fontWeight: 600 }}>
          <a href="#how-it-works">How It Works</a>
          <a href="#marketplace">Marketplace</a>
          <a href="#weather">Weather</a>
          <a href="#prices">Prices</a>
          <a href="#ai-assistant">AI Assistant</a>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}
