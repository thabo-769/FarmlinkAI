import { useState, useRef, type FormEvent } from 'react';
import { CircleAlert, Check, ScanLine, ShieldCheck, Upload, Camera, X, RefreshCw } from 'lucide-react';
import { PageTitle } from '../components';
import { uploadApi } from '../services/api';

export function CropHealth() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Camera capture modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function selectFile(f?: File) {
    setResult('');
    setError('');
    if (!f) {
      setFile(null);
      setPreviewUrl('');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      setError('Choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Choose an image smaller than 5 MB.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  // Camera handlers
  async function openCamera() {
    setError('');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError('Unable to access device camera. Please check camera permissions in your browser or use the file upload option.');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
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
          const capturedFile = new File([blob], `crop-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          selectFile(capturedFile);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    setResult('');
    const form = new FormData();
    form.append('image', file);
    form.append('symptoms', symptoms);

    try {
      const out = await uploadApi<{ assessment: string; disclaimer: string }>('/disease/analyze', form);
      setResult(`${out.assessment}\n\n${out.disclaimer}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Image assessment is unavailable. Please consult an agricultural extension officer.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle
        kicker="EARLY CROP HEALTH GUIDANCE"
        title="Crop health check"
        sub="Take a photo or upload an image and share symptoms for an early plant assessment."
      />
      <div className="notice demo-notice">
        <ShieldCheck size={17} />
        <span>
          <b>Preliminary guidance only.</b> Image assessments can be wrong and are not confirmed diagnoses. For serious or spreading crop damage, contact an AGRITEX extension officer.
        </span>
      </div>

      <div className="crop-health-layout">
        <form className="panel crop-health-form" onSubmit={submit}>
          <div className="field">
            <span>Plant photo <i>*</i></span>
            
            {/* Action buttons: Take a photo or Upload */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={openCamera}
                className="btn btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderColor: '#087443',
                  color: '#087443',
                  background: '#f4faf6',
                }}
              >
                <Camera size={18} /> Take a photo
              </button>

              <label
                className="btn btn-outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                }}
              >
                <Upload size={18} /> Upload from device
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={(e) => selectFile(e.target.files?.[0])}
                />
              </label>
            </div>

            {/* Photo preview or drop container */}
            {previewUrl ? (
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid #087443', maxHeight: '280px' }}>
                <img src={previewUrl} alt="Captured crop" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', padding: '8px 12px', borderRadius: '8px', color: '#fff', fontSize: '12px' }}>
                  <span><b>{file?.name}</b></span>
                  <button type="button" onClick={() => { setFile(null); setPreviewUrl(''); }} style={{ background: 'none', border: 'none', color: '#ffb4b4', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X size={15} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="crop-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => selectFile(e.target.files?.[0])}
                />
                <span className="upload-symbol"><Camera size={26} /></span>
                <b>Take a photo or choose an image of the plant</b>
                <small>JPEG, PNG or WebP · Maximum 5 MB</small>
              </label>
            )}
          </div>

          <label className="field symptoms-field">
            <span>What symptoms have you observed?</span>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Yellowing of lower leaves, brown spots with concentric rings, holes in young maize whorls..."
              rows={4}
              maxLength={1200}
            />
            <small>Mention crop type, when symptoms started, and recent rainfall or fertilizer usage if known.</small>
          </label>

          {error && <div className="error-note"><CircleAlert size={15} />{error}</div>}

          <button className="btn btn-primary full-btn" disabled={!file || busy}>
            {busy ? 'Analyzing plant symptoms…' : <><ScanLine size={16} /> Analyze crop health</>}
          </button>
        </form>

        <aside className="crop-health-aside">
          <div className="listing-tip">
            <div className="feature-icon mint"><Camera size={20} /></div>
            <span className="section-kicker">PHOTO CAPTURE TIPS</span>
            <h3>How to get the most accurate result</h3>
            <p>
              Hold your camera steady in bright daylight. Focus clearly on the affected leaves, stems, or fruit, avoiding heavy shadows.
            </p>
          </div>
          <div className="listing-rules">
            <h3>Diagnostic steps</h3>
            <p><Check size={15} /> Take a close-up photo of the symptoms</p>
            <p><Check size={15} /> AI evaluates patterns against regional pathogens</p>
            <p><Check size={15} /> Receive immediate field observations & next steps</p>
            <small>Images are analyzed in-memory and are not shared publicly.</small>
          </div>
        </aside>

        {result && (
          <section className="panel crop-result" style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
            <span className="section-kicker">PRELIMINARY FIELD ASSESSMENT</span>
            <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontFamily: 'inherit' }}>{result}</pre>
          </section>
        )}
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '540px', background: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Target box guide */}
            <div style={{ position: 'absolute', top: '15%', left: '15%', right: '15%', bottom: '25%', border: '2px dashed rgba(255,255,255,0.7)', borderRadius: '12px', pointerEvents: 'none' }} />

            <div style={{ padding: '16px 20px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={stopCamera}
                className="btn btn-outline"
                style={{ color: '#fff', borderColor: '#444', background: '#222' }}
              >
                <X size={16} /> Cancel
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '14px', borderRadius: '30px' }}
              >
                <Camera size={18} /> Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
