import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Apple, Bird, Factory, Leaf, Package, Search, Settings, ShoppingBag, Sprout, Wheat,
  X, Plus, ArrowRight, ChevronRight, MapPin, Heart, MessageCircle, Filter, ShieldCheck,
  CircleAlert, CircleCheck, TrendingUp, Sparkles, Tag
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { products } from '../data';
import type { Product } from '../types';
import { api } from '../services/api';
import { PageTitle, ProductCard, EmptyState } from '../components';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'All products': ShoppingBag,
  Vegetables: Leaf,
  Fruits: Apple,
  'Grains & Cereals': Wheat,
  'Livestock & Poultry': Bird,
  'Equipment & Tools': Settings,
  'Inputs & Seeds': Sprout,
  'Agro-Processed': Factory,
};

const CATEGORIES = [
  'All products',
  'Vegetables',
  'Fruits',
  'Grains & Cereals',
  'Livestock & Poultry',
  'Equipment & Tools',
  'Inputs & Seeds',
  'Agro-Processed',
];

const DEFAULT_IMAGES: Record<string, string> = {
  'Vegetables': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85',
  'Fruits': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85',
  'Grains & Cereals': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=85',
  'Crops': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=85',
  'Livestock & Poultry': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=900&q=85',
  'Livestock': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=900&q=85',
  'Equipment & Tools': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=85',
  'Equipment': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=900&q=85',
  'Inputs & Seeds': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=85',
  'Seeds': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=900&q=85',
  'Fertiliser': 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=85',
  'Agro-Processed': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
};

export function Marketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All products');
  const [sort, setSort] = useState('Recommended');
  const [regionFilter, setRegionFilter] = useState('All Zimbabwe');
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    api<{
      data: Array<{
        id: string;
        name: string;
        category: string;
        description: string;
        price: number | string;
        currency?: string;
        quantity: number | string;
        unit?: string;
        location: string;
        image?: string;
        profiles?: { full_name?: string };
      }>;
    }>('/products')
      .then(r => {
        if (!mounted || !r.data || r.data.length === 0) return;
        setLive(true);
        // Merge server products with rich client items
        const serverList = r.data.map(p => ({
          ...p,
          price: Number(p.price),
          currency: p.currency || 'USD',
          quantity: Number(p.quantity),
          unit: p.unit || 'kg',
          image: p.image || products.find(x => x.id === p.id)?.image || DEFAULT_IMAGES[p.category] || products[0].image,
          seller: p.profiles?.full_name || 'FarmLink seller',
          status: 'active' as const,
        }));

        // Combine server items and fallback catalog without duplicates
        const ids = new Set(serverList.map(s => s.id));
        const combined = [...serverList, ...products.filter(p => !ids.has(p.id))];
        setCatalog(combined);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const shown = useMemo(() => {
    const filtered = catalog.filter(p => {
      // Category match
      let matchesCat = category === 'All products';
      if (!matchesCat) {
        if (category === p.category) {
          matchesCat = true;
        } else if (category === 'Vegetables' && (p.category === 'Crops' || p.category === 'Vegetables')) {
          matchesCat = true;
        } else if (category === 'Grains & Cereals' && (p.category === 'Crops' || p.category === 'Grains & Cereals')) {
          matchesCat = true;
        } else if (category === 'Livestock & Poultry' && (p.category === 'Livestock' || p.category === 'Livestock & Poultry')) {
          matchesCat = true;
        } else if (category === 'Equipment & Tools' && (p.category === 'Equipment' || p.category === 'Equipment & Tools')) {
          matchesCat = true;
        } else if (category === 'Inputs & Seeds' && (p.category === 'Seeds' || p.category === 'Fertiliser' || p.category === 'Inputs & Seeds')) {
          matchesCat = true;
        } else if (category === 'Agro-Processed' && p.category === 'Agro-Processed') {
          matchesCat = true;
        }
      }

      // Region match
      const matchesRegion = regionFilter === 'All Zimbabwe' || p.location.toLowerCase().includes(regionFilter.toLowerCase());

      // Search match
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${p.name} ${p.location} ${p.category} ${p.description} ${p.seller}`.toLowerCase().includes(query);

      return matchesCat && matchesRegion && matchesSearch;
    });

    if (sort === 'Price: low to high') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') filtered.sort((a, b) => b.price - a.price);
    if (sort === 'Quantity available') filtered.sort((a, b) => b.quantity - a.quantity);
    return filtered;
  }, [category, regionFilter, search, catalog, sort]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All products': catalog.length };
    CATEGORIES.slice(1).forEach(cat => {
      counts[cat] = catalog.filter(p => {
        if (p.category === cat) return true;
        if (cat === 'Vegetables' && p.category === 'Crops') return true;
        if (cat === 'Livestock & Poultry' && p.category === 'Livestock') return true;
        if (cat === 'Equipment & Tools' && p.category === 'Equipment') return true;
        if (cat === 'Inputs & Seeds' && (p.category === 'Seeds' || p.category === 'Fertiliser')) return true;
        return false;
      }).length;
    });
    return counts;
  }, [catalog]);

  return (
    <>
      <PageTitle
        kicker="DIRECT FARM COMMERCE"
        title="Agricultural Marketplace"
        sub="Buy and sell fresh vegetables, fruits, grains, livestock, equipment, inputs, and natural agro-processed goods across Zimbabwe."
        action={
          <Link to="/listing/new" className="btn btn-primary">
            <Plus size={16} /> Create listing
          </Link>
        }
      />

      {/* SEARCH AND FILTER BAR */}
      <div className="market-tools" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div className="search-wrap" style={{ minWidth: '260px', flex: 2 }}>
          <Search size={17} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search crops, livestock, pumps, honey, fertilisers..."
            aria-label="Search listings"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Region selector */}
        <label className="sort-select" style={{ minWidth: '150px' }}>
          <span>Region</span>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
            <option>All Zimbabwe</option>
            <option>Harare</option>
            <option>Manicaland</option>
            <option>Mashonaland East</option>
            <option>Mashonaland Central</option>
            <option>Mashonaland West</option>
            <option>Midlands</option>
            <option>Masvingo</option>
            <option>Matabeleland</option>
          </select>
        </label>

        {/* Sort selector */}
        <label className="sort-select">
          <span>Sort by</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option>Recommended</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
            <option>Quantity available</option>
          </select>
        </label>
      </div>

      {/* MARKETPLACE CATEGORIES */}
      <div className="category-tabs" style={{ overflowX: 'auto', paddingBottom: '6px' }}>
        {CATEGORIES.map(c => {
          const count = categoryCounts[c] ?? 0;
          const isActive = category === c;
          const Icon = CATEGORY_ICONS[c] ?? Package;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={isActive ? 'active' : ''}
              style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{c}</span>
              <span style={{ fontSize: '10px', opacity: isActive ? 1 : 0.7, marginLeft: '2px' }}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* RESULTS COUNT & LOCATION */}
      <div className="market-results">
        <span>
          <b>{shown.length} items</b> found in <b>{category}</b>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} /> {regionFilter}
        </span>
      </div>

      {/* PRODUCT GRID */}
      {shown.length ? (
        <div className="product-grid market-grid">
          {shown.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search />}
          title="No products found"
          body={`We couldn't find any products in ${category} matching your search.`}
          action={
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearch('');
                setCategory('All products');
                setRegionFilter('All Zimbabwe');
              }}
            >
              Clear filters
            </button>
          }
        />
      )}
    </>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState<Product>(products.find(x => x.id === id) || products[0]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!id) return;
    api<{
      data: {
        id: string;
        name: string;
        category: string;
        description: string;
        price: number | string;
        currency?: string;
        quantity: number | string;
        unit: string;
        location: string;
        image?: string;
        status: 'active' | 'pending' | 'sold' | 'removed';
        profiles?: { full_name?: string };
      };
    }>(`/products/${id}`)
      .then(({ data }) => {
        setP({
          ...data,
          price: Number(data.price),
          currency: data.currency || 'USD',
          quantity: Number(data.quantity),
          image: data.image || products.find(x => x.id === data.id)?.image || DEFAULT_IMAGES[data.category] || products[0].image,
          seller: data.profiles?.full_name || 'FarmLink seller',
          status: data.status === 'removed' ? 'sold' : data.status,
        });
        setIsLive(true);
      })
      .catch(() => {});
  }, [id]);

  return (
    <>
      <Link to="/marketplace" className="back-link">
        ← Back to Marketplace
      </Link>
      <div className="detail-layout">
        <div>
          <div className="detail-photo">
            <img src={p.image} alt={p.name} />
            <span className="photo-tag">{p.category}</span>
          </div>
          <div className="panel detail-description">
            <span className="section-kicker">ABOUT THIS LISTING</span>
            <h2>Product description</h2>
            <p>{p.description}</p>
            <div className="detail-facts">
              <div>
                <MapPin />
                <span>Location</span>
                <b>{p.location}</b>
              </div>
              <div>
                <Wheat />
                <span>Category</span>
                <b>{p.category}</b>
              </div>
              <div>
                <ShoppingBag />
                <span>Quantity available</span>
                <b>
                  {p.quantity.toLocaleString()} {p.unit}
                </b>
              </div>
              <div>
                <CircleCheck />
                <span>Listing status</span>
                <b className="active-text">Available</b>
              </div>
            </div>
          </div>
        </div>
        <div className="detail-side">
          <div className="panel detail-buy">
            <div className="seller-label">
              <span className="availability-dot">Available</span>
              <span>Direct Farm Supply</span>
            </div>
            <h1>{p.name}</h1>
            <div className="detail-price">
              ${p.price.toFixed(2)}
              <small> / {p.unit}</small>
            </div>
            <p className="detail-market-note">
              <CircleAlert size={14} />{' '}
              {isLive
                ? 'Direct farmer listing. Confirm inspection and transport arrangements.'
                : 'Direct listing. Contact seller to confirm collection.'}
            </p>
            <button
              className="btn btn-primary full-btn"
              onClick={() => alert(`Contacting ${p.seller} regarding ${p.name}. You can reach them through the messaging system.`)}
            >
              <MessageCircle size={17} /> Contact seller
            </button>
            <button className="btn btn-outline full-btn">
              <Heart size={16} /> Save listing
            </button>
          </div>
          <div className="panel seller-panel">
            <h3>Seller information</h3>
            <div className="seller-info">
              <div className="avatar seller-avatar">
                {p.seller.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <b>{p.seller}</b>
                <span>Verified Agricultural Producer · Zimbabwe</span>
              </div>
            </div>
            <div className="seller-location">
              <MapPin size={14} />
              {p.location}, Zimbabwe
            </div>
            <Link to="/profile" className="btn btn-outline full-btn">
              View seller profile
            </Link>
          </div>
          <div className="safe-card">
            <ShieldCheck />
            <div>
              <b>Trade with confidence</b>
              <p>Connect directly with local farmers and suppliers. Inspect produce or equipment prior to handover.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
