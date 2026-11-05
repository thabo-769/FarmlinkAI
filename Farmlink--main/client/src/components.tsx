import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sprout, Search, Menu, X, CloudSun, Bot, Store, BarChart3, LayoutDashboard, ListTodo, Bell, Settings, LogOut, Plus, ArrowRight, ChevronRight, MapPin, Heart, MessageCircle, Send, Sun, CloudRain, Wind, Droplets, CalendarDays, CircleCheck, CircleAlert, Wheat, Leaf, Clock3, Filter, ShoppingBag, UserRound, Eye, ShieldCheck, Upload, ThermometerSun, TrendingUp, TrendingDown, Check, ArrowUpRight, Activity, MoreHorizontal, ScanLine } from 'lucide-react';
import { products } from './data';
import type { Product } from './types';
import { useAuth } from './context/AuthContext';
export const heroImage='https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=90';
const links=[['Dashboard',LayoutDashboard,'/dashboard'],['Marketplace',Store,'/marketplace'],['My Products',ShoppingBag,'/products'],['Farming Tasks',ListTodo,'/tasks'],['AI Assistant',Bot,'/assistant'],['Crop health',ScanLine,'/crop-health'],['Weather',CloudSun,'/weather'],['Market Prices',BarChart3,'/prices'] ] as const;
export function Brand({light=false}:{light?:boolean}) { return <Link to="/" className={`brand ${light?'brand-light':''}`}><span className="brand-mark"><Sprout size={20}/></span><span>FarmLink <b>AI</b></span></Link>; }
export function PublicHeader(){
  return (
    <header className="public-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #eef2ee', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
      <Brand/>
      <nav className="public-nav">
        <a href="/#how-it-works">How it works</a>
        <a href="/#marketplace">Marketplace</a>
        <a href="/#weather">Weather</a>
        <a href="/#prices">Prices</a>
        <a href="/#ai-assistant">AI Assistant</a>
      </nav>
      <div className="header-actions">
        <Link to="/login" className="btn btn-quiet">Log in</Link>
        <Link to="/register" className="btn btn-primary">Get started <ArrowRight size={15}/></Link>
      </div>
      <Link className="mobile-nav-link" to="/login">Log in</Link>
    </header>
  );
}
export function Sidebar({close}:{close?:()=>void}){
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = profile?.full_name ? profile.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : (user?.email?.slice(0,2).toUpperCase() || 'FL');
  const displayName = profile?.full_name || (user as any)?.displayName || user?.email?.split('@')[0] || 'Farmer';
  const roleDisplay = (profile?.role || 'Farmer');
  const locDisplay = profile?.location || 'Zimbabwe';

  return <aside className="sidebar"><div className="side-top"><Brand light/><button className="icon-button mobile-only" onClick={close}><X size={20}/></button></div><div className="side-user"><div className="avatar">{initials}</div><div><strong>{displayName}</strong><small>{roleDisplay} · {locDisplay}</small></div><ChevronRight size={15}/></div><div className="side-label">WORKSPACE</div><nav className="side-nav">{links.map(([name,Icon,path])=><NavLink key={name} to={path} onClick={close} className={({isActive})=>`side-link ${isActive?'selected':''}`}><Icon size={17}/><span>{name}</span>{name==='AI Assistant'&&<span className="new-pill">AI</span>}</NavLink>)}</nav><div className="side-bottom"><NavLink className="side-link" to="/profile"><UserRound size={17}/> Profile</NavLink><NavLink className="side-link" to="/settings"><Settings size={17}/> Settings</NavLink><button className="side-link" style={{background:'none',border:'none',textAlign:'left',width:'100%'}} onClick={async()=>{await signOut();navigate('/');close?.();}}><LogOut size={17}/> Log out</button><div className="side-help"><div className="help-orb"><Sprout size={19}/></div><b>Growing together</b><small>Better decisions start with good information.</small><Link to="/assistant">Ask the assistant <ArrowRight size={13}/></Link></div><small className="side-copy">© 2025 FarmLink AI · Zimbabwe</small></div></aside>}
export function ProductCard({product,compact=false}:{product:Product;compact?:boolean}){return <article className={`product-card ${compact?'compact-card':''}`}><Link className="product-photo" to={`/product/${product.id}`}><img src={product.image} alt={product.name}/><span className="photo-tag">{product.category}</span><button className="favorite" aria-label="Save listing" onClick={e=>{e.preventDefault();e.currentTarget.classList.toggle('is-liked')}}><Heart size={16}/></button></Link><div className="product-info"><div className="product-title"><Link to={`/product/${product.id}`}><h3>{product.name}</h3></Link><span className="availability-dot">Available</span></div><p className="product-meta"><MapPin size={13}/>{product.location}</p><div className="product-footer"><div><b>${product.price.toFixed(2)}</b><span> / {product.unit}</span><small>{product.quantity.toLocaleString()} {product.unit} available</small></div><Link to={`/product/${product.id}`} className="btn btn-small">View details <ArrowUpRight size={14}/></Link></div></div></article>}
export function AppShell({children}:{children:ReactNode}){const [open,setOpen]=useState(false);const { user, profile } = useAuth();const initials = profile?.full_name ? profile.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : (user?.email?.slice(0,2).toUpperCase() || 'FL');const locDisplay = profile?.location || 'Harare, Zimbabwe';return <div className="app-shell">{open&&<button className="scrim" onClick={()=>setOpen(false)} aria-label="Close menu"/>}<Sidebar close={()=>setOpen(false)}/><main className="app-main"><div className="mobile-top"><button className="icon-button" onClick={()=>setOpen(true)}><Menu/></button><Brand/><button className="icon-button"><Bell size={19}/></button></div><div className="topbar"><div className="crumb">FarmLink <ChevronRight size={14}/> <span>Workspace</span></div><div className="top-actions"><span className="top-location"><MapPin size={14}/> {locDisplay}</span><button className="icon-button notification"><Bell size={18}/><i/></button><div className="avatar small-avatar">{initials}</div></div></div><div className="page-content">{children}</div></main></div>}
export function PageTitle({kicker,title,sub,action}:{kicker?:string;title:string;sub?:string;action?:ReactNode}){return <div className="page-title"><div>{kicker&&<span className="section-kicker">{kicker}</span>}<h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</div>}
export function Metric({icon,label,value,foot,tint}:{icon:ReactNode;label:string;value:string;foot:string;tint:string}){return <div className="metric-card"><div className={`metric-icon ${tint}`}>{icon}</div><span>{label}</span><b>{value}</b><small>{foot}</small></div>}
export function TaskRow({icon,title,detail,when,kind}:{icon:ReactNode;title:string;detail:string;when:string;kind:string}){return <div className="task-row"><div className={`task-icon ${kind}`}>{icon}</div><div className="task-copy"><b>{title}</b><small>{detail}</small></div><span className={`task-date ${when==='Today'?'due':''}`}><CalendarDays size={13}/>{when}</span><button className="check-task" aria-label="Mark task complete"><CircleCheck size={18}/></button></div>}
export function QuickAction({icon,title,to}:{icon:ReactNode;title:string;to:string}){return <Link className="quick-action" to={to}><span>{icon}</span><b>{title}</b><ArrowUpRight size={13}/></Link>}
export function Field({label,required,placeholder,type='text',name}:{label:string;required?:boolean;placeholder:string;type?:string;name?:string}){return <label className="field"><span>{label} {required&&<i>*</i>}</span><input name={name||label.toLowerCase().replaceAll(' ','_')} type={type} placeholder={placeholder} required={required} min={type==='number'?'0':undefined}/></label>}
export function EmptyState({icon,title,body,action}:{icon:ReactNode;title:string;body:string;action?:ReactNode}){return <div className="empty-state"><div>{icon}</div><h3>{title}</h3><p>{body}</p>{action}</div>}
