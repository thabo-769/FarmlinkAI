import { useState, useEffect } from 'react';
import {
  CalendarDays, Sprout, CheckCircle2, Plus, Clock, AlertCircle,
  ChevronRight, Calendar as CalendarIcon, CheckSquare, Sparkles, Filter
} from 'lucide-react';
import { api } from '../../services/api';

interface CropMilestone {
  stage: string;
  daysAfterPlanting: string;
  action: string;
  fertilizerOrInput?: string;
  riskNote: string;
}

interface CropScheduleTemplate {
  crop: string;
  season: string;
  regions: string;
  recommendedPlantingWindow: string;
  harvestWindow: string;
  totalDays: number;
  milestones: CropMilestone[];
}

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'normal' | 'high';
  due_at?: string;
  completed_at?: string | null;
}

export function PlantingCalendarTool() {
  const [selectedCrop, setSelectedCrop] = useState('White Maize (Pfumvudza)');
  const [selectedRegion, setSelectedRegion] = useState('Region II (Mashonaland / Harare / Mazowe)');
  const [selectedSeason, setSelectedSeason] = useState('Summer Main Rainfed (Nov – Apr)');
  const [plantingDate, setPlantingDate] = useState('2026-11-20');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [taskAddedNotice, setTaskAddedNotice] = useState('');

  const crops = [
    'White Maize (Pfumvudza)',
    'Commercial Grain Maize',
    'Roma Tomatoes (Staggered)',
    'Soya Beans',
    'Groundnuts (Nyimo & Nzungu)',
    'Sorghum (Drought-Tolerant)',
    'Waltham Butternut Squash',
    'Winter Wheat (Irrigated)',
  ];

  const regions = [
    'Region I (Eastern Highlands / Nyanga)',
    'Region II (Mashonaland / Harare / Mazowe)',
    'Region III (Midlands / Gweru / Kwekwe)',
    'Region IV (Masvingo / Lowveld)',
    'Region V (Beitbridge / Hwange)',
  ];

  const seasons = [
    'Summer Main Rainfed (Nov – Apr)',
    'Winter Irrigated (May – Oct)',
    'Early Green Maize (Aug – Dec)',
  ];

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const res = await api<{ data: TaskItem[] }>('/tasks');
      if (res?.data) setTasks(res.data);
    } catch {
      // ignore
    }
  }

  async function handleAddMilestoneToTasks(milestone: CropMilestone) {
    try {
      const res = await api<{ data: TaskItem }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: `${selectedCrop.split(' ')[0]}: ${milestone.stage} (${milestone.action})`,
          description: `${milestone.fertilizerOrInput ? `Input: ${milestone.fertilizerOrInput}. ` : ''}${milestone.riskNote}`,
          priority: 'high',
          due_at: new Date(Date.now() + 86400000 * 7).toISOString(),
        }),
      });
      if (res?.data) {
        setTasks((prev) => [res.data, ...prev]);
        setTaskAddedNotice(`Added "${milestone.stage}" to your Farm Tasks!`);
        setTimeout(() => setTaskAddedNotice(''), 4000);
      }
    } catch {
      // ignore
    }
  }

  // Pre-configured dynamic agronomy calendar models
  const scheduleData: CropScheduleTemplate = {
    crop: selectedCrop,
    season: selectedSeason,
    regions: selectedRegion,
    recommendedPlantingWindow: '15 Nov – 15 Dec (Once 25-30mm rainfall is established)',
    harvestWindow: '15 Apr – 10 May',
    totalDays: 140,
    milestones: [
      {
        stage: 'Stage 1: Pfumvudza Basin Prep & Liming',
        daysAfterPlanting: '2 to 4 weeks prior to rains',
        action: 'Dig 15cm deep x 15cm wide basins spaced 75cm x 60cm. Incorporate 1 handful of cattle manure or compost per basin.',
        fertilizerOrInput: 'Agricultural lime (if pH < 5.0) + Well-rotted kraal manure',
        riskNote: 'Avoid dry basin compaction; place mulch around basins to capture early runoff.',
      },
      {
        stage: 'Stage 2: Basal Application & Sowing',
        daysAfterPlanting: 'Day 0',
        action: 'Place basal fertilizer 5cm away from seeds to prevent fertilizer burn. Plant 3 seeds per basin, thinned to 2 at 2 weeks.',
        fertilizerOrInput: 'Compound D (7-14-7) @ 350 kg/ha or 1 bottle cap (No. 5 cup) per basin',
        riskNote: 'Sow only after soil is moist down to 30cm depth. Do not plant into dry dust.',
      },
      {
        stage: 'Stage 3: Emergence & Early Weed Control',
        daysAfterPlanting: 'Days 7 – 14',
        action: 'Scout germination rate. Thin weak seedlings leaving the 2 strongest plants per basin. Keep plots 100% weed-free.',
        fertilizerOrInput: 'Pre-emergence herbicide or shallow hoe weeding',
        riskNote: 'Early weeds compete aggressively for nitrogen and moisture.',
      },
      {
        stage: 'Stage 4: First Top-Dressing & Armyworm Scout',
        daysAfterPlanting: 'Days 28 – 35 (Knee-high / 5–6 leaves)',
        action: 'Apply first split top-dressing when soil is moist. Scout whorls for Fall Armyworm windowing and frass.',
        fertilizerOrInput: 'Ammonium Nitrate (AN 34.5% N) @ 150 kg/ha (first split)',
        riskNote: 'Apply AN into the basin ring; never throw pellets directly into the plant whorl.',
      },
      {
        stage: 'Stage 5: Second Top-Dressing & Tasseling',
        daysAfterPlanting: 'Days 50 – 60',
        action: 'Apply second AN split just before tasseling. Critical water-sensitive period: protect soil mulch cover.',
        fertilizerOrInput: 'Ammonium Nitrate (AN) @ 150 kg/ha (second split)',
        riskNote: 'Moisture stress during pollen-shed causes severe yield reduction.',
      },
      {
        stage: 'Stage 6: Grain Filling & Silking',
        daysAfterPlanting: 'Days 75 – 95',
        action: 'Monitor ear maturity. Scout for stalk borers and cob rots during wet spells.',
        fertilizerOrInput: 'Foliar potassium or zinc booster if deficient',
        riskNote: 'Ensure birds and rodents are deterred around field perimeters.',
      },
      {
        stage: 'Stage 7: Physiological Maturity & Harvest',
        daysAfterPlanting: 'Days 125 – 140',
        action: 'Check for black moisture layer at the grain tip. Harvest, de-husk, and sun-dry on raised cribs until 12.5% moisture is reached.',
        fertilizerOrInput: 'Grain protectant dust (e.g. Shumba Super or Actellic Gold)',
        riskNote: 'Store bagged grain on wooden pallets 50cm away from walls to prevent weevils.',
      },
    ],
  };

  return (
    <div className="tool-view-card planting-calendar-tool">
      <div className="tool-header-block">
        <div className="tool-icon-circle green-tint">
          <CalendarDays size={24} />
        </div>
        <div>
          <div className="tool-meta-tag green-tag">TOOL 5 OF 8 · SEASONAL SCHEDULER & AGRO-CALENDAR</div>
          <h2>AI Planting Calendar</h2>
          <p>
            Generate tailored crop growth timelines, fertilizer application schedules, and activity reminders mapped to Zimbabwe's natural regions.
          </p>
        </div>
        <div className="view-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline View
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar Grid
          </button>
        </div>
      </div>

      {/* Configuration Controls Bar */}
      <div className="panel calendar-config-bar">
        <div className="config-fields-grid">
          <label className="field-label">
            <span>Crop & Variety:</span>
            <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)}>
              {crops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            <span>Agro-Ecological Region:</span>
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            <span>Farming Season:</span>
            <select value={selectedSeason} onChange={(e) => setSelectedSeason(e.target.value)}>
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label">
            <span>Estimated Sowing Date:</span>
            <input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
            />
          </label>
        </div>
      </div>

      {taskAddedNotice && (
        <div className="notice-banner success">
          <CheckCircle2 size={16} />
          <span>{taskAddedNotice}</span>
        </div>
      )}

      {/* Summary Banner */}
      <div className="calendar-summary-cards">
        <div className="summary-card panel">
          <span className="card-kicker">OPTIMAL PLANTING WINDOW</span>
          <strong>{scheduleData.recommendedPlantingWindow}</strong>
          <small>Region II / III rainfall established</small>
        </div>
        <div className="summary-card panel">
          <span className="card-kicker">EXPECTED HARVEST PERIOD</span>
          <strong>{scheduleData.harvestWindow}</strong>
          <small>Estimated cycle: {scheduleData.totalDays} days</small>
        </div>
        <div className="summary-card panel">
          <span className="card-kicker">FERTILIZER PROTOCOL</span>
          <strong>Compound D + Split AN</strong>
          <small>Basal at sowing + 2 top-dressing splits</small>
        </div>
      </div>

      {/* View Mode: Timeline */}
      {viewMode === 'timeline' ? (
        <div className="timeline-stages-wrapper">
          <h3>Growth Milestones & Field Tasks: {selectedCrop}</h3>
          <div className="timeline-flow-list">
            {scheduleData.milestones.map((m, idx) => (
              <div key={idx} className="timeline-step-card panel">
                <div className="step-marker-col">
                  <div className="step-circle">{idx + 1}</div>
                  <div className="step-connector" />
                </div>
                <div className="step-content-col">
                  <div className="step-header-row">
                    <div>
                      <h4>{m.stage}</h4>
                      <span className="step-days-pill">
                        <Clock size={12} /> {m.daysAfterPlanting}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleAddMilestoneToTasks(m)}
                    >
                      <Plus size={14} /> Add to Farm Tasks
                    </button>
                  </div>

                  <p className="step-action-desc">{m.action}</p>

                  <div className="step-metadata-box">
                    {m.fertilizerOrInput && (
                      <div className="meta-item">
                        <Sprout size={14} />
                        <span><strong>Recommended Inputs:</strong> {m.fertilizerOrInput}</span>
                      </div>
                    )}
                    <div className="meta-item risk">
                      <AlertCircle size={14} />
                      <span><strong>Key Risk & Prevention:</strong> {m.riskNote}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* View Mode: Calendar Grid View */
        <div className="calendar-grid-wrapper panel">
          <h3>Seasonal Agronomic Calendar: November 2026 – May 2027</h3>
          <div className="calendar-month-blocks">
            <div className="month-block">
              <div className="month-name">November 2026</div>
              <ul className="month-tasks">
                <li className="task-pill green">Pfumvudza basin digging & manure</li>
                <li className="task-pill blue">Basal Compound D application</li>
                <li className="task-pill brand">Main sowing after 30mm rain</li>
              </ul>
            </div>
            <div className="month-block">
              <div className="month-name">December 2026</div>
              <ul className="month-tasks">
                <li className="task-pill orange">Seedling emergence & thinning</li>
                <li className="task-pill red">First Fall Armyworm scouting</li>
                <li className="task-pill blue">First top-dressing (Ammonium Nitrate)</li>
              </ul>
            </div>
            <div className="month-block">
              <div className="month-name">January 2027</div>
              <ul className="month-tasks">
                <li className="task-pill orange">Second weeding & soil banking</li>
                <li className="task-pill blue">Second AN top-dressing split</li>
                <li className="task-pill brand">Whorl vegetative monitoring</li>
              </ul>
            </div>
            <div className="month-block">
              <div className="month-name">February 2027</div>
              <ul className="month-tasks">
                <li className="task-pill brand">Tasseling & silking protection</li>
                <li className="task-pill orange">Mulch maintenance against dry spell</li>
              </ul>
            </div>
            <div className="month-block">
              <div className="month-name">March – April 2027</div>
              <ul className="month-tasks">
                <li className="task-pill blue">Grain filling & cob drying</li>
                <li className="task-pill brand">Field physiological maturity check</li>
                <li className="task-pill green">Harvesting & crib sun-drying</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Farm Tasks Connected Panel */}
      <div className="panel farm-tasks-preview-panel">
        <div className="panel-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare size={16} />
            <h3>Your Scheduled Farm Tasks ({tasks.length})</h3>
          </div>
          <a href="/tasks" className="btn btn-quiet">
            View All Tasks <ChevronRight size={14} />
          </a>
        </div>
        {tasks.length === 0 ? (
          <p className="empty-text">No active farming tasks. Click "Add to Farm Tasks" on any milestone above.</p>
        ) : (
          <div className="tasks-compact-list">
            {tasks.slice(0, 4).map((t) => (
              <div key={t.id} className="task-row-compact">
                <span className="task-check-circle" />
                <div className="task-info">
                  <strong>{t.title}</strong>
                  {t.description && <small>{t.description}</small>}
                </div>
                <span className={`task-pri-badge ${t.priority}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
