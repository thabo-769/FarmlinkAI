import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot, ScanLine, CloudSun, TrendingUp, CalendarDays, BarChart3,
  Droplets, Mic, ArrowRight, ArrowLeft, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { PageTitle } from '../components';

// The 8 Dedicated Tool Components
import { AssistantTool } from './tools/AssistantTool';
import { CropDoctorTool } from './tools/CropDoctorTool';
import { WeatherTool } from './tools/WeatherTool';
import { MarketPricesTool } from './tools/MarketPricesTool';
import { PlantingCalendarTool } from './tools/PlantingCalendarTool';
import { FarmAnalyticsTool } from './tools/FarmAnalyticsTool';
import { SmartIrrigationTool } from './tools/SmartIrrigationTool';
import { VoiceAssistantTool } from './tools/VoiceAssistantTool';

export type ToolId =
  | 'overview'
  | 'assistant'
  | 'crop-doctor'
  | 'weather'
  | 'market-prices'
  | 'planting-calendar'
  | 'farm-analytics'
  | 'smart-irrigation'
  | 'voice-assistant';

interface ToolMeta {
  id: ToolId;
  name: string;
  tag: string;
  desc: string;
  status: string;
  icon: any;
  tint: string;
  actionText: string;
}

export const AI_FARM_TOOLS: ToolMeta[] = [
  {
    id: 'assistant',
    name: 'AI Farming Assistant',
    tag: 'AGRONOMIC ADVISOR',
    desc: 'Intelligent conversational advisor for crop management, Pfumvudza guidelines, and fertilizer calibration.',
    status: 'AI Active',
    icon: Bot,
    tint: 'brand',
    actionText: 'Open Assistant',
  },
  {
    id: 'crop-doctor',
    name: 'AI Crop Doctor',
    tag: 'DISEASE & PEST AI',
    desc: 'Camera-enabled plant pathology scanner. Identify foliar diseases, Fall Armyworm, and nutrient deficiencies.',
    status: 'Vision Engine Ready',
    icon: ScanLine,
    tint: 'green',
    actionText: 'Diagnose Crops',
  },
  {
    id: 'weather',
    name: 'AI Weather Intelligence',
    tag: 'AGRO-METEOROLOGY',
    desc: 'Radar forecasts, foliar spraying suitability windows, and drought/excess rainfall warnings for Zimbabwe.',
    status: 'Live Satellite Radar',
    icon: CloudSun,
    tint: 'orange',
    actionText: 'Check Forecast',
  },
  {
    id: 'market-prices',
    name: 'AI Market Price Intelligence',
    tag: 'AMA & REGIONAL ARBITRAGE',
    desc: 'Benchmark commodity prices across Mbare Musika, Bulawayo, Sakubva, and GMB with 30-day AI price forecasts.',
    status: 'Verified AMA Feeds',
    icon: TrendingUp,
    tint: 'blue',
    actionText: 'Compare Markets',
  },
  {
    id: 'planting-calendar',
    name: 'AI Planting Calendar',
    tag: 'SEASONAL TIMELINES',
    desc: 'Customized sowing dates, fertilizer split milestones, and task schedules tailored to Natural Regions I – V.',
    status: 'Regions I–V Aligned',
    icon: CalendarDays,
    tint: 'green',
    actionText: 'Plan Planting',
  },
  {
    id: 'farm-analytics',
    name: 'AI Farm Analytics',
    tag: 'PROFIT & YIELD AUDIT',
    desc: 'Track input expenses, harvest output, and sales revenue with AI-powered input cost reduction recommendations.',
    status: 'P&L Engine Active',
    icon: BarChart3,
    tint: 'purple',
    actionText: 'View Analytics',
  },
  {
    id: 'smart-irrigation',
    name: 'AI Smart Irrigation',
    tag: 'HYDRO-PRECISION',
    desc: 'Calculate precise crop water demand based on evapotranspiration (ETc), soil type, and rainfall adjustments.',
    status: 'Weather Synced',
    icon: Droplets,
    tint: 'blue',
    actionText: 'Plan Irrigation',
  },
  {
    id: 'voice-assistant',
    name: 'AI Voice Assistant',
    tag: 'HANDS-FREE FIELD ADVISOR',
    desc: 'Speak agricultural inquiries into your microphone and hear spoken AI advice in English, Shona, or Ndebele.',
    status: 'English · Shona · Ndebele',
    icon: Mic,
    tint: 'brand',
    actionText: 'Start Speaking',
  },
];

interface FarmToolsProps {
  embedded?: boolean;
  defaultTab?: ToolId;
}

export function FarmTools({ embedded = false, defaultTab = 'overview' }: FarmToolsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawParam = searchParams.get('tool');

  // Handle aliases for backwards compatibility
  let normalizedTab: ToolId = 'overview';
  if (rawParam) {
    if (rawParam === 'crop-health') normalizedTab = 'crop-doctor';
    else if (rawParam === 'prices') normalizedTab = 'market-prices';
    else if (AI_FARM_TOOLS.some((t) => t.id === rawParam)) normalizedTab = rawParam as ToolId;
  } else if (defaultTab !== 'overview') {
    normalizedTab = defaultTab;
  }

  const [activeTab, setActiveTab] = useState<ToolId>(normalizedTab);

  useEffect(() => {
    const p = searchParams.get('tool');
    if (p) {
      if (p === 'crop-health' && activeTab !== 'crop-doctor') setActiveTab('crop-doctor');
      else if (p === 'prices' && activeTab !== 'market-prices') setActiveTab('market-prices');
      else if (AI_FARM_TOOLS.some((t) => t.id === p) && activeTab !== p) setActiveTab(p as ToolId);
    } else if (!p && activeTab !== 'overview' && !embedded) {
      setActiveTab('overview');
    }
  }, [searchParams]);

  function switchTab(tab: ToolId) {
    setActiveTab(tab);
    if (!embedded) {
      if (tab === 'overview') {
        searchParams.delete('tool');
        setSearchParams(searchParams);
      } else {
        setSearchParams({ tool: tab });
      }
    }
  }

  const activeToolMeta = AI_FARM_TOOLS.find((t) => t.id === activeTab);

  return (
    <div className={`farm-tools-page ${embedded ? 'embedded-tools-suite' : ''}`}>
      {!embedded && (
        <PageTitle
          kicker="AI-POWERED AGRICULTURAL SUITE"
          title="Farm Tools"
          sub="Eight intelligent agricultural tools engineered for Zimbabwean farmers: from crop diagnosis and planting schedules to smart irrigation, weather intelligence and voice guidance."
        />
      )}

      {/* Mobile Tool Selector Dropdown (< 768px): Zero horizontal scroll */}
      <div className="farm-tools-mobile-selector">
        <label htmlFor="farm-tool-select" className="mobile-select-label">
          <LayoutGrid size={15} /> Switch Tool:
        </label>
        <select
          id="farm-tool-select"
          value={activeTab}
          onChange={(e) => switchTab(e.target.value as ToolId)}
          className="mobile-tool-dropdown"
        >
          <option value="overview">All 8 Tools (Overview)</option>
          {AI_FARM_TOOLS.map((tool, idx) => (
            <option key={tool.id} value={tool.id}>
              {idx + 1}. {tool.name}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop / Tablet Tab Bar (>= 768px): No ugly scrollbar */}
      <div className="farm-tools-top-nav-bar desktop-only-tabs">
        <button
          type="button"
          className={`nav-tab-pill ${activeTab === 'overview' ? 'selected' : ''}`}
          onClick={() => switchTab('overview')}
        >
          <LayoutGrid size={14} />
          <span>All 8 Tools</span>
        </button>

        {AI_FARM_TOOLS.map((tool, idx) => {
          const Icon = tool.icon;
          const isSelected = activeTab === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              className={`nav-tab-pill ${isSelected ? 'selected' : ''}`}
              onClick={() => switchTab(tool.id)}
            >
              <Icon size={13} />
              <span>{idx + 1}. {tool.name.replace('AI ', '')}</span>
            </button>
          );
        })}
      </div>

      {/* If Overview: Render 8 Interactive Tool Cards */}
      {activeTab === 'overview' ? (
        <div className="farm-tools-hub-view">
          <div className="hub-intro-box panel">
            <div className="hub-intro-text">
              <span className="section-kicker">COMPREHENSIVE FARM MANAGEMENT SUITE</span>
              <h2>Intelligent Decision Tools for Every Stage of the Season</h2>
              <p className="hub-desc-text">
                From soil prep and certified seed selection to pest scouting, water conservation, and market commodity arbitrage. Select any tool below to launch its dedicated workspace.
              </p>
            </div>
            <div className="hub-features-chips">
              <span className="hub-chip"><CheckCircle2 size={12} /> Regions I–V</span>
              <span className="hub-chip"><CheckCircle2 size={12} /> Pfumvudza Aligned</span>
              <span className="hub-chip"><CheckCircle2 size={12} /> Real AMA Pricing</span>
              <span className="hub-chip"><CheckCircle2 size={12} /> English · Shona · Ndebele</span>
            </div>
          </div>

          <div className="farm-tools-cards-grid eight-cards">
            {AI_FARM_TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => switchTab(tool.id)}
                  className={`farm-tool-card interactive-card tint-${tool.tint}`}
                >
                  <div className="card-top-status-row">
                    <span className="tool-number-pill">0{index + 1}</span>
                    <span className="tool-status-pill online">
                      <span className="dot" /> {tool.status}
                    </span>
                  </div>

                  <div className="tool-card-main-content">
                    <div className={`farm-tool-icon ${tool.tint}`}>
                      <Icon size={22} />
                    </div>

                    <div className="farm-tool-info">
                      <div className={`farm-tool-tag ${tool.tint}-tag`}>{tool.tag}</div>
                      <h3>{tool.name}</h3>
                      <p>{tool.desc}</p>
                    </div>
                  </div>

                  <span className="farm-tool-action">
                    {tool.actionText} <ArrowRight size={13} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Render Active Dedicated Tool Workspace */
        <div className="active-tool-workspace-view">
          <div className="workspace-breadcrumb-bar">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={() => switchTab('overview')}
            >
              <ArrowLeft size={14} /> Back to All Farm Tools
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{activeToolMeta?.name}</span>
          </div>

          <div className="active-tool-rendered-container">
            {activeTab === 'assistant' && <AssistantTool />}
            {activeTab === 'crop-doctor' && <CropDoctorTool />}
            {activeTab === 'weather' && <WeatherTool />}
            {activeTab === 'market-prices' && <MarketPricesTool />}
            {activeTab === 'planting-calendar' && <PlantingCalendarTool />}
            {activeTab === 'farm-analytics' && <FarmAnalyticsTool />}
            {activeTab === 'smart-irrigation' && <SmartIrrigationTool />}
            {activeTab === 'voice-assistant' && <VoiceAssistantTool />}
          </div>
        </div>
      )}
    </div>
  );
}