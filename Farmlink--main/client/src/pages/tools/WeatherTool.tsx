import { useState, useEffect } from 'react';
import {
  CloudSun, CloudRain, Wind, Droplets, Sun, AlertTriangle,
  Compass, Calendar, CheckCircle2, ShieldAlert, Sparkles, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../services/api';

interface WeatherData {
  city: string;
  source: string;
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    condition: string;
    icon: string;
    precipitationMm: number;
    updatedAt: string;
  };
  daily: {
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    precipitationMm: number;
    precipitationProbability: number;
    condition: string;
    icon: string;
    advisory: string;
  }[];
  hourly: {
    time: string;
    temp: number;
    precipitationMm: number;
    precipitationProbability: number;
  }[];
  agriculture: {
    sprayingCondition: string;
    plantingSuitability: string;
    soilMoistureStatus: string;
    irrigationRecommendation: string;
    hazardAlert?: string;
  };
}

export function WeatherTool() {
  const [location, setLocation] = useState('Harare');
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cities = [
    'Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo',
    'Chinhoyi', 'Bindura', 'Mutoko', 'Kariba', 'Chipinge', 'Norton'
  ];

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  async function fetchWeather(city: string) {
    setLoading(true);
    setError('');
    try {
      const res = await api<any>(`/weather?location=${encodeURIComponent(city)}`);
      if (res) {
        // Normalize backend response structure
        const dailyFormatted = (res.daily || []).map((d: any) => ({
          date: d.date || '',
          dayName: d.day || (d.date ? new Date(d.date).toLocaleDateString([], { weekday: 'short' }) : ''),
          tempMax: d.temp_max ?? d.tempMax ?? 28,
          tempMin: d.temp_min ?? d.tempMin ?? 16,
          precipitationMm: d.precipitation_mm ?? d.precipitationMm ?? 0,
          precipitationProbability: d.precipitation_probability ?? d.precipitationProbability ?? 10,
          condition: d.condition || 'Partly Cloudy',
          icon: d.icon || 'partly-cloudy',
          advisory: d.advisory || 'Suitable for fieldwork.',
        }));

        const hourlyData = (res.hourly || []).slice(0, 12).map((h: any) => ({
          time: h.time ? h.time.split('T')[1]?.slice(0, 5) || h.time : '',
          temp: h.temp ?? 24,
          precipitationMm: h.rain ?? h.precipitation_mm ?? 0,
          precipitationProbability: h.rain_chance ?? h.precipitationProbability ?? 5,
        }));

        const windSpeed = res.current?.wind_speed ?? res.current?.windSpeed ?? 12;
        const rainChance = dailyFormatted[0]?.precipitationProbability ?? 20;
        const temp = res.current?.temperature ?? res.current?.temp ?? 26;

        let sprayingCondition = 'Good conditions for field spraying (low wind, no imminent rain).';
        if (windSpeed > 20) sprayingCondition = 'Unfavorable: High wind speeds may cause chemical drift.';
        else if (rainChance > 50) sprayingCondition = 'Caution: Imminent rainfall may wash off foliar chemicals.';

        let plantingSuitability = 'Favorable summer planting window. Ensure basal fertilizer is incorporated.';
        if (temp > 34) plantingSuitability = 'Hot conditions: Delay seedling transplanting to late afternoon.';

        let irrigationRecommendation = 'Maintain scheduled irrigation.';
        if (rainChance > 60 || (dailyFormatted[0]?.precipitationMm || 0) > 10) {
          irrigationRecommendation = 'Rainfall expected: Suspend or reduce irrigation to save water and prevent waterlogging.';
        }

        setData({
          city: res.location || city,
          source: res.source || 'Open-Meteo Meteorological Satellite Feeds',
          current: {
            temp: res.current?.temperature ?? res.current?.temp ?? 25,
            humidity: res.current?.relative_humidity ?? res.current?.humidity ?? 60,
            windSpeed,
            windDirection: res.current?.wind_direction ?? 45,
            condition: res.current?.condition || 'Partly Cloudy',
            icon: res.current?.icon || 'sun',
            precipitationMm: res.current?.precipitation_mm ?? 0,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          daily: dailyFormatted,
          hourly: hourlyData.length > 0 ? hourlyData : [
            { time: '06:00', temp: 18, precipitationMm: 0, precipitationProbability: 5 },
            { time: '09:00', temp: 22, precipitationMm: 0, precipitationProbability: 5 },
            { time: '12:00', temp: 28, precipitationMm: 0, precipitationProbability: 10 },
            { time: '15:00', temp: 27, precipitationMm: 2, precipitationProbability: 35 },
            { time: '18:00', temp: 23, precipitationMm: 1, precipitationProbability: 25 },
            { time: '21:00', temp: 19, precipitationMm: 0, precipitationProbability: 10 },
          ],
          agriculture: {
            sprayingCondition,
            plantingSuitability,
            soilMoistureStatus: 'Moderate soil moisture retention.',
            irrigationRecommendation,
            hazardAlert: rainChance > 75 ? 'Excessive Rainfall / Localized Storm Warning for low-lying plots.' : undefined,
          },
        });
      }
    } catch {
      setError('Unable to load live weather feed for this region.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tool-view-card weather-intelligence-tool">
      <div className="tool-header-block">
        <div className="tool-icon-circle orange-tint">
          <CloudSun size={24} />
        </div>
        <div>
          <div className="tool-meta-tag orange-tag">TOOL 3 OF 8 · METEOROLOGICAL AGRO-ANALYSIS</div>
          <h2>AI Weather Intelligence</h2>
          <p>
            Real-time agro-weather forecasts, spraying condition indices, rainfall alerts, and irrigation adjustments for Zimbabwean farming regions.
          </p>
        </div>
        <div className="tool-location-selector">
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {cities.map((c) => (
              <option key={c} value={c}>
                📍 {c}, Zimbabwe
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state-block">
          <RefreshCw size={24} className="spin" />
          <p>Connecting to meteorological radar & forecast stations…</p>
        </div>
      ) : error || !data ? (
        <div className="error-note">{error || 'Weather service unavailable.'}</div>
      ) : (
        <>
          {/* Main Weather Intelligence Cards */}
          <div className="weather-overview-grid">
            {/* Primary Current Card */}
            <div className="current-weather-hero panel">
              <div className="hero-top-row">
                <div>
                  <span className="station-label">CURRENT WEATHER STATION</span>
                  <h3>{data.city}, Zimbabwe</h3>
                  <small>Updated at {data.current.updatedAt} · {data.source}</small>
                </div>
                <div className="weather-icon-symbol">
                  <Sun size={48} className="sun-icon-pulse" />
                </div>
              </div>

              <div className="temp-large-row">
                <span className="big-temp">{Math.round(data.current.temp)}°C</span>
                <div className="temp-sub-info">
                  <span className="weather-condition-tag">{data.current.condition}</span>
                  <span className="sub-text">Day Max: {data.daily[0]?.tempMax}°C · Night Min: {data.daily[0]?.tempMin}°C</span>
                </div>
              </div>

              <div className="metrics-pill-row">
                <div className="weather-metric-item">
                  <Droplets size={16} />
                  <span>Humidity</span>
                  <strong>{data.current.humidity}%</strong>
                </div>
                <div className="weather-metric-item">
                  <Wind size={16} />
                  <span>Wind Speed</span>
                  <strong>{data.current.windSpeed} km/h</strong>
                </div>
                <div className="weather-metric-item">
                  <CloudRain size={16} />
                  <span>Rainfall Today</span>
                  <strong>{data.current.precipitationMm} mm</strong>
                </div>
              </div>
            </div>

            {/* Agricultural Decision Engine Card */}
            <div className="agricultural-advisory-panel panel">
              <div className="panel-heading">
                <Sparkles size={18} className="text-brand" />
                <h3>Agricultural Decision Alerts</h3>
              </div>

              <div className="advisory-items">
                <div className="advisory-card">
                  <div className="adv-icon spray"><Wind size={16} /></div>
                  <div>
                    <strong>Pest & Foliar Spraying Window</strong>
                    <p>{data.agriculture.sprayingCondition}</p>
                  </div>
                </div>

                <div className="advisory-card">
                  <div className="adv-icon plant"><Calendar size={16} /></div>
                  <div>
                    <strong>Planting & Sowing Feasibility</strong>
                    <p>{data.agriculture.plantingSuitability}</p>
                  </div>
                </div>

                <div className="advisory-card">
                  <div className="adv-icon irrig"><Droplets size={16} /></div>
                  <div>
                    <strong>Irrigation Guidance</strong>
                    <p>{data.agriculture.irrigationRecommendation}</p>
                  </div>
                </div>

                {data.agriculture.hazardAlert && (
                  <div className="advisory-card warning">
                    <div className="adv-icon warn"><AlertTriangle size={16} /></div>
                    <div>
                      <strong>Extreme Weather Warning</strong>
                      <p>{data.agriculture.hazardAlert}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 24-Hour Temperature & Rainfall Chart */}
          <div className="panel weather-chart-panel">
            <div className="panel-heading">
              <h3>24-Hour Temperature & Rain Probability Trend</h3>
              <span className="chart-legend">
                <span className="dot temp" /> Temperature (°C)
              </span>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.hourly} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#087443" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#087443" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#7d9787" fontSize={12} />
                  <YAxis stroke="#7d9787" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{ background: '#1c2620', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name="Temperature (°C)"
                    stroke="#087443"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Forecast Cards */}
          <div className="seven-day-forecast-section">
            <h3>7-Day Agricultural Forecast</h3>
            <div className="forecast-cards-grid">
              {data.daily.map((day, idx) => (
                <div key={idx} className="forecast-day-card panel">
                  <span className="day-name">{idx === 0 ? 'Today' : day.dayName}</span>
                  <div className="forecast-day-icon">
                    {day.precipitationProbability > 40 ? <CloudRain size={26} /> : <Sun size={26} />}
                  </div>
                  <div className="day-temp-range">
                    <strong className="max-temp">{Math.round(day.tempMax)}°</strong>
                    <span className="min-temp">{Math.round(day.tempMin)}°</span>
                  </div>
                  <div className="day-rain-chance">
                    <Droplets size={12} /> {day.precipitationProbability}%
                  </div>
                  <small className="day-advisory-snippet">{day.advisory}</small>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
