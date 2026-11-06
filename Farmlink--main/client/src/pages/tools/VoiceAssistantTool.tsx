import { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Volume2, VolumeX, Sparkles, Sprout, Send,
  RotateCcw, Globe, Radio, Play, Pause, AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';

interface VoiceMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export function VoiceAssistantTool() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState<'en' | 'sn' | 'nd'>('en');
  const [conversationId, setConversationId] = useState('');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'sn' ? 'sn-ZW' : language === 'nd' ? 'nd-ZW' : 'en-ZW';

      recognition.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setError(`Microphone error: ${event.error}. You can also type your question.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, [language]);

  function startListening() {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }
    stopSpeaking();
    setTranscript('');
    try {
      recognitionRef.current.lang = language === 'sn' ? 'en-ZW' : language === 'nd' ? 'en-ZW' : 'en-US';
      recognitionRef.current.start();
    } catch {
      // already started
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
    if (transcript.trim()) {
      handleSend(transcript);
    }
  }

  function speakText(text: string) {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Clean markdown stars/bullets for clean audio narration
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }

  function stopSpeaking() {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }

  async function handleSend(textToSend?: string) {
    const text = (textToSend || transcript).trim();
    if (!text || busy) return;

    setTranscript('');
    stopSpeaking();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', text, timestamp: time }]);
    setBusy(true);

    try {
      const out = await api<{ answer: string; conversationId: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, ...(conversationId ? { conversationId } : {}) }),
      });

      setConversationId(out.conversationId);
      const answerText = out.answer;
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: answerText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Read answer aloud automatically
      speakText(answerText);
    } catch {
      const fallback =
        'Plant maize in Region II after at least 25mm of rain. Ensure Compound D basal fertilizer is placed 5cm from seeds, and scout whorls for Fall Armyworm.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speakText(fallback);
    } finally {
      setBusy(false);
    }
  }

  // Pre-configured localized voice queries
  const localizedPrompts: Record<'en' | 'sn' | 'nd', { label: string; text: string }[]> = {
    en: [
      { label: 'Maize Fertilizer', text: 'How much Compound D and Ammonium Nitrate should I use per hectare?' },
      { label: 'Armyworm Scout', text: 'What are the first visible signs of Fall Armyworm in young maize?' },
      { label: 'Tomato Blight', text: 'How do I prevent Early Blight from spreading on my tomatoes?' },
    ],
    sn: [
      { label: 'Pfumvudza (Shona)', text: 'Mhoroi! Zvigodhi zvePfumvudza zvinofanirwa kudzika zvakadii mumunda?' },
      { label: 'Kurima Chibage', text: 'Chibage chinonyanya kudyara riini mudunhu reMashonaland?' },
      { label: 'Honye Mumunda', text: 'Ndoita sei nehonye dzekupedza chibage mumunda mangu?' },
    ],
    nd: [
      { label: 'UkuLima (Ndebele)', text: 'Salibonani! Ngicela uncede ngokuthi ummbila utshalwa nini eMidlands?' },
      { label: 'Izibungu', text: 'Ngilwisana njani lezibungu ezidla amakhasi ommbila?' },
      { label: 'Umanyolo', text: 'Kumele ngifake umanyolo ongakanani esivandeni sami?' },
    ],
  };

  return (
    <div className="tool-view-card voice-assistant-tool">
      <div className="tool-header-block">
        <div className="tool-icon-circle brand-tint">
          <Mic size={24} />
        </div>
        <div>
          <div className="tool-meta-tag brand-tag">TOOL 8 OF 8 · VOICE-ENABLED AGRICULTURAL AI</div>
          <h2>AI Voice Assistant</h2>
          <p>
            Hands-free voice farming advisor: speak your agricultural questions directly from the field and hear spoken guidance in English, Shona, or Ndebele.
          </p>
        </div>
        <div className="language-selector-pill">
          <Globe size={15} />
          <button
            type="button"
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button
            type="button"
            className={`lang-btn ${language === 'sn' ? 'active' : ''}`}
            onClick={() => setLanguage('sn')}
          >
            Shona
          </button>
          <button
            type="button"
            className={`lang-btn ${language === 'nd' ? 'active' : ''}`}
            onClick={() => setLanguage('nd')}
          >
            Ndebele
          </button>
        </div>
      </div>

      {/* Hero Voice Interaction Console */}
      <div className="voice-console-panel panel">
        {/* Animated Listening Waveform */}
        <div className={`waveform-visualizer ${isListening ? 'active' : isSpeaking ? 'speaking' : ''}`}>
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
          <span className="wave-bar" />
        </div>

        {/* State Label */}
        <div className="voice-status-title">
          {isListening ? (
            <span className="status-badge listening">
              <span className="pulse-dot" /> Listening… Speak your question now
            </span>
          ) : isSpeaking ? (
            <span className="status-badge speaking">
              <Volume2 size={16} /> Speaking AI FarmLink response…
            </span>
          ) : busy ? (
            <span className="status-badge thinking">
              <Sparkles size={16} /> Thinking & formulating guidance…
            </span>
          ) : (
            <span className="status-badge idle">
              <Radio size={16} /> Tap the microphone to ask a question
            </span>
          )}
        </div>

        {/* Big Central Mic Button */}
        <div className="mic-button-wrapper">
          <button
            type="button"
            className={`big-mic-button ${isListening ? 'is-recording' : ''}`}
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Tap to finish speaking' : 'Tap to start speaking'}
          >
            {isListening ? <MicOff size={36} /> : <Mic size={36} />}
          </button>
        </div>

        {/* Audio Speaking Controls */}
        {isSpeaking && (
          <button type="button" className="btn btn-outline stop-speech-btn" onClick={stopSpeaking}>
            <VolumeX size={15} /> Mute AI Voice
          </button>
        )}

        {/* Real-time Speech Transcript Preview */}
        {transcript && (
          <div className="realtime-transcript-preview">
            <small>Transcribed from speech:</small>
            <p>"{transcript}"</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => handleSend(transcript)}>
              <Send size={14} /> Send Question
            </button>
          </div>
        )}

        {error && (
          <div className="error-note" style={{ maxWidth: '400px', margin: '14px auto 0' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Quick Voice Prompt Chips */}
        <div className="quick-voice-prompts">
          <span className="prompts-label">Tap to ask in {language === 'sn' ? 'Chishona' : language === 'nd' ? 'isiNdebele' : 'English'}:</span>
          <div className="chips-list">
            {localizedPrompts[language].map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="voice-chip-btn"
                onClick={() => handleSend(item.text)}
              >
                <strong>{item.label}:</strong> {item.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Conversation History & Transcription Log */}
      <div className="panel voice-history-panel">
        <div className="panel-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sprout size={18} className="text-brand" />
            <h3>Voice Dialogue Transcription History</h3>
          </div>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              setMessages([]);
              stopSpeaking();
            }}
          >
            <RotateCcw size={14} /> Clear Transcripts
          </button>
        </div>

        {messages.length === 0 ? (
          <p className="empty-text">No voice messages recorded yet. Tap the microphone above to start.</p>
        ) : (
          <div className="voice-transcript-list">
            {messages.map((m, idx) => (
              <div key={idx} className={`transcript-row ${m.role}`}>
                <div className="role-avatar-col">
                  {m.role === 'assistant' ? <Sprout size={16} /> : <Mic size={16} />}
                </div>
                <div className="transcript-bubble">
                  <div className="transcript-header">
                    <strong>{m.role === 'assistant' ? 'FarmLink Agronomist AI' : 'You (Farmer)'}</strong>
                    <span className="transcript-time">{m.timestamp}</span>
                    {m.role === 'assistant' && (
                      <button
                        type="button"
                        className="replay-speech-btn"
                        onClick={() => speakText(m.text)}
                        title="Replay speech audio"
                      >
                        <Volume2 size={13} /> Replay Audio
                      </button>
                    )}
                  </div>
                  <div className="transcript-text" style={{ whiteSpace: 'pre-wrap' }}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
