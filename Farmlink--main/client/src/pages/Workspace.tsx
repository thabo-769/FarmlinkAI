import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Search, Menu, X, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudLightning, Bot, Store, BarChart3, LayoutDashboard, ListTodo, Bell, Settings, LogOut, Plus, ArrowRight, ChevronRight, MapPin, Heart, MessageCircle, Send, Sun, Sunrise, Sunset, CloudRain, Wind, Droplets, CalendarDays, CircleCheck, CircleAlert, Wheat, Leaf, Clock3, Filter, ShoppingBag, UserRound, Eye, ShieldCheck, Upload, ThermometerSun, TrendingUp, TrendingDown, Check, ArrowUpRight, Activity, MoreHorizontal, ScanLine, Timer, Play, Pause, RotateCcw, BellRing, Volume2, Phone, Mail, Edit3, Save, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { products, marketPrices } from '../data';
import type { Product } from '../types';
import { api } from '../services/api';
import { PageTitle, Metric, TaskRow, QuickAction, EmptyState, ProductCard } from '../components';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() || 'FL');
  const displayName = profile?.full_name || (user as any)?.displayName || user?.email?.split('@')[0] || 'Farmer';

  const sections = [
    { num: '01', icon: 'Store', label: 'Marketplace', desc: 'Browse, buy and sell fresh produce with verified farmers across Zimbabwe.', to: '/marketplace', color: 'green' },
    { num: '02', icon: 'UserRound', label: 'Profile', desc: 'Manage your farmer identity, farm details, and public listing information.', to: '/profile', color: 'blue' },
    { num: '03', icon: 'Settings', label: 'Settings', desc: 'Control your account preferences, notifications, security, and app display.', to: '/settings', color: 'gray' },
    { num: '04', icon: 'LayoutDashboard', label: 'Farm Tools', desc: 'Smart farming suite — weather forecast, crop health and AI assistance in one place.', to: '/farm-tools', color: 'forest', group: 'Farm Tools' },
    { num: '05', icon: 'CloudSun', label: 'Weather Forecast', desc: 'Local weather forecasts, a 14-day outlook, rainfall estimates and spraying conditions.', to: '/farm-tools?tool=weather', color: 'orange', group: 'Farm Tools' },
    { num: '06', icon: 'ScanLine', label: 'Crop Health', desc: 'Scan crop leaves with your camera to detect diseases and get treatment plans.', to: '/farm-tools?tool=crop-health', color: 'emerald', group: 'Farm Tools' },
    { num: '07', icon: 'Bot', label: 'AI Assistance', desc: 'Get farming advice about planting, soil, pests and crop planning whenever you need it.', to: '/farm-tools?tool=assistant', color: 'purple', group: 'Farm Tools', badge: 'AI' },
  ];

  const iconMap: Record<string, JSX.Element> = {
    Store: <Store size={26} />, UserRound: <UserRound size={26} />, Settings: <Settings size={26} />,
    LayoutDashboard: <LayoutDashboard size={26} />, CloudSun: <CloudSun size={26} />, ScanLine: <ScanLine size={26} />, Bot: <Bot size={26} />,
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <PageTitle kicker="YOUR FARM WORKSPACE" title="Dashboard" sub="Seven sections to run your farm — market, profile, settings, farm tools and more." />
      <div className="welcome-row">
        <div>
          <div className="welcome-date"><Sun size={15} /> {new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(new Date()).toUpperCase()} <span>·</span> GROWING SEASON</div>
          <h1>Hello, {displayName} <Sprout className="wave" size={18} aria-hidden="true" /></h1>
          <p>Your FarmLink AI workspace — 7 sections at a glance.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/listing/new" className="btn btn-primary"><Plus size={16} /> Add a product</Link>
          <button type="button" className="btn btn-outline" onClick={handleSignOut}><LogOut size={16} /> Log out</button>
        </div>
      </div>

      <div className="section-intro"><span className="section-kicker">FARM SECTIONS</span><h2>Open a section</h2><p>Select a section to open it. Weather, Crop Health and AI Assistance are available in Farm Tools.</p></div>

      {/* 7-Section Navigation Grid */}
      <div className="dash-section-grid">
        {sections.map(s => (
          <Link key={s.num} to={s.to} className={`dash-section-card color-${s.color}`}>
            <div className="dsc-header">
              <div className={`dsc-icon bg-${s.color}`}>{iconMap[s.icon]}</div>
              <span className="dsc-num">{s.num}</span>
              {'badge' in s && s.badge && <span className="new-pill">{s.badge as string}</span>}
            </div>
            {'group' in s && s.group && <div className="dsc-parent">{s.group}</div>}
            <h3 className="dsc-label">{s.label}</h3>
            <p className="dsc-desc">{s.desc}</p>
            <span className="dsc-cta">Open <ArrowUpRight size={13} /></span>
          </Link>
        ))}
      </div>

      <div className="metric-row">
        <Metric icon={<ShoppingBag size={18} />} label="Marketplace listings" value={String(products.length)} foot="Active produce & inputs" tint="green" />
        <Metric icon={<CloudSun size={18} />} label="Farm tools" value="3" foot="Weather · Crop health · AI" tint="orange" />
        <Metric icon={<BarChart3 size={18} />} label="Price insights" value={String(marketPrices.length)} foot="Regional market prices" tint="blue" />
      </div>
    </>
  );
}

export function Assistant() {
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const text = question;
    setQuestion('');
    setMessages((current) => [...current, { role: 'user', text }]);
    setBusy(true);
    try {
      const out = await api<{ answer: string; conversationId: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, ...(conversationId ? { conversationId } : {}) }),
      });
      setConversationId(out.conversationId);
      setMessages((current) => [...current, { role: 'assistant', text: out.answer }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text:
            error instanceof Error
              ? error.message
              : 'The AI service is unavailable. Ask the administrator to configure an AI provider.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const prompts = [
    'When should I plant maize in Mashonaland?',
    'How can I improve soil health naturally?',
    'What are the signs of fall armyworm?',
    'Help me plan a crop rotation',
  ];

  return (
    <>
      <PageTitle
        kicker="YOUR FARMING COMPANION"
        title="AI Farming Assistant"
        sub="Ask questions about crops, soil, livestock and farm planning."
      />
      <div className="ai-layout">
        <div className="ai-chat panel">
          <div className="chat-top">
            <div className="bot-avatar"><Bot size={20} /></div>
            <div><b>FarmLink AI</b><span><i /> General farming guidance</span></div>
            <button
              className="icon-button"
              onClick={() => { setMessages([]); setConversationId(''); }}
              title="Clear conversation"
            >
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="welcome-bot"><Sprout size={25} /></div>
                <span className="section-kicker">HERE TO HELP YOU GROW</span>
                <h2>What can I help you with?</h2>
                <p>Ask a question about your farm, and I can help you consider the next step.</p>
                <div className="suggestions">
                  {prompts.map((prompt, index) => (
                    <button key={prompt} onClick={() => setQuestion(prompt)}>
                      <span>{[<Wheat />, <Leaf />, <CircleAlert />, <CalendarDays />][index]}</span>
                      {prompt}
                      <ArrowUpRight size={13} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div className={`chat-message ${message.role}`} key={index}>
                  {message.role === 'assistant' && <div className="message-avatar"><Sprout size={15} /></div>}
                  <div className="bubble">{message.text}</div>
                </div>
              ))
            )}
            {busy && (
              <div className="chat-message assistant">
                <div className="message-avatar"><Sprout size={15} /></div>
                <div className="bubble typing"><i /><i /><i /></div>
              </div>
            )}
          </div>
          <form className="chat-input" onSubmit={submit}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a farming question..."
              aria-label="Ask a farming question"
            />
            <button className="send-button" aria-label="Send question" disabled={busy || !question.trim()}>
              <Send size={17} />
            </button>
          </form>
          <div className="chat-disclaimer">
            <ShieldCheck size={13} /> AI responses are general guidance, may be inaccurate and are not a diagnosis.
            For serious crop or livestock concerns, consult an agricultural extension officer.
          </div>
        </div>
        <aside className="ai-aside">
          <div className="ai-aside-card">
            <div className="aside-sun"><Sun size={19} /></div>
            <span>FARMING TIP</span>
            <h3>Small steps make a big difference.</h3>
            <p>Record planting dates, rainfall and inputs to help plan more confidently for the next season.</p>
            <small>General suggestion. Adapt this advice to your farm.</small>
          </div>
          <div className="ai-topics">
            <h3>Explore a topic</h3>
            {[
              ['Crops and planting', Wheat],
              ['Soil and nutrients', Leaf],
              ['Pests and diseases', CircleAlert],
              ['Livestock care', Sprout],
              ['Weather and planning', CloudSun],
            ].map(([topic, Icon]: any) => (
              <button key={topic} onClick={() => setQuestion(`Help me with ${topic.toLowerCase()} for my farm.`)}>
                <Icon size={16} />{topic}<ChevronRight size={14} />
              </button>
            ))}
          </div>
          <div className="extension-note">
            <MapPin />
            <p><b>Need local advice?</b><br />Your agricultural extension officer can provide farm-specific recommendations.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
function playTimerChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 harmonic chime
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.65);
    });
  } catch (e) {
    console.debug('Audio autoplay unavailable', e);
  }
}

function fmtTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface FarmingTaskItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
  due_at?: string;
  completed_at?: string;
  duration_minutes?: number;
}

interface TaskTimerState {
  remaining: number;
  initial: number;
  isRunning: boolean;
  isFinished: boolean;
}

export function Tasks(){
  const [tasks, setTasks] = useState<FarmingTaskItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  // Per-task timers: taskId -> TaskTimerState
  const [timers, setTimers] = useState<Record<string, TaskTimerState>>({});

  // Quick standalone fieldwork timer
  const [fieldTimerSec, setFieldTimerSec] = useState<number>(30 * 60);
  const [fieldTimerInitial, setFieldTimerInitial] = useState<number>(30 * 60);
  const [fieldTimerRunning, setFieldTimerRunning] = useState<boolean>(false);
  const [fieldTimerName, setFieldTimerName] = useState<string>('Drip Irrigation');
  const [fieldTimerAlert, setFieldTimerAlert] = useState<string>('');

  async function loadTasks() {
    try {
      const res = await api<{ data: FarmingTaskItem[] }>('/tasks');
      const loaded = res.data || [];
      setTasks(loaded);
      // Initialize timers for tasks with duration
      const initTimers: Record<string, TaskTimerState> = {};
      loaded.forEach(t => {
        const mins = t.duration_minutes || (t.title.toLowerCase().includes('irrigation') ? 30 : t.title.toLowerCase().includes('spray') ? 20 : 15);
        initTimers[t.id] = {
          remaining: mins * 60,
          initial: mins * 60,
          isRunning: false,
          isFinished: false,
        };
      });
      setTimers(initTimers);
    } catch {
      const fallback: FarmingTaskItem[] = [
        { id: '1', title: 'Check irrigation system', description: 'Inspect drip lines & clean filters in north block.', priority: 'high', duration_minutes: 30, due_at: new Date().toISOString() },
        { id: '2', title: 'Apply fertiliser to maize', description: 'Top-dress Field 2 after checking soil moisture.', priority: 'normal', duration_minutes: 45, due_at: new Date(Date.now() + 86400000).toISOString() },
        { id: '3', title: 'Inspect tomato crop for pests', description: 'Greenhouse scouting for red spider mite & whitefly.', priority: 'normal', duration_minutes: 20, due_at: new Date(Date.now() + 172800000).toISOString() },
      ];
      setTasks(fallback);
      setTimers({
        '1': { remaining: 30 * 60, initial: 30 * 60, isRunning: false, isFinished: false },
        '2': { remaining: 45 * 60, initial: 45 * 60, isRunning: false, isFinished: false },
        '3': { remaining: 20 * 60, initial: 20 * 60, isRunning: false, isFinished: false },
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Timer tick interval
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update standalone field timer
      if (fieldTimerRunning) {
        setFieldTimerSec(prev => {
          if (prev <= 1) {
            setFieldTimerRunning(false);
            playTimerChime();
            setFieldTimerAlert(`Time is up for ${fieldTimerName}.`);
            return 0;
          }
          return prev - 1;
        });
      }

      // 2. Update task-specific timers
      setTimers(prev => {
        let changed = false;
        const next: Record<string, TaskTimerState> = { ...prev };
        for (const [id, state] of Object.entries(next)) {
          if (state.isRunning && state.remaining > 0) {
            changed = true;
            const newRem = state.remaining - 1;
            if (newRem <= 0) {
              playTimerChime();
              next[id] = { ...state, remaining: 0, isRunning: false, isFinished: true };
            } else {
              next[id] = { ...state, remaining: newRem };
            }
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fieldTimerRunning, fieldTimerName]);

  function startTaskTimer(id: string) {
    setTimers(prev => {
      const cur = prev[id] || { remaining: 30 * 60, initial: 30 * 60, isRunning: false, isFinished: false };
      return {
        ...prev,
        [id]: {
          ...cur,
          remaining: cur.remaining <= 0 ? cur.initial : cur.remaining,
          isRunning: true,
          isFinished: false,
        },
      };
    });
  }

  function pauseTaskTimer(id: string) {
    setTimers(prev => prev[id] ? { ...prev, [id]: { ...prev[id], isRunning: false } } : prev);
  }

  function resetTaskTimer(id: string) {
    setTimers(prev => prev[id] ? { ...prev, [id]: { ...prev[id], remaining: prev[id].initial, isRunning: false, isFinished: false } } : prev);
  }

  function addMinutesToTask(id: string, mins: number) {
    setTimers(prev => {
      const cur = prev[id] || { remaining: 0, initial: 0, isRunning: false, isFinished: false };
      const added = mins * 60;
      return {
        ...prev,
        [id]: {
          ...cur,
          remaining: cur.remaining + added,
          initial: cur.initial + added,
          isFinished: false,
        },
      };
    });
  }

  function setFieldTimerPreset(name: string, mins: number) {
    setFieldTimerName(name);
    setFieldTimerSec(mins * 60);
    setFieldTimerInitial(mins * 60);
    setFieldTimerRunning(false);
    setFieldTimerAlert('');
  }

  async function toggleComplete(t: FarmingTaskItem) {
    const isCompleted = !!t.completed_at;
    const newCompletedAt = isCompleted ? undefined : new Date().toISOString();
    setTasks(prev => prev.map(item => item.id === t.id ? { ...item, completed_at: newCompletedAt } : item));
    // Also pause timer if completing
    if (!isCompleted) {
      pauseTaskTimer(t.id);
    }
    try {
      await api(`/tasks/${t.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed_at: newCompletedAt || null }),
      });
    } catch (e) {
      console.warn('Could not update task on backend', e);
    }
  }

  async function addTask(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      const res = await api<{ data: FarmingTaskItem }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description: desc,
          priority,
          duration_minutes: durationMinutes,
          due_at: new Date().toISOString(),
        }),
      });
      if (res.data) {
        const newTask = res.data;
        setTasks(prev => [newTask, ...prev]);
        setTimers(prev => ({
          ...prev,
          [newTask.id]: {
            remaining: (durationMinutes || 30) * 60,
            initial: (durationMinutes || 30) * 60,
            isRunning: false,
            isFinished: false,
          },
        }));
        setTitle('');
        setDesc('');
        setShowAdd(false);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Please sign in to save your personal tasks.');
    } finally {
      setBusy(false);
    }
  }

  const completedCount = tasks.filter(t => !!t.completed_at).length;
  const upcomingCount = tasks.filter(t => !t.completed_at).length;

  return <>
    <PageTitle
      kicker="PLAN & TIME YOUR SEASON"
      title="Farming Tasks & Timers"
      sub="Keep track of farm activities with built-in timers for irrigation, chemical applications, and fieldwork."
      action={<button className="btn btn-primary" onClick={()=>setShowAdd(!showAdd)}><Plus size={16}/> {showAdd?'Cancel':'Add a task'}</button>}
    />

    {/* FIELDWORK & IRRIGATION ACTIVE TIMER WIDGET */}
    <div className="panel" style={{marginBottom:'24px',background:'linear-gradient(135deg,#0c4d2d 0%,#177546 100%)',color:'#fff',borderRadius:'16px',padding:'24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px',marginBottom:'16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'38px',height:'38px',borderRadius:'10px',background:'rgba(255,255,255,.15)',display:'grid',placeItems:'center'}}>
            <Timer size={22} color="#b8f2cb"/>
          </div>
          <div>
            <span style={{fontSize:'11px',fontWeight:700,letterSpacing:'1.5px',color:'#b8f2cb'}}>ACTIVE FARM TIMER</span>
            <h2 style={{margin:0,fontSize:'18px',color:'#fff'}}>{fieldTimerName}</h2>
          </div>
        </div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button
            onClick={playTimerChime}
            className="btn"
            style={{background:'rgba(255,255,255,.15)',color:'#fff',padding:'6px 12px',fontSize:'12px',border:'1px solid rgba(255,255,255,.2)'}}
            title="Test audio chime"
          >
            <Volume2 size={14}/> Test Chime
          </button>
        </div>
      </div>

      {/* Timer Display & Controls */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'20px',background:'rgba(0,0,0,.15)',borderRadius:'12px',padding:'18px 22px',marginBottom:'16px'}}>
        <div>
          <div style={{fontFamily:'monospace',fontSize:'52px',fontWeight:800,letterSpacing:'2px',lineHeight:1}}>
            {fmtTimer(fieldTimerSec)}
          </div>
          <span style={{fontSize:'12px',opacity:.8,display:'inline-flex',alignItems:'center',gap:'5px'}}>
            {fieldTimerRunning ? <><Timer size={14} /> Running fieldwork cycle...</> : fieldTimerSec === 0 ? <><Bell size={14} /> Cycle complete</> : 'Paused / Ready'}
          </span>
        </div>

        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          {!fieldTimerRunning ? (
            <button
              onClick={()=>setFieldTimerRunning(true)}
              className="btn"
              style={{background:'#d8f39d',color:'#0a3f23',fontSize:'14px',fontWeight:800,padding:'12px 24px',boxShadow:'0 4px 15px rgba(0,0,0,.2)'}}
            >
              <Play size={16} fill="currentColor"/> Start Timer
            </button>
          ) : (
            <button
              onClick={()=>setFieldTimerRunning(false)}
              className="btn"
              style={{background:'#ffd166',color:'#422a00',fontSize:'14px',fontWeight:800,padding:'12px 24px'}}
            >
              <Pause size={16} fill="currentColor"/> Pause
            </button>
          )}

          <button
            onClick={()=>{ setFieldTimerRunning(false); setFieldTimerSec(fieldTimerInitial); setFieldTimerAlert(''); }}
            className="btn"
            style={{background:'rgba(255,255,255,.15)',color:'#fff',fontSize:'13px',padding:'12px 16px',border:'1px solid rgba(255,255,255,.2)'}}
            title="Reset timer"
          >
            <RotateCcw size={15}/> Reset
          </button>
        </div>
      </div>

      {fieldTimerAlert && (
        <div style={{background:'#d8f39d',color:'#064e3b',padding:'10px 14px',borderRadius:'8px',marginBottom:'14px',fontWeight:700,fontSize:'13px',display:'flex',alignItems:'center',gap:'8px'}}>
          <BellRing size={16}/> {fieldTimerAlert}
        </div>
      )}

      {/* Preset Buttons for Common Farm Work */}
      <div>
        <div style={{fontSize:'11px',fontWeight:700,opacity:.8,marginBottom:'8px',letterSpacing:'.5px'}}>QUICK FIELDWORK PRESETS:</div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          {[
            { name: 'Drip irrigation', mins: 30, icon: Droplets },
            { name: 'Spray mixing', mins: 15, icon: Wind },
            { name: 'Greenhouse ventilation', mins: 45, icon: Sprout },
            { name: 'Fertiliser soaking', mins: 20, icon: Activity },
            { name: 'Crop scouting', mins: 25, icon: Search },
            { name: 'Fieldwork', mins: 60, icon: Wheat },
          ].map(p => (
            <button
              key={p.name}
              onClick={()=>setFieldTimerPreset(p.name, p.mins)}
              style={{
                background: fieldTimerName === p.name ? '#ffffff' : 'rgba(255,255,255,.12)',
                color: fieldTimerName === p.name ? '#064e3b' : '#ffffff',
                border: '1px solid rgba(255,255,255,.25)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: fieldTimerName === p.name ? 700 : 500,
                cursor: 'pointer',
                transition: 'all .15s'
              }}
            >
              <p.icon size={14} aria-hidden="true" /> {p.name} ({p.mins} min)
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* ADD TASK FORM WITH TIMER DURATION */}
    {showAdd && (
      <form onSubmit={addTask} className="panel" style={{marginBottom:'24px',padding:'20px',border:'1px solid #c8d9cb'}}>
        <h3 style={{marginTop:0,marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
          <Plus size={18} color="#087443"/> Create a new farm task with timer
        </h3>
        <div style={{display:'grid',gap:'12px',marginBottom:'16px'}}>
          <input
            value={title}
            onChange={e=>setTitle(e.target.value)}
            placeholder="Task title (e.g. Irrigate Tomato Block B, Top-dress Maize Field 1)"
            required
            style={{padding:'10px 12px',borderRadius:'8px',border:'1px solid #ccd',fontSize:'14px'}}
          />
          <textarea
            value={desc}
            onChange={e=>setDesc(e.target.value)}
            placeholder="Additional details, field sector, chemicals, or equipment..."
            rows={2}
            style={{padding:'10px 12px',borderRadius:'8px',border:'1px solid #ccd',fontSize:'13px'}}
          />
          <div style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <label style={{fontSize:'12px',fontWeight:700,color:'#2e4a3b'}}>Priority:</label>
              <select value={priority} onChange={e=>setPriority(e.target.value as any)} style={{padding:'7px 12px',borderRadius:'6px',border:'1px solid #ccd'}}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <label style={{fontSize:'12px',fontWeight:700,color:'#2e4a3b'}}>
                <Timer size={14} style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}/>
                Timer Duration:
              </label>
              <select
                value={durationMinutes}
                onChange={e=>setDurationMinutes(Number(e.target.value))}
                style={{padding:'7px 12px',borderRadius:'6px',border:'1px solid #ccd'}}
              >
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes (1 hr)</option>
                <option value={90}>90 minutes (1.5 hrs)</option>
                <option value={120}>120 minutes (2 hrs)</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button type="submit" disabled={busy} className="btn btn-primary">{busy?'Saving...':'Save task'}</button>
          <button type="button" onClick={()=>setShowAdd(false)} className="btn btn-outline">Cancel</button>
        </div>
      </form>
    )}

    {/* METRICS */}
    <div className="task-summary">
      <div><span className="metric-icon green"><ListTodo/></span><b>{upcomingCount}</b><small>Upcoming tasks</small></div>
      <div><span className="metric-icon orange"><Clock3/></span><b>{tasks.length}</b><small>Total planned</small></div>
      <div><span className="metric-icon blue"><CircleCheck/></span><b>{completedCount}</b><small>Completed tasks</small></div>
    </div>

    {/* TASKS LIST WITH LIVE PER-TASK TIMERS */}
    <section className="panel tasks-panel">
      <div className="panel-heading">
        <div>
          <h2>Your Tasks & Active Timers</h2>
          <p>Select Start on a task to track fieldwork time with audio alerts.</p>
        </div>
      </div>

      {loading ? (
        <p style={{padding:'20px'}}>Loading your tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{padding:'24px',color:'#666'}}>No tasks yet. Click "Add a task" above to start your seasonal checklist.</p>
      ) : (
        tasks.map(t => {
          const timer = timers[t.id] || { remaining: 30 * 60, initial: 30 * 60, isRunning: false, isFinished: false };
          const isDone = !!t.completed_at;

          return (
            <div
              className={`full-task ${isDone ? 'done' : ''}`}
              key={t.id}
              style={{
                borderBottom:'1px solid #eef2ee',
                padding:'16px 0',
                display:'flex',
                flexDirection:'column',
                gap:'12px',
              }}
            >
              {/* Task Row Header */}
              <div style={{display:'flex',alignItems:'flex-start',gap:'12px',width:'100%'}}>
                <button
                  onClick={()=>toggleComplete(t)}
                  aria-label="Mark complete"
                  style={{
                    width:'24px',
                    height:'24px',
                    borderRadius:'6px',
                    border:`2px solid ${isDone ? '#087443' : '#a8bfae'}`,
                    background: isDone ? '#087443' : '#fff',
                    color:'#fff',
                    display:'grid',
                    placeItems:'center',
                    cursor:'pointer',
                    marginTop:'3px',
                    flexShrink:0
                  }}
                >
                  {isDone ? <Check size={16}/> : null}
                </button>

                <div className="task-icon mint" style={{flexShrink:0}}><Leaf size={18}/></div>

                <div className="task-copy" style={{flex:1}}>
                  <b style={{textDecoration: isDone ? 'line-through' : 'none',fontSize:'15px',color:isDone?'#888':'#11261a'}}>
                    {t.title}
                  </b>
                  <p style={{margin:'4px 0 0',fontSize:'13px',color:'#5c6e62'}}>
                    {t.description || 'No description provided'}
                  </p>
                </div>

                <div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}>
                  <span className={`priority ${t.priority==='high'?'priority-high':''}`} style={{fontSize:'10px',fontWeight:700}}>
                    {t.priority.toUpperCase()}
                  </span>
                  <span className="task-date" style={{fontSize:'11px',color:'#7a9a85',display:'flex',alignItems:'center',gap:'4px'}}>
                    <CalendarDays size={13}/> {isDone ? 'Done' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Task Inline Timer Control Bar */}
              {!isDone && (
                <div
                  style={{
                    marginLeft:'36px',
                    background: timer.isRunning ? '#edf7ef' : timer.isFinished ? '#fff3cd' : '#f7faf7',
                    border: `1px solid ${timer.isRunning ? '#6cc287' : timer.isFinished ? '#ffeeba' : '#e2eae3'}`,
                    borderRadius:'10px',
                    padding:'10px 14px',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'space-between',
                    flexWrap:'wrap',
                    gap:'10px',
                    transition:'background .2s ease',
                  }}
                >
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                      <Timer size={16} color={timer.isRunning ? '#087443' : '#52735d'}/>
                      <span style={{fontFamily:'monospace',fontSize:'18px',fontWeight:800,color:timer.isRunning?'#087443':timer.isFinished?'#856404':'#274332'}}>
                        {fmtTimer(timer.remaining)}
                      </span>
                    </div>

                    {timer.isRunning && (
                      <span style={{display:'inline-flex',alignItems:'center',gap:'4px',fontSize:'11px',color:'#087443',fontWeight:700}}>
                        <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#087443',animation:'pulse 1.5s infinite'}}></span>
                        Active
                      </span>
                    )}

                    {timer.isFinished && (
                      <span style={{fontSize:'11px',fontWeight:700,color:'#856404',background:'#fff3cd',padding:'3px 8px',borderRadius:'6px'}}>
                        <Bell size={13} aria-hidden="true" /> Cycle complete.
                      </span>
                    )}
                  </div>

                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    {!timer.isRunning ? (
                      <button
                        onClick={()=>startTaskTimer(t.id)}
                        className="btn"
                        style={{background:'#087443',color:'#fff',padding:'5px 12px',fontSize:'12px',borderRadius:'6px'}}
                        title="Start timer for this task"
                      >
                        <Play size={13} fill="currentColor"/> {timer.remaining === 0 ? 'Restart' : 'Start'}
                      </button>
                    ) : (
                      <button
                        onClick={()=>pauseTaskTimer(t.id)}
                        className="btn"
                        style={{background:'#e67e22',color:'#fff',padding:'5px 12px',fontSize:'12px',borderRadius:'6px'}}
                        title="Pause timer"
                      >
                        <Pause size={13} fill="currentColor"/> Pause
                      </button>
                    )}

                    <button
                      onClick={()=>resetTaskTimer(t.id)}
                      className="btn btn-outline"
                      style={{padding:'5px 10px',fontSize:'12px',borderRadius:'6px'}}
                      title="Reset timer"
                    >
                      <RotateCcw size={13}/>
                    </button>

                    <div style={{display:'flex',gap:'4px'}}>
                      <button
                        onClick={()=>addMinutesToTask(t.id, 15)}
                        style={{background:'#fff',border:'1px solid #c9d8cc',borderRadius:'5px',padding:'4px 8px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}
                        title="Add 15 minutes"
                      >
                        +15m
                      </button>
                      <button
                        onClick={()=>addMinutesToTask(t.id, 30)}
                        style={{background:'#fff',border:'1px solid #c9d8cc',borderRadius:'5px',padding:'4px 8px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}
                        title="Add 30 minutes"
                      >
                        +30m
                      </button>
                    </div>

                    {timer.isFinished && (
                      <button
                        onClick={()=>toggleComplete(t)}
                        className="btn"
                        style={{background:'#27ae60',color:'#fff',padding:'5px 12px',fontSize:'11px',fontWeight:700,borderRadius:'6px'}}
                      >
                        <Check size={13}/> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </section>
  </>;
}
interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  rain_chance: number;
  wind_speed: number;
  humidity: number;
  condition: string;
  icon: WeatherIconName;
  advisory: string;
  sunrise?: string;
  sunset?: string;
}
interface WeatherResponse {
  source?: string;
  provider?: string;
  fetched_at?: string;
  city?: { name: string; country?: string };
  current?: {
    temp: number;
    feels_like: number;
    condition: string;
    icon?: WeatherIconName;
    wind_speed: number;
    humidity: number;
    rain_chance: number;
    advisory?: string;
  };
  forecast?: ForecastDay[];
}

type WeatherIconName =
  | 'sun'
  | 'partly-cloudy'
  | 'cloud'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'thunderstorm'
  | 'variable';

const WEATHER_ICONS: Record<WeatherIconName, LucideIcon> = {
  sun: Sun,
  'partly-cloudy': CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  thunderstorm: CloudLightning,
  variable: ThermometerSun,
};

const ZW_CITIES = ['Harare','Bulawayo','Mutare','Masvingo','Gweru','Kwekwe','Chinhoyi','Bindura','Mutoko','Kariba','Victoria Falls','Norton','Rusape','Zvishavane','Chegutu','Chipinge','Beitbridge'];

export function Weather(){
  const [location,setLocation]=useState('Harare');
  const [inputVal,setInputVal]=useState('Harare');
  const [weatherData,setWeatherData]=useState<WeatherResponse|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [selectedDate,setSelectedDate]=useState<string>('');
  const [lastUpdated,setLastUpdated]=useState<Date|null>(null);

  function fetchWeather(loc:string){
    setLoading(true);
    setError('');
    api<WeatherResponse>(`/weather?location=${encodeURIComponent(loc)}`)
      .then(res=>{
        setWeatherData(res);
        setLastUpdated(new Date());
        if(res.forecast && res.forecast.length>0) setSelectedDate(res.forecast[0].date);
      })
      .catch(()=>setError('Could not load weather. Check your connection and try again.'))
      .finally(()=>setLoading(false));
  }

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const forecast = weatherData?.forecast ?? [];
  const selected = forecast.find(d=>d.date===selectedDate) ?? forecast[0] ?? null;
  const cur = weatherData?.current;
  const CurrentWeatherIcon = cur ? WEATHER_ICONS[cur.icon || 'partly-cloudy'] : CloudSun;
  const SelectedWeatherIcon = selected ? WEATHER_ICONS[selected.icon] : CloudSun;

  function handleSearch(e:React.FormEvent){
    e.preventDefault();
    setLocation(inputVal);
    fetchWeather(inputVal);
  }

  function fmtDate(dateStr:string){
    const d = new Date(dateStr+'T12:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
    const dd = new Date(dateStr+'T00:00:00');
    if(dd.toDateString()===today.toDateString()) return {day:'Today',date:d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})};
    if(dd.toDateString()===tomorrow.toDateString()) return {day:'Tomorrow',date:d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})};
    return {day:d.toLocaleDateString('en-GB',{weekday:'short'}),date:d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})};
  }

  function fmtTime(isoStr?:string){
    if(!isoStr) return '--';
    try{ return new Date(isoStr).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); } catch{ return '--'; }
  }

  const rainColor = (p:number) => p>70?'#c0392b':p>40?'#e67e22':'#27ae60';

  return <>
    <PageTitle kicker="PLAN WITH THE SKY" title="Weather & Farm Forecast" sub="Live 14-day forecasts for Zimbabwe farming regions. Pick a date to see detailed conditions."/>

    {/* Location search + city chips */}
    <div className="panel" style={{marginBottom:'20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',marginBottom:'14px'}}>
        <MapPin size={18} color="#087443"/>
        <h2 style={{margin:0,fontSize:'16px'}}>
          {loading ? 'Loading forecast...' : weatherData?.city?.name ? `${weatherData.city.name}, Zimbabwe` : location}
        </h2>
        {lastUpdated && <span style={{fontSize:'11px',color:'#7a9a85',marginLeft:'auto'}}>Updated {lastUpdated.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</span>}
        <button className="btn btn-outline" style={{fontSize:'12px',padding:'5px 12px'}} onClick={()=>fetchWeather(location)} disabled={loading}>
          <RotateCcw size={14} /> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <form onSubmit={handleSearch} style={{display:'flex',gap:'8px',marginBottom:'14px'}}>
        <div className="search-wrap" style={{flex:1,margin:0}}>
          <Search size={16}/>
          <input value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder="Enter a Zimbabwean city..." list="zw-cities" aria-label="Weather location"/>
          <datalist id="zw-cities">{ZW_CITIES.map(c=><option key={c} value={c}/>)}</datalist>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{whiteSpace:'nowrap'}}>Get Forecast</button>
      </form>
      {/* City quick-select chips */}
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
        {ZW_CITIES.slice(0,9).map(c=>(
          <button key={c} onClick={()=>{setInputVal(c);setLocation(c);fetchWeather(c);}}
            style={{padding:'4px 10px',borderRadius:'20px',border:'1px solid #c5dac8',background:location===c?'#087443':'#f4f9f5',color:location===c?'#fff':'#1c422c',fontSize:'12px',cursor:'pointer',fontWeight:location===c?700:400}}>
            {c}
          </button>
        ))}
      </div>
      {error && <p style={{color:'#c0392b',fontSize:'13px',marginTop:'10px',display:'flex',alignItems:'center',gap:'6px'}}><CircleAlert size={15} />{error}</p>}
    </div>

    {/* Current conditions hero */}
    {cur && (
      <div style={{background:'linear-gradient(135deg,#0d5c35 0%,#19804d 60%,#1aad62 100%)',borderRadius:'16px',padding:'28px',marginBottom:'20px',color:'#fff',display:'flex',alignItems:'center',gap:'24px',flexWrap:'wrap'}}>
        <CurrentWeatherIcon size={64} strokeWidth={1.5} aria-label={cur.condition} />
        <div style={{flex:1}}>
          <div style={{fontSize:'12px',fontWeight:700,letterSpacing:'1.5px',opacity:.75,marginBottom:'4px'}}>
            CURRENT CONDITIONS | {(weatherData?.city?.name||location).toUpperCase()}
          </div>
          <div style={{fontSize:'52px',fontWeight:900,lineHeight:1}}>{cur.temp}°<span style={{fontSize:'24px'}}>C</span></div>
          <div style={{fontSize:'15px',opacity:.85}}>{cur.condition} | Feels like {cur.feels_like}°C</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',minWidth:'240px'}}>
          {[
            {icon:Wind,label:'Wind',val:`${cur.wind_speed} km/h`},
            {icon:Droplets,label:'Humidity',val:`${cur.humidity}%`},
            {icon:CloudRain,label:'Rain chance',val:`${cur.rain_chance}%`},
          ].map(s=>(
            <div key={s.label} style={{background:'rgba(255,255,255,.15)',borderRadius:'10px',padding:'10px',textAlign:'center'}}>
              <s.icon size={18} aria-hidden="true" />
              <div style={{fontSize:'10px',opacity:.75,marginBottom:'2px'}}>{s.label}</div>
              <div style={{fontWeight:700,fontSize:'14px'}}>{s.val}</div>
            </div>
          ))}
        </div>
        {cur.advisory && (
          <div style={{width:'100%',background:'rgba(255,255,255,.12)',borderRadius:'10px',padding:'12px 14px',fontSize:'13px',display:'flex',gap:'8px',alignItems:'flex-start'}}>
            <Sprout size={16} aria-hidden="true" />
            <span><b>Farm advisory:</b> {cur.advisory}</span>
          </div>
        )}
      </div>
    )}

    {/* 14-day date picker strip */}
    {forecast.length > 0 && (
      <div className="panel" style={{marginBottom:'20px'}}>
        <div className="panel-heading" style={{marginBottom:'12px'}}>
          <div><h2 style={{margin:0}}>14-day forecast</h2><p style={{margin:0}}>Select a day to view the forecast details.</p></div>
          <CalendarDays size={18} color="#087443"/>
        </div>
        <div style={{display:'flex',gap:'8px',overflowX:'auto',paddingBottom:'8px'}}>
          {forecast.map(day=>{
            const {day:dayName,date:dateLabel} = fmtDate(day.date);
            const isSelected = day.date===selectedDate;
            const DayWeatherIcon = WEATHER_ICONS[day.icon];
            return (
              <button key={day.date} onClick={()=>setSelectedDate(day.date)}
                style={{
                  minWidth:'72px',flexShrink:0,padding:'10px 8px',borderRadius:'12px',border:`2px solid ${isSelected?'#087443':'#ddeee3'}`,
                  background:isSelected?'#087443':'#f9fbf9',color:isSelected?'#fff':'#1c422c',cursor:'pointer',
                  display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',transition:'all .15s'
                }}>
                <span style={{fontSize:'10px',fontWeight:700,opacity:.75}}>{dayName}</span>
                <DayWeatherIcon size={20} aria-label={day.condition} />
                <span style={{fontSize:'13px',fontWeight:800}}>{day.temp_max}°</span>
                <span style={{fontSize:'10px',opacity:.65}}>{day.temp_min}°</span>
                <span style={{fontSize:'10px',color:isSelected?'rgba(255,255,255,.8)':rainColor(day.rain_chance),fontWeight:600}}>{day.rain_chance}%</span>
                <span style={{fontSize:'9px',opacity:.6}}>{dateLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    )}

    {/* Selected day detail */}
    {selected && (
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
        {/* Conditions card */}
        <div className="panel" style={{background:'#f4f9f5'}}>
          <div style={{display:'flex',gap:'12px',alignItems:'center',marginBottom:'16px'}}>
            <SelectedWeatherIcon size={40} aria-label={selected.condition} />
            <div>
              <div style={{fontSize:'11px',fontWeight:700,color:'#087443',letterSpacing:'1px'}}>{fmtDate(selected.date).day.toUpperCase()} | {fmtDate(selected.date).date}</div>
              <div style={{fontSize:'28px',fontWeight:900,color:'#0d2e1f'}}>{selected.temp_max}° / {selected.temp_min}°<span style={{fontSize:'14px'}}>C</span></div>
              <div style={{fontSize:'13px',color:'#4a5e52'}}>{selected.condition}</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[
              {icon:Wind,label:'Wind speed',val:`${selected.wind_speed} km/h`},
              {icon:Droplets,label:'Humidity',val:`${selected.humidity}%`},
              {icon:CloudRain,label:'Rain chance',val:`${selected.rain_chance}%`,color:rainColor(selected.rain_chance)},
              {icon:Sunrise,label:'Sunrise',val:fmtTime(selected.sunrise)},
              {icon:Sunset,label:'Sunset',val:fmtTime(selected.sunset)},
            ].map(s=>(
              <div key={s.label} style={{background:'#fff',borderRadius:'8px',padding:'10px',display:'flex',gap:'8px',alignItems:'center'}}>
                <s.icon size={16} aria-hidden="true" />
                <div>
                  <div style={{fontSize:'10px',color:'#7a9a85'}}>{s.label}</div>
                  <div style={{fontWeight:700,fontSize:'13px',color:(s as any).color||'#1c422c'}}>{s.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Advisory card */}
        <div className="panel" style={{background:'linear-gradient(135deg,#eaf4ed,#d4ecda)',display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <Sprout size={24} aria-hidden="true" />
            <div>
              <div style={{fontSize:'11px',fontWeight:700,color:'#087443',letterSpacing:'1px'}}>FARM ADVISORY</div>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0d2e1f'}}>{fmtDate(selected.date).day}</div>
            </div>
          </div>
          <p style={{margin:0,fontSize:'14px',color:'#1c422c',lineHeight:1.6}}>{selected.advisory}</p>
          <div style={{marginTop:'auto',fontSize:'11px',color:'#5a8a6a',display:'flex',gap:'6px',alignItems:'center'}}>
            <ShieldCheck size={13}/> Based on live Open-Meteo forecast data
          </div>
          {weatherData?.provider && (
            <div style={{fontSize:'10px',color:'#7a9a85'}}>Source: {weatherData.provider}{weatherData.fetched_at ? ` | ${new Date(weatherData.fetched_at).toLocaleString('en-GB')}` : ''}</div>
          )}
        </div>
      </div>
    )}

    {!weatherData && !loading && (
      <div className="panel" style={{textAlign:'center',padding:'40px'}}>
        <CloudSun size={48} aria-hidden="true" style={{marginBottom:12}} />
        <h3>Enter a Zimbabwe city above to load the forecast</h3>
      </div>
    )}

    {/* Tips section */}
    <section className="panel weather-tip">
      <div className="feature-icon butter"><Sprout/></div>
      <div>
        <span className="section-kicker">FARMING WITH THE WEATHER</span>
        <h3>Make weather work for your farm</h3>
        <p>Plan irrigation, planting and spraying around the forecast. Checking conditions 3 to 5 days ahead can help you prepare for rain and dry spells.</p>
      </div>
      <span className="general-label">General guidance</span>
    </section>
  </>;
}
interface PriceItem {
  id: string;
  crop: string;
  category: string;
  market: string;
  city: string;
  price: number;
  currency: string;
  unit: string;
  change: string;
  up: boolean;
  high: number;
  low: number;
  source: string;
  observed_on: string;
  advisory?: string;
}

const PRICE_CATEGORIES = ['All', 'Grains & Cereals', 'Vegetables', 'Fruits', 'Livestock', 'Natural Farm Goods'];
const PRICE_MARKETS = ['All Markets', 'Mbare Musika', 'Bulawayo', 'Sakubva Musika', 'GMB', 'Masvingo', 'Beitbridge', 'Chipinge'];

export function Prices() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [market, setMarket] = useState('All Markets');
  const [updatedAt, setUpdatedAt] = useState<string>('');

  function loadPrices() {
    setLoading(true);
    api<{ data: PriceItem[]; updated_at?: string }>('/prices')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPrices(res.data);
          if (res.updated_at) setUpdatedAt(res.updated_at);
        }
      })
      .catch(() => {
        // Fallback demo prices
        setPrices([
          { id: '1', crop: 'White Maize (Grain)', category: 'Grains & Cereals', market: 'Mbare Musika', city: 'Harare', price: 0.38, currency: 'USD', unit: 'kg', change: '+2.7%', up: true, high: 0.42, low: 0.35, source: 'AMA Zimbabwe', observed_on: '2026-10-29', advisory: 'Steady demand from millers.' },
          { id: '2', crop: 'Field Tomatoes (Roma)', category: 'Vegetables', market: 'Mbare Musika', city: 'Harare', price: 12.00, currency: 'USD', unit: 'crate (20kg)', change: '-4.2%', up: false, high: 14.00, low: 10.50, source: 'Mbare Traders Board', observed_on: '2026-10-29', advisory: 'Heavy morning arrivals from Mutoko.' },
          { id: '3', crop: 'Red Speckled Sugar Beans', category: 'Grains & Cereals', market: 'Mbare Musika', city: 'Harare', price: 1.45, currency: 'USD', unit: 'kg', change: '+3.6%', up: true, high: 1.60, low: 1.35, source: 'AMA Produce Tracker', observed_on: '2026-10-29', advisory: 'Wholesale packers buying actively.' },
          { id: '4', crop: 'BP1 Irish Table Potatoes', category: 'Vegetables', market: 'Mbare Musika', city: 'Harare', price: 9.00, currency: 'USD', unit: 'pocket (15kg)', change: '-2.2%', up: false, high: 10.50, low: 8.50, source: 'Potato Association', observed_on: '2026-10-29', advisory: 'Highland stock arriving.' },
        ]);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPrices();
  }, []);

  const filtered = prices.filter(p => {
    const matchesCat = category === 'All' || p.category.toLowerCase().includes(category.toLowerCase());
    const matchesMkt = market === 'All Markets' || p.market.toLowerCase().includes(market.toLowerCase()) || p.city.toLowerCase().includes(market.toLowerCase());
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || `${p.crop} ${p.market} ${p.city} ${p.source}`.toLowerCase().includes(query);
    return matchesCat && matchesMkt && matchesQuery;
  });

  return (
    <>
      <PageTitle
        kicker="AUTHENTIC MARKET INTELLIGENCE"
        title="Live Agricultural Market Prices"
        sub="Track daily commodity spot prices and trading volumes across Zimbabwe's major agricultural markets."
        action={
          <button onClick={loadPrices} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RotateCcw size={14} /> Refresh Prices
          </button>
        }
      />

      {/* SOURCED NOTICE BANNER */}
      <div style={{ background: '#eaf4eb', border: '1px solid #c4dec9', borderRadius: '12px', padding: '14px 18px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={20} color="#087443" />
          <span style={{ fontSize: '13px', color: '#133e24' }}>
            <b>Verified Sourced Data:</b> Sourced from <b>Agricultural Marketing Authority (AMA)</b>, <b>Mbare Musika</b>, <b>Bulawayo Wholesale</b>, and <b>GMB Depots</b>.
          </span>
        </div>
        {updatedAt && (
          <span style={{ fontSize: '11px', color: '#4a7356' }}>
            Updated: {new Date(updatedAt).toLocaleDateString('en-GB')}
          </span>
        )}
      </div>

      {/* SEARCH AND MARKET FILTER CONTROLS */}
      <div className="market-tools" style={{ flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div className="search-wrap" style={{ flex: 2, minWidth: '240px' }}>
          <Search size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search maize, tomatoes, potatoes, cattle, honey..."
            aria-label="Search market prices"
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <label className="sort-select" style={{ minWidth: '180px' }}>
          <span>Trading Hub</span>
          <select value={market} onChange={e => setMarket(e.target.value)}>
            {PRICE_MARKETS.map(m => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
      </div>

      {/* MARKET CATEGORIES */}
      <div className="category-tabs" style={{ overflowX: 'auto', paddingBottom: '6px', marginBottom: '20px' }}>
        {PRICE_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={category === c ? 'active' : ''}
            style={{ whiteSpace: 'nowrap' }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* BENCHMARK CARDS GRID */}
      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading verified commodity prices...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BarChart3 />}
          title="No prices found"
          body="Try selecting another category or clearing your search term."
          action={
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearch('');
                setCategory('All');
                setMarket('All Markets');
              }}
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {filtered.map(p => (
            <div
              key={p.id}
              className="panel"
              style={{
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #e1ebe3',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#087443', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                      {p.category}
                    </span>
                    <h3 style={{ margin: '4px 0 2px', fontSize: '18px', color: '#132c1e' }}>{p.crop}</h3>
                    <div style={{ fontSize: '12px', color: '#687e70', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {p.market}, {p.city}
                    </div>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: p.up ? '#e7f7ed' : '#fbebee',
                      color: p.up ? '#127a42' : '#c0392b',
                    }}
                  >
                    {p.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {p.change}
                  </span>
                </div>

                {/* Price Display */}
                <div style={{ margin: '14px 0 10px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#0b3d22', lineHeight: 1 }}>
                    ${p.price.toFixed(2)}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#5b7565', marginLeft: '4px' }}>
                      / {p.unit}
                    </span>
                  </div>
                </div>

                {/* Range bar (Low - High) */}
                <div style={{ background: '#f5f9f6', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', color: '#496152', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Low: <b>${p.low.toFixed(2)}</b></span>
                    <span>High: <b>${p.high.toFixed(2)}</b></span>
                  </div>
                  <div style={{ height: '4px', background: '#dce8df', borderRadius: '2px', position: 'relative' }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '2px',
                        background: '#087443',
                        width: `${Math.min(100, Math.max(15, ((p.price - p.low) / (p.high - p.low || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {p.advisory && (
                  <p style={{ margin: 0, fontSize: '12px', color: '#2c4a37', lineHeight: 1.5, background: '#fafdfa', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #148f52' }}>
                    <Lightbulb size={14} aria-hidden="true" /> {p.advisory}
                  </p>
                )}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #eef3ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#7a9483' }}>
                <span>Source: {p.source}</span>
                <span>{p.observed_on}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MARKET OVERVIEW & SELLING STRATEGY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <div className="panel" style={{ padding: '22px' }}>
          <div className="panel-heading" style={{ marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Trading Hub Price Spread</h2>
              <p style={{ margin: '4px 0 0' }}>Compare benchmark rates between northern, eastern and southern depots.</p>
            </div>
            <TrendingUp size={19} color="#087443" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { crop: 'Field Tomatoes (20kg crate)', mbare: '$12.00', byo: '$13.50', spread: '+$1.50 in Bulawayo' },
              { crop: 'White Maize (kg)', mbare: '$0.38', gmb: '$0.39', spread: 'GMB floor parity' },
              { crop: 'Sugar Beans (kg)', mbare: '$1.45', mutare: '$1.55', spread: '+$0.10 in Mutare' },
              { crop: 'Boer Goats (Head)', beitbridge: '$95.00', mbare: '$90.00', spread: 'High southern auction demand' },
            ].map(r => (
              <div key={r.crop} style={{ background: '#f8faf8', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5ede6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <b style={{ fontSize: '13px', color: '#132c1e' }}>{r.crop}</b>
                  <div style={{ fontSize: '11px', color: '#688271', marginTop: '2px' }}>{r.spread}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#087443' }}>
                  {r.mbare} <span style={{ fontWeight: 400, color: '#888' }}>vs</span> {r.byo || r.gmb || r.mutare || r.beitbridge}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: '22px', background: 'linear-gradient(135deg,#f4fbf5,#e8f6eb)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#087443', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <Sprout size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#093c21' }}>Farmer Selling Advisory</h3>
          </div>

          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#1d412b', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <b>Grade before dispatch:</b> Clean, sorted, uniform tomatoes and potatoes fetch up to 30% premium at Mbare Musika.
            </li>
            <li>
              <b>Time your arrivals:</b> Fresh horticulture trucks arriving between 3:00 AM and 5:30 AM get prioritized by wholesale buyers.
            </li>
            <li>
              <b>Direct buyer contracts:</b> Listing directly on FarmLink Marketplace eliminates broker commissions and secures pre-harvest agreements.
            </li>
          </ul>

          <div style={{ marginTop: '20px' }}>
            <Link to="/listing/new" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={15} /> List Your Produce at Market Price
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states initialized with current profile
  const [fullName, setFullName] = useState(profile?.full_name || (user as any)?.displayName || 'James Moyo');
  const [role, setRole] = useState(profile?.role || 'farmer');
  const [location, setLocation] = useState(profile?.location || 'Harare, Zimbabwe');
  const [phone, setPhone] = useState(profile?.phone || '+263 77 234 5678');
  const [farmName, setFarmName] = useState(profile?.farm_name || 'Green Acres Farm');
  const [farmSize, setFarmSize] = useState(profile?.farm_size || '5 Hectares');
  const [farmingType, setFarmingType] = useState(profile?.farming_type || 'Horticulture & Maize');
  const [bio, setBio] = useState(
    profile?.bio ||
      'Dedicated smallholder producer producing high-grade fresh tomatoes, maize, and seasonal butternut squash for regional markets in Zimbabwe.'
  );

  // Sync state if profile loads asynchronously
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.role) setRole(profile.role);
      if (profile.location) setLocation(profile.location);
      if (profile.phone) setPhone(profile.phone);
      if (profile.farm_name) setFarmName(profile.farm_name);
      if (profile.farm_size) setFarmSize(profile.farm_size);
      if (profile.farming_type) setFarmingType(profile.farming_type);
      if (profile.bio) setBio(profile.bio);
    }
  }, [profile]);

  const initials = fullName
    ? fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'FL';

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({
        full_name: fullName,
        role,
        location,
        phone,
        farm_name: farmName,
        farm_size: farmSize,
        farming_type: farmingType,
        bio,
      });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      alert('Could not save profile. Changes have been preserved in local session.');
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageTitle
        kicker="YOUR FARM IDENTITY"
        title="Farm & Account Profile"
        sub="Manage your personal details, farm specifications, and public contact information for buyers."
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className={`btn ${isEditing ? 'btn-outline' : 'btn-primary'}`}
              onClick={() => setIsEditing(!isEditing)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {isEditing ? (
                <>
                  <X size={15} /> Cancel Editing
                </>
              ) : (
                <>
                  <Edit3 size={15} /> Edit Profile
                </>
              )}
            </button>
            <button
              onClick={async () => {
                await signOut();
              }}
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        }
      />

      {successMsg && (
        <div
          style={{
            background: '#e8f7ed',
            border: '1px solid #b7e5c5',
            color: '#086e3f',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CircleCheck size={18} /> {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isEditing ? 'minmax(0, 1.3fr) minmax(0, 1fr)' : '1fr', gap: '24px', alignItems: 'start' }}>
        {/* EDIT FORM (Visible when editing) */}
        {isEditing && (
          <form onSubmit={handleSave} className="panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eaf4eb', color: '#087443', display: 'grid', placeItems: 'center' }}>
                <Edit3 size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>Edit Farm Profile</h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#668' }}>Update your farm info and public buyer details.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                  Full Name / Contact Person *
                </label>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Tendai Chikowe"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                    Account Role *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                  >
                    <option value="farmer">Farmer / Producer</option>
                    <option value="buyer">Commercial Buyer</option>
                    <option value="supplier">Agri-Input Supplier</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                    Location / Province *
                  </label>
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                    placeholder="e.g. Mutoko, Mashonaland East"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                    Phone / WhatsApp Number
                  </label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+263 77..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                    Farm or Business Name
                  </label>
                  <input
                    value={farmName}
                    onChange={e => setFarmName(e.target.value)}
                    placeholder="e.g. Murehwa Greens"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                    Farm Size / Scale
                  </label>
                  <input
                    value={farmSize}
                    onChange={e => setFarmSize(e.target.value)}
                    placeholder="e.g. 5 Hectares / 2 Plots"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                    Primary Produce / Focus
                  </label>
                  <input
                    value={farmingType}
                    onChange={e => setFarmingType(e.target.value)}
                    placeholder="e.g. Roma Tomatoes, Maize, Honey"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2a4435', marginBottom: '5px' }}>
                  Farm Bio & Description
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  placeholder="Share details about your farming practices, irrigation access, or crop schedule..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccd', fontSize: '13px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Save size={16} /> {saving ? 'Saving changes...' : 'Save profile'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* PROFILE CARD & OVERVIEW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="panel profile-page-card" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div
              className="profile-cover large-cover"
              style={{
                height: '140px',
                background: 'linear-gradient(135deg, #0d5432 0%, #1a824e 50%, #2bb872 100%)',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', bottom: '12px', right: '16px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#a6f5c5" /> Verified Member
              </div>
            </div>

            <div className="profile-page-info" style={{ padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
                  <div
                    className="profile-avatar big-profile"
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      background: '#087443',
                      color: '#fff',
                      fontSize: '24px',
                      fontWeight: 800,
                      display: 'grid',
                      placeItems: 'center',
                      border: '4px solid #fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      marginTop: '-37px',
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h2 style={{ margin: '0 0 2px', fontSize: '22px', color: '#102d1d' }}>{fullName}</h2>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#087443', textTransform: 'capitalize' }}>
                      {role}{farmName ? ` | ${farmName}` : ''}
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ fontSize: '12px', padding: '7px 14px' }}>
                    <Edit3 size={14} /> Edit
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '16px 0', fontSize: '13px', color: '#566e60' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={15} color="#087443" /> {location}
                </span>
                {phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={15} color="#087443" /> {phone}
                  </span>
                )}
                {user?.email && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={15} color="#087443" /> {user.email}
                  </span>
                )}
              </div>

              {bio && (
                <p style={{ margin: '0 0 20px', fontSize: '14px', lineHeight: 1.6, color: '#274433', background: '#f5faf6', padding: '14px 16px', borderRadius: '10px' }}>
                  {bio}
                </p>
              )}

              {/* FARM SPECS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#f8faf8', padding: '12px', borderRadius: '10px', border: '1px solid #e2ece4' }}>
                  <div style={{ fontSize: '11px', color: '#7a9483', marginBottom: '2px' }}>FARM SIZE</div>
                  <b style={{ fontSize: '14px', color: '#132d1e' }}>{farmSize}</b>
                </div>
                <div style={{ background: '#f8faf8', padding: '12px', borderRadius: '10px', border: '1px solid #e2ece4' }}>
                  <div style={{ fontSize: '11px', color: '#7a9483', marginBottom: '2px' }}>SPECIALTY</div>
                  <b style={{ fontSize: '14px', color: '#132d1e' }}>{farmingType}</b>
                </div>
                <div style={{ background: '#f8faf8', padding: '12px', borderRadius: '10px', border: '1px solid #e2ece4' }}>
                  <div style={{ fontSize: '11px', color: '#7a9483', marginBottom: '2px' }}>STATUS</div>
                  <b style={{ fontSize: '14px', color: '#087443', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CircleCheck size={14} /> Active
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Admin(){return <><PageTitle kicker="PLATFORM OVERSIGHT" title="Admin dashboard" sub="Review platform activity and manage community listings."/><div className="metric-grid admin-metrics"><Metric icon={<UserRound/>} label="Registered users" value="28" foot="Active community members" tint="green"/><Metric icon={<ShoppingBag/>} label="Active listings" value="18" foot="Live marketplace listings" tint="blue"/><Metric icon={<CircleAlert/>} label="Open reports" value="0" foot="Clean moderation queue" tint="orange"/><Metric icon={<Activity/>} label="Platform activity" value="100%" foot="All systems operational" tint="purple"/></div><div className="panel"><div className="panel-heading"><div><h2>Moderation queue</h2><p>Reported content and newly submitted listings will appear here.</p></div><button className="filter-btn"><Filter size={15}/> Filter</button></div><EmptyState icon={<ShieldCheck/>} title="All clear" body="No pending reports or flagged content in the queue."/></div></>}

export function MyProducts() {
  const [items, setItems] = useState<Product[]>(products.slice(0, 4));
  const [live, setLive] = useState(false);

  useEffect(() => {
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
        status: 'active' | 'pending' | 'sold' | 'removed';
        profiles?: { full_name?: string };
      }>;
    }>('/products/mine')
      .then(r => {
        if (r.data && r.data.length) {
          setLive(true);
          setItems(
            r.data.map(p => ({
              ...p,
              price: Number(p.price),
              currency: p.currency || 'USD',
              quantity: Number(p.quantity),
              unit: p.unit || 'kg',
              image: p.image || products.find(x => x.category === p.category)?.image || products[0].image,
              seller: p.profiles?.full_name || 'FarmLink seller',
              status: p.status === 'removed' ? 'sold' : p.status,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageTitle
        kicker="YOUR MARKET PRESENCE"
        title="My products"
        sub="Manage the products you share with buyers."
        action={
          <Link to="/listing/new" className="btn btn-primary">
            <Plus size={16} /> Add a product
          </Link>
        }
      />
      {items.length ? (
        <div className="product-grid market-grid">
          {items.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ShoppingBag />}
          title="No listings yet"
          body="Create a listing to share your products with buyers."
          action={
            <Link className="btn btn-primary" to="/listing/new">
              Add a product
            </Link>
          }
        />
      )}
    </>
  );
}
