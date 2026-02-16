import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, PhoneOff, Users, Hexagon, Clock, Timer, PauseCircle, Play, Smile, AlertTriangle, CheckCircle, Info, Plus, Trash2, X, ChevronLeft, ChevronRight, FileText, FileBarChart, Download, RefreshCcw, Star, MessageSquare, Edit3, HelpCircle, Coffee, TrendingUp, Activity, Lock, MessageSquarePlus, ZapOff, Zap, TrendingDown, Grid, Target, ShieldCheck, ThumbsUp, ThumbsDown, Meh, Brain, Sparkles, Zap as ZapIcon, Tag } from 'lucide-react';

// --- CONFIGURATION ---
const USER_NAME = "Product Lead";
const USER_PROFILE_IMG = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop";

// Backend Configuration
const BACKEND_URL = "http://localhost:8000/api/v1";
const WS_URL = "ws://localhost:8000/ws";
// Theme colors
const colors = {
  gold: '#b99550',
  goldDim: 'rgba(185, 149, 80, 0.15)',
  goldBright: '#ffcd5a',
  textMain: '#E8E0D5',
  textDim: '#957443',
  textDark: '#211b15',
  border: 'rgba(196, 168, 111, 0.25)',
  success: '#5D7A58',
  danger: '#8A3A3A',
  bgApp: '#1c1410',
  bgSidebar: '#1b110d',
  bgCard: '#1e1610',
  bgInput: '#0c0908',
  goldGrad: 'linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%)',
  darkGlass: 'rgba(29, 21, 16, 0.9)'
};

// Board members (for customer simulation it can be customers)

// --- PREMIUM EXECUTIVE THEME ---
const EXECUTIVE_THEME = `
  :root {
    --bg-app: #1c1410;
    --bg-sidebar: #1d110d;
    --bg-card: #1e1610;
    --bg-input: #0c0908;
    --bg-glass: rgba(29, 21, 16, 0.85);
    --text-primary: #E8E0D5;
    --text-secondary: #957443;
    --gold-dim: #ac8042;
    --gold-mid: #b99550;
    --gold-bright: #ffcd5a;        
    --gold-grad: linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%);
    --border-gold: rgba(196, 168, 111, 0.2);
    --wood-grain: repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px);
    --success: #5D7A58;
    --success-dim: rgba(93, 122, 88, 0.2);
    --danger: #8A3A3A;
    --danger-dim: rgba(138, 58, 58, 0.15);
    --info: #4A6FA5;
    --deepBg: #0F0A08;
  }
`;
const boardMembers = [];
// --- PREMIUM STYLES & ANIMATIONS ---
const premiumAnimationStyles = `
  * {
    scroll-behavior: smooth;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* CUSTOM SCROLLBAR - PREMIUM GOLD */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--gold-dim);
    border-radius: 10px;
    transition: background 0.3s;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--gold-mid);
  }

  /* NO SCROLLBAR */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* CHAT SCROLLBAR */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-gold);
    border-radius: 10px;
    transition: background 0.3s;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--gold-mid);
  }

  /* ANIMATIONS */
  @keyframes breatheBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @keyframes msgEnter {
    0% {
      opacity: 0;
      transform: translateY(15px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes neuralPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.4;
    }
    50% {
      transform: scale(1.3);
      opacity: 1;
      box-shadow: 0 0 10px var(--gold-mid);
    }
  }

  @keyframes scan {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleUp {
    0% {
      transform: scale(0.9);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pulseSlow {
    0% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.7;
      transform: scale(1);
    }
  }

  @keyframes blurIn {
    from {
      backdrop-filter: blur(0px);
      background: rgba(0,0,0,0);
    }
    to {
      backdrop-filter: blur(15px);
      background: rgba(0,0,0,0.85);
    }
  }

  @keyframes gridFlow {
    0% { background-position: 0 0; }
    100% { background-position: 32px 32px; }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px var(--gold-mid), 0 0 10px var(--gold-mid); }
    50% { box-shadow: 0 0 20px var(--gold-mid), 0 0 30px var(--gold-mid); }
  }

  .smooth-ease {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .interactive-btn {
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .interactive-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.2);
  }

  .interactive-btn:active {
    transform: translateY(0);
  }

  .interactive-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .sidebar-open {
    width: 320px;
    opacity: 1;
  }

  .sidebar-closed {
    width: 0;
    opacity: 0;
    overflow: hidden;
  }

  .sentiment-positive {
    background: linear-gradient(135deg, var(--success-dim), transparent);
    border-left: 3px solid var(--success) !important;
  }

  .sentiment-negative {
    background: linear-gradient(135deg, var(--danger-dim), transparent);
    border-left: 3px solid var(--danger) !important;
  }

  .sentiment-neutral {
    background: linear-gradient(135deg, rgba(74, 111, 165, 0.1), transparent);
    border-left: 3px solid var(--info) !important;
  }

  /* PREMIUM GLASS MORPHISM */
  .glass-panel {
    background: var(--bg-glass);
    backdrop-filter: blur(16px);
    border: 1px solid var(--border-gold);
    border-radius: 16px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  }

  /* NEURAL BACKGROUND */
  .neural-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: var(--deepBg);
    background-image:
      linear-gradient(rgba(212, 175, 104, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212, 175, 104, 0.08) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .neural-bg::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, transparent 20%, var(--deepBg) 95%);
  }
`;

// --- DATA ---
const CUSTOMER_PANEL = [
  { id: 1, name: "Alice M.", role: "Power User", initials: "AM", status: "online", sentiment: "positive" },
  { id: 2, name: "Bob D.", role: "Enterprise Buyer", initials: "BD", status: "online", sentiment: "neutral" },
  { id: 3, name: "Charlie K.", role: "Skeptic", initials: "CK", status: "online", sentiment: "negative" },
  { id: 4, name: "Diana P.", role: "UX Designer", initials: "DP", status: "online", sentiment: "positive" },
  { id: 5, name: "Evan G.", role: "Budget Focused", initials: "EG", status: "away", sentiment: "neutral" },
  { id: 6, name: "Fiona L.", role: "Early Adopter", initials: "FL", status: "online", sentiment: "positive" },
];

const INITIAL_FEEDBACK = {
  1: { rating: 5, comment: "Love the new interface speed.", sentiment: "positive" },
  2: { rating: 4, comment: "Needs better SSO integration.", sentiment: "neutral" },
  3: { rating: 2, comment: "Too expensive for the value.", sentiment: "negative" },
  4: { rating: 5, comment: "The dark mode is perfect.", sentiment: "positive" },
  5: { rating: 3, comment: "Can we get a discount tier?", sentiment: "neutral" },
  6: { rating: 4, comment: "Solid update, but buggy on mobile.", sentiment: "neutral" },
};

const INITIAL_MESSAGES = [
  { id: 1, sender: "System", text: "Focus Group Session #402 initialized. Recording active.", type: 'system' },
];

// --- SENTIMENT ANALYSIS ---
const analyzeSentiment = (text) => {
  const positiveWords = ['love', 'great', 'excellent', 'perfect', 'amazing', 'useful', 'helpful', 'good', 'better', 'best', 'like', 'appreciate'];
  const negativeWords = ['bad', 'terrible', 'awful', 'expensive', 'costly', 'not', 'never', 'hate', 'dislike', 'poor', 'worst', 'issue', 'problem'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// --- COMPONENTS ---

// LIVE SENTIMENT BOARD (MATCHING THE IMAGE DESIGN)
const LiveSentimentBoard = ({ feedbackData, customerPanel }) => {
  const getAverageSentiment = () => {
    const ratings = Object.values(feedbackData).map(f => f.rating);
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const getSentimentCounts = () => {
    const sentiments = Object.values(feedbackData).map(f => f.sentiment || 'neutral');
    return {
      positive: sentiments.filter(s => s === 'positive').length,
      neutral: sentiments.filter(s => s === 'neutral').length,
      negative: sentiments.filter(s => s === 'negative').length
    };
  };

  const counts = getSentimentCounts();
  const avgRating = getAverageSentiment();

  return (
    <div style={{ padding: 16, background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 12 }}>
      <div style={{ fontSize: 10, color: 'var(--gold-mid)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Activity size={14} /> PSYCHOLOGICAL METRICS
      </div>

      {/* Trust Accumulation Graph Placeholder */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 600 }}>Trust Accumulation & Betrayal Graph</div>
        <div style={{ position: 'relative', height: 80, background: 'rgba(0,0,0,0.3)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
          <svg width="100%" height="100%" viewBox="0 0 400 80" preserveAspectRatio="none">
            <path d="M 0 60 Q 50 40, 100 45 T 200 35 T 300 25 T 400 20" stroke="var(--gold-mid)" strokeWidth="2" fill="none" />
            <path d="M 0 60 L 400 60" stroke="var(--border-gold)" strokeWidth="1" strokeDasharray="4,4" />
          </svg>
        </div>
      </div>

      {/* Perception vs Reality Gap Chart */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 600 }}>Perception vs Reality Gap Chart</div>
        <div style={{ display: 'flex', gap: 8, height: 60, alignItems: 'flex-end' }}>
          {[0.5, 0.8, 0.45, 0.9, 0.4, 0.75, 0.6, 0.85].map((height, i) => (
            <div key={i} style={{ flex: 1, background: i % 2 === 0 ? 'rgba(74, 62, 50, 0.6)' : 'var(--gold-dim)', height: `${height * 100}%`, borderRadius: '4px 4px 0 0' }} />
          ))}
        </div>
      </div>

      {/* Expectation Inflation Curve */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 600 }}>Expectation Inflation Curve</div>
        <div style={{ height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
          <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--gold-dim), var(--danger))' }} />
        </div>
      </div>

      {/* Simulation Fidelity */}
      <div style={{ padding: 14, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-gold)', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--gold-mid)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Target size={12} /> SIMULATION FIDELITY
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Agent Performance Sync</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold-mid)' }}>65%</div>
        </div>
        <div style={{ height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '100%', background: 'var(--gold-grad)' }} />
        </div>
      </div>

      {/* Final Customer Reality Matrix */}
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-primary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>FINAL CUSTOMER REALITY MATRIX</span>
          <Grid size={12} color="var(--gold-dim)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
          {Array.from({ length: 32 }).map((_, i) => {
            const isActive = [9, 17, 22, 28].includes(i);
            const intensity = isActive ? 1 : Math.random() * 0.5;
            const sentimentColor =
              feedbackData[customerPanel[i % 6]?.id]?.sentiment === 'positive' ? 'var(--success)' :
                feedbackData[customerPanel[i % 6]?.id]?.sentiment === 'negative' ? 'var(--danger)' :
                  'var(--gold-dim)';

            return (
              <div
                key={i}
                style={{
                  aspectRatio: '1',
                  background: isActive ? sentimentColor : 'rgba(74, 62, 50, 0.4)',
                  opacity: isActive ? 1 : intensity,
                  borderRadius: 4,
                  transition: 'all 0.5s ease',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ThinkingBubble = ({ member }) => (
  <div style={{ display: 'flex', gap: 12, padding: '16px 20px', animation: 'fadeInUp 0.4s ease', alignItems: 'center' }}>
    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--border-gold)', border: '2px solid var(--gold-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--gold-mid)', animation: 'pulseSlow 2s infinite' }}>
      {member.initials}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        <Brain size={12} style={{ display: 'inline', marginRight: 4 }} />
        ANALYZING & TYPING...
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 0.2, 0.4].map((d, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--gold-mid)',
              animation: `neuralPulse 1.4s ease-in-out ${d}s infinite`
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const TypewriterText = ({ text, sentiment }) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    indexRef.current = 0;

    const words = text.split(" ");
    const interval = setInterval(() => {
      if (indexRef.current < words.length) {
        setDisplayedText(p => p + (indexRef.current === 0 ? "" : " ") + words[indexRef.current]);
        indexRef.current++;
      } else clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  const getSentimentIcon = () => {
    if (sentiment === 'positive') return <ThumbsUp size={14} color="var(--success)" style={{ display: 'inline', marginLeft: 6 }} />;
    if (sentiment === 'negative') return <ThumbsDown size={14} color="var(--danger)" style={{ display: 'inline', marginLeft: 6 }} />;
    return <Meh size={14} color="var(--info)" style={{ display: 'inline', marginLeft: 6 }} />;
  };

  return (
    <span>
      {displayedText}
      {displayedText === text && getSentimentIcon()}
    </span>
  );
};

// --- MAIN COMPONENT ---
const CustomerFeedbackRoom = ({ config, onBack }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [wordStreams, setWordStreams] = useState({});
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const [typingMemberId, setTypingMemberId] = useState(null);
  const [endReason, setEndReason] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [feedbackData, setFeedbackData] = useState(INITIAL_FEEDBACK);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentAsk, setCurrentAsk] = useState("Product v2.0 Feedback");
  const [isEditingAsk, setIsEditingAsk] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [sessionTime, setSessionTime] = useState(3600);
  const [activityTime, setActivityTime] = useState(300);
  const [performanceScore, setPerformanceScore] = useState(65);

  // WebSocket states
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [customerPanel, setCustomerPanel] = useState(CUSTOMER_PANEL);

  const chatEndRef = useRef(null);
  const wsRef = useRef(null);  // WebSocket reference - FIXED: was missing

  // --- WEBSOCKET MESSAGE HANDLER ---
  const handleWebSocketMessage = useCallback((data) => {
    console.log('📨 WebSocket message:', data.type, data);

    // Handle word-by-word streaming
    if (data.type === 'word_stream') {
      const { character_name, word, is_complete, sentiment } = data;

      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === character_name && lastMsg.type === 'agent') {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            text: lastMsg.text + " " + word,
            sentiment: sentiment || lastMsg.sentiment
          };
          return newMessages;
        }

        const member = customerPanel.find(m => m.name === character_name);
        // Generate initials from character_name if member not found
        const initials = member?.initials || character_name.split(' ').map(n => n[0]).join('').toUpperCase();

        return [...prev, {
          id: Date.now(),
          sender: character_name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: word,
          type: 'agent',
          sentiment: sentiment || 'neutral',
          initials: initials
        }];
      });

      if (is_complete) {
        setTypingMemberId(null);
      } else {
        const member = customerPanel.find(m => m.name === character_name);
        setTypingMemberId(member?.id);
      }
      return;
    }

    // Handle complete response
    if (data.type === 'character_response' || (data.type === 'agent' && data.message)) {
      setTypingMemberId(null);

      const characterName = data.character_name || data.speaker || 'Customer';
      const responseText = data.response || data.message;
      const sentiment = data.sentiment || analyzeSentiment(responseText);

      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === characterName) {
          return prev;
        }

        const member = customerPanel.find(m => m.name === characterName);
        // Generate initials from characterName if member not found
        const initials = member?.initials || characterName.split(' ').map(n => n[0]).join('').toUpperCase();

        return [...prev, {
          id: Date.now(),
          sender: characterName,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: responseText,
          type: 'agent',
          sentiment: sentiment,
          initials: initials
        }];
      });

      // Update feedback data based on response
      const member = customerPanel.find(m => m.name === characterName);
      if (member) {
        const ratingChange = sentiment === 'positive' ? 1 : sentiment === 'negative' ? -1 : 0;

        setFeedbackData(prev => ({
          ...prev,
          [member.id]: {
            rating: Math.min(5, Math.max(1, (prev[member.id]?.rating || 3) + ratingChange)),
            comment: responseText,
            sentiment: sentiment
          }
        }));

        // Update customer panel sentiment
        setCustomerPanel(prev => prev.map(c =>
          c.id === member.id ? { ...c, sentiment } : c
        ));
      }
      return;
    }

    // Handle thinking
    if (data.type === 'thinking') {
      const member = customerPanel.find(m => m.name === (data.character_name || data.speaker));
      setTypingMemberId(member?.id);
      return;
    }

    // Handle meeting ended
    if (data.type === 'meeting_ended') {
      setEndReason(data.reason || 'Meeting ended');
      setIsMeetingEnded(true);
      return;
    }

    // Handle analytics update
    if (data.type === 'analytics_update') {
      if (data.performance_score) {
        setPerformanceScore(data.performance_score);
      }
    }
  }, [customerPanel]);

  // --- WEBSOCKET CONNECTION ---
  // --- ✅ UPGRADED: AUTHENTICATED SESSION START ---
  useEffect(() => {
    let ws = null;
    let mounted = true;

    const initializeAuthenticatedSession = async () => {
      try {
        console.log('🚀 Starting Customer Service session with authentication...');
        const { sessionAPI } = await import('../services/api');

        const response = await sessionAPI.start('customer', 'chat', config || {});

        if (!mounted) return;

        const authenticatedSessionId = response.data.session.session_id;
        setSessionId(authenticatedSessionId);
        console.log('✅ Authenticated session started:', authenticatedSessionId);

        const wsUrl = `ws://localhost:8000/ws/customer/chat/${authenticatedSessionId}`;
        console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ WebSocket connected');
          setIsConnected(true);

          // Send company context first
          ws.send(JSON.stringify({
            type: 'company_context',
            context: {
              company_name: config.companyName || 'Your Company',
              product: config.productName || 'Product',
              industry: config.industry || 'Technology',
              stage: config.stage || 'Growth',
              scenario: config.scenario || 'Customer feedback session'
            }
          }));
          console.log('📊 Company context sent');

          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now(),
              sender: 'Customer',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: 'Hi, I need help with my order. It hasn\'t arrived yet.',
              type: 'customer',
              sentiment: 'frustrated'
            }]);
          }, 1000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 WS Message:', data);
            handleWebSocketMessage(data);  // Actually process the message!
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
            console.log('WS text:', event.data);
          }
        };

        ws.onclose = () => {
          console.log('❌ WebSocket disconnected');
          setIsConnected(false);
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error('❌ Failed to start authenticated session:', error);

        if (error.response?.status === 401) {
          alert('Authentication required. Please log in again.');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          const errorMsg = error.response?.data?.error || 'Access denied';
          alert(`Session start failed: ${errorMsg}\n\nPlease check your membership status.`);
          if (onBack) onBack();
        } else {
          alert('Failed to start session. Please try again.');
          if (onBack) onBack();
        }
      }
    };

    initializeAuthenticatedSession();

    return () => {
      mounted = false;
      if (ws) {
        ws.close();
      }
    };
  }, [config]);
  // AUTO-PAUSE ON WINDOW CHANGE
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isOnBreak && !isMeetingEnded && !showEndConfirm) {
        setIsPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isOnBreak, isMeetingEnded, showEndConfirm]);

  // TIMERS
  useEffect(() => {
    if (isMeetingEnded || isPaused || isOnBreak || showEndConfirm) return;

    const interval = setInterval(() => {
      setSessionTime(p => p <= 1 ? (setEndReason("Session Time Limit Reached"), setIsMeetingEnded(true), 0) : p - 1);
      setActivityTime(p => p <= 1 ? (setEndReason("Inactivity Timeout"), setIsMeetingEnded(true), 0) : p - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMeetingEnded, isPaused, isOnBreak, showEndConfirm]);

  useEffect(() => {
    if (isOnBreak && breakTimeLeft > 0) {
      const interval = setInterval(() => setBreakTimeLeft(p => p - 1), 1000);
      return () => clearInterval(interval);
    } else if (isOnBreak && breakTimeLeft <= 0) setIsOnBreak(false);
  }, [isOnBreak, breakTimeLeft]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMemberId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setActivityTime(300);

    const newMsg = {
      id: Date.now(),
      sender: USER_NAME,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      type: 'me'
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    // Send via WebSocket if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('📤 Sending message to backend:', inputText);
      wsRef.current.send(JSON.stringify({
        type: 'user_message',
        message: inputText
      }));
    } else {
      console.warn('⚠️ WebSocket not connected, using fallback');
      simulateResponse();
    }
  };

  const handleNewChat = () => {
    setMessages(INITIAL_MESSAGES);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "System",
      text: "Chat history cleared. Context reset.",
      type: 'system'
    }]);
  };

  const simulateResponse = () => {
    const member = customerPanel[Math.floor(Math.random() * customerPanel.length)];
    setTypingMemberId(member.id);

    const responses = {
      positive: [
        "That feature sounds really useful for my workflow!",
        "I love this direction. Very innovative!",
        "This would solve a major pain point for us.",
        "Impressive! This is exactly what we need."
      ],
      negative: [
        "I'm not sure I'd pay extra for that capability.",
        "The pricing seems too high for what it offers.",
        "This doesn't really address our main concerns.",
        "I have some serious doubts about this approach."
      ],
      neutral: [
        "Can you explain more about the implementation?",
        "What's the timeline for rolling this out?",
        "How does this compare to existing solutions?",
        "Interesting, but I'd need to see more details."
      ]
    };

    const sentimentTypes = ['positive', 'negative', 'neutral'];
    const chosenSentiment = sentimentTypes[Math.floor(Math.random() * sentimentTypes.length)];
    const responseText = responses[chosenSentiment][Math.floor(Math.random() * responses[chosenSentiment].length)];

    setTimeout(() => {
      const ratingChange = chosenSentiment === 'positive' ? 1 : chosenSentiment === 'negative' ? -1 : 0;

      setFeedbackData(prev => ({
        ...prev,
        [member.id]: {
          rating: Math.min(5, Math.max(1, (prev[member.id]?.rating || 3) + ratingChange)),
          comment: responseText,
          sentiment: chosenSentiment
        }
      }));

      setCustomerPanel(prev => prev.map(c =>
        c.id === member.id ? { ...c, sentiment: chosenSentiment } : c
      ));

      const aiMsg = {
        id: Date.now() + 1,
        sender: member.name,
        initials: member.initials,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        type: 'agent',
        sentiment: chosenSentiment
      };

      setMessages(prev => [...prev, aiMsg]);
      setTypingMemberId(null);
    }, 2500);
  };

  const startBreak = (minutes) => {
    setBreakTimeLeft(minutes * 60);
    setIsOnBreak(true);
    setIsBreakModalOpen(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const triggerEndSession = () => {
    setEndReason("Concluded by Lead");
    setShowEndConfirm(true);
  };

  const confirmEndSession = () => {
    setShowEndConfirm(false);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'control',
        data: { action: 'end_session' }
      }));
    }

    setIsMeetingEnded(true);
  };

  const getSentimentClass = (sentiment) => {
    if (sentiment === 'positive') return 'sentiment-positive';
    if (sentiment === 'negative') return 'sentiment-negative';
    return 'sentiment-neutral';
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: 'var(--deepBg)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <style>{EXECUTIVE_THEME + premiumAnimationStyles}</style>
      <div className="neural-bg" />

      {/* Connection Status Indicator */}
      {isConnected && (
        <div style={{ position: 'fixed', top: 90, right: 20, zIndex: 100, padding: '6px 12px', background: 'var(--success-dim)', border: '1px solid var(--success)', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6, animation: 'fadeInUp 0.5s ease' }}>
          <ZapIcon size={12} color="var(--success)" style={{ animation: 'pulseSlow 2s infinite' }} />
          <span style={{ fontSize: 10, color: 'var(--success)', fontWeight: 600 }}>LIVE AI CONNECTED</span>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {showEndConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'blurIn 0.3s ease' }}>
          <div className="glass-panel" style={{ padding: 40, maxWidth: 450, textAlign: 'center', animation: 'scaleUp 0.4s ease' }}>
            <AlertTriangle size={48} color="var(--gold-mid)" style={{ margin: '0 auto 20px' }} />
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>End Focus Group?</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 30 }}>All feedback will be compiled. You cannot return to this session.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowEndConfirm(false)}
                className="interactive-btn"
                style={{ flex: 1, padding: '12px 0', background: 'transparent', border: '1px solid var(--border-gold)', borderRadius: 6, color: 'var(--text-primary)', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={confirmEndSession}
                className="interactive-btn"
                style={{ flex: 1, padding: '12px 0', background: 'var(--danger)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700 }}
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FEEDBACK MODAL --- */}
      {isFeedbackModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div className="glass-panel custom-scrollbar" style={{ padding: 30, maxWidth: 700, width: '100%', maxHeight: '90vh', overflow: 'auto', animation: 'scaleUp 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
              <h2 style={{ fontSize: 22, color: 'var(--gold-mid)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={24} /> Customer Feedback Report
              </h2>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {customerPanel.map((member, i) => {
              const data = feedbackData[member.id] || { rating: 3, comment: "No feedback yet", sentiment: "neutral" };
              return (
                <div key={member.id} className={getSentimentClass(data.sentiment)} style={{ padding: 20, border: '1px solid var(--border-gold)', borderRadius: 8, marginBottom: 16, animation: `slideInRight 0.5s ease ${i * 0.1}s backwards` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {member.name} ({member.role})
                    </div>
                    {data.sentiment === 'positive' && <ThumbsUp size={18} color="var(--success)" />}
                    {data.sentiment === 'negative' && <ThumbsDown size={18} color="var(--danger)" />}
                    {data.sentiment === 'neutral' && <Meh size={18} color="var(--info)" />}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} fill={star <= data.rating ? 'var(--gold-mid)' : 'transparent'} color={star <= data.rating ? 'var(--gold-mid)' : 'var(--text-secondary)'} />
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{data.comment}"
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="interactive-btn"
              style={{ width: '100%', padding: 14, background: 'var(--gold-grad)', border: 'none', borderRadius: 4, color: '#000', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em' }}
            >
              CLOSE REPORT
            </button>
          </div>
        </div>
      )}

      {/* --- BREAK MODAL --- */}
      {isBreakModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ padding: 40, maxWidth: 400, textAlign: 'center', animation: 'scaleUp 0.4s ease' }}>
            <Coffee size={48} color="var(--gold-mid)" style={{ margin: '0 auto 20px', animation: 'bounce 1s infinite' }} />
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Take a Break</div>
            <button
              onClick={() => setIsBreakModalOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'absolute', top: 20, right: 20 }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30 }}>
              {[5, 10, 30].map(m => (
                <button
                  key={m}
                  onClick={() => startBreak(m)}
                  className="interactive-btn"
                  style={{ padding: '12px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', borderRadius: 6, color: 'var(--text-primary)', fontWeight: 700 }}
                >
                  {m} Min
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- BREAK OVERLAY --- */}
      {isOnBreak && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <Coffee size={64} color="var(--gold-mid)" style={{ marginBottom: 30, animation: 'pulseSlow 2s infinite' }} />
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold-mid)', letterSpacing: '0.1em', marginBottom: 12 }}>EXECUTIVE BREAK</div>
          <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 40 }}>{formatTime(breakTimeLeft)}</div>
          <button
            onClick={() => setIsOnBreak(false)}
            className="interactive-btn"
            style={{ padding: '14px 40px', background: 'var(--gold-grad)', border: 'none', borderRadius: 4, color: '#000', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}
          >
            <Play size={20} /> RESUME SESSION
          </button>
        </div>
      )}

      {/* --- PAUSE OVERLAY --- */}
      {isPaused && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <Lock size={64} color="var(--gold-mid)" style={{ marginBottom: 30 }} />
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold-mid)', letterSpacing: '0.15em', marginBottom: 10 }}>EXECUTIVE PAUSE</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 40 }}>Security Protocol: Simulation Hibernated</div>
          <button
            onClick={() => setIsPaused(false)}
            className="interactive-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: 'transparent', border: '1px solid var(--gold-mid)', color: 'var(--gold-mid)', borderRadius: 4, fontWeight: 800, fontSize: 14, margin: '0 auto', letterSpacing: '0.1em' }}
          >
            <Play size={20} /> RESUME SESSION
          </button>
        </div>
      )}

      {/* --- END SCREEN --- */}
      {isMeetingEnded && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 40 }}>
          <CheckCircle size={80} color="var(--success)" style={{ marginBottom: 30, animation: 'scaleUp 0.6s ease' }} />
          <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--gold-mid)', letterSpacing: '0.1em', marginBottom: 12 }}>SESSION COMPLETE</div>
          <div style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 50 }}>{endReason}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 500, marginBottom: 40 }}>
            {[
              { icon: FileText, label: "Full Session Report", sub: "Analysis Complete" },
              { icon: FileBarChart, label: "Sentiment Analysis", sub: "Exporting Metrics" }
            ].map((item, i) => (
              <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 16, animation: `slideInRight 0.5s ease ${i * 0.1}s backwards` }}>
                <item.icon size={32} color="var(--gold-mid)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.sub}</div>
                </div>
                <Download size={24} color="var(--text-secondary)" style={{ cursor: 'pointer' }} className="interactive-btn" />
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            className="interactive-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold-mid)', background: 'rgba(212, 175, 104, 0.1)', border: '1px solid var(--gold-dim)', cursor: 'pointer', fontSize: 13, padding: '10px 20px', borderRadius: 4, margin: '0 auto' }}
          >
            <RefreshCcw size={16} /> NEW SESSION
          </button>
        </div>
      )}

      {/* --- PREMIUM HEADER --- */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-sidebar)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Tag size={24} color="var(--gold-mid)" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-mid)', letterSpacing: '0.1em' }}>AGIOAS</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Focus Group</div>
          </div>
        </div>

        {/* CURRENT ASK */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          {isEditingAsk ? (
            <input
              autoFocus
              onBlur={() => setIsEditingAsk(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingAsk(false)}
              value={currentAsk}
              onChange={(e) => setCurrentAsk(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--gold-mid)', borderRadius: 4, color: '#fff', padding: '4px 8px', fontSize: 13, textAlign: 'center', outline: 'none', minWidth: 200 }}
            />
          ) : (
            <div
              onClick={() => setIsEditingAsk(true)}
              className="interactive-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: '6px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)' }}
            >
              <Target size={14} color="var(--gold-mid)" />
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>TOPIC: {currentAsk}</span>
              <Edit3 size={12} color="var(--text-secondary)" />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(93, 122, 88, 0.2)', borderRadius: 20, border: '1px solid var(--success)' }}>
            <Clock size={16} color="var(--success)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>{formatTime(sessionTime)}</span>
          </div>
          <button
            onClick={triggerEndSession}
            className="interactive-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 6, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}
          >
            <PhoneOff size={16} /> END
          </button>
        </div>
      </div>

      {/* --- MAIN BODY --- */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="interactive-btn"
          style={{ position: 'absolute', top: 20, left: isSidebarOpen ? 325 : 10, zIndex: 100, width: 32, height: 32, borderRadius: '50%', background: 'var(--gold-grad)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)', boxShadow: '0 4px 15px rgba(212, 175, 104, 0.3)' }}
        >
          {isSidebarOpen ? <ChevronLeft size={18} color="#000" /> : <ChevronRight size={18} color="#000" />}
        </button>

        {/* SIDEBAR - MATCHING IMAGE DESIGN */}
        <div
          className={isSidebarOpen ? 'sidebar-open custom-scrollbar' : 'sidebar-closed'}
          style={{ height: '100%', borderRight: '1px solid var(--border-gold)', background: 'var(--bg-sidebar)', backdropFilter: 'blur(10px)', padding: 20, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 12, borderBottom: '1px solid var(--border-gold)' }}>
            <Users size={18} color="var(--gold-mid)" />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold-mid)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CUSTOMER PANEL</span>
          </div>

          {/* CUSTOMER LIST WITH SENTIMENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {customerPanel.map((member, i) => (
              <div
                key={member.id}
                className={getSentimentClass(member.sentiment)}
                style={{
                  padding: 14,
                  background: typingMemberId === member.id ? 'rgba(212, 175, 104, 0.15)' : 'var(--bg-card)',
                  border: typingMemberId === member.id ? '1px solid var(--gold-mid)' : '1px solid var(--border-gold)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.3s ease',
                  animation: `slideInLeft 0.5s ease ${i * 0.1}s backwards`
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--border-gold)', border: '2px solid var(--gold-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'var(--gold-mid)', position: 'relative' }}>
                  {member.initials}
                  {/* Sentiment Indicator */}
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: member.sentiment === 'positive' ? 'var(--success)' : member.sentiment === 'negative' ? 'var(--danger)' : 'var(--info)', border: '2px solid var(--bg-sidebar)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {typingMemberId === member.id ? "Responding..." : member.role}
                  </div>
                </div>
                {feedbackData[member.id] && (
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-mid)' }}>
                    {feedbackData[member.id].rating}★
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* LIVE SENTIMENT BOARD - MATCHING IMAGE EXACTLY */}
          <LiveSentimentBoard feedbackData={feedbackData} customerPanel={customerPanel} />

          <button
            onClick={() => setIsBreakModalOpen(true)}
            className="interactive-btn"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'rgba(212, 175, 104, 0.1)', border: '1px solid var(--gold-mid)', color: 'var(--gold-mid)', borderRadius: 8, fontSize: 12, fontWeight: 800, letterSpacing: '0.05em' }}
          >
            <Coffee size={16} /> TAKE A BREAK
          </button>

          <button
            onClick={handleNewChat}
            className="interactive-btn"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-gold)', color: 'var(--text-secondary)', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
          >
            <MessageSquarePlus size={16} /> New Chat
          </button>

          <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseEnter={() => setShowInstructions(true)}
            onMouseLeave={() => setShowInstructions(false)}
          >
            <button
              className="interactive-btn"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-gold)', color: 'var(--text-secondary)', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
            >
              <HelpCircle size={16} /> HELP
            </button>
            {showInstructions && (
              <div className="glass-panel" style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 8, padding: 14, fontSize: 11, color: 'var(--text-secondary)', zIndex: 100, animation: 'fadeInUp 0.3s ease' }}>
                <div style={{ fontWeight: 800, color: 'var(--gold-mid)', marginBottom: 8, letterSpacing: '0.05em' }}>INSTRUCTIONS</div>
                <div style={{ lineHeight: 1.6 }}>
                  <div>• Ask open-ended questions</div>
                  <div>• Monitor real-time sentiment</div>
                  <div>• Use breaks for long sessions</div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="interactive-btn"
            style={{ width: '100%', padding: '14px', background: 'var(--success-dim)', border: '1px solid var(--success)', borderRadius: 8, color: 'var(--success)', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <FileBarChart size={18} /> VIEW FEEDBACK REPORT
          </button>
        </div>

        {/* RIGHT: CHAT AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {messages.map((msg) => {
              const isRightSide = msg.type === 'me';
              let bubbleBg = 'var(--bg-card)', bubbleBorder = 'var(--border-gold)';
              if (msg.type === 'me') {
                bubbleBg = 'rgba(212, 175, 104, 0.15)';
                bubbleBorder = 'var(--gold-mid)';
              }

              const anim = msg.type === 'system' ? 'fadeInUp 0.5s ease' : 'msgEnter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isRightSide ? 'flex-end' : 'flex-start',
                    animation: anim
                  }}
                >
                  {msg.type === 'system' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-gold)', borderRadius: 24, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <Info size={14} color="var(--gold-mid)" />
                      <span>{msg.text}</span>
                    </div>
                  )}

                  {msg.type !== 'system' && (
                    <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: isRightSide ? 'flex-end' : 'flex-start' }}>
                        {!isRightSide && (
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--border-gold)', border: '2px solid var(--gold-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--gold-mid)' }}>
                            {msg.initials}
                          </div>
                        )}
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{msg.sender}</span>
                      </div>

                      <div className={msg.type === 'agent' ? getSentimentClass(msg.sentiment) : ''} style={{ padding: 16, background: bubbleBg, backdropFilter: 'blur(8px)', border: `1px solid ${bubbleBorder}`, borderRadius: 12, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                        {msg.type === 'agent' ? (
                          <TypewriterText text={msg.text} sentiment={msg.sentiment} />
                        ) : (
                          msg.text
                        )}
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: isRightSide ? 'right' : 'left' }}>
                        {msg.time}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {typingMemberId && (
              <div style={{
                display: 'flex',
                gap: 12,
                padding: '12px 16px',
                animation: 'msgPopIn 0.3s ease-out',
                background: 'rgba(185, 149, 80, 0.05)', // ✅ Slight highlight
                borderRadius: 8,
                border: `1px solid rgba(185, 149, 80, 0.15)` // ✅ Border for visibility
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: colors.goldGrad,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.textDark,
                  boxShadow: '0 0 20px rgba(185, 149, 80, 0.4)' // ✅ Glow effect
                }}>
                  {boardMembers.find(m => m.id === typingMemberId)?.initials}
                </div>
                <div style={{
                  flex: 1,
                  background: colors.bgCard,
                  borderRadius: 8,
                  padding: '12px 16px',
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: colors.gold,
                        animation: `dotPulse 1.4s infinite ease-in-out ${i * 0.2}s`,
                        boxShadow: '0 0 10px rgba(185, 149, 80, 0.6)' // ✅ Dot glow
                      }} />
                    ))}
                  </div>
                  <span style={{
                    color: colors.textDim,
                    fontSize: 13,
                    fontStyle: 'italic'
                  }}>
                    {boardMembers.find(m => m.id === typingMemberId)?.name} is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* PREMIUM INPUT AREA */}
          <div
            style={{
              padding: '10px 10px',
              background: 'transparent',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 700,
                maxWidth: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  padding: '4px 10px',
                  background: 'var(--bg-input)',
                  border: `1px solid ${isInputFocused ? 'var(--gold-mid)' : 'var(--border-gold)'
                    }`,
                  borderRadius: 35,
                  transition: 'all 0.3s ease',
                  boxShadow: isInputFocused
                    ? '0 0 20px rgba(212, 175, 104, 0.2)'
                    : 'none',
                }}
              >
                <input
                  value={inputText}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && !e.shiftKey && handleSendMessage()
                  }
                  placeholder="Ask for feedback..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: 15,
                    outline: 'none',
                    caretColor: 'var(--gold-mid)',
                  }}
                  disabled={isMeetingEnded || isPaused || isOnBreak}
                />

                <button
                  onClick={handleSendMessage}
                  className="interactive-btn"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: inputText.trim()
                      ? 'var(--gold-grad)'
                      : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                    boxShadow: inputText.trim()
                      ? '0 4px 15px rgba(212, 175, 104, 0.3)'
                      : 'none',
                  }}
                  disabled={
                    !inputText.trim() || isMeetingEnded || isPaused || isOnBreak
                  }
                >
                  <Send
                    size={18}
                    color={
                      inputText.trim() ? '#1A120E' : 'var(--text-secondary)'
                    }
                  />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackRoom;