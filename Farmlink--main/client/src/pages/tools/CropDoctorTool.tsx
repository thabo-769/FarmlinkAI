import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  ScanLine, Camera, Upload, Check, AlertTriangle, ShieldCheck,
  History, Sparkles, X, ChevronRight, RefreshCw, FileText
} from 'lucide-react';
import { uploadApi, api } from '../../services/api';

interface DiagnosisItem {
  id: string;
  problem: string;
  crop_type?: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  symptoms: string;
  treatment: string;
  prevention: string;
  created_at: string;
}

export function CropDoctorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [cropType, setCropType] = useState('White Maize');
  const [symptoms, setSymptoms] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    assessment: string;
    diagnosis?: DiagnosisItem;
    disclaimer: string;
  } | null>(null);

  const [history, setHistory] = useState<DiagnosisItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<DiagnosisItem | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await api<{ data: DiagnosisItem[] }>('/disease/history');
      if (res.data) setHistory(res.data);
    } catch {
      // ignore
    }
  }

  function handleFileSelect(f?: File) {
    if (!f) {
      setFile(null);
      setPreviewUrl('');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Please select an image smaller than 5 MB.');
      return;
    }
    setError('');
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setSelectedHistoryItem(null);
  }

  async function openCamera() {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch {
      setError('Unable to access device camera. Please upload an image instead.');
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsCameraOpen(false);
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const captured = new File([blob], `crop-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleFileSelect(captured);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Please choose or capture a crop leaf image before running diagnosis.');
      return;
    }

    setBusy(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('symptoms', symptoms);
    formData.append('cropType', cropType);

    try {
      const out = await uploadApi<{
        assessment: string;
        diagnosis?: DiagnosisItem;
        disclaimer: string;
      }>('/disease/analyze', formData);

      setResult(out);
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Diagnosis service unavailable. Please consult an extension officer.');
    } finally {
      setBusy(false);
    }
  }

  const commonSymptomChips = [
    'Yellowing leaves (chlorosis)',
    'Holes & windowing in whorl',
    'Concentric brown spots',
    'Curled leaves with stippling',
    'Sudden midday wilting',
    'White powdery fungus',
  ];

  function getSeverityColor(sev: string) {
    switch (sev) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'moderate':
        return '#d97706';
      default:
        return '#16a34a';
    }
  }

  return (
    <div className="tool-view-card crop-doctor-tool">
      <div className="tool-header-block">
        <div className="tool-icon-circle green-tint">
          <ScanLine size={24} />
        </div>
        <div>
          <div className="tool-meta-tag green-tag">TOOL 2 OF 8 · COMPUTER VISION & PATHOLOGY</div>
          <h2>AI Crop Doctor</h2>
          <p>
            Scan affected plant foliage with your camera to detect diseases, pests, and nutrient deficiencies under Zimbabwean field conditions.
          </p>
        </div>
        <div className="tool-status-pill online">
          <span className="dot" /> Vision Diagnostic Engine Ready
        </div>
      </div>

      <div className="crop-doctor-grid">
        {/* Main Diagnostic Panel */}
        <div className="doctor-main-panel panel">
          <form onSubmit={handleSubmit}>
            <div className="form-group-row">
              <label className="field-label">
                <span>Target Crop:</span>
                <select value={cropType} onChange={(e) => setCropType(e.target.value)}>
                  <option value="White Maize">White Maize (Grain/Pfumvudza)</option>
                  <option value="Roma Tomatoes">Tomatoes (Roma / Rodade)</option>
                  <option value="Soya Beans">Soya Beans</option>
                  <option value="Sorghum">Sorghum & Millets</option>
                  <option value="Cabbage">Cabbage / Brassicas</option>
                  <option value="Waltham Butternut">Waltham Butternut / Squash</option>
                  <option value="Groundnuts">Groundnuts</option>
                  <option value="Potatoes">Irish Potatoes</option>
                </select>
              </label>
            </div>

            {/* Photo Capture / Upload Area */}
            <div className="field-block">
              <span className="field-title">Plant / Leaf Photo *</span>

              {isCameraOpen ? (
                <div className="camera-view-container">
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: '10px' }} />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="camera-actions-bar">
                    <button type="button" className="btn btn-primary" onClick={capturePhoto}>
                      <Camera size={16} /> Snap Photo
                    </button>
                    <button type="button" className="btn btn-outline" onClick={stopCamera}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : previewUrl ? (
                <div className="photo-preview-wrapper">
                  <img src={previewUrl} alt="Crop scan preview" className="crop-scan-img" />
                  <div className="photo-overlay-tag">
                    <span>{file?.name || 'Captured Leaf Image'}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleFileSelect(undefined)}
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="upload-options-row">
                  <button type="button" className="btn btn-outline capture-btn" onClick={openCamera}>
                    <Camera size={18} /> Take Live Photo
                  </button>

                  <label className="btn btn-outline upload-btn">
                    <Upload size={18} /> Upload Image
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Symptoms Input */}
            <div className="field-block">
              <span className="field-title">Observed Symptoms & Field Notes</span>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe leaf spots, whorl feeding, yellowing patterns, or pest droppings..."
                rows={3}
              />
              <div className="symptom-chips-row">
                <span className="chip-label">Quick tags:</span>
                {commonSymptomChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="symptom-chip"
                    onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${chip}` : chip))}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-note">{error}</div>}

            <button type="submit" className="btn btn-primary analyze-submit-btn" disabled={!file || busy}>
              {busy ? (
                <>
                  <RefreshCw size={16} className="spin" /> Analyzing crop leaf symptoms…
                </>
              ) : (
                <>
                  <ScanLine size={16} /> Run AI Crop Diagnosis
                </>
              )}
            </button>
          </form>

          {/* Diagnosis Result Card */}
          {result && (
            <div className="diagnosis-result-card">
              <div className="diag-badge-row">
                <span className="badge-problem">{result.diagnosis?.problem || 'Diagnostic Assessment'}</span>
                {result.diagnosis?.severity && (
                  <span
                    className="badge-severity"
                    style={{ background: getSeverityColor(result.diagnosis.severity), color: '#fff' }}
                  >
                    Severity: {result.diagnosis.severity.toUpperCase()}
                  </span>
                )}
                {result.diagnosis?.confidence && (
                  <span className="badge-confidence">
                    <Sparkles size={13} /> {result.diagnosis.confidence}% Confidence
                  </span>
                )}
              </div>

              <div className="diag-assessment-body" style={{ whiteSpace: 'pre-wrap' }}>
                {result.assessment}
              </div>

              <div className="diag-disclaimer">
                <ShieldCheck size={16} />
                <span>{result.disclaimer}</span>
              </div>
            </div>
          )}

          {/* Selected History Preview */}
          {selectedHistoryItem && !result && (
            <div className="diagnosis-result-card history-view">
              <div className="diag-badge-row">
                <span className="badge-problem">{selectedHistoryItem.problem}</span>
                <span
                  className="badge-severity"
                  style={{ background: getSeverityColor(selectedHistoryItem.severity), color: '#fff' }}
                >
                  {selectedHistoryItem.severity.toUpperCase()}
                </span>
                <span className="badge-confidence">{selectedHistoryItem.confidence}% Confidence</span>
              </div>

              <div className="history-details-grid">
                <div>
                  <strong>Target Crop:</strong> {selectedHistoryItem.crop_type || 'Field Crop'}
                </div>
                <div>
                  <strong>Scan Date:</strong> {new Date(selectedHistoryItem.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="history-section">
                <h4>Symptoms Noted</h4>
                <p>{selectedHistoryItem.symptoms}</p>
              </div>

              <div className="history-section">
                <h4>Recommended Treatment</h4>
                <p>{selectedHistoryItem.treatment}</p>
              </div>

              <div className="history-section">
                <h4>Prevention & Cultural Control</h4>
                <p>{selectedHistoryItem.prevention}</p>
              </div>

              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => setSelectedHistoryItem(null)}
                style={{ marginTop: '10px' }}
              >
                Close Historical Record
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Diagnosis History & Clinical Tips */}
        <div className="doctor-sidebar-panel">
          <div className="panel history-panel">
            <div className="panel-title-row">
              <History size={16} />
              <h3>Previous Diagnoses</h3>
            </div>
            {history.length === 0 ? (
              <p className="empty-text">No recorded plant diagnoses yet. Run a scan above to save your first record.</p>
            ) : (
              <div className="history-items-list">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`history-item-row ${selectedHistoryItem?.id === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedHistoryItem(item);
                      setResult(null);
                    }}
                  >
                    <div>
                      <div className="hist-problem">{item.problem}</div>
                      <div className="hist-meta">
                        <span>{item.crop_type || 'Crop'}</span> ·{' '}
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span
                      className="hist-severity-dot"
                      style={{ background: getSeverityColor(item.severity) }}
                      title={`Severity: ${item.severity}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel guide-panel">
            <h4>Photography Best Practices</h4>
            <ul className="guide-tips">
              <li>Hold camera steady 15–20cm away from the affected leaf or stem.</li>
              <li>Ensure bright natural morning light; avoid deep shadows or glare.</li>
              <li>Include both healthy tissue and the diseased margin in the photo.</li>
              <li>Inspect underside of leaves for microscopic mites, aphids, or egg clusters.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
