// App.js - COMPLETE UPGRADED CEO 3D - BACKEND INTEGRATED
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFBX, useAnimations, OrbitControls, useGLTF, Environment, useProgress } from '@react-three/drei';
import {
  Video, Mic, Wifi, Check,
  Hexagon, MicOff, PhoneOff, Send,
  FileText, Volume2, VolumeX, X, Info, AlertTriangle, Play,
  FastForward, Download, BarChart, ShieldCheck, ThumbsUp, ThumbsDown, Clock,
  User, Settings, FilePlus, ChevronDown, Lock, Maximize, History, Pencil, Activity,
  TrendingUp, Brain, Target, Zap, ZapOff, Users, Globe, PieChart, Layers, Crosshair
} from 'lucide-react';

// --- BACKEND API URL (CORRECTED) ---
const BACKEND_API_URL = "http://localhost:8000/api/v1";

// --- TTS VOICES CONFIGURATION ---
const TTS_VOICES = [
  { name: 'Microsoft David - English (United States)', gender: 'male', lang: 'en-US' },
  { name: 'Microsoft Mark - English (United States)', gender: 'male', lang: 'en-US' },
  { name: 'Google US English Male', gender: 'male', lang: 'en-US' },
  { name: 'Microsoft Zira - English (United States)', gender: 'female', lang: 'en-US' },
  { name: 'Google US English Female', gender: 'female', lang: 'en-US' }
];

// --- 0. ANIMATION DETECTION LOGIC FOR CEO (ENHANCED) ---
const detectCeoAnimation = (text) => {
  if (!text) return "Idle";
  const lower = text.toLowerCase();

  // Strong directives - Force animation
  if (lower.includes('must') || lower.includes('have to') || lower.includes('need to') ||
    lower.includes('critical') || lower.includes('essential') || lower.includes('imperative')) {
    return "Force";
  }

  // Celebration/Approval - Clap animation  
  if (lower.includes('excellent') || lower.includes('brilliant') || lower.includes('perfect') ||
    lower.includes('exactly') || lower.includes('great') || lower.includes('congratulations')) {
    return "Clap";
  }

  // Empathy/Concern - OhNo animation
  if (lower.includes('understand the pressure') || lower.includes('i hear that') ||
    lower.includes("that's heavy") || lower.includes('difficult') || lower.includes('tough')) {
    return "OhNo";
  }

  // Humor - Laugh animation
  if (lower.includes('haha') || lower.includes('funny') || lower.includes('laugh') ||
    lower.includes('reminds me of') || lower.includes('imagine')) {
    return "Laugh";
  }

  // Deep listening - Listen animation
  if (lower.includes('tell me more') || lower.includes('help me understand') ||
    lower.includes('interesting') || lower.includes('what do you mean')) {
    return "Listen";
  }

  // Strong emphasis - BangTable animation
  if (lower.includes('wake up') || lower.includes('reality') || lower.includes('truth is') ||
    lower.includes("here's what") || lower.includes('ridiculous') || lower.includes('dammit')) {
    return "BangTable";
  }

  // Default to Talk for normal conversation
  return "Talk";
};

// --- 1. BACKGROUNDS ---

// Original Room
const Background = () => {
  const { scene } = useGLTF("/vcs.glb");
  return <primitive object={scene} scale={1} position={[1, -1, 0]} rotation={[0, 3.875, 0]} />;
};

// CEO Room 
const CeoBackground = () => {
  const { scene } = useGLTF("/ceo2.glb");

  const cleanScene = useMemo(() => {
    const clonedScene = scene.clone();
    clonedScene.traverse((child) => {
      if (child.isSkinnedMesh || (child.isMesh && child.name.toLowerCase().includes('body'))) {
        child.visible = false;
        child.frustumCulled = false;
        child.scale.set(0, 0, 0);
      }
    });
    return clonedScene;
  }, [scene]);

  return <primitive object={cleanScene} scale={1} position={[0.4, 0.35, -2.9]} rotation={[0, 4.7, 0]} />;
};

// --- 2. CHARACTER CONTROLLERS ---

// CEO Controller
const CeoController = ({ animation }) => {
  const groupRef = useRef();

  const base = useFBX("/ceoidel.fbx");
  const talkAnim = useFBX("/ceotalk.fbx");
  const bangAnim = useFBX("/ceobangingfis.fbx");
  const clapAnim = useFBX("/ceoclap.fbx");
  const laughAnim = useFBX("/ceolaugh.fbx");
  const ohNoAnim = useFBX("/ceoohno.fbx");
  const forceAnim = useFBX("/ceouhaveto.fbx");
  const listenAnim = useFBX("/ceoulisten.fbx");

  useEffect(() => {
    [base, talkAnim, bangAnim, clapAnim, laughAnim, ohNoAnim, forceAnim, listenAnim].forEach(model => {
      model.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    const addClip = (animObj, name) => {
      if (animObj.animations[0]) {
        const clip = animObj.animations[0].clone();
        clip.name = name;
        animations.push(clip);
      }
    };

    addClip(base, "Idle");
    addClip(talkAnim, "Talk");
    addClip(bangAnim, "BangTable");
    addClip(clapAnim, "Clap");
    addClip(laughAnim, "Laugh");
    addClip(ohNoAnim, "OhNo");
    addClip(forceAnim, "Force");
    addClip(listenAnim, "Listen");

    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (actions) {
      const currentAnim = animation || "Idle";
      const action = actions[currentAnim];

      if (action) {
        Object.keys(actions).forEach((key) => {
          if (key !== currentAnim) {
            actions[key].fadeOut(0.6);
          }
        });

        if (!action.isRunning()) {
          action.reset().fadeIn(0.6).play();
        } else {
          action.fadeIn(0.6).play();
        }
      }
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.01} position={[0, -1, 0]} rotation={[0, 0, 0]} /></group>;
};

// --- 3. LOADING SPINNER ---
const Loader = () => {
  const { active } = useProgress();
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000000', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        .loader { position: relative; width: 160px; height: 160px; transform-style: preserve-3d; perspective: 1200px; }
        .node { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; background: #ffaa00; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 20px #ffaa00, 0 0 40px rgba(255, 170, 0, 0.6); animation: nodePulse 1.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; }
        .thread { position: absolute; background: linear-gradient(90deg, transparent, rgba(255, 170, 0, 0.8), transparent); box-shadow: 0 0 10px rgba(255, 170, 0, 0.5); transform-origin: center; }
        .t1 { width: 100%; height: 2px; top: 30%; left: 0; animation:  weave1 2s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
        .t2 { width: 2px; height: 100%; top: 0; left: 70%; animation: weave2 2.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; }
        .t3 { width: 100%; height: 2px; bottom: 30%; left: 0; animation: weave3 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite; }
        .t4 { width: 2px; height: 100%; top: 0; left: 30%; animation: weave4 2.6s cubic-bezier(0.36, 0, 0.66, -0.56) infinite; }
        @keyframes nodePulse { 0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px #ffaa00, 0 0 40px rgba(255, 170, 0, 0.6); } 50% { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 30px #ffaa00, 0 0 60px rgba(255, 170, 0, 0.8); } }
        @keyframes weave1 { 0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg); opacity: 0.8; } 50% { transform: translateY(40px) rotateX(60deg) rotateZ(20deg); opacity: 1; } 100% { transform: translateY(0) rotateX(0deg) rotateZ(0deg); opacity: 0.8; } }
        @keyframes weave2 { 0% { transform: translateX(0) rotateY(0deg) rotateZ(0deg); opacity: 0.8; } 50% { transform: translateX(-40px) rotateY(60deg) rotateZ(-20deg); opacity: 1; } 100% { transform: translateX(0) rotateY(0deg) rotateZ(0deg); opacity: 0.8; } }
        @keyframes weave3 { 0% { transform: translateY(0) rotateX(0deg) rotateZ(0deg); opacity: 0.8; } 50% { transform: translateY(-40px) rotateX(-60deg) rotateZ(15deg); opacity: 1; } 100% { transform: translateY(0) rotateX(0deg) rotateZ(0deg); opacity: 0.8; } }
        @keyframes weave4 { 0% { transform: translateX(0) rotateY(0deg) rotateZ(0deg); opacity: 0.8; } 50% { transform: translateX(40px) rotateY(-60deg) rotateZ(-15deg); opacity: 1; } 100% { transform: translateX(0) rotateY(0deg) rotateZ(0deg); opacity: 0.8; } }
      `}</style>
      <div className="loader">
        <div className="thread t1"></div><div className="thread t2"></div><div className="thread t3"></div><div className="thread t4"></div><div className="node"></div>
      </div>
      <div style={{ position: 'absolute', bottom: '20%', color: '#ffaa00', fontFamily: 'monospace', letterSpacing: '0.1em' }}>INITIALIZING ENVIRONMENT...</div>
    </div>
  );
};

// --- 4. INVESTMENT BOARD COMPONENTS (NO UI CHANGES, JUST LIVE DATA) ---

const StrategicHealthRadar = ({ metrics }) => {
  const size = 180;
  const center = size / 2;
  const radius = size * 0.4;
  const keys = ["visionary", "strategy", "critical", "persuasion", "marketFit"];
  const labels = ["VISION", "STRAT", "DEPTH", "IMPACT", "MARKET"];

  const points = keys.map((key, i) => {
    const val = metrics[key] / 100;
    const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
    return {
      x: center + radius * val * Math.cos(angle),
      y: center + radius * val * Math.sin(angle),
    };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <Crosshair size={14} color="#D4AF68" />
        <span style={{ color: '#E8E0D5', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>STRATEGIC HEALTH RADAR</span>
      </div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
          <polygon
            key={idx}
            points={keys.map((_, i) => {
              const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
              return `${center + radius * scale * Math.cos(angle)},${center + radius * scale * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(212, 175, 104, 0.1)"
            strokeWidth="1"
          />
        ))}
        {keys.map((_, i) => {
          const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center} y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="rgba(212, 175, 104, 0.1)"
            />
          );
        })}
        <polygon
          points={polygonPoints}
          fill="rgba(212, 175, 104, 0.2)"
          stroke="#D4AF68"
          strokeWidth="2"
          style={{ transition: 'all 0.5s ease' }}
        />
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          const tx = center + (radius + 15) * Math.cos(angle);
          const ty = center + (radius + 15) * Math.sin(angle);
          return (
            <text key={i} x={tx} y={ty} fill="#9C8C74" fontSize="8" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const FutureProjection = ({ value, data }) => {
  const projected = Math.min(100, value + 5);
  const allData = [...data, projected];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={14} color="#D4AF68" />
          <span style={{ color: '#E8E0D5', fontSize: 11, fontWeight: 700 }}>FUTURE PROJECTION</span>
        </div>
        <span style={{ color: '#D4AF68', fontWeight: 'bold', fontSize: 12 }}>PROJ: {Math.round(projected)}%</span>
      </div>
      <div style={{ height: 60, background: 'rgba(0,0,0,0.3)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={`M0,${100 - data[0]} ${data.map((p, i) => `L${(i / (allData.length - 1)) * 100},${100 - p}`).join(' ')}`}
            fill="none" stroke="#D4AF68" strokeWidth="2" vectorEffect="non-scaling-stroke"
          />
          <line
            x1={(data.length - 1) / (allData.length - 1) * 100} y1={100 - data[data.length - 1]}
            x2="100" y2={100 - projected}
            stroke="#D4AF68" strokeWidth="2" strokeDasharray="4 2" vectorEffect="non-scaling-stroke"
          />
          <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF68" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D4AF68" stopOpacity="0" />
          </linearGradient>
          <path d={`M0,100 L0,${100 - data[0]} ${allData.map((p, i) => `L${(i / (allData.length - 1)) * 100},${100 - p}`).join(' ')} L100,100 Z`} fill="url(#projGrad)" />
        </svg>
      </div>
    </div>
  );
};

const ValueConcentration = ({ value }) => {
  const cells = Array.from({ length: 15 });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Layers size={14} color="#D4AF68" />
        <span style={{ color: '#E8E0D5', fontSize: 11, fontWeight: 700 }}>VALUE CONCENTRATION</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
        {cells.map((_, i) => {
          const base = (i + 1) / 15;
          const opacity = Math.min(1, base * (value / 100) + 0.05);
          return (
            <div key={i} style={{
              height: 12,
              background: `rgba(212, 175, 104, ${opacity})`,
              borderRadius: 2,
              boxShadow: opacity > 0.7 ? '0 0 6px rgba(212, 175, 104, 0.2)' : 'none',
              transition: 'background 0.8s ease'
            }} />
          );
        })}
      </div>
    </div>
  );
};

const GrowthVelocity = ({ value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Target size={14} color="#D4AF68" />
        <span style={{ color: '#E8E0D5', fontSize: 11, fontWeight: 700 }}>GROWTH VELOCITY</span>
      </div>
      <span style={{ color: '#D4AF68', fontWeight: 'bold', fontSize: 12 }}>{value}%</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 24, padding: '0 4px' }}>
      {[...Array(8)].map((_, i) => {
        const threshold = (i + 1) * 12.5;
        const isActive = value >= threshold;
        return (
          <div key={i} style={{
            flex: 1,
            height: `${15 + (i * 12)}%`,
            background: isActive ? '#D4AF68' : 'rgba(255,255,255,0.05)',
            borderRadius: '1px 1px 0 0',
            boxShadow: isActive ? '0 0 8px rgba(212, 175, 104, 0.3)' : 'none',
            transition: 'all 0.5s ease'
          }} />
        );
      })}
    </div>
  </div>
);

const InvestmentBoard = ({ onClose, metrics }) => {
  const getColor = (val) => {
    if (val >= 75) return '#5D7A58';
    if (val <= 25) return '#8A3A3A';
    return '#D4AF68';
  };

  return (
    <div style={{
      position: 'absolute', top: 80, right: 40, bottom: 80, width: 360,
      background: 'rgba(26, 18, 14, 0.95)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(196, 168, 111, 0.2)', borderRadius: 8,
      display: 'flex', flexDirection: 'column', zIndex: 90,
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)', animation: 'slideIn 0.3s ease-out'
    }}>
      <style>{`
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .board-content::-webkit-scrollbar { width: 4px; }
          .board-content::-webkit-scrollbar-track { background: transparent; }
          .board-content::-webkit-scrollbar-thumb { background: rgba(212, 175, 104, 0.2); border-radius: 2px; }
        `}</style>

      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} color="#D4AF68" />
          <span style={{ color: '#D4AF68', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>AGIOAS BOARD</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C74' }}><X size={14} /></button>
      </div>

      <div className="board-content" style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 28, overflowY: 'auto' }}>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#E8E0D5', fontSize: 12, fontWeight: 700 }}>VISIONARY INDEX</span>
            <span style={{ color: getColor(metrics.visionary), fontWeight: 'bold' }}>{metrics.visionary}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${metrics.visionary}%`, height: '100%', background: '#D4AF68', boxShadow: '0 0 12px #D4AF68', transition: 'width 1s ease' }} />
          </div>
        </div>

        <StrategicHealthRadar metrics={metrics} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9C8C74', fontWeight: 700 }}>
            <span>EMOTIONAL</span>
            <span style={{ color: '#E8E0D5', fontSize: 11 }}>RESPONSE POLARITY</span>
            <span>STRATEGIC</span>
          </div>
          <div style={{ position: 'relative', height: 2, background: 'rgba(212, 175, 104, 0.2)', borderRadius: 1 }}>
            <div style={{
              position: 'absolute', left: `${metrics.strategy}%`, top: '50%', transform: 'translate(-50%, -50%)',
              width: 10, height: 10, background: '#D4AF68', borderRadius: '50%', boxShadow: '0 0 10px #D4AF68', transition: 'left 0.8s ease'
            }} />
          </div>
        </div>

        <FutureProjection value={metrics.critical} data={[50, 55, 52, 58, 62]} />

        <GrowthVelocity value={metrics.marketFit} />

        <ValueConcentration value={metrics.persuasion} />

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={14} color="#D4AF68" />
              <span style={{ color: '#E8E0D5', fontSize: 11, fontWeight: 700 }}>PERSUASION IMPACT</span>
            </div>
            <span style={{ color: '#D4AF68', fontWeight: 'bold' }}>{metrics.persuasion}%</span>
          </div>
          <div style={{ display: 'flex', gap: 2, height: 4 }}>
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{ flex: 1, background: metrics.persuasion >= (i + 1) * 5 ? '#D4AF68' : 'rgba(255,255,255,0.05)', transition: 'background 0.3s' }} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 5. MAIN APP COMPONENT ---
const Vcs = ({ activeSim, onBack }) => {
  const { progress } = useProgress();
  const [config] = useState({
    title: "Agioas",
    pitchText: "",
    useAssets: true,
    focusMode: true,
  });

  const [simMode] = useState("ceo"); // Always CEO mode
  const [sessionId, setSessionId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showInvestmentBoard, setShowInvestmentBoard] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionTime, setSessionTime] = useState(3600);
  const [responseTimer, setResponseTimer] = useState(300);
  const [isModelsMuted, setIsModelsMuted] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState("Idle");
  const [isThinking, setIsThinking] = useState(false);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(65);

  // LIVE UPDATING METRICS FROM BACKEND
  const [boardMetrics, setBoardMetrics] = useState({
    visionary: 50,
    strategy: 50,
    critical: 50,
    persuasion: 50,
    marketFit: 50
  });

  const transcriptEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthRef = useRef(null);
  const availableVoicesRef = useRef([]);

  const [transcript, setTranscript] = useState([
    { sender: "System", text: "Session initialized. Ready for coaching.", time: "00:00" }
  ]);

  // TTS Setup
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        availableVoicesRef.current = speechSynthRef.current.getVoices();
      };
      loadVoices();
      if (speechSynthRef.current.onvoiceschanged !== undefined) {
        speechSynthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Initialize session with authentication
  useEffect(() => {
    if (progress < 100) return;

    let mounted = true;

    const initializeAuthenticatedSession = async () => {
      try {
        console.log('🚀 Starting CEO 3D session with authentication...');
        const { sessionAPI } = await import('../services/api');

        const response = await sessionAPI.start('ceo', '3d', {
          founder_name: 'Founder',
          session_mode: '3d'
        });

        if (!mounted) return;

        const authenticatedSessionId = response.data.session.session_id;
        setSessionId(authenticatedSessionId);
        console.log('✅ Authenticated session started:', authenticatedSessionId);

        // [KEEP ALL YOUR ORIGINAL 3D SCENE INITIALIZATION CODE BELOW HERE]

        // Get initial message from backend
        const initialMsg = response.data.initial_message?.message || "Welcome. I'm here to help you think through your biggest challenges and opportunities. What's on your mind today?";

        setTranscript(prev => [...prev, { sender: "CEO Coach", text: initialMsg, time: "00:00" }]);
        setCurrentSpeaker("CEO Coach");
        setCurrentAnimation("Talk");
        speakText(initialMsg, () => {
          setCurrentSpeaker(null);
          setCurrentAnimation("Idle");
        });

      } catch (error) {
        console.error('❌ Failed to start authenticated session:', error);
        if (error.response?.status === 401) {
          alert('Authentication required. Please log in again.');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          alert(`Session start failed: ${error.response?.data?.error || 'Access denied'}\n\nPlease check your membership.`);
          if (onBack) onBack();
        } else {
          alert('Failed to start session.');
          if (onBack) onBack();
        }
      }
    };

    initializeAuthenticatedSession();
    return () => { mounted = false; };
  }, [progress]);

  const speakText = (text, onEndCallback) => {
    if (!speechSynthRef.current || isModelsMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }

    speechSynthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = availableVoicesRef.current;

    // Use male voice for CEO
    let selectedVoice = voices.find(v =>
      v.name.includes('Microsoft David') ||
      v.name.includes('Google US English Male')
    );

    if (!selectedVoice && voices.length > 0) {
      const filteredVoices = voices.filter(v => v.lang.startsWith('en'));
      selectedVoice = filteredVoices.length > 0 ? filteredVoices[0] : voices[0];
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => { if (onEndCallback) onEndCallback(); };
    utterance.onerror = () => { if (onEndCallback) onEndCallback(); };
    speechSynthRef.current.speak(utterance);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMeetingStarted && !showReport) setIsPaused(true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isMeetingStarted, showReport]);

  const handleEndSession = () => { setIsMeetingStarted(false); setShowReport(true); };

  useEffect(() => {
    let interval;
    if (isMeetingStarted && !isPaused && !showReport && progress === 100) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev <= 1 ? 0 : prev - 1);
        setResponseTimer((prev) => prev <= 1 ? 300 : prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingStarted, isPaused, showReport, progress]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, showTranscript]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatResponseTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSessionRequest = () => { setShowEndConfirm(true); };
  const handleConfirmEndSession = () => { setShowEndConfirm(false); handleEndSession(); };
  const handleCancelEndSession = () => { setShowEndConfirm(false); };

  // UPGRADED: Send message with proper backend integration
  const handleSendMessage = async () => {
    if (!userMessage.trim() || !sessionId) return;

    const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [...prev, { sender: "You", text: userMessage, time: timeStamp }]);

    const messageToSend = userMessage;
    setUserMessage("");
    setResponseTimer(300);
    setIsThinking(true);

    try {
      console.log('📤 Sending message to backend:', messageToSend);

      const response = await fetch(`${BACKEND_API_URL}/sessions/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received backend response:', data);

      setIsThinking(false);

      // Extract response data
      const responseText = data.message || "I understand. Tell me more.";
      const characterName = "CEO Coach";

      // IMPORTANT: Use animation from backend if available, otherwise detect
      let detectedAnimation = data.animation || detectCeoAnimation(responseText);

      console.log(`🎭 Animation: ${detectedAnimation} for message: "${responseText.substring(0, 50)}..."`);

      // Update animation and speaker
      setCurrentSpeaker(characterName);
      setCurrentAnimation(detectedAnimation);

      // LIVE UPDATE METRICS FROM BACKEND
      if (data.metrics) {
        console.log('📊 Updating metrics:', data.metrics);

        setBoardMetrics({
          visionary: Math.round(data.metrics.clarity || 50),
          strategy: Math.round(100 - (data.metrics.pressure || 50)), // Inverse of pressure
          critical: Math.round(data.metrics.confidence || 50),
          persuasion: Math.round(data.metrics.energy || 50),
          marketFit: Math.round((data.metrics.clarity + data.metrics.confidence) / 2 || 50)
        });

        // Update accuracy score
        setAccuracyScore(Math.round(data.metrics.confidence || 65));
      }

      // Add to transcript
      setTranscript(prev => [...prev, {
        sender: characterName,
        text: responseText,
        time: timeStamp
      }]);

      // Speak the response
      speakText(responseText, () => {
        setCurrentSpeaker(null);
        setCurrentAnimation("Idle");
      });

    } catch (error) {
      console.error('❌ Chat error:', error);
      setIsThinking(false);

      // Fallback response
      const replyText = "I'm listening. Continue.";
      setTranscript(prev => [...prev, { sender: "CEO Coach", text: replyText, time: timeStamp }]);
      setCurrentSpeaker("CEO Coach");
      setCurrentAnimation("Talk");
      speakText(replyText, () => { setCurrentSpeaker(null); setCurrentAnimation("Idle"); });
    }

    if (inputRef.current) inputRef.current.style.height = '48px';
  };

  const handleContinue = () => {
    if (skipsUsed >= 5) { alert("Skip Limit Reached"); return; }
    setSkipsUsed(prev => prev + 1);
    const replyText = "Understood. Moving forward.";
    setTranscript(prev => [...prev, { sender: "CEO Coach", text: replyText, time: "Now" }]);
    setCurrentSpeaker("CEO Coach");
    setCurrentAnimation("Talk");
    speakText(replyText, () => { setCurrentSpeaker(null); setCurrentAnimation("Idle"); });
    setResponseTimer(300);
  };

  const handleInputResize = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleExitFull = () => {
    if (speechSynthRef.current) speechSynthRef.current.cancel();
    setShowReport(false);
    setIsMeetingStarted(true);
    setSessionTime(3600);
    setTranscript([{ sender: "System", text: "Session started. Recording active.", time: "00:00" }]);
    setCurrentSpeaker(null);
    setCurrentAnimation("Idle");
    if (onBack) onBack();
  }

  useEffect(() => {
    return () => { if (speechSynthRef.current) speechSynthRef.current.cancel(); };
  }, []);

  if (showReport) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="fade-in">
        <div style={{ width: 800, background: '#1A120E', border: '1px solid #D4AF68', borderRadius: 8, padding: 40, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}><Hexagon size={48} color="#D4AF68" style={{ margin: '0 auto 16px' }} /><h2 style={{ fontSize: 32, fontFamily: 'serif', color: '#E8E0D5', margin: 0 }}>SESSION DEBRIEF</h2><p style={{ color: '#9C8C74', marginTop: 8 }}>Analysis complete. Performance recorded.</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><BarChart size={20} color="#D4AF68" /><span style={{ fontSize: 14, fontWeight: 700, color: '#E8E0D5' }}>PERFORMANCE SCORE</span></div><div style={{ fontSize: 48, fontWeight: 700, color: '#D4AF68' }}>{accuracyScore}<span style={{ fontSize: 20, color: '#5E4F40' }}>/100</span></div><p style={{ fontSize: 13, color: '#9C8C74', marginTop: 8 }}>Strong conviction shown.</p></div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><ShieldCheck size={20} color="#D4AF68" /><span style={{ fontSize: 14, fontWeight: 700, color: '#E8E0D5' }}>KEY FEEDBACK</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#E8E0D5' }}><ThumbsUp size={14} color="#5D7A58" /> Clear value proposition.</div><div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#E8E0D5' }}><ThumbsDown size={14} color="#8A3A3A" /> Focus on scaling details.</div></div></div>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
            <button style={{ padding: '12px 24px', background: '#D4AF68', color: '#1A120E', border: 'none', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><Download size={16} /> DOWNLOAD REPORT</button>
            <button style={{ padding: '12px 24px', background: 'rgba(212, 175, 104, 0.1)', color: '#D4AF68', border: '1px solid #D4AF68', borderRadius: 4, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={16} /> TRANSCRIPT</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}><button onClick={handleExitFull} style={{ background: 'none', border: 'none', color: '#5E4F40', fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RESTART SESSION</button></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 70, display: 'flex', flexDirection: 'column' }} className="fade-in">
      <style>{`
              .app-scrollbar::-webkit-scrollbar { width: 4px; }
              .app-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
              .app-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 104, 0.2); border-radius: 2px; }
              @keyframes thinkingPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
              .thinking-pulse { animation: thinkingPulse 1.4s ease-in-out infinite; }
            `}</style>

      <Loader />

      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 85, color: '#D4AF68', fontFamily: 'serif', fontSize: 18, fontWeight: 'bold', letterSpacing: '0.2em' }}>CEO COACHING SESSION</div>

      {showEndConfirm && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 400, padding: 32, background: '#1A120E', border: '1px solid #8A3A3A', borderRadius: 8, textAlign: 'center' }}>
            <AlertTriangle size={48} color="#8A3A3A" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#E8E0D5', fontSize: 20, marginBottom: 8 }}>ARE YOU SURE?</h3>
            <p style={{ color: '#9C8C74', marginBottom: 24 }}>Ending the session will disconnect the coaching.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button onClick={handleCancelEndSession} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #9C8C74', color: '#9C8C74', borderRadius: 4, cursor: 'pointer' }}>CANCEL</button>
              <button onClick={handleConfirmEndSession} style={{ padding: '12px 24px', background: '#8A3A3A', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>END SESSION</button>
            </div>
          </div>
        </div>
      )}

      {isPaused && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(15, 10, 8, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <img src="/logo.png" alt="Logo" style={{ width: 80, height: 80, opacity: 0.8 }} />
          <div style={{ textAlign: 'center' }}><h2 style={{ fontSize: 32, fontFamily: 'serif', color: '#E8E0D5', margin: 0 }}>SESSION PAUSED</h2><p style={{ color: '#9C8C74', marginTop: 8 }}>Environment secured.</p></div>
          <button onClick={() => setIsPaused(false)} style={{ padding: '16px 48px', background: '#D4AF68', border: 'none', borderRadius: 4, color: '#1A120E', fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}><Play size={16} fill="#1A120E" /> RESUME</button>
        </div>
      )}

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(180deg, rgba(15, 10, 8, 0.9) 0%, transparent 100%)', zIndex: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 40, width: 'auto' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 20, color: '#D4AF68', fontFamily: 'serif', fontWeight: 'bold', letterSpacing: '0.05em' }}>AGIOAS</span>
            <span style={{ fontSize: 10, color: '#9C8C74', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>EXECUTIVE COACHING</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: responseTimer < 60 ? 1 : 0.5, color: responseTimer < 60 ? '#8A3A3A' : '#9C8C74' }}><AlertTriangle size={14} /><span style={{ fontSize: 12, fontWeight: 700 }}>{formatResponseTime(responseTimer)}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: 4, border: '1px solid rgba(212, 175, 104, 0.2)' }}><Clock size={16} color="#D4AF68" /><span style={{ fontSize: 16, fontFamily: 'monospace', color: '#E8E0D5', fontWeight: 600 }}>{formatTime(sessionTime)}</span></div>
        </div>
      </div>

      {showTranscript && (
        <div style={{ position: 'absolute', top: 80, left: 40, bottom: 100, width: 360, background: 'rgba(26, 18, 14, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196, 168, 111, 0.2)', borderRadius: 8, display: 'flex', flexDirection: 'column', zIndex: 90, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: '#D4AF68', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>LIVE TRANSCRIPT</span><button onClick={() => setShowTranscript(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C74' }}><X size={14} /></button></div>
          <div className="app-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {transcript.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: msg.sender === "You" ? '#D4AF68' : '#E8E0D5', fontSize: 11, fontWeight: 700 }}>{msg.sender}</span>
                  <span style={{ color: '#5E4F40', fontSize: 10 }}>{msg.time}</span>
                </div>
                <div style={{ color: '#9C8C74', fontSize: 13, lineHeight: 1.4 }}>{msg.text}</div>
              </div>
            ))}
            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'rgba(212, 175, 104, 0.1)', borderRadius: 6 }}>
                <Brain size={14} color="#D4AF68" />
                <span style={{ color: '#D4AF68', fontSize: 12, fontWeight: 600 }} className="thinking-pulse">Analyzing response...</span>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {showInvestmentBoard && (
        <InvestmentBoard onClose={() => setShowInvestmentBoard(false)} metrics={boardMetrics} />
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 1.1, 6.5], fov: 40 }} gl={{ toneMappingExposure: 1.0 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#fff6e5" />
            <Environment preset="city" environmentIntensity={1.0} />

            <CeoBackground />
            <CeoController animation={currentSpeaker === "CEO Coach" ? currentAnimation : "Idle"} />

            <OrbitControls target={[0, 0, 0]} enablePan={true} minDistance={3} maxDistance={13} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8} enableDamping={true} dampingFactor={0.05} />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 200, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto' }}>
          <button onClick={() => setShowInvestmentBoard(!showInvestmentBoard)} style={{ width: 44, height: 44, borderRadius: '50%', background: showInvestmentBoard ? '#D4AF68' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: showInvestmentBoard ? '#1A120E' : '#D4AF68', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Info size={20} />
          </button>
          <button onClick={() => setShowTranscript(!showTranscript)} style={{ height: 44, padding: '0 20px', borderRadius: 22, background: showTranscript ? '#D4AF68' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: showTranscript ? '#1A120E' : '#D4AF68', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><FileText size={16} /> TRANSCRIPT</button>
          <button onClick={() => setIsModelsMuted(!isModelsMuted)} style={{ height: 44, padding: '0 20px', borderRadius: 22, background: isModelsMuted ? '#8A3A3A' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#D4AF68', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{isModelsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        </div>
        <div style={{ flex: 1, margin: '0 20px', pointerEvents: 'auto', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: currentSpeaker === null && !isThinking ? '1px solid #D4AF68' : '1px solid rgba(196, 168, 111, 0.3)', boxShadow: currentSpeaker === null && !isThinking ? '0 0 15px rgba(212, 175, 104, 0.2)' : 'none', borderRadius: 24, display: 'flex', alignItems: 'flex-end', padding: '8px 16px', maxWidth: 800 }}>
          <textarea ref={inputRef} value={userMessage} onChange={handleInputResize} placeholder={currentSpeaker === null && !isThinking ? "Share your challenge..." : "Listening..."} disabled={currentSpeaker !== null || isThinking || progress < 100} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#E8E0D5', fontSize: 14, resize: 'none', maxHeight: '120px', minHeight: '24px', lineHeight: '24px', fontFamily: 'sans-serif' }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
          <button onClick={handleSendMessage} disabled={currentSpeaker !== null || isThinking || progress < 100} style={{ width: 32, height: 32, borderRadius: '50%', background: currentSpeaker === null && !isThinking ? '#D4AF68' : '#3E2F26', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 2 }}>
            <Send size={16} color={currentSpeaker === null ? "#1A120E" : "#5E4F40"} />
          </button>
        </div>
        <div style={{ pointerEvents: 'auto' }}><button onClick={handleEndSessionRequest} style={{ padding: '0 24px', height: 44, borderRadius: 22, background: '#8A3A3A', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><PhoneOff size={16} /> END</button></div>
      </div>
    </div>
  );
};

export default Vcs;