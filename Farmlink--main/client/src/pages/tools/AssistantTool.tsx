import { useState, type FormEvent } from 'react';
import {
  Bot, Sprout, ArrowUpRight, Send, Sparkles, RotateCcw,
  Wheat, ShieldAlert, Droplets, CalendarDays, CheckCircle2, MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { PageTitle } from '../../components';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export function AssistantTool() {
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Crops & Planting', 'Pfumvudza & Soil', 'Pest Control', 'Livestock'];

  const categoryPrompts: Record<string, string[]> = {
    'All': [
      'When should I plant maize in Mashonaland Region II once rains begin?',
      'How much basal Compound D and top-dressing AN should I apply per Pfumvudza basin?',
      'How can I identify and control Fall Armyworm larvae in young maize whorls?',
      'What causes tomato leaves to develop dark concentric spots and turn yellow?',
      'How should I rotate maize with legumes to restore nitrogen and suppress striga weed?'
    ],
    'Crops & Planting': [
      'What are the optimal planting dates for commercial soya beans in Zimbabwe?',
      'Which sorghum varieties perform best in dry natural regions IV and V?',
      'How deep should groundnut seeds be planted in sandy clay loam soils?',
      'When is the best time to harvest and cure Waltham butternut for storage?'
    ],
    'Pfumvudza & Soil': [
      'Explain the exact dimensions and spacing for Pfumvudza planting basins.',
      'How much cattle manure or compost is needed per basin before rainfall?',
      'My soil test shows pH 4.8. How much agricultural lime should I apply per hectare?',
      'How does grass mulching help retain soil moisture during mid-summer dry spells?'
    ],
    'Pest Control': [
      'How do I scout for Fall Armyworm and what is the economic damage threshold?',
      'What is Maize Streak Virus and how do leafhoppers transmit it?',
      'What safe organic sprays can I make with neem or chili-garlic for aphids?',
      'How do I stop red spider mites from destroying tomatoes during hot dry periods?'
    ],
    'Livestock': [
      'What vaccination schedule is essential for free-range roadrunner chickens?',
      'How should I formulate affordable supplementary feed for dairy heifers in winter?',
      'What are the key symptoms of tick-borne Theileriosis (January Disease) in cattle?',
      'How do I protect indigenous goats from pulpy kidney and internal worms?'
    ]
  };

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || question).trim();
    if (!text || busy) return;

    setQuestion('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', text, timestamp: now }]);
    setBusy(true);

    try {
      const out = await api<{ answer: string; conversationId: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, ...(conversationId ? { conversationId } : {}) }),
      });
      setConversationId(out.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: out.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            '**FarmLink Agricultural Guidance:**\n\nThank you for your agronomic inquiry. For smallholder farmers in Zimbabwe, always coordinate planting with at least 25–30mm of established rainfall. For specific crop pest emergencies or fertilizer calibration, please also verify recommendations with your local AGRITEX extension officer.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage();
  }

  const activePrompts = categoryPrompts[activeCategory] || categoryPrompts['All'];

  return (
    <div className="tool-view-card ai-assistant-tool">
      <div className="tool-header-block">
        <div className="tool-icon-circle brand-tint">
          <Bot size={24} />
        </div>
        <div>
          <div className="tool-meta-tag">TOOL 1 OF 8 · INTELLIGENT ADVISOR</div>
          <h2>AI Farming Assistant</h2>
          <p>
            Agricultural guidance for Zimbabwe: crop schedules, Pfumvudza techniques, pest management, and soil health.
          </p>
        </div>
        <div className="tool-status-pill online">
          <span className="dot" /> AI Active
        </div>
      </div>

      <div className="ai-chat-container">
        {/* Chat Header */}
        <div className="chat-top-bar">
          <div className="chat-bot-status">
            <div className="bot-avatar-badge">
              <Sprout size={18} />
            </div>
            <div>
              <strong>FarmLink Agronomist AI</strong>
              <span>Zimbabwe Agro-Ecological Regions I – V · AGRITEX Aligned</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              setMessages([]);
              setConversationId('');
            }}
            title="Start new conversation"
          >
            <RotateCcw size={14} /> Clear Chat
          </button>
        </div>

        {/* Message Viewport */}
        <div className="chat-viewport">
          {messages.length === 0 ? (
            <div className="assistant-welcome">
              <div className="welcome-icon">
                <Sparkles size={28} />
              </div>
              <h3>How can I assist your farm today?</h3>
              <p>
                Select a category or ask any question about planting windows, fertilizers, pest control, or livestock in Zimbabwe.
              </p>

              {/* Category Pills */}
              <div className="assistant-category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Suggested Questions Grid */}
              <div className="assistant-prompts-grid">
                {activePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="prompt-card-btn"
                    onClick={() => sendMessage(p)}
                  >
                    <span className="prompt-text">{p}</span>
                    <ArrowUpRight size={14} className="prompt-arrow" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-message-list">
              {messages.map((m, idx) => (
                <div key={idx} className={`chat-message-row ${m.role}`}>
                  {m.role === 'assistant' && (
                    <div className="msg-avatar">
                      <Sprout size={16} />
                    </div>
                  )}
                  <div className="msg-content">
                    <div className="msg-bubble">
                      <div className="msg-body" style={{ whiteSpace: 'pre-wrap' }}>
                        {m.text}
                      </div>
                    </div>
                    <span className="msg-time">{m.timestamp}</span>
                  </div>
                </div>
              ))}
              {busy && (
                <div className="chat-message-row assistant">
                  <div className="msg-avatar">
                    <Sprout size={16} />
                  </div>
                  <div className="msg-content">
                    <div className="msg-bubble typing">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about maize planting, pest identification, Pfumvudza, fertilizer rates..."
            disabled={busy}
          />
          <button type="submit" className="btn btn-primary send-btn" disabled={!question.trim() || busy}>
            <Send size={16} />
            <span>Send</span>
          </button>
        </form>
      </div>

      <div className="tool-disclaimer-box">
        <CheckCircle2 size={16} />
        <span>
          <strong>Extension Officer Recommendation:</strong> AI recommendations provide preliminary agronomic information. For severe crop losses or complex livestock diseases, consult your local ward AGRITEX officer or veterinary depot.
        </span>
      </div>
    </div>
  );
}
