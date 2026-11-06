import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScanLine, Bot, CloudSun, ArrowRight, Sparkles, CloudRain, ShieldCheck, ThermometerSun } from 'lucide-react';
import { PageTitle } from '../components';
import { CropHealth } from './CropHealth';
import { Assistant, Weather } from './Workspace';

export type ToolTab = 'weather' | 'crop-health' | 'assistant';

interface FarmToolsProps {
  embedded?: boolean;
  defaultTab?: ToolTab;
}

export function FarmTools({ embedded = false, defaultTab = 'weather' }: FarmToolsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tool') as ToolTab;
  const [activeTab, setActiveTab] = useState<ToolTab>(
    urlTab && ['weather', 'crop-health', 'assistant'].includes(urlTab)
      ? urlTab
      : defaultTab
  );

  useEffect(() => {
    const param = searchParams.get('tool') as ToolTab;
    if (param && ['weather', 'crop-health', 'assistant'].includes(param) && param !== activeTab) {
      setActiveTab(param);
    }
  }, [searchParams]);

  function switchTab(tab: ToolTab) {
    setActiveTab(tab);
    if (!embedded) {
      setSearchParams({ tool: tab });
    }
  }

  return (
    <div className={`farm-tools-page ${embedded ? 'embedded-tools-suite' : ''}`}>
      {!embedded && (
        <PageTitle
          kicker="SMART FARMING SUITE"
          title="Farm Tools"
          sub="Three practical tools for your farm: local weather forecasts, AI crop-health guidance and farming advice."
        />
      )}

      {/* 3 Tool Feature Cards */}
      <div className="farm-tools-cards-grid">
        <button
          type="button"
          onClick={() => switchTab('weather')}
          className={`farm-tool-card ${activeTab === 'weather' ? 'is-active' : ''}`}
        >
          <div className="farm-tool-icon orange">
            <CloudSun size={26} />
          </div>
          <div className="farm-tool-info">
            <div className="farm-tool-tag orange-tag">METEOROLOGY & PLANNING</div>
            <h3>Weather Forecast</h3>
            <p>Real-time agro-forecasts, rainfall outlook, temperature, wind, and spraying conditions.</p>
          </div>
          <span className="farm-tool-action">
            {activeTab === 'weather' ? 'Active Tool' : 'Open Forecast'} <ArrowRight size={14} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('crop-health')}
          className={`farm-tool-card ${activeTab === 'crop-health' ? 'is-active' : ''}`}
        >
          <div className="farm-tool-icon green">
            <ScanLine size={26} />
          </div>
          <div className="farm-tool-info">
            <div className="farm-tool-tag green-tag">AI DIAGNOSTICS</div>
            <h3>Crop Health</h3>
            <p>Scan crop leaves for diseases and pests with your camera, then receive instant treatment guidance.</p>
          </div>
          <span className="farm-tool-action">
            {activeTab === 'crop-health' ? 'Active Tool' : 'Scan Crops'} <ArrowRight size={14} />
          </span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('assistant')}
          className={`farm-tool-card ${activeTab === 'assistant' ? 'is-active' : ''}`}
        >
          <div className="farm-tool-icon blue">
            <Bot size={26} />
          </div>
          <div className="farm-tool-info">
            <div className="farm-tool-tag blue-tag">FARMING ADVICE WHENEVER YOU NEED IT</div>
            <h3>AI Assistance</h3>
            <p>Ask questions about planting, soil health, irrigation and pest management.</p>
          </div>
          <span className="farm-tool-action">
            {activeTab === 'assistant' ? 'Active Tool' : 'Chat with AI'} <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* Active Tool Workspace */}
      <div className="farm-tool-active-wrapper">
        <div className="farm-tool-tab-bar">
          <button
            type="button"
            className={`tool-tab-btn ${activeTab === 'weather' ? 'selected' : ''}`}
            onClick={() => switchTab('weather')}
          >
            <CloudSun size={17} />
            <span>1. Weather Forecast</span>
          </button>
          <button
            type="button"
            className={`tool-tab-btn ${activeTab === 'crop-health' ? 'selected' : ''}`}
            onClick={() => switchTab('crop-health')}
          >
            <ScanLine size={17} />
            <span>2. Crop Health</span>
          </button>
          <button
            type="button"
            className={`tool-tab-btn ${activeTab === 'assistant' ? 'selected' : ''}`}
            onClick={() => switchTab('assistant')}
          >
            <Bot size={17} />
            <span>3. AI Assistance</span>
          </button>
        </div>

        <div className="farm-tool-content-viewport">
          {activeTab === 'weather' && (
            <div className="tool-view-card">
              <Weather />
            </div>
          )}
          {activeTab === 'crop-health' && (
            <div className="tool-view-card">
              <CropHealth />
            </div>
          )}
          {activeTab === 'assistant' && (
            <div className="tool-view-card">
              <Assistant />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
