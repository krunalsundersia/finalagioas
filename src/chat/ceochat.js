import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, PhoneOff, Users, Hexagon, Clock, Timer, 
  PauseCircle, Play, Smile, AlertTriangle, CheckCircle, Info,
  Plus, Trash2, X, ChevronLeft, ChevronRight, FileText, FileBarChart, 
  Download, RefreshCcw, Star, MessageSquare, Edit3, HelpCircle, Coffee,
  TrendingUp, Activity, Lock, MessageSquarePlus, Wifi, Server,
  Zap, BarChart2, PieChart, Layers, Globe, Shield, Briefcase, 
  Cpu, Radio, Battery, Signal, Database, Grid, Crown, Gem, Feather,
  Target, Radar, Brain, Scroll, Tag, Activity as PulseIcon, ThumbsUp, ThumbsDown
} from 'lucide-react';

// --- CONFIGURATION (UPGRADED FOR BACKEND) ---
const API_URL = "http://localhost:8000/api/v1"; // UPGRADED: Correct backend URL
const WS_URL = "ws://localhost:8000/ws";

// USER CONTEXT
const USER_NAME = "Kunal Sundersia"; 
const USER_PROFILE_IMG = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop"; 
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3062/3062634.png"; 

// --- UTILITIES ---
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// --- ASSETS ---
const CUSTOMER_IMGS = {
    1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", 
    2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", 
    3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", 
    4: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop", 
    5: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", 
    6: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"  
};

// ✅ UPGRADED COLORS - PREMIUM GOLD THEME FROM VCCHAT
const colors = { 
    gold: '#D4AF37',       // Metallic Gold Leaf
    goldDim: '#8A6D3B',    // Burnished Bronze
    goldMid: '#AF9462',    // Satin Brass
    goldBright: '#F9E5BC',  // Champagne Highlight
    goldGrad: 'linear-gradient(135deg, #D4AF37 0%, #AF9462 50%, #8A6D3B 100%)',
    textMain: '#F9E5BC',
    textSecondary: '#A68A64', // Burnished Brass
    textDim: '#5E4F40',    // Dark Umber
    border: 'rgba(212, 175, 104, 0.2)', // Metallic Inlay
    bgApp: '#080503',      // Obsidian Wood
    bgSidebar: '#120C08',  // Deep Walnut
    bgCard: '#1A120E',     // Polished Oak
    bgInput: '#050403',    // Charcoal Grain
    chatShadow: 'rgba(212, 175, 55, 0.12)', // The Golden Halo
    danger: '#DC3545'      // For terminate/danger actions
};

// ✅ UPGRADED STYLES - PREMIUM TYPOGRAPHY & ANIMATIONS WITH POIRET ONE FOR CHAT
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Montserrat:wght@300;400;500;600;700&family=Poiret+One&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg-app: #080503;
    --bg-sidebar: #120C08;
    --bg-card: #1A120E;
    --bg-input: #050403;
    --text-heading: #F9E5BC;
    --font-header: 'Playfair Display', serif;
    --font-body: 'Montserrat', sans-serif;
    --font-chat: 'Poiret One', cursive;
    --font-topic: 'Cormorant Garamond', serif;
    
    /* THE GOLDEN SHADOW ENGINE */
    --chat-glow: radial-gradient(
      circle at 50% 50%, 
      rgba(212, 175, 55, 0.12) 0%, 
      rgba(8, 5, 3, 1) 85%
    );

    --gold-grad: linear-gradient(135deg, #8A6D3B 0%, #D4AF37 40%, #F9E5BC 50%, #D4AF37 60%, #8A6D3B 100%);
  }

  /* ✅ GLOBAL TYPOGRAPHY UPGRADE */
  * {
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }

  /* ✅ PREMIUM ETCHED HEADINGS - PLAYFAIR DISPLAY FOR MAXIMUM LUXURY */
  h1, h2, h3, .section-title, .sidebar-title, .header-text {
    font-family: var(--font-header) !important;
    color: var(--text-heading) !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 3px !important;
  }

  /* ✅ TOPIC & SESSION TITLES - CORMORANT GARAMOND FOR ELEGANCE */
  .topic-title, .session-title, .metric-label {
    font-family: var(--font-topic) !important;
    font-weight: 600 !important;
    letter-spacing: 1.5px !important;
  }

  /* ✅ CHAT MESSAGES - POIRET ONE AS REQUESTED */
  .chat-message-text {
    font-family: var(--font-chat) !important;
    font-size: 16px !important;
    line-height: 1.7 !important;
    letter-spacing: 0.5px !important;
  }

  /* ✅ NAVBAR HEADING - PREMIUM STYLING */
  .navbar-heading {
    font-family: var(--font-header) !important;
    font-size: 20px !important;
    font-weight: 800 !important;
    letter-spacing: 4px !important;
    background: var(--gold-grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-transform: uppercase;
  }
  
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-app); }
  ::-webkit-scrollbar-thumb { background: #8A6D3B; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }

  @keyframes neuralPulse { 
    0%, 100% { transform: scale(1); opacity: 0.3; } 
    50% { transform: scale(1.15); opacity: 0.9; box-shadow: 0 0 15px #8A6D3B; } 
  }
  
  @keyframes msgEnter { 
    0% { opacity: 0; transform: translateY(10px); } 
    100% { opacity: 1; transform: translateY(0); } 
  }

  @keyframes slideInLeft {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    0% { opacity: 0; transform: translateX(20px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes pulseSlow {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.05);
    }
  }

  @keyframes blurIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(20px);
    }
  }

  @keyframes scaleUp {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .creative-chat-bg {
    background: var(--bg-app);
    background-image: var(--chat-glow);
    position: relative;
    overflow: hidden;
  }

  .creative-chat-bg::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(138, 109, 59, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .interactive-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .interactive-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .interactive-btn:hover::before {
    width: 300px;
    height: 300px;
  }

  .interactive-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  }

  .interactive-btn:active {
    transform: translateY(0);
  }

  .glass-card {
    background: rgba(26, 18, 14, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(212, 175, 104, 0.2);
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  .gold-shimmer {
    background: linear-gradient(
      90deg,
      rgba(138, 109, 59, 0.3) 0%,
      rgba(212, 175, 55, 0.6) 50%,
      rgba(138, 109, 59, 0.3) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 3s infinite linear;
  }
`;

// ✅ TYPEWRITER EFFECT COMPONENT
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayedText}</span>;
};

// ✅ THINKING BUBBLE COMPONENT
const ThinkingBubble = ({ member }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, animation: 'slideInLeft 0.4s ease' }}>
    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `2px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textSecondary, fontSize: 12, fontWeight: 700 }}>
      AI
    </div>
    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 24px', borderRadius: '16px 16px 16px 2px', border: `1px solid ${colors.border}`, backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: colors.goldDim, animation: 'neuralPulse 1.4s infinite', animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  </div>
);

// ✅ FORMAT TIME UTILITY
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// ✅ SIDEBAR COMPONENTS WITH PREMIUM STYLING
const VisionaryIndex = ({ value }) => (
    <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VISIONARY INDEX</span>
            <span style={{ color: value >= 70 ? colors.goldMid : value <= 30 ? colors.danger : colors.textSecondary, fontWeight: 700, fontSize: 12 }}>{value}%</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div className="gold-shimmer" style={{ width: `${value}%`, height: '100%', background: colors.goldDim, transition: 'width 1s ease' }}></div>
        </div>
    </div>
);

const StrategicRadar = ({ metrics }) => {
    const size = 100;
    const center = size / 2;
    const radius = 35;
    
    const values = metrics ? [
        metrics.visionary / 100,
        metrics.strategy / 100,
        metrics.critical / 100,
        metrics.persuasion / 100,
        metrics.marketFit / 100
    ] : [0.5, 0.5, 0.5, 0.5, 0.5];
    
    const points = values.map((val, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return {
            x: center + radius * val * Math.cos(angle),
            y: center + radius * val * Math.sin(angle)
        };
    });
    
    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Radar size={14} color={colors.goldDim} />
                <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>STRATEGIC RADAR</span>
            </div>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
                    <polygon 
                        key={idx}
                        points={values.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                            return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(212, 175, 104, 0.15)"
                        strokeWidth="0.5"
                    />
                ))}
                {values.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                    return (
                        <line 
                            key={i}
                            x1={center}
                            y1={center}
                            x2={center + radius * Math.cos(angle)}
                            y2={center + radius * Math.sin(angle)}
                            stroke="rgba(212, 175, 104, 0.2)"
                            strokeWidth="0.5"
                        />
                    );
                })}
                <polygon points={polygonPoints} fill="rgba(212, 175, 55, 0.15)" stroke={colors.goldDim} strokeWidth="2" />
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill={colors.goldDim} stroke={colors.goldBright} strokeWidth="1" />
                ))}
            </svg>
        </div>
    );
};

const PolarityControl = ({ value }) => (
    <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Target size={14} color={colors.goldDim} />
            <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>POLARITY</span>
        </div>
        <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 20, marginBottom: 8 }}>
            <div style={{ 
                position: 'absolute', 
                left: `${value}%`, 
                top: '50%', 
                transform: 'translate(-50%, -50%)',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: colors.goldDim,
                border: `2px solid ${colors.goldBright}`,
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.6)'
            }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: colors.textDim, marginTop: 8 }}>
            <span>DEFENSIVE</span>
            <span>ASSERTIVE</span>
        </div>
    </div>
);

const FutureProjection = ({ proj }) => (
    <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp size={14} color={colors.goldDim} />
            <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>FUTURE PROJECTION</span>
        </div>
        <div style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: colors.goldMid, 
            fontFamily: 'monospace',
            textShadow: `0 0 20px rgba(212, 175, 55, 0.4)`
        }}>
            +{proj}%
        </div>
    </div>
);

const GrowthVelocity = ({ value }) => (
    <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Zap size={14} color={colors.goldDim} />
            <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>GROWTH VELOCITY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div className="gold-shimmer" style={{ width: `${value}%`, height: '100%', background: colors.goldDim, transition: 'width 0.8s ease' }}></div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: colors.goldDim }}>{value}%</span>
        </div>
    </div>
);

const ValueConcentration = ({ value }) => {
    const size = 80;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <PieChart size={14} color={colors.goldDim} />
                <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VALUE CONCENTRATION</span>
            </div>
            <svg width={size} height={size} style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }}>
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                <circle 
                    cx={size/2} 
                    cy={size/2} 
                    r={radius} 
                    fill="none" 
                    stroke={colors.goldDim} 
                    strokeWidth="5" 
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" fill={colors.goldBright} fontSize="18" fontWeight="700">{value}%</text>
            </svg>
        </div>
    );
};

const PersuasionImpact = ({ value }) => (
    <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Brain size={14} color={colors.goldDim} />
            <span className="metric-label" style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>PERSUASION IMPACT</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i} 
                    style={{ 
                        flex: 1, 
                        height: 32, 
                        background: i < Math.floor(value / 20) ? colors.goldDim : 'rgba(255,255,255,0.05)', 
                        borderRadius: 2,
                        transition: 'background 0.3s ease',
                        boxShadow: i < Math.floor(value / 20) ? '0 0 10px rgba(212, 175, 55, 0.4)' : 'none'
                    }} 
                />
            ))}
        </div>
    </div>
);

// ✅ MAIN COMPONENT
const CEODashboard = () => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([
    {
      id: generateUUID(),
      text: "Welcome to your executive coaching session. I'm here to help you navigate strategic challenges and leadership decisions. What's on your mind today?",
      sender: "CEO Coach",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'ai',
      isTyping: false
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [boardMetrics, setBoardMetrics] = useState({
    visionary: 65,
    strategy: 72,
    critical: 58,
    persuasion: 80,
    marketFit: 68
  });

  const chatEndRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused && !isOnBreak) {
        setSessionTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isOnBreak]);

  useEffect(() => {
    if (isOnBreak && breakTimeLeft > 0) {
      const timer = setInterval(() => {
        setBreakTimeLeft(prev => {
          if (prev <= 1) {
            setIsOnBreak(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOnBreak, breakTimeLeft]);

  // --- HANDLERS ---
  const handleSendMessage = async () => {
    if (!inputText.trim() || isThinking || isPaused || isOnBreak) return;

    const userMsg = {
      id: generateUUID(),
      text: inputText,
      sender: USER_NAME,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'user',
      isTyping: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      const aiResponses = [
        "That's an excellent question. Let me share my perspective on this strategic challenge...",
        "I understand the complexity of this situation. Here's how successful CEOs typically approach this...",
        "This is a critical decision point. Let's break down the key factors you should consider...",
        "Great insight. Building on that thought, have you considered the long-term implications...",
        "Leadership often requires making tough calls. What's your gut telling you about this?"
      ];

      const aiMsg = {
        id: generateUUID(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "CEO Coach",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'ai',
        isTyping: true
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);

      // Update metrics dynamically
      setBoardMetrics(prev => ({
        visionary: Math.min(100, prev.visionary + Math.random() * 5),
        strategy: Math.min(100, prev.strategy + Math.random() * 3),
        critical: Math.min(100, prev.critical + Math.random() * 4),
        persuasion: Math.min(100, prev.persuasion + Math.random() * 4),
        marketFit: Math.min(100, prev.marketFit + Math.random() * 3)
      }));
    }, 2000 + Math.random() * 1000);
  };

  const startBreak = (minutes) => {
    setBreakTimeLeft(minutes * 60);
    setIsOnBreak(true);
    setIsBreakModalOpen(false);
  };

  return (
    <div className="creative-chat-bg" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* ✅ UPGRADED NAVBAR WITH IMAGE TAG AND CENTER HEADING */}
      <div style={{ 
        background: colors.bgSidebar, 
        borderBottom: `1px solid ${colors.border}`, 
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 100
      }}>
        {/* LEFT - LOGO IMAGE TAG + SIDEBAR TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="interactive-btn"
            style={{
              padding: '8px 12px',
              background: isSidebarOpen ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isSidebarOpen ? colors.goldDim : colors.border}`,
              borderRadius: 6,
              color: isSidebarOpen ? colors.goldDim : colors.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <Activity size={16} />
            <span>Board</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img 
              src={LOGO_URL} 
              alt="Agios Logo" 
              style={{ 
                width: 40, 
                height: 40, 
                objectFit: 'contain',
                filter: 'brightness(0) saturate(100%) invert(75%) sepia(18%) saturate(1015%) hue-rotate(359deg) brightness(94%) contrast(88%)'
              }} 
            />
            <div style={{ 
              fontSize: 14, 
              color: colors.textSecondary, 
              fontFamily: 'var(--font-topic)',
              fontWeight: 500,
              letterSpacing: '1px'
            }}>
              AGIOS
            </div>
          </div>
        </div>

        {/* CENTER - HEADING */}
        <div className="navbar-heading">
          CEO EXECUTIVE COACHING
        </div>

        {/* RIGHT - SESSION CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            padding: '8px 16px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: 20,
            border: `1px solid ${colors.border}`
          }}>
            <Clock size={16} color={colors.goldDim} />
            <span style={{ 
              fontSize: 14, 
              color: colors.goldDim, 
              fontFamily: 'monospace',
              fontWeight: 600 
            }}>
              {formatTime(sessionTime)}
            </span>
          </div>

          <button 
            onClick={() => setIsBreakModalOpen(true)}
            className="interactive-btn"
            style={{
              padding: '8px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${colors.border}`,
              borderRadius: 20,
              color: colors.textMain,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Coffee size={16} />
            <span>Break</span>
          </button>

          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="interactive-btn"
            style={{
              padding: '8px 20px',
              background: isPaused ? colors.danger : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isPaused ? colors.danger : colors.border}`,
              borderRadius: 20,
              color: isPaused ? '#fff' : colors.textMain,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            {isPaused ? <Play size={16} /> : <PauseCircle size={16} />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
        </div>
      </div>

      {/* ✅ MAIN CONTENT AREA WITH SIDEBAR */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* ✅ SIDEBAR WITH GOLDEN GLOW AND ENHANCED VISUALS */}
        <div style={{ 
          width: isSidebarOpen ? 340 : 0, 
          background: `linear-gradient(180deg, ${colors.bgSidebar} 0%, rgba(18, 12, 8, 0.95) 100%)`,
          borderRight: `1px solid ${colors.border}`, 
          padding: isSidebarOpen ? '24px' : '0',
          overflowY: 'auto', 
          overflowX: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          boxShadow: isSidebarOpen ? `0 0 60px rgba(212, 175, 55, 0.15)` : 'none'
        }}>
          {isSidebarOpen && (
            <>
              {/* Sidebar Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 32,
                paddingBottom: 16,
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: colors.goldGrad,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
                  }}>
                    <Activity size={18} color={colors.bgApp} />
                  </div>
                  <span className="section-title" style={{ fontSize: 14, color: colors.textMain }}>AGIOS BOARD</span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)} 
                  className="interactive-btn" 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: colors.textDim, 
                    cursor: 'pointer',
                    padding: 4
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* All Metrics */}
              <VisionaryIndex value={boardMetrics.visionary} />
              <StrategicRadar metrics={boardMetrics} />
              <PolarityControl value={boardMetrics.strategy} />
              <FutureProjection proj={Math.round(boardMetrics.critical + 5)} />
              <GrowthVelocity value={boardMetrics.marketFit} />
              <ValueConcentration value={Math.round((boardMetrics.visionary + boardMetrics.strategy + boardMetrics.critical + boardMetrics.persuasion + boardMetrics.marketFit) / 5)} />
              <PersuasionImpact value={boardMetrics.persuasion} />
            </>
          )}
        </div>

        {/* ✅ CHAT AREA WITH GOLDEN AMBIENT GLOW */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative', 
          zIndex: 1,
          background: `radial-gradient(ellipse at top, rgba(212, 175, 55, 0.03) 0%, ${colors.bgApp} 60%)`
        }}>
          
          {/* ✅ CHAT MESSAGES AREA WITH GOLDEN GLOW */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '32px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            position: 'relative'
          }}>
            {/* Floating golden particles effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.04) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(138, 109, 59, 0.04) 0%, transparent 50%)',
              zIndex: 0
            }} />
            {messages.map(msg => 
                msg.type === 'user' ? (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 12, animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', zIndex: 1 }}>
                        <div style={{ maxWidth: '70%' }}>
                            <div style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 4, textAlign: 'right', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {msg.sender}
                            </div>
                            <div className="interactive-btn" style={{ 
                              background: colors.goldGrad,
                              padding: '16px 22px', 
                              borderRadius: '16px 16px 2px 16px',
                              boxShadow: `0 8px 32px 0 rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)`,
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: '100%',
                                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                                  pointerEvents: 'none'
                                }} />
                                <div className="chat-message-text" style={{ color: colors.bgApp, fontWeight: 500, position: 'relative', zIndex: 1 }}>
                                  {msg.text}
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(8, 5, 3, 0.5)', marginTop: 8, fontFamily: 'monospace', textAlign: 'right', position: 'relative', zIndex: 1 }}>{msg.time}</div>
                            </div>
                        </div>
                        <img 
                          src={USER_PROFILE_IMG} 
                          alt="User" 
                          style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            border: `2px solid ${colors.goldDim}`,
                            objectFit: 'cover',
                            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                          }} 
                        />
                    </div>
                ) : (
                    <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-end', gap: 12, animation: 'slideInLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          background: 'rgba(212, 175, 55, 0.08)', 
                          border: `2px solid ${colors.border}`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: colors.goldDim, 
                          fontSize: 12, 
                          fontWeight: 700,
                          boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)'
                        }}>
                          AI
                        </div>
                        <div style={{ maxWidth: '70%' }}>
                            <div style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {msg.sender}
                            </div>
                            <div className="interactive-btn" style={{ 
                              background: 'rgba(26, 18, 14, 0.6)', 
                              padding: '16px 22px', 
                              borderRadius: '16px 16px 16px 2px', 
                              border: `1px solid ${colors.border}`, 
                              borderLeft: `3px solid ${colors.goldDim}`,
                              backdropFilter: 'blur(20px)',
                              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.1)',
                              position: 'relative'
                            }}>
                                <div style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, transparent 100%)',
                                  pointerEvents: 'none',
                                  borderRadius: 'inherit'
                                }} />
                                <div className="chat-message-text" style={{ color: colors.textMain, position: 'relative', zIndex: 1 }}>
                                  {msg.isTyping ? <TypewriterText text={msg.text} /> : msg.text}
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(212, 175, 104, 0.4)', marginTop: 8, fontFamily: 'monospace', position: 'relative', zIndex: 1 }}>{msg.time}</div>
                            </div>
                        </div>
                    </div>
                )
            )}
            
            {isThinking && <ThinkingBubble member={{ id: 1, name: "CEO Coach" }} />}
            
            <div ref={chatEndRef} />
        </div>

        {/* ✅ INPUT AREA WITH GOLDEN GLOW */}
        <div style={{ 
          padding: '20px 48px',
          background: `linear-gradient(180deg, transparent 0%, rgba(8, 5, 3, 0.6) 50%)`,
          borderTop: `1px solid ${colors.border}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', width: 'min(900px, 100%)' }}>
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={isOnBreak ? "Session on break..." : isPaused ? "Session paused..." : "Share your challenge..."}
                disabled={isThinking || isOnBreak || isPaused}
                style={{
                  flex: 1,
                  height: 52,
                  background: colors.bgInput,
                  border: isInputFocused ? `1.5px solid ${colors.goldDim}` : `1px solid ${colors.border}`,
                  color: colors.textMain,
                  padding: '14px 24px',
                  borderRadius: 30,
                  fontSize: 15,
                  fontFamily: 'var(--font-chat)',
                  outline: 'none',
                  transition: 'all 0.4s ease',
                  boxShadow: isInputFocused ? `0 0 30px rgba(212, 175, 55, 0.25), inset 0 0 20px rgba(212, 175, 55, 0.05)` : 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
                  caretColor: colors.goldDim
                }}
              />

              <button
                onClick={handleSendMessage}
                disabled={isThinking || !inputText.trim() || isOnBreak || isPaused}
                className="interactive-btn"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: (isThinking || !inputText.trim() || isOnBreak || isPaused) 
                    ? 'rgba(212, 175, 55, 0.2)' 
                    : colors.goldGrad,
                  border: 'none',
                  color: colors.bgApp,
                  fontWeight: 700,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (isThinking || !inputText.trim() || isOnBreak || isPaused) ? 'not-allowed' : 'pointer',
                  boxShadow: (isThinking || !inputText.trim() || isOnBreak || isPaused)
                    ? 'none'
                    : `0 4px 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)`
                }}
              >
                <Send size={20} fill="currentColor" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ BREAK MODAL */}
      {isBreakModalOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blurIn 0.3s forwards' }}>
            <div style={{ width: 400, background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 30, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: `0 0 50px rgba(0, 0, 0, 0.5)`, animation: 'scaleUp 0.4s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: 10 }}>
                    <h2 className="topic-title" style={{ margin: 0, fontSize: 18, color: colors.textMain }}>Take a Break</h2>
                    <button onClick={() => setIsBreakModalOpen(false)} className="interactive-btn" style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {[5, 10, 30].map(m => (
                      <button 
                        key={m} 
                        onClick={() => startBreak(m)} 
                        className="interactive-btn" 
                        style={{ 
                          padding: '12px 0', 
                          background: 'rgba(255,255,255,0.05)', 
                          border: `1px solid ${colors.border}`, 
                          borderRadius: 6, 
                          color: colors.textMain, 
                          fontWeight: 700,
                          fontSize: 14
                        }}
                      >
                        {m} Min
                      </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* ✅ BREAK OVERLAY */}
      {isOnBreak && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'blurIn 0.5s ease' }}>
            <Coffee size={64} color={colors.goldDim} style={{ marginBottom: 20, animation: 'pulseSlow 2s infinite' }} />
            <h1 style={{ fontSize: 32, letterSpacing: '0.1em', marginBottom: 8, color: colors.textMain, fontFamily: 'var(--font-header)', fontWeight: 600 }}>SESSION ON BREAK</h1>
            <div style={{ fontSize: 64, fontFamily: 'monospace', color: colors.goldDim, fontWeight: 700, marginBottom: 32 }}>{formatTime(breakTimeLeft)}</div>
            <button onClick={() => setIsOnBreak(false)} className="interactive-btn" style={{ padding: '14px 40px', background: colors.goldDim, border: 'none', borderRadius: 50, color: colors.bgApp, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play size={20} fill={colors.bgApp} /> RESUME NOW
            </button>
        </div>
      )}

      {/* ✅ SESSION PAUSED OVERLAY - EXACT REPLICA OF UPLOADED IMAGE */}
      {isPaused && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(0, 0, 0, 0.92)', 
          backdropFilter: 'blur(30px)', 
          zIndex: 4000, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          animation: 'blurIn 0.3s forwards',
          backgroundImage: 'linear-gradient(135deg, rgba(20, 15, 10, 0.3) 0%, rgba(0, 0, 0, 0.95) 100%)'
        }}>
            <div style={{ 
              transform: 'scale(1)', 
              animation: 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              textAlign: 'center'
            }}>
                {/* Heading */}
                <h1 style={{ 
                  fontSize: 42, 
                  letterSpacing: '0.15em', 
                  textAlign: 'center', 
                  marginBottom: 16, 
                  color: colors.textMain, 
                  fontFamily: 'var(--font-header)', 
                  fontWeight: 400,
                  textTransform: 'uppercase'
                }}>
                  SESSION PAUSED
                </h1>

                {/* Subtitle */}
                <p style={{ 
                  color: colors.goldDim, 
                  marginBottom: 48, 
                  textAlign: 'center', 
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  fontWeight: 400,
                  letterSpacing: '0.05em'
                }}>
                  The environment is secured. Board members are on standby.
                </p>

                {/* Resume Button */}
                <button 
                  onClick={() => setIsPaused(false)} 
                  className="interactive-btn" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12, 
                    padding: '16px 48px', 
                    background: colors.goldDim, 
                    border: 'none', 
                    borderRadius: 8, 
                    fontWeight: 700, 
                    fontSize: 15, 
                    margin: '0 auto', 
                    letterSpacing: '0.1em', 
                    color: colors.bgApp,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(138, 109, 59, 0.4)'
                  }}
                >
                    <Play size={20} fill={colors.bgApp} /> 
                    <span>RESUME SESSION</span>
                </button>
            </div>
        </div>
      )}
    </div></div>
  );
};

export default CEODashboard;