import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, PhoneOff, Users, Hexagon, Clock,
  Play, CheckCircle, X, ChevronLeft, ChevronRight,
  RefreshCcw, Edit3, HelpCircle, Coffee,
  Lock, MessageSquarePlus, ThumbsUp, ThumbsDown,
  Activity, FileText, Download, PieChart,
  Target, BarChart2, AlertCircle, Brain,
  TrendingUp, Zap, Shield, Cpu, DollarSign,
  UserCheck, BarChart3, LineChart
} from 'lucide-react';

// --- CONFIGURATION ---
const USER_NAME = "Founder";
const USER_PROFILE_IMG = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop";
const BACKEND_URL = "http://localhost:8000/api/v1"; // ✅ UPGRADED: Use REST API
const WS_URL = "ws://localhost:8000/ws";
// Config object
const config = {
  apiUrl: 'http://localhost:8000',
  wsUrl: 'ws://localhost:8000'
};

// Board members for VC simulation
const boardMembers = [];

// onBack function (if you don't have it)
const onBack = () => {
  window.history.back();
};
const colors = {
  gold: '#FFD700',       // Metallic Gold Leaf
  goldDim: '#B8860B',    // Burnished Bronze
  goldMid: '#DAA520',    // Satin Brass
  goldBright: '#FFF8DC',  // Champagne Highlight
  goldGrad: 'linear-gradient(135deg, #D4AF37 0%, #AF9462 50%, #8A6D3B 100%)',
  textMain: '#FFFFFF',
  textSecondary: '#F5DEB3', // Burnished Brass
  textDim: '#D2B48C',    // Dark Umber
  border: 'rgba(255, 215, 0, 0.3)', // Metallic Inlay
  bgApp: '#2A1810',      // Obsidian Wood
  bgSidebar: '#3D2517',  // Deep Walnut
  bgCard: '#4A2F1E',     // Polished Oak
  bgInput: '#1F1108',    // Charcoal Grain
  chatShadow: 'rgba(212, 175, 55, 0.12)' // The Golden Halo
};
const animationStyles = `
  /* ✅ IMPORT PREMIUM FONTS */
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap');

  :root {
    
    /* PREMIUM GOLDEN SHADOWS */
    --shadow-gold-sm: 0 2px 8px rgba(255, 215, 0, 0.2);
    --shadow-gold-md: 0 4px 16px rgba(255, 215, 0, 0.3);
    --shadow-gold-lg: 0 8px 32px rgba(255, 215, 0, 0.4);
    --shadow-wood: 0 4px 12px rgba(42, 24, 16, 0.6);
    --shadow-inset-wood: inset 0 2px 4px rgba(0, 0, 0, 0.3);

    --bg-app: #2A1810;
    --text-heading: #FFFFFF;
    --font-header: 'Cinzel', serif;
    --font-body: 'Montserrat', sans-serif;
    
    /* THE GOLDEN SHADOW ENGINE */
    --chat-glow: radial-gradient(
      circle at 50% 50%, 
      rgba(212, 175, 55, 0.12) 0%, 
      rgba(42, 24, 16, 1) 85%
    );

    --gold-grad: background: linear-gradient(135deg, 
      #B8860B 0%, 
      #FFD700 20%, 
      #FDB931 40%, 
      #FFED4E 50%, 
      #FDB931 60%, 
      #FFD700 80%, 
      #B8860B 100%);
  }

  /* ✅ GLOBAL TYPOGRAPHY UPGRADE */
  * {
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ✅ PREMIUM ETCHED GOLD HEADINGS */
  h1, h2, h3, .section-title, .sidebar-title, .header-text {
    font-family: var(--font-header) !important;
    background: var(--gold-grad);
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    
    /* Etched Boundary */
    -webkit-text-stroke: 0.5px rgba(249, 229, 188, 0.3); 
    
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 2px !important;
    
    text-shadow: 
      0px 1px 0px rgba(255, 255, 255, 0.1), 
      0px -1px 1px rgba(0, 0, 0, 0.8);
      
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.9));
  }

  /* Sidebar Specific Font Refinement */
  .sidebar-container span, .sidebar-item {
    font-family: var(--font-body);
    font-weight: 500;
    letter-spacing: 0.5px;
    color: #F5DEB3;
  }

  /* Message Bubble Typography */
  .message-text {
    font-family: var(--font-body);
    line-height: 1.6;
    font-weight: 400;
  }

  /* Custom Scrollbar, Animations, and Layout Layers remain unchanged... */

  
  /* PREMIUM WOOD GRAIN TEXTURE */
  .wood-texture {
    background-image: 
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.03) 0px,
        rgba(0, 0, 0, 0.03) 1px,
        transparent 1px,
        transparent 3px
      ),
      repeating-linear-gradient(
        0deg,
        rgba(139, 115, 85, 0.05) 0px,
        rgba(139, 115, 85, 0.05) 2px,
        transparent 2px,
        transparent 4px
      );
  }
  
  /* GOLD METALLIC SHINE */

  
  /* BRILLIANT GOLD FOR STATS & NUMBERS */
  .gold-text {
    color: #FFD700;
    font-weight: 700;
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.6),
      0 2px 4px rgba(0, 0, 0, 1);
  }
  
  .bright-gold {
    color: #FFED4E;
    font-weight: 700;
    text-shadow: 
      0 0 15px rgba(255, 237, 78, 0.8),
      0 2px 6px rgba(0, 0, 0, 1);
  }

  .gold-shine {
    background: linear-gradient(135deg, 
      #FFD700 0%, 
      #FDB931 25%, 
      #FFED4E 50%, 
      #FDB931 75%, 
      #B8860B 100%);
    background-size: 200% 200%;
    animation: goldShimmer 3s ease infinite;
  }
  
  @keyframes goldShimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* RICH WOOD PANEL EFFECT */


  /* HIGH CONTRAST SIDEBAR TEXT */
  .sidebar-container, .vc-card, .investment-board {
    color: #FFFFFF !important;
  }
  
  .vc-name, .member-name, .stat-label {
    color: #FFFFFF !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    font-weight: 600 !important;
  }
  
  .vc-role, .member-role {
    color: #F5DEB3 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }
  
  .stat-value {
    color: #FFD700 !important;
    font-weight: 700 !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  }
  
  .percentage, .score-value {
    color: #FFED4E !important;
    font-weight: 700 !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  }

  .wood-panel {
    background: linear-gradient(180deg, 
      #4A2F1E 0%, 
      #3D2517 50%, 
      #2A1810 100%);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 -2px 4px rgba(255, 215, 0, 0.1);
  }

  .mesh-gradient {
    position: absolute;
    inset: 0;
    z-index: -2;
    background: var(--bg-app);
    background-image: var(--chat-glow);
  }
`;
// --- INITIAL DATA ---
const INITIAL_MESSAGES = [
  { id: 1, sender: "System", text: "Pitch Simulation initialized. Real-time AI analysis active.", type: 'system' },
];

// --- SUB-COMPONENTS ---

const ThinkingBubble = ({ member }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, animation: 'slideInLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', paddingBottom: 8, position: 'relative', zIndex: 2 }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold, fontSize: 10, animation: 'pulseSlow 2s infinite' }}>{member?.initials || 'VC'}</div>
    <div style={{ background: colors.darkGlass, border: `1px solid ${colors.border}`, borderRadius: '16px 16px 16px 2px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)' }}>
      <span style={{ fontSize: 11, color: '#F5DEB3', marginRight: 6, fontWeight: 600 }}>ANALYZING RESPONSE</span>
      {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 5, height: 5, background: colors.gold, borderRadius: '50%', animation: `neuralPulse 1s infinite ease-in-out ${d}s` }}></div>)}
    </div>
  </div>
);

const RiskReturnFrontier = ({ risk, returnVal }) => {
  const size = 200;
  const padding = 20;
  const innerSize = size - padding * 2;

  // Normalize values (0-100) to coordinates
  const x = padding + (risk / 100) * innerSize;
  const y = padding + (1 - returnVal / 100) * innerSize;

  return (
    <div style={{ padding: '16px', background: 'rgba(74, 47, 30, 0.4)', borderTop: `1px solid ${colors.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#D2B48C', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Activity size={12} color={colors.warning} /> Risk–Return Frontier
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Grid lines */}
          <line x1={padding} y1={size - padding} x2={size - padding} y2={size - padding} stroke={colors.border} strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={size - padding} stroke={colors.border} strokeWidth="1" />

          {/* The Frontier Curve (Hyperbola-ish) */}
          <path
            d={`M ${padding} ${size - padding - 20} Q ${padding + 40} ${padding + 40} ${size - padding - 20} ${padding}`}
            fill="none"
            stroke={colors.goldDim}
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Labels */}
          <text x={size - padding} y={size - padding + 12} fontSize="8" fill={colors.textDim} textAnchor="end">RISK</text>
          <text x={padding - 5} y={padding} fontSize="8" fill={colors.textDim} transform={`rotate(-90, ${padding - 5}, ${padding})`} textAnchor="end">RETURN</text>

          {/* Current Position Dot */}
          <circle cx={x} cy={y} r="5" fill={colors.gold} style={{ transition: 'all 1s ease' }}>
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r="12" stroke={colors.gold} fill="none" strokeOpacity="0.3" style={{ transition: 'all 1s ease' }} />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ fontSize: 10, color: '#D2B48C' }}>Exposure: <span style={{ color: colors.textMain }}>{risk}%</span></div>
        <div style={{ fontSize: 10, color: '#D2B48C' }}>Alpha: <span style={{ color: colors.success }}>{returnVal}%</span></div>
      </div>
    </div>
  );
};

const TermSheetPowerCurve = ({ powerBalance }) => {
  const width = 240;
  const height = 60;

  // powerBalance is -100 (Founder Heavy) to +100 (Investor Heavy)
  const normalizedX = ((powerBalance + 100) / 200) * width;

  return (
    <div style={{ padding: '16px', background: 'rgba(74, 47, 30, 0.4)', borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#D2B48C', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <TrendingUp size={12} color={colors.info} /> Term Sheet Power Curve
      </div>
      <div style={{ width: '100%', height: height, position: 'relative' }}>
        {/* Background Track */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: colors.border, transform: 'translateY(-50%)' }} />

        {/* Gradient Zones */}
        <div style={{ position: 'absolute', top: '50%', left: 0, width: '30%', height: 4, background: colors.successDim, transform: 'translateY(-50%)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: '50%', right: 0, width: '30%', height: 4, background: colors.dangerDim, transform: 'translateY(-50%)', borderRadius: 2 }} />

        {/* The Slider / Indicator */}
        <div style={{
          position: 'absolute',
          left: `${(powerBalance + 100) / 2}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          <div style={{ width: 2, height: 20, background: colors.gold }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.gold, boxShadow: `0 0 10px ${colors.gold}` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'absolute', bottom: 0 }}>
          <span style={{ fontSize: 8, color: colors.success, fontWeight: 700 }}>FOUNDER OPTIMIZED</span>
          <span style={{ fontSize: 8, color: colors.danger, fontWeight: 700 }}>INVESTOR OPTIMIZED</span>
        </div>
      </div>
    </div>
  );
};

// ✅ UPGRADED: Smooth word-by-word typing with natural pauses
const TypewriterText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const char = text[currentIndex];
      // Add slight pause after punctuation for natural rhythm
      const delay = char === '.' || char === '?' || char === '!' ? speed * 3 :
        char === ',' || char === ';' ? speed * 2 : speed;

      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + char);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <span style={{
          display: 'inline-block',
          width: 2,
          height: '1em',
          marginLeft: 2,
          background: colors.gold,
          animation: 'cursorBlink 1s infinite'
        }} />
      )}
    </span>
  );
};

const VCAvatar = ({ vc, state, size = 40 }) => {
  const getMoodColor = (mood) => {
    if (mood > 0.7) return colors.success;
    if (mood < 0.3) return colors.danger;
    return colors.warning;
  };

  const getEngagementColor = (engagement) => {
    if (engagement > 0.7) return colors.gold;
    if (engagement < 0.3) return colors.textDim;
    return colors.info;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.3))`,
        border: `2px solid ${state ? getEngagementColor(state.engagement) : colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.gold,
        fontSize: size * 0.3,
        fontWeight: 700,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 15px ${state ? getEngagementColor(state.engagement) + '40' : 'rgba(0,0,0,0.3)'}`
      }}>
        {vc.initials || vc.name.split(' ').map(n => n[0]).join('')}

        {/* Mood indicator */}
        {state && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: getMoodColor(state.mood || 0.5),
            border: '2px solid rgba(0,0,0,0.5)',
            boxShadow: `0 0 5px ${getMoodColor(state.mood || 0.5)}`
          }} />
        )}
      </div>

      {/* Engagement ring */}
      {state && (
        <div style={{
          position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: '50%',
          border: `2px solid transparent`,
          borderTopColor: getEngagementColor(state.engagement),
          transform: `rotate(${state.engagement * 360}deg)`,
          transition: 'transform 1s ease'
        }} />
      )}
    </div>
  );
};

const AnalyticsPanel = ({ analytics }) => {
  if (!analytics) {
    return (
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ color: '#D2B48C', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
          <Target size={12} /> Live Analytics
        </div>
        <div style={{ color: '#D2B48C', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>
          Collecting data...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ color: '#D2B48C', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0 }}>
        <Target size={12} /> Live Analytics
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#D2B48C', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Zap size={8} /> Pace
          </span>
          <span style={{ fontSize: 13, color: colors.textMain, fontWeight: 600 }}>
            {analytics.claims_per_minute || '--'} <span style={{ fontSize: 9 }}>CPM</span>
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#D2B48C', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Shield size={8} /> Evidence
          </span>
          <span style={{ fontSize: 13, color: analytics.evidence_ratio > 0.5 ? colors.success : colors.warning, fontWeight: 600 }}>
            {analytics.evidence_ratio ? Math.round(analytics.evidence_ratio * 100) : '--'}%
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#D2B48C', display: 'flex', alignItems: 'center', gap: 4 }}>
            <UserCheck size={8} /> Engagement
          </span>
          <span style={{ fontSize: 13, color: colors.textMain, fontWeight: 600 }}>
            {analytics.avg_engagement ? Math.round(analytics.avg_engagement * 100) : '--'}%
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 10, color: '#D2B48C', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Brain size={8} /> Confidence
          </span>
          <span style={{ fontSize: 13, color: analytics.avg_belief_confidence > 0.6 ? colors.success : colors.textMain, fontWeight: 600 }}>
            {analytics.avg_belief_confidence ? Math.round(analytics.avg_belief_confidence * 100) : '--'}%
          </span>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: '#D2B48C', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={10} /> Impact Score
          </span>
          <span style={{ fontSize: 10, color: colors.gold }}>
            {analytics.total_claims ? Math.min(10, Math.round(analytics.total_claims / 5 + analytics.evidence_ratio * 5)) : '--'}/10
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <div style={{
            width: `${analytics.total_claims ? Math.min(100, Math.round((analytics.total_claims / 5 + analytics.evidence_ratio * 5) * 10)) : 50}%`,
            height: '100%',
            background: colors.gold,
            borderRadius: 2,
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>

    </div>
  );
};

// --- MAIN COMPONENT ---
const InvestmentPitchRoom = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const [typingMemberId, setTypingMemberId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [endReason, setEndReason] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [vcPanel, setVcPanel] = useState([]);
  const [vcStates, setVcStates] = useState({});
  const [currentAsk, setCurrentAsk] = useState("Series A: $5M Valuation");
  const [isEditingAsk, setIsEditingAsk] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [sessionTime, setSessionTime] = useState(3600);
  const [sessionId, setSessionId] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [convictionHistory, setConvictionHistory] = useState(new Array(15).fill(50));

  // Financial Visualization States
  const [currentRisk, setCurrentRisk] = useState(40);
  const [currentReturn, setCurrentReturn] = useState(60);
  const [powerBalance, setPowerBalance] = useState(0); // -100 to 100

  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // --- ✅ UPGRADED: REST API CONNECTION ---
  // --- ✅ UPGRADED: AUTHENTICATED SESSION START ---
  useEffect(() => {
    let mounted = true;

    const initializeAuthenticatedSession = async () => {
      try {
        console.log('🚀 Starting VC session with authentication...');
        const { sessionAPI } = await import('../services/api');

        const response = await sessionAPI.start('vc', 'chat', config || {});

        if (!mounted) return;

        const authenticatedSessionId = response.data.session.session_id;
        setSessionId(authenticatedSessionId);
        console.log('✅ Authenticated session started:', authenticatedSessionId);

        const sessionData = response.data.session;
        if (sessionData.characters && sessionData.characters.length > 0) {
          const backendVCs = sessionData.characters.map((char, idx) => ({
            id: idx + 1,
            name: char.name,
            role: char.role,
            initials: char.name.split(' ').map(n => n[0]).join(''),
            baseInterest: 50
          }));
          setVcPanel(backendVCs);

          const initialState = {};
          backendVCs.forEach(vc => {
            initialState[vc.id] = {
              interest: 50,
              conviction: 50,
              frustration: 0,
              engagement: 0.5,
              mood: 0.5,
              skepticism: 50
            };
          });
          setVcStates(initialState);
        } else {
          initializeLocalSession();
        }

        const initialMsg = {
          id: Date.now(),
          sender: sessionData.speaker || "Sharad Singhania",
          initials: (sessionData.speaker || "SS").split(' ').map(n => n[0]).join(''),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: sessionData.initial_message || "Welcome to AGIOAS Ventures. Please present your elevator pitch.",
          type: 'agent',
          sentiment: 'neutral',
          isTyping: true
        };
        setMessages(prev => [...prev, initialMsg]);

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
          console.warn('Using local simulation as fallback');
          initializeLocalSession();

          const welcomeMsg = {
            id: Date.now(),
            sender: "Sharad Singhania",
            initials: "SS",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: "Welcome to AGIOAS Ventures. We're excited to hear your pitch. Please begin with your elevator pitch.",
            type: 'agent',
            sentiment: 'neutral',
            isTyping: true
          };
          setMessages(prev => [...prev, welcomeMsg]);
        }
      }
    };

    initializeAuthenticatedSession();

    return () => {
      mounted = false;
    };
  }, [config]);

  const initializeLocalSession = () => {
    const localVCs = [
      { id: 1, name: "Arsit Rao", role: "Lead Partner", initials: "AR", baseInterest: 50 },
      { id: 2, name: "Harrison Cole", role: "Product Lead", initials: "HC", baseInterest: 50 },
      { id: 3, name: "Sam Oberoi", role: "Growth Lead", initials: "SO", baseInterest: 50 },
      { id: 4, name: "Sharad Singhania", role: "Finance Partner", initials: "SS", baseInterest: 50 },
      { id: 5, name: "Warren V.", role: "Strategy Lead", initials: "WV", baseInterest: 50 },
    ];

    setVcPanel(localVCs);
    setSessionId(`local_${Date.now()}`); // ✅ UPGRADED: Set local session ID

    const initialState = {};
    localVCs.forEach(vc => {
      initialState[vc.id] = {
        interest: 50, // ✅ UPGRADED: Start neutral
        conviction: 50,
        frustration: 0,
        engagement: 0.5,
        mood: 0.5,
        skepticism: 50 // ✅ UPGRADED: Track skepticism
      };
    });
    setVcStates(initialState);
  };

  const handleWebSocketMessage = (data) => {
    console.log('📨 WebSocket message:', data.type);

    switch (data.type) {
      case 'connected':
        // Initial connection established
        break;

      case 'vc_response':
        handleVCResponse(data.data);
        break;

      case 'vc_typing':
        setTypingMemberId(data.data.vc_name);
        setTimeout(() => setTypingMemberId(null), 2000);
        break;

      case 'analytics_update':
        updateAnalytics(data.data);
        break;

      case 'session_ended':
        handleSessionEnd(data.data);
        break;

      case 'break_started':
        startBreakTimer(data.data.duration);
        break;

      case 'break_ended':
        setIsOnBreak(false);
        break;
    }
  };

  const handleVCResponse = (response) => {
    // First, hide the thinking indicator
    setTypingMemberId(null);

    // Add VC message WITHOUT internal thoughts
    const newMessage = {
      id: Date.now(),
      sender: response.vc_name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: response.message,
      type: 'agent',
      sentiment: 'neutral',
      isTyping: true // Mark this message as typing initially
    };

    setMessages(prev => [...prev, newMessage]);

    // Update VC state
    if (response.vc_state) {
      setVcStates(prev => {
        const vcId = vcPanel.find(vc => vc.name === response.vc_name)?.id;
        if (vcId) {
          return {
            ...prev,
            [vcId]: response.vc_state
          };
        }
        return prev;
      });
    }

    // Update analytics and financial visualizations
    if (response.analytics) {
      updateAnalytics(response);

      // Derive financial metrics from sentiment and interest
      const interestChange = response.sentiment === 'positive' ? 5 : -5;
      setCurrentRisk(prev => Math.min(100, Math.max(0, prev + (response.sentiment === 'negative' ? 3 : -2))));
      setCurrentReturn(prev => Math.min(100, Math.max(0, prev + (response.sentiment === 'positive' ? 4 : -2))));
      setPowerBalance(prev => Math.min(100, Math.max(-100, prev + (response.sentiment === 'positive' ? -8 : 10))));
    }
  };

  const updateAnalytics = (response) => {
    if (response.analytics) {
      setAnalytics(response.analytics);

      // Update conviction history
      if (response.analytics.avg_engagement) {
        const engagementValue = response.analytics.avg_engagement * 100;
        setConvictionHistory(prev => [...prev.slice(1), engagementValue]);
      }

      // Update chart data
      if (response.chart_data) {
        setChartData(response.chart_data);
      }
    }
  };

  const startBreakTimer = (duration) => {
    setIsOnBreak(true);
    setBreakTimeLeft(duration);

    const timer = setInterval(() => {
      setBreakTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsOnBreak(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSessionEnd = (data) => {
    setEndReason(data.verdict?.reason || "Session ended");
    setIsMeetingEnded(true);
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (isMeetingEnded || isPaused || isOnBreak || showEndConfirm) return;

    const interval = setInterval(() => {
      setSessionTime(prev => {
        if (prev <= 1) {
          setEndReason("Time Limit");
          setIsMeetingEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMeetingEnded, isPaused, isOnBreak, showEndConfirm]);

  // --- SCROLL TO BOTTOM ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMemberId]);

  // --- SEND MESSAGE ---
  // ✅ UPGRADED: Real AI backend integration with smooth typing
  const handleSendMessage = async () => {
    if (!inputText.trim() || !sessionId) return;

    // Add user message
    const newMsg = {
      id: Date.now(),
      sender: USER_NAME,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      type: 'me',
      sentiment: 'neutral'
    };
    setMessages(prev => [...prev, newMsg]);

    const messageToSend = inputText;
    setInputText("");

    // Show thinking indicator
    setIsTyping(true);
    const randomVC = vcPanel[Math.floor(Math.random() * vcPanel.length)];
    setTypingMemberId(randomVC?.id);

    try {
      // Call real backend API
      const response = await fetch(`${BACKEND_URL}/sessions/${sessionId}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log('✅ AI response:', data);

      // Hide thinking indicator
      setIsTyping(false);
      setTypingMemberId(null);

      // Process each VC response
      const vcResponses = data.responses || [];

      for (let i = 0; i < vcResponses.length; i++) {
        const vcResponse = vcResponses[i];
        const speaker = vcResponse.speaker;
        const responseText = vcResponse.message;
        const vcState = vcResponse.vc_state;
        const emotion = vcResponse.emotion || 'neutral';

        // Find VC in panel
        const vcMatch = vcPanel.find(v => v.name === speaker);

        // Determine sentiment from emotion
        const sentiment = emotion === 'angry' || emotion === 'skeptical' ? 'negative' :
          emotion === 'positive' || emotion === 'agreeing' ? 'positive' : 'neutral';

        // Add AI message with typing animation
        const aiMsg = {
          id: Date.now() + i,
          sender: speaker,
          initials: vcMatch?.initials || speaker.split(' ').map(n => n[0]).join(''),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: responseText,
          type: 'agent',
          sentiment: sentiment,
          isTyping: true // ✅ Triggers word-by-word typing
        };

        setMessages(prev => [...prev, aiMsg]);

        // ✅ LIVE UPDATE: Update VC state from AI
        if (vcMatch && vcState) {
          const newInterest = 100 - (vcState.skepticism || 50);

          setVcStates(prev => ({
            ...prev,
            [vcMatch.id]: {
              ...prev[vcMatch.id],
              interest: newInterest,
              conviction: vcState.interest || newInterest,
              skepticism: vcState.skepticism || 50,
              engagement: newInterest / 100,
              mood: sentiment === 'positive' ? 0.8 : sentiment === 'negative' ? 0.2 : 0.5,
              frustration: vcState.skepticism || 50
            }
          }));
        }

        // Wait for typing to complete before next message
        await new Promise(resolve => setTimeout(resolve, responseText.length * 50 + 500));
      }

      // ✅ LIVE UPDATE: Update analytics and charts
      const avgInterest = Object.values(vcStates).reduce((acc, state) =>
        acc + (state?.interest || 50), 0) / Math.max(1, vcPanel.length);

      setConvictionHistory(prev => [...prev.slice(1), avgInterest]);

      // Update financial visualizations based on avg interest
      const interestChange = avgInterest - 50; // Deviation from neutral
      setCurrentRisk(prev => Math.min(100, Math.max(0, 50 - interestChange)));
      setCurrentReturn(prev => Math.min(100, Math.max(0, 50 + interestChange)));
      setPowerBalance(prev => Math.min(100, Math.max(-100, prev + (interestChange > 0 ? -8 : 8))));

    } catch (error) {
      console.error('❌ Backend error:', error);

      // Hide thinking
      setIsTyping(false);
      setTypingMemberId(null);

      // Fallback to local simulation
      simulateLocalResponse(randomVC);
    }
  };

  const simulateLocalResponse = (vc) => {
    // Simulate AI response after delay
    setTimeout(() => {
      const responses = [
        "I actually like that direction. The ROI potential seems clear.",
        "I'm skeptical about the scalability here. The CAC looks too high.",
        "Walk me through your unit economics in more detail.",
        "What makes your product technically defensible?",
        "How do you differentiate from established competitors?",
        "Why is your team uniquely qualified for this opportunity?",
        "Tell me more about your customer acquisition strategy.",
        "What's your plan if the market shifts direction?"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const isPositive = Math.random() > 0.5;

      // First, hide the thinking indicator
      setTypingMemberId(null);

      // Add AI message with typing flag
      const aiMsg = {
        id: Date.now() + 1,
        sender: vc?.name || "VC",
        initials: vc?.initials,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: randomResponse,
        type: 'agent',
        sentiment: isPositive ? 'positive' : 'negative',
        isTyping: true // This will trigger the typing animation
      };

      setMessages(prev => [...prev, aiMsg]);

      // Update VC state locally
      if (vc) {
        setVcStates(prev => ({
          ...prev,
          [vc.id]: {
            ...prev[vc.id],
            interest: Math.min(100, Math.max(0, (prev[vc.id]?.interest || 50) + (isPositive ? 10 : -10))),
            conviction: Math.min(100, Math.max(0, (prev[vc.id]?.conviction || 50) + (isPositive ? 8 : -12))),
            frustration: Math.min(100, Math.max(0, (prev[vc.id]?.frustration || 0) + (isPositive ? -5 : 15)))
          }
        }));
      }

      // Update analytics locally
      const newAvg = Object.values(vcStates).reduce((acc, state) => acc + (state?.interest || 0), 0) / Math.max(1, vcPanel.length);
      setConvictionHistory(prev => [...prev.slice(1), newAvg]);

      // Update Financial Visuals
      setCurrentRisk(prev => Math.min(100, Math.max(0, prev + (isPositive ? -4 : 6))));
      setCurrentReturn(prev => Math.min(100, Math.max(0, prev + (isPositive ? 7 : -3))));
      setPowerBalance(prev => Math.min(100, Math.max(-100, prev + (isPositive ? -12 : 15))));

    }, 2000); // 2 second thinking delay
  };

  // --- HELPER FUNCTIONS ---
  const startBreak = (minutes) => {
    setBreakTimeLeft(minutes * 60);
    setIsOnBreak(true);
    setIsBreakModalOpen(false);

    if (websocket && isConnected) {
      websocket.send(JSON.stringify({
        type: 'control',
        session_id: sessionId,
        data: { action: 'take_break', duration: minutes * 60 }
      }));
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const triggerEndSession = () => {
    setEndReason("Concluded by Founder");
    setShowEndConfirm(true);
  };

  const confirmEndSession = () => {
    setShowEndConfirm(false);

    if (websocket && isConnected) {
      websocket.send(JSON.stringify({
        type: 'control',
        session_id: sessionId,
        data: { action: 'end_session' }
      }));
    } else {
      setIsMeetingEnded(true);
    }
  };

  const getMessageStyles = (msg) => {
    const isMe = msg.type === 'me';
    const isPositive = msg.sentiment === 'positive';
    const isRightSide = isMe || isPositive;

    let bubbleBg = colors.darkGlass;
    let bubbleBorder = colors.border;

    if (isMe) {
      bubbleBg = colors.goldDim;
      bubbleBorder = colors.gold;
    } else if (isPositive) {
      bubbleBg = colors.successDim;
      bubbleBorder = colors.success;
    } else {
      bubbleBg = colors.dangerDim;
      bubbleBorder = colors.danger;
    }

    return { isRightSide, bubbleBg, bubbleBorder };
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: colors.deepBg,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{animationStyles}</style>

      {/* --- CONFIRMATION MODAL --- */}
      {showEndConfirm && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blurIn 0.3s forwards' }}>
          <div style={{ width: 350, background: '#1A120E', border: `1px solid ${colors.danger}`, borderRadius: 12, padding: 30, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: `0 0 50px ${colors.dangerDim}`, animation: 'scaleUp 0.3s ease', textAlign: 'center' }}>
            <AlertCircle size={48} color={colors.danger} style={{ margin: '0 auto' }} />
            <div>
              <h2 style={{ color: colors.textMain, margin: '0 0 8px 0', fontSize: 18 }}>End Pitch Session?</h2>
              <p style={{ color: '#D2B48C', fontSize: 13, margin: 0 }}>All progress will be saved. You can download reports on the next screen.</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowEndConfirm(false)} className="interactive-btn" style={{ flex: 1, padding: '12px 0', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMain, fontWeight: 600 }}>Cancel</button>
              <button onClick={confirmEndSession} className="interactive-btn" style={{ flex: 1, padding: '12px 0', background: colors.danger, border: 'none', borderRadius: 6, color: '#fff', fontWeight: 600 }}>End Session</button>
            </div>
          </div>
        </div>
      )}

      {/* --- BREAK MODAL --- */}
      {isBreakModalOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blurIn 0.3s forwards' }}>
          <div style={{ width: 400, background: '#1A120E', border: `1px solid ${colors.gold}`, borderRadius: 12, padding: 30, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: `0 0 50px ${colors.goldDim}`, animation: 'scaleUp 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: 10 }}>
              <h2 style={{ color: colors.gold, margin: 0, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Take a Break</h2>
              <button onClick={() => setIsBreakModalOpen(false)} style={{ background: 'none', border: 'none', color: '#D2B48C', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[5, 10, 30].map(m => <button key={m} onClick={() => startBreak(m)} className="interactive-btn" style={{ padding: '12px 0', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMain, fontWeight: 700 }}>{m} Min</button>)}
            </div>
          </div>
        </div>
      )}

      {/* --- BREAK OVERLAY --- */}
      {isOnBreak && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'blurIn 0.5s ease' }}>
          <Coffee size={64} color={colors.gold} style={{ marginBottom: 20, animation: 'pulseSlow 2s infinite' }} />
          <h1 style={{ color: colors.textMain, fontSize: 32, letterSpacing: '0.1em', marginBottom: 8 }}>SESSION ON BREAK</h1>
          <div style={{ fontSize: 64, fontFamily: 'monospace', color: colors.gold, fontWeight: 700, marginBottom: 32 }}>{formatTime(breakTimeLeft)}</div>
          <button onClick={() => setIsOnBreak(false)} className="interactive-btn" style={{ padding: '14px 40px', background: colors.gold, border: 'none', borderRadius: 50, color: '#000', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}><Play size={20} fill="#000" /> RESUME NOW</button>
        </div>
      )}

      {/* --- PAUSE OVERLAY --- */}
      {isPaused && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(30px)', zIndex: 4000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'blurIn 0.3s forwards' }}>
          <div style={{ transform: 'scale(1)', animation: 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <Lock size={64} color={colors.danger} style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px auto' }} />
            <h1 style={{ color: colors.textMain, fontSize: 28, letterSpacing: '0.1em', textAlign: 'center', marginBottom: 8 }}>SESSION LOCKED</h1>
            <p style={{ color: '#D2B48C', marginBottom: 32, textAlign: 'center', fontFamily: 'monospace' }}>Security Protocol: Window Focus Lost</p>
            <button onClick={() => setIsPaused(false)} className="interactive-btn" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: colors.gold, border: 'none', borderRadius: 4, fontWeight: 800, fontSize: 14, margin: '0 auto', letterSpacing: '0.05em' }}>
              <Play size={16} fill="#000" /> RESUME PITCH
            </button>
          </div>
        </div>
      )}

      {/* --- END SCREEN --- */}
      {isMeetingEnded && (
        <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 3000, animation: 'blurIn 0.8s forwards' }}>
          <div className="smooth-ease" style={{ width: '100%', maxWidth: 500, background: 'rgba(20, 20, 25, 0.8)', border: `1px solid ${colors.goldDim}`, borderRadius: 20, padding: 40, textAlign: 'center', boxShadow: `0 30px 80px ${colors.goldDim}`, backdropFilter: 'blur(20px)', animation: 'scaleUp 0.6s cubic-bezier(0.19, 1, 0.22, 1)', position: 'relative' }}>
            <button onClick={() => setIsMeetingEnded(false)} className="interactive-btn" style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#D2B48C', cursor: 'pointer', zIndex: 10 }}><X size={24} /></button>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(212, 175, 104, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, margin: '0 auto 24px auto', border: `2px solid ${colors.gold}` }}>
              <CheckCircle size={40} color={colors.gold} />
            </div>
            <h1 style={{ color: colors.textMain, fontFamily: 'serif', fontSize: 32, marginBottom: 8, letterSpacing: '-0.02em' }}>Pitch Concluded</h1>
            <div style={{ color: colors.gold, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 30, letterSpacing: '0.15em' }}>{endReason}</div>

            {/* Download Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 30 }}>
              <button className="interactive-btn" onClick={() => alert("Downloading Report...")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.textMain }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}><BarChart2 size={16} color={colors.gold} /></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Download Full Report</div>
                    <div style={{ fontSize: 11, color: '#F5DEB3' }}>PDF • 2.4 MB</div>
                  </div>
                </div>
                <Download size={16} color={colors.textDim} />
              </button>
              <button className="interactive-btn" onClick={() => alert("Downloading Summary...")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.textMain }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}><PieChart size={16} color={colors.success} /></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Executive Summary</div>
                    <div style={{ fontSize: 11, color: '#F5DEB3' }}>PDF • 0.8 MB</div>
                  </div>
                </div>
                <Download size={16} color={colors.textDim} />
              </button>
              <button className="interactive-btn" onClick={() => alert("Downloading Transcript...")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.textMain }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}><FileText size={16} color={colors.textDim} /></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Chat Transcript</div>
                    <div style={{ fontSize: 11, color: '#F5DEB3' }}>TXT • 12 KB</div>
                  </div>
                </div>
                <Download size={16} color={colors.textDim} />
              </button>
            </div>

            <button onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D2B48C', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, opacity: 0.7, margin: '0 auto' }}><RefreshCcw size={14} /> Start New Pitch</button>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div style={{
        height: 60,
        background: 'rgba(0,0,0,0.4)',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF68, #8B6B2C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colors.gold}`
            }}>
              <Brain size={20} color="#000" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: colors.textMain, letterSpacing: '0.1em', fontFamily: 'serif' }}>AGIOAS AI</span>
          </div>
          <div style={{ width: 1, height: 24, background: colors.border }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isConnected ? colors.success : colors.danger,
              animation: isConnected ? 'pulseSlow 2s infinite' : 'none'
            }} />
            <span style={{ fontSize: 12, color: isConnected ? colors.success : colors.danger, fontWeight: 500 }}>
              {isConnected ? 'AI LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Pitch Ask */}


        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: sessionTime < 60 ? colors.danger : colors.textMain }}>
            <Clock size={16} />
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13 }}>{formatTime(sessionTime)}</span>
          </div>
          <button onClick={triggerEndSession} className="interactive-btn" style={{ padding: '8px 16px', background: 'rgba(138, 58, 58, 0.2)', border: `1px solid ${colors.danger}`, color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><PhoneOff size={14} /> END</button>
        </div>
      </div>

      {/* --- MAIN BODY --- */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="interactive-btn" style={{
          position: 'absolute',
          top: 20,
          left: isSidebarOpen ? 305 : 10,
          zIndex: 100,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: colors.gold,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          animation: 'float 3s infinite ease-in-out'
        }}>
          {isSidebarOpen ? <ChevronLeft size={16} color="#000" /> : <ChevronRight size={16} color="#000" />}
        </button>

        {/* SIDEBAR */}
        <div className={`smooth-ease ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
          background: 'rgba(15, 10, 8, 0.6)',
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
          overflow: 'hidden',
          zIndex: 10
        }}>

          {/* --- SIDEBAR HEADER BUTTONS (FROM SCREENSHOT) --- */}
          <div style={{ padding: '24px 16px 12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* EXECUTIVE PAUSE BUTTON */}
            <button
              onClick={() => setIsPaused(true)}
              className="interactive-btn"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(74, 47, 30, 0.5)',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                color: colors.gold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                textTransform: 'uppercase',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em'
              }}
            >
              <Coffee size={16} /> EXECUTIVE PAUSE
            </button>

            {/* NEW SESSION & HELP GROUP */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => window.location.reload()}
                className="interactive-btn"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(74, 47, 30, 0.4)',
                  border: `1px solid ${colors.gold}`,
                  borderRadius: 8,
                  color: colors.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <MessageSquarePlus size={16} /> New Session
              </button>
              <button
                className="interactive-btn"
                style={{
                  width: 44,
                  background: 'rgba(74, 47, 30, 0.4)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  color: '#D2B48C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HelpCircle size={18} />
              </button>
            </div>

            {/* INTELLIGENCE REPORT BUTTON */}
            <button
              className="interactive-btn"
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(93, 122, 88, 0.05)',
                border: `1px solid ${colors.successDim}`,
                borderRadius: 8,
                color: '#9EBA9A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                textTransform: 'uppercase',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '0.15em'
              }}
            >
              <Shield size={16} /> INTELLIGENCE REPORT
            </button>
          </div>

          <div style={{
            padding: '10px 16px',
            color: '#D2B48C',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderTop: `1px solid ${colors.border}`
          }}>
            <Users size={14} /> Investment Board
          </div>

          {/* VC LIST */}
          <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {vcPanel.map((vc, i) => {
              const state = vcStates[vc.id] || {};
              const interest = state.interest || 50;
              const conviction = state.conviction || 50;
              const frustration = state.frustration || 0;
              const engagement = state.engagement || 0.5;

              let barColor = colors.gold;
              if (interest < 30) barColor = colors.danger;
              if (interest > 70) barColor = colors.success;

              return (
                <div key={vc.id} className={`${typingMemberId === vc.id ? 'thinking-active' : ''}`} style={{
                  padding: '8px 4px',
                  marginBottom: 4,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  animation: `slideInRight 0.3s ease forwards ${i * 0.05}s`,
                  opacity: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <VCAvatar vc={vc} state={state} size={32} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 12, color: colors.textMain, fontWeight: 600 }}>{vc.name}</div>
                      <div style={{ fontSize: 9, color: '#D2B48C' }}>{vc.role}</div>
                    </div>
                  </div>

                  {/* Interest Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${interest}%`,
                        height: '100%',
                        background: barColor,
                        transition: 'width 0.8s ease'
                      }}></div>
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: barColor, width: 24, textAlign: 'right' }}>{Math.round(interest)}%</div>
                  </div>

                  {/* Additional Metrics */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 8, color: '#D2B48C' }}>
                    <span>Conviction: {Math.round(conviction)}%</span>
                    <span>Engage: {Math.round(engagement * 100)}%</span>
                    {frustration > 20 && <span style={{ color: colors.danger }}>Frust: {Math.round(frustration)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ANALYTICS SECTION */}
          <AnalyticsPanel analytics={analytics} />

          {/* FINANCIAL VISUALIZATIONS (REPLACED ANALYTICS CHART & CONVICTION GRAPH) */}
          <RiskReturnFrontier risk={currentRisk} returnVal={currentReturn} />
          <TermSheetPowerCurve powerBalance={powerBalance} />
        </div>

        {/* CHAT AREA WITH GOLDEN EXECUTIVE THEME */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: colors.bgInput }}>
          {/* Golden Mesh Gradient Background */}
          <div className="mesh-gradient" />

          {/* Executive SVG Pattern Overlay */}
          <div className="executive-pattern" />

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 40px 100px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            position: 'relative',
            zIndex: 1
          }} className="no-scrollbar">
            {messages.map((msg, index) => {
              const { isRightSide, bubbleBg, bubbleBorder } = getMessageStyles(msg);
              const anim = msg.type === 'system' ? 'fadeInUp 0.5s ease' : 'msgEnter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

              return (
                <div key={msg.id} style={{
                  alignSelf: msg.type === 'system' ? 'center' : (isRightSide ? 'flex-end' : 'flex-start'),
                  maxWidth: msg.type === 'system' ? '100%' : '65%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.type === 'system' ? 'center' : (isRightSide ? 'flex-end' : 'flex-start'),
                  animation: anim
                }}>
                  {msg.type === 'system' && (
                    <div style={{
                      background: 'rgba(212, 175, 104, 0.08)',
                      borderRadius: 20,
                      padding: '6px 16px',
                      fontSize: 11,
                      color: colors.gold,
                      border: `1px solid ${colors.goldDim}`,
                      fontFamily: 'monospace',
                      backdropFilter: 'blur(10px)',
                      letterSpacing: '0.05em'
                    }}>
                      {msg.text}
                    </div>
                  )}

                  {msg.type !== 'system' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexDirection: isRightSide ? 'row-reverse' : 'row' }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#000',
                          border: `1px solid ${bubbleBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: colors.gold,
                          fontSize: 12,
                          flexShrink: 0,
                          overflow: 'hidden',
                          boxShadow: `0 4px 15px rgba(212, 175, 104, 0.15)`
                        }}>
                          {msg.type === 'me' ? (
                            <img src={USER_PROFILE_IMG} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            msg.initials || msg.sender?.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <div className="interactive-btn" style={{
                          background: bubbleBg,
                          color: colors.textMain,
                          padding: '14px 18px',
                          borderRadius: isRightSide ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          fontSize: 14,
                          lineHeight: 1.6,
                          border: `1px solid ${bubbleBorder}`,
                          backdropFilter: 'blur(16px)',
                          transition: 'all 0.3s',
                          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
                          borderLeft: !isRightSide ? `3px solid ${bubbleBorder}` : `1px solid ${bubbleBorder}`,
                          borderRight: isRightSide ? `3px solid ${bubbleBorder}` : `1px solid ${bubbleBorder}`,
                        }}>
                          <div style={{
                            fontSize: 10,
                            fontWeight: 700,
                            marginBottom: 4,
                            color: bubbleBorder,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            textAlign: isRightSide ? 'right' : 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            justifyContent: isRightSide ? 'flex-end' : 'flex-start'
                          }}>
                            {msg.type !== 'me' && msg.sentiment === 'positive' && <ThumbsUp size={10} />}
                            {msg.type !== 'me' && msg.sentiment === 'negative' && <ThumbsDown size={10} />}
                            {msg.sender}
                          </div>
                          {/* Show typing animation for AI messages that are marked as typing */}
                          {msg.type === 'agent' && msg.isTyping ? (
                            <TypewriterText text={msg.text} />
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 10,
                        color: 'rgba(212, 175, 104, 0.4)',
                        marginTop: 6,
                        marginRight: isRightSide ? 52 : 0,
                        marginLeft: isRightSide ? 0 : 52,
                        fontFamily: 'monospace'
                      }}>
                        {msg.time}
                      </div>
                    </>
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

          {/* INPUT AREA */}
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: 800,
            zIndex: 2
          }}>
            <div className="interactive-btn" style={{
              background: 'linear-gradient(135deg, rgba(74, 47, 30, 0.95) 0%, rgba(42, 24, 16, 0.95) 100%)',
              borderRadius: 30,
              border: isInputFocused ? `1px solid ${colors.gold}` : `1px solid ${colors.goldDim}`,
              display: 'flex',
              alignItems: 'center',
              padding: '8px 8px 8px 24px',
              backdropFilter: 'blur(20px)',
              boxShadow: isInputFocused ? `0 0 30px ${colors.goldDim}` : '0 10px 40px rgba(0,0,0,0.5)',
              transform: isInputFocused ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.4s ease'
            }}>
              <input
                value={inputText}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isConnected ? "Pitch your idea... (AI-powered analysis)" : "Pitch your idea... (Offline simulation)"}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: colors.textMain,
                  fontSize: 15,
                  outline: 'none',
                  caretColor: colors.gold,
                  minHeight: '24px'
                }}
                disabled={isMeetingEnded || isPaused || isOnBreak}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleSendMessage}
                  className="interactive-btn"
                  disabled={!inputText.trim() || isMeetingEnded || isPaused || isOnBreak}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: colors.gold,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1A120E',
                    boxShadow: `0 4px 15px ${colors.goldDim}`,
                    opacity: (!inputText.trim() || isMeetingEnded || isPaused || isOnBreak) ? 0.5 : 1,
                    cursor: (!inputText.trim() || isMeetingEnded || isPaused || isOnBreak) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Send size={18} fill="currentColor" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>

            {/* Connection Status */}
            {!isConnected && (
              <div style={{
                textAlign: 'center',
                marginTop: 8,
                fontSize: 11,
                color: colors.gold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: 0.8
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.gold, animation: 'pulseSlow 1s infinite' }} />
                OFFLINE MODE • LOCAL ENVIRONMENT ACTIVE
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPitchRoom;