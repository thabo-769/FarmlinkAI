import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  ScanLine, Camera, Upload, Check, AlertTriangle, ShieldCheck,
  History, Sparkles, X, RefreshCw, Image as ImageIcon, CheckCircle2,
  RotateCcw, Info, HelpCircle, Eye, ChevronRight
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
  const [isDragging, setIsDragging] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadHistory();
    return () => {
      // Clean up camera stream on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
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
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError('Please select an image smaller than 8 MB.');
      return;
    }
    setError('');
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setSelectedHistoryItem(null);
  }

  // Live in-app webcam stream
  async function startLiveCamera() {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      // Fallback: trigger native device camera input
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setError('Unable to launch camera stream. Please use the Upload button.');
      }
    }
  }

  function stopLiveCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  }

  function captureFromLiveStream() {
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
          stopLiveCamera();
        }
      }, 'image/jpeg', 0.92);
    }
  }

  // Drag and drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Please take a photo or upload an affected leaf image before running diagnosis.');
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
    'Whorl feeding & frass',
    'Concentric target-board rings',
    'Yellowing between veins (chlorosis)',
    'Sudden midday leaf wilting',
    'White powdery fungus',
    'Curled leaves with stippling',
    'Brown necrotic leaf margins',
    'Purple stems / stunted growth',
    'Rust-colored pustules',
  ];

  function toggleSymptomChip(chip: string) {
    if (symptoms.includes(chip)) {
      // Remove it
      const parts = symptoms.split(',').map((s) => s.trim()).filter((s) => s !== chip && s.length > 0);
      setSymptoms(parts.join(', '));
    } else {
      // Add it
      setSymptoms((prev) => (prev.trim() ? `${prev.trim()}, ${chip}` : chip));
    }
  }

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

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return (
    <div className="tool-view-card crop-doctor-tool-redesign">
      {/* Hidden Native Camera & Gallery File Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
      />

      {/* Header Banner */}
      <div className="crop-doctor-header">
        <div className="header-left">
          <div className="tool-badge-pill">
            <ScanLine size={14} /> TOOL 2 OF 8 · PATHOLOGY & PEST AI
          </div>
          <h2 className="doctor-title">AI Crop Doctor</h2>
          <p className="doctor-subtitle">
            Snap or upload a photo of affected leaves to detect crop diseases, pests, and nutrient deficiencies with field recommendations for Zimbabwean agriculture.
          </p>
        </div>
        <div className="header-status-badge">
          <span className="live-pulsing-dot" />
          <span>Vision Diagnostic Engine Online</span>
        </div>
      </div>

      <div className="crop-doctor-workspace-grid">
        {/* Left / Main Workspace Column */}
        <div className="crop-doctor-main-col">
          <form onSubmit={handleSubmit} className="crop-doctor-form">
            {/* Step 1: Crop Selection */}
            <div className="doctor-step-card panel">
              <div className="step-card-header">
                <span className="step-num-badge">1</span>
                <div>
                  <h3 className="step-title">Select Target Crop</h3>
                  <p className="step-desc">Choose the crop you are inspecting for calibrated pest & disease matching.</p>
                </div>
              </div>

              <div className="crop-select-container">
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="crop-styled-select"
                >
                  <option value="White Maize">🌽 White Maize (Grain / Pfumvudza / SC Series)</option>
                  <option value="Roma Tomatoes">🍅 Tomatoes (Roma / Rodade / Heinz)</option>
                  <option value="Soya Beans">🌱 Soya Beans (Grain & Forage)</option>
                  <option value="Sorghum">🌾 Sorghum & Pearl Millet (Drought-Tolerant)</option>
                  <option value="Cabbage">🥬 Cabbage, Brassicas & Rape</option>
                  <option value="Waltham Butternut">🎃 Waltham Butternut & Squash</option>
                  <option value="Groundnuts">🥜 Groundnuts (Nzungu)</option>
                  <option value="Potatoes">🥔 Irish Potatoes</option>
                  <option value="Sugar Beans">🫘 Sugar Beans & Cowpeas</option>
                  <option value="Tobacco">🍂 Virginia & Flue-Cured Tobacco</option>
                  <option value="Cotton">☁️ Seed Cotton</option>
                </select>
              </div>
            </div>

            {/* Step 2: Photo Capture / Upload Card */}
            <div className="doctor-step-card panel">
              <div className="step-card-header">
                <span className="step-num-badge">2</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                    <h3 className="step-title">Capture or Upload Leaf Photo</h3>
                    {file && (
                      <span className="photo-ready-badge">
                        <CheckCircle2 size={13} /> Photo Ready
                      </span>
                    )}
                  </div>
                  <p className="step-desc">Take a clear close-up of the damaged leaf, whorl, or diseased lesions.</p>
                </div>
              </div>

              {/* Viewfinder Mode if active */}
              {isCameraOpen ? (
                <div className="camera-live-viewport">
                  <div className="viewport-video-box">
                    <video ref={videoRef} autoPlay playsInline muted className="live-video-element" />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="viewfinder-overlay">
                      <div className="target-aim-box" />
                      <span className="aim-guide-text">Align diseased foliage inside the frame</span>
                    </div>
                  </div>
                  <div className="live-camera-controls">
                    <button type="button" className="btn btn-primary snap-btn" onClick={captureFromLiveStream}>
                      <Camera size={18} /> Snap Photo
                    </button>
                    <button type="button" className="btn btn-outline cancel-cam-btn" onClick={stopLiveCamera}>
                      Cancel Viewfinder
                    </button>
                  </div>
                </div>
              ) : previewUrl ? (
                /* Selected / Captured Image Preview Card */
                <div className="captured-photo-card">
                  <div className="photo-preview-box">
                    <img src={previewUrl} alt="Crop inspection preview" className="preview-image" />
                    <div className="photo-scanned-overlay">
                      <div className="photo-meta-info">
                        <span className="photo-name">{file?.name || 'Leaf-Capture.jpg'}</span>
                        <span className="photo-size">{file ? formatFileSize(file.size) : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="preview-action-buttons">
                    <button
                      type="button"
                      className="photo-retake-btn primary-action"
                      onClick={() => {
                        if (cameraInputRef.current) cameraInputRef.current.click();
                      }}
                    >
                      <Camera size={15} /> Retake Photo
                    </button>
                    <button
                      type="button"
                      className="photo-retake-btn secondary-action"
                      onClick={() => {
                        if (galleryInputRef.current) galleryInputRef.current.click();
                      }}
                    >
                      <Upload size={15} /> Choose Another
                    </button>
                    <button
                      type="button"
                      className="photo-retake-btn remove-action"
                      onClick={() => handleFileSelect(undefined)}
                      title="Clear image"
                    >
                      <X size={15} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Initial Upload & Camera Trigger Zone */
                <div
                  className={`photo-dropzone-box ${isDragging ? 'dragging-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="dropzone-icon-circle">
                    <Camera size={28} />
                  </div>
                  <h4 className="dropzone-prompt">Snap or upload a diseased crop photo</h4>
                  <p className="dropzone-sub">
                    Directly take a photo using your phone camera, or select an existing leaf image from your device.
                  </p>

                  <div className="capture-buttons-grid">
                    <button
                      type="button"
                      className="action-capture-btn camera-trigger"
                      onClick={() => {
                        if (cameraInputRef.current) cameraInputRef.current.click();
                      }}
                    >
                      <Camera size={18} />
                      <div className="btn-text-col">
                        <span className="btn-main-label">Take Photo</span>
                        <span className="btn-sub-label">Launch Phone Camera</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="action-capture-btn upload-trigger"
                      onClick={() => {
                        if (galleryInputRef.current) galleryInputRef.current.click();
                      }}
                    >
                      <Upload size={18} />
                      <div className="btn-text-col">
                        <span className="btn-main-label">Upload Image</span>
                        <span className="btn-sub-label">Gallery or Files</span>
                      </div>
                    </button>
                  </div>

                  {/* Optional Live Webcam Viewfinder Button for Desktop */}
                  <div className="viewfinder-option-row">
                    <button
                      type="button"
                      className="live-viewfinder-link"
                      onClick={startLiveCamera}
                    >
                      <Eye size={14} /> Open Live Camera Viewfinder
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Observed Symptoms & Field Notes */}
            <div className="doctor-step-card panel">
              <div className="step-card-header">
                <span className="step-num-badge">3</span>
                <div>
                  <h3 className="step-title">Observed Symptoms & Field Notes</h3>
                  <p className="step-desc">
                    Describe foliar damage or tap the quick tags below to enrich AI precision.
                  </p>
                </div>
              </div>

              <div className="symptoms-input-wrapper">
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Ragged whorl holes with sawdust-like frass on young maize plants, irregular yellow spots spreading from bottom leaves..."
                  rows={4}
                  className="symptoms-textarea-styled"
                />

                <div className="symptoms-quick-tags-panel">
                  <span className="quick-tags-title">Quick Symptom Tags (Tap to add):</span>
                  <div className="symptom-chips-flow">
                    {commonSymptomChips.map((chip) => {
                      const isSelected = symptoms.includes(chip);
                      return (
                        <button
                          key={chip}
                          type="button"
                          className={`symptom-tag-pill ${isSelected ? 'active-tag' : ''}`}
                          onClick={() => toggleSymptomChip(chip)}
                        >
                          {isSelected ? <Check size={12} /> : '+'} {chip}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="crop-doctor-alert error-box">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Run Diagnosis Button */}
            <button
              type="submit"
              className="run-diagnosis-button"
              disabled={!file || busy}
            >
              {busy ? (
                <>
                  <RefreshCw size={18} className="spin-icon" />
                  <span>Analyzing Foliage with AI Vision Engine…</span>
                </>
              ) : (
                <>
                  <ScanLine size={19} />
                  <span>Run AI Crop Diagnosis</span>
                </>
              )}
            </button>
          </form>

          {/* Active Diagnosis Result Report Card */}
          {result && (
            <div className="diagnosis-report-card panel">
              <div className="report-header-strip">
                <div className="report-main-title">
                  <span className="report-label">AI DIAGNOSTIC FINDINGS</span>
                  <h3 className="problem-heading">
                    {result.diagnosis?.problem || 'Crop Pathology Assessment'}
                  </h3>
                </div>

                <div className="report-badges-row">
                  {result.diagnosis?.severity && (
                    <span
                      className="severity-pill"
                      style={{ background: getSeverityColor(result.diagnosis.severity) }}
                    >
                      Severity: {result.diagnosis.severity.toUpperCase()}
                    </span>
                  )}
                  {result.diagnosis?.confidence && (
                    <span className="confidence-pill">
                      <Sparkles size={13} /> {result.diagnosis.confidence}% Confidence
                    </span>
                  )}
                </div>
              </div>

              {/* Assessment Text / Body */}
              <div className="report-body-box">
                <h4 className="report-subheading">Pathology & Field Assessment</h4>
                <div className="assessment-prose">{result.assessment}</div>
              </div>

              {/* Structured Breakdown if diagnosis object is present */}
              {result.diagnosis && (
                <div className="report-structured-grid">
                  <div className="structured-block treatment-block">
                    <h4 className="block-title">Recommended Immediate Treatment</h4>
                    <p className="block-text">{result.diagnosis.treatment}</p>
                  </div>

                  <div className="structured-block prevention-block">
                    <h4 className="block-title">Prevention & Cultural Controls (Pfumvudza)</h4>
                    <p className="block-text">{result.diagnosis.prevention}</p>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="report-disclaimer-box">
                <ShieldCheck size={18} className="disclaimer-icon" />
                <p className="disclaimer-text">{result.disclaimer}</p>
              </div>

              <div className="report-actions-bar">
                <button
                  type="button"
                  className="btn btn-outline new-scan-btn"
                  onClick={() => {
                    handleFileSelect(undefined);
                    setSymptoms('');
                    setResult(null);
                  }}
                >
                  <RotateCcw size={15} /> Scan Another Crop
                </button>
              </div>
            </div>
          )}

          {/* Historical Record Selected View */}
          {selectedHistoryItem && !result && (
            <div className="diagnosis-report-card panel historical-view">
              <div className="report-header-strip">
                <div className="report-main-title">
                  <span className="report-label">ARCHIVED FIELD SCAN</span>
                  <h3 className="problem-heading">{selectedHistoryItem.problem}</h3>
                  <span className="history-timestamp">
                    {selectedHistoryItem.crop_type} · Recorded on{' '}
                    {new Date(selectedHistoryItem.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="report-badges-row">
                  <span
                    className="severity-pill"
                    style={{ background: getSeverityColor(selectedHistoryItem.severity) }}
                  >
                    {selectedHistoryItem.severity.toUpperCase()}
                  </span>
                  <span className="confidence-pill">{selectedHistoryItem.confidence}% Confidence</span>
                </div>
              </div>

              <div className="report-structured-grid">
                <div className="structured-block">
                  <h4 className="block-title">Noted Symptoms</h4>
                  <p className="block-text">{selectedHistoryItem.symptoms}</p>
                </div>
                <div className="structured-block treatment-block">
                  <h4 className="block-title">Recommended Treatment</h4>
                  <p className="block-text">{selectedHistoryItem.treatment}</p>
                </div>
                <div className="structured-block prevention-block">
                  <h4 className="block-title">Prevention & Cultural Control</h4>
                  <p className="block-text">{selectedHistoryItem.prevention}</p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-outline close-history-btn"
                onClick={() => setSelectedHistoryItem(null)}
              >
                Close Archive View
              </button>
            </div>
          )}
        </div>

        {/* Right / Sidebar Column */}
        <div className="crop-doctor-sidebar-col">
          {/* Recent Diagnoses Panel */}
          <div className="doctor-sidebar-card panel">
            <div className="sidebar-card-header">
              <div className="sidebar-title-row">
                <History size={16} />
                <h3>Diagnosis History</h3>
              </div>
              <span className="history-count-tag">{history.length} Scans</span>
            </div>

            {history.length === 0 ? (
              <div className="empty-history-box">
                <ScanLine size={24} className="empty-icon" />
                <p>No recorded plant diagnoses yet. Capture or upload a leaf photo to create your first clinical record.</p>
              </div>
            ) : (
              <div className="history-records-list">
                {history.map((item) => {
                  const isCurrent = selectedHistoryItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`history-card-row ${isCurrent ? 'selected-record' : ''}`}
                      onClick={() => {
                        setSelectedHistoryItem(item);
                        setResult(null);
                      }}
                    >
                      <div className="history-card-info">
                        <h4 className="hist-problem-name">{item.problem}</h4>
                        <div className="hist-sub-meta">
                          <span>{item.crop_type || 'Crop'}</span>
                          <span className="meta-sep">•</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="history-card-badge">
                        <span
                          className="hist-severity-dot"
                          style={{ background: getSeverityColor(item.severity) }}
                          title={`Severity: ${item.severity}`}
                        />
                        <ChevronRight size={14} className="chevron" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Photography Guide Panel */}
          <div className="doctor-sidebar-card panel photography-tips-panel">
            <div className="sidebar-card-header">
              <div className="sidebar-title-row">
                <HelpCircle size={16} />
                <h3>Photography Best Practices</h3>
              </div>
            </div>

            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-number">1</span>
                <div>
                  <strong>Maintain 15–20 cm Distance:</strong> Fill the frame with the affected foliage so leaf veins and margins are razor sharp.
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">2</span>
                <div>
                  <strong>Use Bright Morning Light:</strong> Natural outdoor lighting works best. Avoid deep shadows, flash glare, or backlight.
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">3</span>
                <div>
                  <strong>Include the Margin:</strong> Photograph the transition boundary between healthy green tissue and diseased lesions.
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">4</span>
                <div>
                  <strong>Inspect Underside:</strong> Look under leaves for hidden spider mites, whiteflies, or fungal sporulation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
