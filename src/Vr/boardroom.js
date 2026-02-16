import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBX, useAnimations, OrbitControls, Html, useGLTF, Environment, useProgress } from '@react-three/drei';
import {
  Video, Mic, Wifi, Check, Hexagon, PhoneOff, Send,
  FileText, Volume2, VolumeX, X, Info, AlertTriangle, Play,
  FastForward, BarChart, ShieldCheck, ThumbsUp, ThumbsDown, Clock,
  User, Maximize, Pencil, Lock, UploadCloud, Database,
  MicOff, VideoOff, LayoutGrid, Sidebar, Grid, Download, RefreshCcw,
  CheckSquare, Plus, Trash2, Users, FileBarChart, FileOutput, FileType,
  Crown, Brain, Cpu, Zap, Network, Activity, Shield, Target
} from 'lucide-react';

// --- GLOBAL LOADER COMPONENT ---
const GlobalLoader = ({ isLoading, message = "Loading Boardroom..." }) => {
  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 10, 8, 1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      pointerEvents: 'all',
      backfaceVisibility: 'hidden'
    }}>
      <style>
        {`
        .loader {
          position: relative;
          width: 160px;
          height: 160px;
          transform-style: preserve-3d;
          perspective: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
        }

        .node {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: #ffaa00;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow:
            0 0 20px #ffaa00,
            0 0 40px rgba(255, 170, 0, 0.6);
          animation: nodePulse 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform, box-shadow;
        }

        .thread {
          position: absolute;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 170, 0, 0.8),
            transparent
          );
          box-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
          transform-origin: center;
          will-change: transform, opacity;
        }

        .t1 {
          width: 100%;
          height: 2px;
          top: 30%;
          left: 0;
          animation: weave1 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .t2 {
          width: 2px;
          height: 100%;
          top: 0;
          left: 70%;
          animation: weave2 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .t3 {
          width: 100%;
          height: 2px;
          bottom: 30%;
          left: 0;
          animation: weave3 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .t4 {
          width: 2px;
          height: 100%;
          top: 0;
          left: 30%;
          animation: weave4 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes nodePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 0 20px #ffaa00,
              0 0 40px rgba(255, 170, 0, 0.6);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.4);
            box-shadow:
              0 0 30px #ffaa00,
              0 0 60px rgba(255, 170, 0, 0.8);
          }
        }

        @keyframes weave1 {
          0% {
            transform: translateY(0) rotateX(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(40px) rotateX(60deg) rotateZ(20deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotateX(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
        }

        @keyframes weave2 {
          0% {
            transform: translateX(0) rotateY(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(-40px) rotateY(60deg) rotateZ(-20deg);
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotateY(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
        }

        @keyframes weave3 {
          0% {
            transform: translateY(0) rotateX(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40px) rotateX(-60deg) rotateZ(15deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotateX(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
        }

        @keyframes weave4 {
          0% {
            transform: translateX(0) rotateY(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateX(40px) rotateY(-60deg) rotateZ(-15deg);
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotateY(0deg) rotateZ(0deg);
            opacity: 0.8;
          }
        }
        `}
      </style>

      <div className="loader">
        <div className="thread t1"></div>
        <div className="thread t2"></div>
        <div className="thread t3"></div>
        <div className="thread t4"></div>
        <div className="node"></div>
      </div>

      <div style={{
        marginTop: 40,
        color: '#ffaa00',
        fontSize: 14,
        fontFamily: 'monospace',
        textAlign: 'center',
        maxWidth: 300,
        letterSpacing: '0.1em'
      }}>
        {message}
        <div style={{ fontSize: 11, color: 'rgba(255, 170, 0, 0.5)', marginTop: 10 }}>
          ESTABLISHING NEURAL LINK...
        </div>
      </div>
    </div>
  );
};

// --- ABUSE WARNING MODAL ---
const AbuseWarningModal = ({ warnings, maxWarnings, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(138, 58, 58, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        width: 400,
        background: '#1A120E',
        border: '2px solid #8A3A3A',
        borderRadius: 8,
        padding: 30,
        textAlign: 'center'
      }}>
        <AlertTriangle size={48} color="#8A3A3A" style={{ marginBottom: 20 }} />
        <h2 style={{ color: '#E8E0D5', marginBottom: 10 }}>ABUSE WARNING</h2>
        <p style={{ color: '#9C8C74', marginBottom: 20 }}>
          Warning {warnings}/{maxWarnings}: Please maintain professional conduct in the boardroom.
          After {maxWarnings} warnings, the session will be terminated.
        </p>
        <button onClick={onClose} style={{
          background: '#8A3A3A',
          color: '#fff',
          border: 'none',
          padding: '10px 30px',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Acknowledge
        </button>
      </div>
    </div>
  );
};

// --- CONSTANTS & CONFIG ---
const ROOM_POSITION = [0, 1.5, -20];
const ROOM_ROTATION = [0, -1.6, 0];
const GLOBAL_SCALE = 0.011;

// --- WEBSOCKET CONFIG ---
const WS_URL = 'ws://localhost:8000/ws/boardroom/3d';

// --- VOICE MAPPING CONFIG ---
const VOICE_TYPE_MAPPING = {
  male_authoritative: { lang: 'en-US', namePatterns: ['Daniel', 'David', 'James', 'Google UK English Male', 'Microsoft David'], pitch: 0.9, rate: 0.9 },
  male_technical: { lang: 'en-US', namePatterns: ['Alex', 'Tom', 'Google US English', 'Microsoft Mark'], pitch: 1.0, rate: 1.0 },
  female_confident: { lang: 'en-US', namePatterns: ['Samantha', 'Victoria', 'Google UK English Female', 'Microsoft Zira'], pitch: 1.1, rate: 1.0 },
  female_analytical: { lang: 'en-US', namePatterns: ['Karen', 'Moira', 'Microsoft Susan'], pitch: 1.0, rate: 0.95 },
  female_diplomatic: { lang: 'en-US', namePatterns: ['Fiona', 'Tessa', 'Google UK English Female'], pitch: 1.05, rate: 0.9 },
};

// --- CHARACTER VOICE ASSIGNMENT ---
const CHARACTER_VOICE_MAP = {
  "Dr. Aris Thorne": "female_diplomatic",
  "Olivia Sterling": "female_analytical",
  "Marcus Chen": "male_technical",
  "Elena Rostova": "female_confident",
  "Gen. Maxwell": "male_authoritative",
  "Prof. Yumi": "female_analytical",
  "Victor H.": "male_authoritative",
  "Sarah Jenkins": "female_diplomatic",
  "The Silencer": "male_authoritative",
};

// --- SMOOTH ANIMATION TRANSITION CONFIG ---
const ANIMATION_TRANSITION_CONFIG = {
  idleToSpeak: 0.5,  // Faster transition to speaking
  speakToIdle: 0.8,  // Smoother return to idle
  defaultFade: 0.4,   // Smooth crossfade
};

const CHAR_CONFIG = [
  { id: 1, name: "Dr. Aris Thorne", role: "Legal", model: "of1", pos: [-7.6, 1.5, 10.50], rot: [0, 1.53, 0], scale: 5, img: "/api/placeholder/40/40", brainComplexity: "high", expertise: ["compliance", "risk", "governance"] },
  { id: 2, name: "Olivia Sterling", role: "CFO", model: "of2", pos: [-7, 1.5, -11], rot: [0, 1.5, 0], scale: 0.05, img: "/api/placeholder/40/40", brainComplexity: "high", expertise: ["budget", "valuation", "roi"] },
  { id: 3, name: "Marcus Chen", role: "CTO", model: "of3", pos: [-7.5, 1.5, -3.5], rot: [0, 1.5, 0], scale: 0.05, img: "/api/placeholder/40/40", brainComplexity: "high", expertise: ["technology", "cybersecurity", "innovation"] },
  { id: 4, name: "Elena Rostova", role: "PR", model: "of4", pos: [5, 1.7, 10], rot: [0, 4.5, 0], scale: 0.05, img: "/api/placeholder/40/40", brainComplexity: "medium", expertise: ["brand", "reputation", "market_response"] },
  { id: 5, name: "Gen. Maxwell", role: "Advisor", model: "of5", pos: [5.7, 1.4, -1.2], rot: [0, -1.5, 0], scale: 0.05, img: "/api/placeholder/40/40", brainComplexity: "medium", expertise: ["operations", "execution", "feasibility"] },
  { id: 6, name: "Prof. Yumi", role: "Ethics", model: "of6", pos: [-1, 1.7, -15], rot: [0, -0.15, 0], scale: 0.047, img: "/api/placeholder/40/40", brainComplexity: "high", expertise: ["strategy", "growth", "planning"] },
  { id: 7, name: "Victor H.", role: "Global", model: "ofw1", pos: [5.7, 1.4, 4.2], rot: [0, -1.3, 0], scale: 0.05, img: "/api/placeholder/40/40", brainComplexity: "high", expertise: ["leadership", "vision", "accountability"] },
  { id: 8, name: "Sarah Jenkins", role: "HR", model: "ofw2", pos: [-7.5, 1.5, 3], rot: [0, 1.5, 0], scale: 0.05, img: "/api/placeholder/40/40", brainComplexity: "medium", expertise: ["culture", "talent", "employee_impact"] },
  { id: 9, name: "The Silencer", role: "Defense", model: "ofw3", pos: [6.3, 0.7, -9.5], rot: [0, -1.5, 0], scale: 0.0005, img: "/api/placeholder/40/40", brainComplexity: "high", expertise: ["risk", "compliance", "crisis_management"] },
];

// --- ENHANCED TTS SERVICE WITH QUEUE ---
class TTSService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.voiceCache = {};
    this.isInitialized = false;
    this.currentUtterance = null;
    this.queue = [];
    this.isProcessing = false;
    this.initVoices();
  }

  initVoices() {
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0) {
        this.isInitialized = true;
        this.buildVoiceCache();
        console.log('TTS Voices loaded:', this.voices.length);
      }
    };

    loadVoices();

    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }

    setTimeout(loadVoices, 1000);
  }

  buildVoiceCache() {
    Object.entries(VOICE_TYPE_MAPPING).forEach(([voiceType, config]) => {
      const voice = this.findBestVoice(config);
      if (voice) {
        this.voiceCache[voiceType] = voice;
      }
    });
  }

  findBestVoice(config) {
    for (const pattern of config.namePatterns) {
      const voice = this.voices.find(v =>
        v.name.toLowerCase().includes(pattern.toLowerCase()) &&
        v.lang.startsWith(config.lang.split('-')[0])
      );
      if (voice) return voice;
    }

    const langVoice = this.voices.find(v => v.lang.startsWith(config.lang.split('-')[0]));
    return langVoice || this.voices[0];
  }

  getVoiceForCharacter(characterName) {
    const voiceType = CHARACTER_VOICE_MAP[characterName] || 'male_authoritative';
    return {
      voice: this.voiceCache[voiceType] || this.voices[0],
      config: VOICE_TYPE_MAPPING[voiceType] || VOICE_TYPE_MAPPING.male_authoritative
    };
  }

  speak(text, characterName, onStart, onEnd) {
    console.log('TTS speak called:', characterName, text.substring(0, 50));

    if (!text) {
      console.log('TTS: No text provided');
      if (onEnd) onEnd();
      return;
    }

    this.queue.push({ text, characterName, onStart, onEnd });

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length === 0 || this.isProcessing) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const { text, characterName, onStart, onEnd } = this.queue.shift();

    if (!this.isInitialized || this.voices.length === 0) {
      console.log('TTS: Voices not ready, retrying...');
      setTimeout(() => {
        this.queue.unshift({ text, characterName, onStart, onEnd });
        this.processQueue();
      }, 500);
      return;
    }

    this.stop();

    const { voice, config } = this.getVoiceForCharacter(characterName);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      console.log('TTS onstart fired for:', characterName);
      if (onStart) onStart();
    };

    utterance.onend = () => {
      console.log('TTS onend fired for:', characterName);
      this.currentUtterance = null;
      this.isProcessing = false;
      if (onEnd) onEnd();

      setTimeout(() => this.processQueue(), 100);
    };

    utterance.onerror = (event) => {
      console.error('TTS Error:', event);
      this.currentUtterance = null;
      this.isProcessing = false;
      if (onEnd) onEnd();

      setTimeout(() => this.processQueue(), 100);
    };

    this.currentUtterance = utterance;

    setTimeout(() => {
      this.synth.speak(utterance);
    }, 50);
  }

  stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
    this.isProcessing = false;
  }

  clearQueue() {
    this.queue = [];
    this.isProcessing = false;
  }

  isSpeaking() {
    return this.synth.speaking || this.queue.length > 0;
  }
}

// --- GLOBAL TTS INSTANCE ---
const ttsService = new TTSService();

// --- 3D COMPONENTS ---

const OfficeRoom = () => {
  const { scene } = useGLTF("/officef.glb");
  return <primitive object={scene} scale={1} position={ROOM_POSITION} rotation={ROOM_ROTATION} />;
};

// --- SMOOTH ANIMATED CHARACTER WITH BETTER TRANSITIONS ---
const AnimatedCharacter = ({ modelName, position, rotation, customScale, isSpeaking }) => {
  const group = useRef();
  const fbxPose = useFBX(`/${modelName}pose.fbx`);
  const fbxTalk = useFBX(`/${modelName}talk.fbx`);

  const [currentAnimation, setCurrentAnimation] = useState('pose');
  const prevSpeakingRef = useRef(false);

  useEffect(() => {
    [fbxPose, fbxTalk].forEach(model => {
      model.traverse((child) => { if (child.isLight) child.visible = false; });
    });
  }, [fbxPose, fbxTalk]);

  const animations = useMemo(() => {
    const clips = [];
    if (fbxPose.animations[0]) { const clip = fbxPose.animations[0].clone(); clip.name = 'pose'; clips.push(clip); }
    if (fbxTalk.animations[0]) { const clip = fbxTalk.animations[0].clone(); clip.name = 'talk'; clips.push(clip); }
    return clips;
  }, [fbxPose, fbxTalk]);

  const { actions, mixer } = useAnimations(animations, group);

  // SMOOTH ANIMATION TRANSITIONS
  useEffect(() => {
    const wasSpeaking = prevSpeakingRef.current;
    const nowSpeaking = isSpeaking;

    if (wasSpeaking !== nowSpeaking) {
      const targetAnimation = nowSpeaking ? 'talk' : 'pose';
      const fromAnimation = nowSpeaking ? 'pose' : 'talk';

      const transitionDuration = nowSpeaking
        ? ANIMATION_TRANSITION_CONFIG.idleToSpeak
        : ANIMATION_TRANSITION_CONFIG.speakToIdle;

      console.log(`${modelName}: ${fromAnimation} → ${targetAnimation} (${transitionDuration}s)`);

      const targetAction = actions[targetAnimation];
      const fromAction = actions[fromAnimation];

      if (targetAction) {
        targetAction.reset();
        targetAction.setEffectiveTimeScale(1);
        targetAction.setEffectiveWeight(1);
        targetAction.fadeIn(transitionDuration);
        targetAction.play();

        if (fromAction) {
          fromAction.fadeOut(transitionDuration);
        }

        setCurrentAnimation(targetAnimation);
      }
    }

    prevSpeakingRef.current = nowSpeaking;
  }, [isSpeaking, actions, modelName]);

  useEffect(() => {
    if (actions['pose']) {
      actions['pose'].reset();
      actions['pose'].setEffectiveTimeScale(1);
      actions['pose'].setEffectiveWeight(1);
      actions['pose'].play();
    }
  }, [actions]);

  const finalScale = customScale || GLOBAL_SCALE;

  return (
    <group ref={group} position={position} rotation={rotation} dispose={null}>
      <primitive object={fbxPose} scale={finalScale} />
    </group>
  );
};

const Loader = ({ onLoaded }) => {
  const { progress, active } = useProgress();

  useEffect(() => {
    if (!active && progress === 100) {
      if (onLoaded) onLoaded();
    }
  }, [active, progress, onLoaded]);

  if (!active) return null;
  return (
    <Html center zIndexRange={[100, 100]}>
      <GlobalLoader isLoading={true} message={`Syncing Assets ${Math.round(progress)}%`} />
    </Html>
  );
};

// --- UI COMPONENTS ---

const SimpleGraph = ({ color, data, height = 40 }) => {
  const width = 100;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = 100 - val;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} 100`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <path d={`M 0 100 L ${points} L ${width} 100 Z`} fill={color} fillOpacity="0.2" />
      <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const VoteModal = ({ onClose, onVoteComplete }) => {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [summary, setSummary] = useState("");
  const [mode, setMode] = useState("yesno");
  const [customOptions, setCustomOptions] = useState(["NOTA"]);
  const [newOption, setNewOption] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setCustomOptions([...customOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (idx) => {
    setCustomOptions(customOptions.filter((_, i) => i !== idx));
  };

  const startVote = async () => {
    const options = mode === 'yesno' ? ["Yes", "No"] : customOptions;

    setIsLoading(true);

    // Simulate voting
    const votes = {};
    const breakdown = [];
    options.forEach(op => votes[op] = 0);
    CHAR_CONFIG.forEach(member => {
      const choice = options[Math.floor(Math.random() * options.length)];
      votes[choice]++;
      breakdown.push({ name: member.name, role: member.role, choice });
    });
    const total = CHAR_CONFIG.length;
    const stats = options.map(op => ({
      label: op,
      count: votes[op],
      percent: Math.round((votes[op] / total) * 100)
    })).sort((a, b) => b.count - a.count);

    setTimeout(() => {
      setResults({ stats, breakdown });
      setStep(2);
      if (onVoteComplete) onVoteComplete();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 500, background: '#1A120E', border: '1px solid #D4AF68', borderRadius: 8, padding: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckSquare size={20} color="#D4AF68" />
            <span style={{ fontSize: 16, fontWeight: 700, color: '#E8E0D5' }}>{step === 1 ? "INITIATE VOTE" : "VOTING RESULTS"}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C74' }}><X size={18} /></button>
        </div>
        {step === 1 ? (
          <>
            <div>
              <label style={{ color: '#9C8C74', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>TOPIC</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter voting topic..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8E0D5', padding: 10, borderRadius: 4 }} />
            </div>
            <div>
              <label style={{ color: '#9C8C74', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>SUMMARY</label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Brief context for the board..." style={{ width: '100%', height: 60, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8E0D5', padding: 10, borderRadius: 4, resize: 'none' }} />
            </div>
            <div>
              <label style={{ color: '#9C8C74', fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>VOTE TYPE</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setMode('yesno')} style={{ flex: 1, padding: 10, background: mode === 'yesno' ? 'rgba(212, 175, 104, 0.2)' : 'transparent', border: `1px solid ${mode === 'yesno' ? '#D4AF68' : 'rgba(255,255,255,0.1)'}`, color: mode === 'yesno' ? '#D4AF68' : '#9C8C74', borderRadius: 4, cursor: 'pointer' }}>Yes / No</button>
                <button onClick={() => setMode('custom')} style={{ flex: 1, padding: 10, background: mode === 'custom' ? 'rgba(212, 175, 104, 0.2)' : 'transparent', border: `1px solid ${mode === 'custom' ? '#D4AF68' : 'rgba(255,255,255,0.1)'}`, color: mode === 'custom' ? '#D4AF68' : '#9C8C74', borderRadius: 4, cursor: 'pointer' }}>Custom Options</button>
              </div>
            </div>
            {mode === 'custom' && (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 4 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input value={newOption} onChange={e => setNewOption(e.target.value)} placeholder="Add option..." style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#E8E0D5', padding: 6, borderRadius: 4 }} />
                  <button onClick={handleAddOption} style={{ background: '#5E4F40', border: 'none', color: '#fff', padding: '0 10px', borderRadius: 4, cursor: 'pointer' }}><Plus size={14} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {customOptions.map((opt, idx) => (
                    <div key={idx} style={{ background: 'rgba(212,175,104,0.1)', border: '1px solid rgba(212,175,104,0.3)', padding: '4px 8px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#D4AF68' }}>
                      {opt}
                      <button onClick={() => handleRemoveOption(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={10} color="#D4AF68" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={startVote} disabled={isLoading} style={{ marginTop: 10, background: isLoading ? '#5E4F40' : '#D4AF68', color: '#1A120E', border: 'none', padding: 12, borderRadius: 4, fontWeight: 700, cursor: isLoading ? 'wait' : 'pointer' }}>
              {isLoading ? 'PROCESSING...' : 'CALL FOR VOTE'}
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <div style={{ color: '#E8E0D5', fontSize: 18, fontFamily: 'serif' }}>{topic}</div>
              <div style={{ color: '#9C8C74', fontSize: 12 }}>{summary}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.stats.map((stat, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#E8E0D5', fontSize: 13, fontWeight: 600 }}>{stat.label}</span>
                    <span style={{ color: '#D4AF68', fontWeight: 700 }}>{stat.percent}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 3 }}>
                    <div style={{ width: `${stat.percent}%`, height: '100%', background: i === 0 ? '#5D7A58' : '#8A3A3A', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, maxHeight: 150, overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 4 }}>
              <div style={{ color: '#9C8C74', fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Individual Votes</div>
              {results.breakdown.map((vote, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
                  <span style={{ color: '#E8E0D5' }}>{vote.name} <span style={{ color: '#5E4F40' }}>({vote.role})</span></span>
                  <span style={{ color: '#D4AF68' }}>{vote.choice}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MemberInfoPanel = ({ members, currentSpeaker, speakingCharacter, onClose, executiveStates }) => {
  const dirData = [50, 55, 52, 60, 65, 70, 75];
  const riskData = [80, 75, 70, 65, 60, 55, 50];

  const calculateLiveStats = () => {
    if (!executiveStates || executiveStates.length === 0) {
      return { avgSupport: 50, avgEngagement: 50, totalSpeaks: 0 };
    }

    const totalSupport = executiveStates.reduce((sum, state) => sum + (state.supportLevel || 50), 0);
    const totalEngagement = executiveStates.reduce((sum, state) => sum + (state.engagement || 50), 0);
    const totalSpeaks = executiveStates.reduce((sum, state) => sum + (state.speakCount || 0), 0);

    return {
      avgSupport: Math.round(totalSupport / executiveStates.length),
      avgEngagement: Math.round(totalEngagement / executiveStates.length),
      totalSpeaks
    };
  };

  const liveStats = calculateLiveStats();

  return (
    <div style={{ position: 'absolute', top: 80, right: 40, width: 320, height: 'auto', maxHeight: '80vh', background: 'rgba(26,18,14,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(196,168,111,0.3)', borderRadius: 8, zIndex: 90, display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
      <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#D4AF68', fontSize: 11, fontWeight: 700 }}>BOARD COMPOSITION</span>
        <X size={14} color="#9C8C74" onClick={onClose} style={{ cursor: 'pointer' }} />
      </div>

      <div style={{ padding: 12, background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-around', fontSize: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#9C8C74' }}>Avg Support</span>
          <span style={{ color: '#D4AF68', fontWeight: 700 }}>{liveStats.avgSupport}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#9C8C74' }}>Engagement</span>
          <span style={{ color: '#D4AF68', fontWeight: 700 }}>{liveStats.avgEngagement}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#9C8C74' }}>Total Speaks</span>
          <span style={{ color: '#D4AF68', fontWeight: 700 }}>{liveStats.totalSpeaks}</span>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#E8E0D5', fontSize: 10, fontWeight: 600 }}>COMPANY DIRECTION</span>
            <span style={{ color: '#5D7A58', fontSize: 10, fontWeight: 700 }}>Trending Up</span>
          </div>
          <div style={{ height: 40, width: '100%' }}>
            <SimpleGraph color="#5D7A58" data={dirData} height={40} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#E8E0D5', fontSize: 10, fontWeight: 600 }}>RISK ANALYSIS</span>
            <span style={{ color: '#E63946', fontSize: 10, fontWeight: 700 }}>Mitigating</span>
          </div>
          <div style={{ height: 40, width: '100%' }}>
            <SimpleGraph color="#E63946" data={riskData} height={40} />
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

        {members.map(m => {
          const execState = executiveStates?.find(s => s.name === m.name);
          const isSpeaking = m.name === speakingCharacter || m.name === currentSpeaker;
          const supportLevel = execState?.supportLevel || 50;
          const engagement = execState?.engagement || 50;

          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: isSpeaking ? 'rgba(212,175,104,0.1)' : 'transparent', borderRadius: 4, border: isSpeaking ? '1px solid rgba(212,175,104,0.3)' : 'none', transition: 'all 0.3s ease' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: isSpeaking ? '2px solid #D4AF68' : '1px solid #5E4F40', flexShrink: 0, transition: 'border 0.3s ease' }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {m.brainComplexity === 'high' && (
                  <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#D4AF68', borderRadius: '50%', width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={8} color="#1A120E" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: isSpeaking ? '#D4AF68' : '#E8E0D5', fontSize: 12, fontWeight: isSpeaking ? 700 : 400 }}>{m.name}</span>
                  <span style={{ color: '#5E4F40', fontSize: 9, textTransform: 'uppercase' }}>{m.role}</span>
                  {isSpeaking && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      background: 'rgba(212,175,104,0.3)',
                      padding: '2px 6px',
                      borderRadius: 8,
                      fontSize: 8,
                      color: '#D4AF68',
                      fontWeight: 700
                    }}>
                      <span style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#D4AF68',
                        animation: 'pulse 1s infinite'
                      }}></span>
                      SPEAKING
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#9C8C74', marginBottom: 2 }}>
                      <span>Support</span>
                      <span>{supportLevel}%</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                      <div style={{ width: `${supportLevel}%`, height: '100%', background: supportLevel > 70 ? '#5D7A58' : supportLevel < 40 ? '#8A3A3A' : '#D4AF68', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ width: 20, textAlign: 'center' }}>
                    <span style={{ fontSize: 9, color: '#D4AF68', fontWeight: 700 }}>{engagement}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
};

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 300, background: '#1A120E', border: '1px solid #8A3A3A', borderRadius: 8, padding: 24, textAlign: 'center' }}>
        <AlertTriangle size={32} color="#8A3A3A" style={{ marginBottom: 16 }} />
        <h3 style={{ color: '#E8E0D5', margin: '0 0 8px 0' }}>End Session?</h3>
        <p style={{ color: '#9C8C74', fontSize: 13, marginBottom: 20 }}>Are you sure you want to conclude the meeting? This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #5E4F40', color: '#E8E0D5', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: 10, background: '#8A3A3A', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>End Meeting</button>
        </div>
      </div>
    </div>
  )
}

const ConnectionStatus = ({ isConnected, userCount }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 70,
      right: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 12px',
      background: 'rgba(0,0,0,0.7)',
      borderRadius: 12,
      border: `1px solid ${isConnected ? 'rgba(93, 122, 88, 0.5)' : 'rgba(138, 58, 58, 0.5)'}`,
      zIndex: 100,
      fontSize: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: isConnected ? '#5D7A58' : '#8A3A3A',
          boxShadow: isConnected ? '0 0 6px #5D7A58' : '0 0 6px #8A3A3A'
        }} />
        <span style={{ color: isConnected ? '#5D7A58' : '#8A3A3A', fontWeight: 600 }}>
          {isConnected ? 'AI ONLINE' : 'CONNECTING...'}
        </span>
      </div>
      {userCount > 0 && (
        <>
          <div style={{ height: 12, width: 1, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={10} color="#9C8C74" />
            <span style={{ color: '#9C8C74' }}>{userCount}</span>
          </div>
        </>
      )}
    </div>
  );
};

const SpeakingIndicator = ({ speakingCharacter }) => {
  if (!speakingCharacter) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 140,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(26,18,14,0.95)',
      border: '1px solid #D4AF68',
      borderRadius: 20,
      padding: '8px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      zIndex: 95,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            width: 3,
            height: 12,
            background: '#D4AF68',
            borderRadius: 2,
            animation: `soundWave 0.5s ease-in-out ${i * 0.1}s infinite alternate`
          }} />
        ))}
      </div>
      <span style={{ color: '#D4AF68', fontSize: 12, fontWeight: 600 }}>{speakingCharacter}</span>
      <span style={{ color: '#9C8C74', fontSize: 10 }}>is speaking...</span>
      <style>{`
                @keyframes soundWave {
                    0% { transform: scaleY(0.3); }
                    100% { transform: scaleY(1); }
                }
            `}</style>
    </div>
  );
};

const PremiumLogo = ({ size = 24 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        position: 'relative',
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #8B4513 100%)',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 10px rgba(139, 69, 19, 0.5)',
        overflow: 'hidden'
      }}>
        <img src="/logo.png" alt="AGIOAS Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      </div>
      <span style={{
        fontSize: size === 24 ? 20 : 24,
        color: '#8B4513',
        fontFamily: 'serif',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 4px rgba(139, 69, 19, 0.3)'
      }}>
        AGIOAS
      </span>
    </div>
  );
};

// --- MAIN BOARDROOM COMPONENT ---
const Boardroom = ({ onBack, meetingTopic = "Strategic Discussion", meetingAim = "Conduct an executive review of company goals." }) => {
  const [title, setTitle] = useState(meetingTopic || "Topic");
  const [aim, setAim] = useState(meetingAim || "");

  const [isMeetingStarted, setIsMeetingStarted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showAbuseWarning, setShowAbuseWarning] = useState(false);
  const [abuseWarnings, setAbuseWarnings] = useState(0);
  const [maxWarnings, setMaxWarnings] = useState(3);

  const [sessionTime, setSessionTime] = useState(3600);
  const [responseTimer, setResponseTimer] = useState(300);

  const [showTranscript, setShowTranscript] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const [isModelsMuted, setIsModelsMuted] = useState(false);

  const [userMessage, setUserMessage] = useState("");
  const [transcript, setTranscript] = useState([{ sender: "System", text: "Boardroom session initialized.", time: "00:00" }]);
  const [currentSpeaker, setCurrentSpeaker] = useState("User");

  const [skipsUsed, setSkipsUsed] = useState(0);
  const [votesUsed, setVotesUsed] = useState(0);

  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Initializing Genius Brains...");
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  const transcriptEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- WEBSOCKET STATE ---
  const [sessionId, setSessionId] = useState(null);
  const [speakingCharacter, setSpeakingCharacter] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [executiveStates, setExecutiveStates] = useState([]);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1);
  const [currentMessageBuffer, setCurrentMessageBuffer] = useState("");
  const wsRef = useRef(null);
  const abuseCheckRef = useRef(0);

  // --- LOADING SEQUENCE ---
  useEffect(() => {
    const messages = [
      "Initializing Genius Brains...",
      "Loading Cognitive Architectures...",
      "Connecting to AI Network...",
      "Synchronizing Executive States...",
      "Preparing 3D Environment...",
      "Calibrating AI Responses..."
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < messages.length) {
        setLoadingMessage(messages[messageIndex]);
        messageIndex++;
      } else {
        clearInterval(interval);
        if (isAssetsLoaded) {
          setIsLoading(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAssetsLoaded]);

  useEffect(() => {
    if (isAssetsLoaded && loadingMessage === "Calibrating AI Responses...") {
      setIsLoading(false);
    }
  }, [isAssetsLoaded, loadingMessage]);

  // --- WEBSOCKET SETUP WITH AUTHENTICATION ---
  useEffect(() => {
    if (!isAssetsLoaded) return;

    let mounted = true;

    const initializeAuthenticatedSession = async () => {
      try {
        console.log('🚀 Starting boardroom 3D session with authentication...');
        const { sessionAPI } = await import('../services/api');

        const response = await sessionAPI.start('boardroom', '3d', { title, aim });

        if (!mounted) return;

        const authenticatedSessionId = response.data.session.session_id;
        setSessionId(authenticatedSessionId);
        console.log('✅ Authenticated session started:', authenticatedSessionId);

        // --- ALL ORIGINAL 3D SCENE INITIALIZATION CODE BELOW ---

        // Connect WebSocket with authenticated session ID
        const wsUrl = `${WS_URL}/${authenticatedSessionId}/`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('✅ WebSocket connected:', wsUrl);
          setIsWsConnected(true);

          // Send greeting after connection
          setTimeout(() => {
            const member = CHAR_CONFIG[6]; // Victor H. (CEO)
            const greeting = `Welcome to the boardroom. I'm ${member.name}, and we're here to discuss "${title}". Let's begin with your proposal.`;
            speakWithAnimation(member.name, greeting);
          }, 1500);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (e) {
            console.log('WebSocket text message:', event.data);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsWsConnected(false);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsWsConnected(false);
        };

        wsRef.current = ws;

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

    return () => {
      mounted = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isAssetsLoaded, title, aim]);

  // --- HANDLE WEBSOCKET MESSAGES WITH WORD STREAMING ---
  const handleWebSocketMessage = (data) => {
    console.log('📨 WS Message:', data.type);

    if (data.type === 'connection_established') {
      console.log('✅ Connection established');
      showNotification('Connected to AI boardroom');
    }

    else if (data.type === 'thinking') {
      // Show thinking indicator
      console.log(`🤔 ${data.character_name} is thinking...`);
      setCurrentSpeaker(data.character_name);
      setSpeakingCharacter(null); // Not speaking yet
      setCurrentMessageBuffer("");
    }

    else if (data.type === 'word_stream') {
      const { character_name, word, is_complete, animation, emotion } = data;

      // Start speaking animation on first word
      if (!speakingCharacter && character_name) {
        console.log(`🗣️ ${character_name} started speaking`);
        setSpeakingCharacter(character_name);
        setCurrentSpeaker(character_name);
      }

      // Accumulate message
      setCurrentMessageBuffer(prev => {
        const newMessage = prev ? `${prev} ${word}` : word;

        // Update transcript on complete
        if (is_complete) {
          console.log(`✅ ${character_name} finished speaking`);
          setTranscript(prevTrans => [...prevTrans, {
            sender: character_name,
            text: newMessage,
            time: "Now"
          }]);

          // Speak via TTS
          if (!isModelsMuted) {
            ttsService.speak(
              newMessage,
              character_name,
              () => console.log('TTS started'),
              () => {
                // Stop speaking animation after TTS ends
                setTimeout(() => {
                  setSpeakingCharacter(null);
                  setCurrentSpeaker("User");
                  setIsAudioPlaying(false);
                }, ANIMATION_TRANSITION_CONFIG.speakToIdle * 1000);
              }
            );
          } else {
            // No TTS - just show text and animate
            const wordCount = newMessage.split(' ').length;
            const displayDuration = Math.max(2000, wordCount * 300);

            setTimeout(() => {
              setSpeakingCharacter(null);
              setCurrentSpeaker("User");
              setIsAudioPlaying(false);
            }, displayDuration);
          }

          return "";
        }

        return newMessage;
      });
    }

    else if (data.type === 'character_response') {
      // Handle complete response (non-streaming fallback)
      const { character_name, message } = data;
      speakWithAnimation(character_name, message);
    }

    else if (data.type === 'executive_states') {
      console.log('📊 Executive states updated');
      setExecutiveStates(data.states || []);
    }

    else if (data.type === 'error') {
      console.error('❌ Server error:', data.message);
      showNotification('Error: ' + data.message);
      setCurrentSpeaker("User");
      setSpeakingCharacter(null);
    }
  };

  // --- SPEAK WITH ANIMATION ---
  const speakWithAnimation = (characterName, text) => {
    if (!isAssetsLoaded) return;

    console.log('🗣️ speakWithAnimation:', characterName, text.substring(0, 50));

    setSpeakingCharacter(characterName);
    setCurrentSpeaker(characterName);
    setIsAudioPlaying(true);

    setTranscript(prev => [...prev, { sender: characterName, text: text, time: "Now" }]);

    if (!isModelsMuted) {
      ttsService.speak(
        text,
        characterName,
        () => console.log('TTS started for:', characterName),
        () => {
          console.log('TTS ended for:', characterName);
          setTimeout(() => {
            setSpeakingCharacter(null);
            setCurrentSpeaker("User");
            setIsAudioPlaying(false);
          }, ANIMATION_TRANSITION_CONFIG.speakToIdle * 1000);
        }
      );
    } else {
      const wordCount = text.split(' ').length;
      const speakDuration = Math.max(2000, wordCount * 300);

      setTimeout(() => {
        setSpeakingCharacter(null);
        setCurrentSpeaker("User");
        setIsAudioPlaying(false);
      }, speakDuration);
    }
  };

  // --- ABUSE DETECTION ---
  const checkForAbuse = (text) => {
    const abuseWords = ['idiot', 'stupid', 'dumb', 'fool', 'moron', 'shut up', 'fuck', 'shit', 'damn', 'ass', 'bastard', 'crap', 'hell', 'kill', 'die', 'useless', 'pathetic', 'trash'];
    const lowerText = text.toLowerCase();
    return abuseWords.some(word => lowerText.includes(word));
  };

  // --- CLEANUP TTS ---
  useEffect(() => {
    if (isModelsMuted) ttsService.stop();
  }, [isModelsMuted]);

  useEffect(() => {
    return () => { ttsService.stop(); };
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- SESSION TIMERS ---
  useEffect(() => {
    let interval;
    if (isMeetingStarted && !isPaused && !showReport && isAssetsLoaded) {
      interval = setInterval(() => {
        setSessionTime(p => (p <= 0 ? 0 : p - 1));
        setResponseTimer(p => {
          if (p <= 0 && currentSpeaker === "User" && !speakingCharacter) {
            const member = CHAR_CONFIG[Math.floor(Math.random() * CHAR_CONFIG.length)];
            speakWithAnimation(member.name, "We're waiting for your input. Should we move to the next point?");
            return 300;
          }
          return p > 0 ? p - 1 : 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingStarted, isPaused, showReport, currentSpeaker, speakingCharacter, isAssetsLoaded]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, showTranscript]);

  const formatTime = (s) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor((s % 3600) / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // --- SEND MESSAGE VIA WEBSOCKET ---
  const handleSendMessage = () => {
    if (!userMessage.trim() || speakingCharacter || !isWsConnected) return;

    if (checkForAbuse(userMessage)) {
      abuseCheckRef.current++;
      if (abuseCheckRef.current >= maxWarnings) {
        setShowReport(true);
        setIsMeetingStarted(false);
        ttsService.stop();
        return;
      }
      setAbuseWarnings(abuseCheckRef.current);
      setShowAbuseWarning(true);
      return;
    }

    const messageText = userMessage;
    setTranscript(prev => [...prev, { sender: "You", text: messageText, time: "Now" }]);
    setUserMessage("");
    setResponseTimer(300);
    setCurrentSpeaker("Thinking...");

    if (inputRef.current) inputRef.current.style.height = '48px';

    // Send via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'user_message',
        message: messageText
      }));
      console.log('📤 Sent user message via WebSocket');
    } else {
      console.warn('⚠️ WebSocket not connected, showing fallback');
      // Fallback response
      setTimeout(() => {
        const member = CHAR_CONFIG[Math.floor(Math.random() * CHAR_CONFIG.length)];
        const responses = [
          "That's an interesting perspective. Let me analyze the implications.",
          "I appreciate your input. We need to examine this from multiple angles.",
          "That raises important considerations for our strategic direction.",
          "Let's break down the key components of this proposal."
        ];
        speakWithAnimation(member.name, responses[Math.floor(Math.random() * responses.length)]);
      }, 1500);
    }
  };

  const handleContinue = () => {
    if (skipsUsed >= 3 || speakingCharacter) return;
    setSkipsUsed(prev => prev + 1);
    setTranscript(prev => [...prev, { sender: "System", text: "User skipped response.", time: "Now" }]);
    showNotification(`Response Skipped (${2 - skipsUsed} remaining)`);
    setTimeout(() => {
      speakWithAnimation("Dr. Aris Thorne", "Moving to the next agenda item.");
      setResponseTimer(300);
    }, 500);
  };

  const handleVoteClick = () => {
    if (votesUsed >= 3) { alert("Max Voting Limit Reached."); return; }
    setShowVoteModal(true);
  };

  const handleVoteComplete = () => { setVotesUsed(prev => prev + 1); };

  const handleInputResize = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleEndSession = () => {
    setShowEndConfirm(false);
    ttsService.stop();
    setSpeakingCharacter(null);
    if (wsRef.current) {
      wsRef.current.close();
    }
    setShowReport(true);
    setIsMeetingStarted(false);
  };

  // --- RENDER ---
  if (showAbuseWarning) {
    return (
      <>
        <AbuseWarningModal warnings={abuseWarnings} maxWarnings={maxWarnings} onClose={() => setShowAbuseWarning(false)} />
        <div style={{ position: 'fixed', inset: 0, background: '#0F0A08', zIndex: 70 }} />
      </>
    );
  }

  if (isMeetingStarted) {
    const getIsSpeaking = (charName) => speakingCharacter === charName;

    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 70, display: 'flex', flexDirection: 'column' }} className="fade-in">
        <GlobalLoader isLoading={isLoading} message={loadingMessage} />

        <ConnectionStatus isConnected={isWsConnected} userCount={activeUsers} />

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: 'transparent', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PremiumLogo size={24} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(139, 69, 19, 0.1)', padding: '4px 8px', borderRadius: 4, border: '1px solid rgba(139, 69, 19, 0.3)' }}>
              <Target size={12} color="#8B4513" />
              <span style={{ fontSize: 11, color: '#8B4513', fontWeight: 700 }}>AIM: {aim.substring(0, 40)}{aim.length > 40 ? '...' : ''}</span>
            </div>
          </div>

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#9C8C74', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>TOPIC</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#E8E0D5', fontFamily: 'serif', fontSize: 20, width: 240, outline: 'none', textAlign: 'center' }} />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9C8C74', fontSize: 12 }}>
              <AlertTriangle size={12} />
              Timeout: {Math.floor(responseTimer / 60)}:{(responseTimer % 60).toString().padStart(2, '0')}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(212,175,104,0.3)', color: '#E8E0D5', fontFamily: 'monospace', fontWeight: 600, fontSize: 12 }}>
              {formatTime(sessionTime)}
            </div>
          </div>
        </div>

        {notification && (
          <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', background: 'rgba(212, 175, 104, 0.9)', color: '#1A120E', padding: '8px 24px', borderRadius: 4, fontWeight: 'bold', fontSize: 14, zIndex: 200, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', animation: 'fadeInOut 3s forwards' }}>
            {notification}
          </div>
        )}

        {showEndConfirm && (
          <ConfirmationModal onCancel={() => setShowEndConfirm(false)} onConfirm={handleEndSession} />
        )}

        {showVoteModal && <VoteModal onClose={() => setShowVoteModal(false)} onVoteComplete={handleVoteComplete} />}

        {showMemberInfo && (
          <MemberInfoPanel members={CHAR_CONFIG} currentSpeaker={currentSpeaker} speakingCharacter={speakingCharacter} executiveStates={executiveStates} onClose={() => setShowMemberInfo(false)} />
        )}

        {showTranscript && (
          <div style={{ position: 'absolute', top: 80, left: 40, right: 40, maxWidth: 600, minWidth: 300, height: 500, background: 'rgba(26,18,14,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(196,168,111,0.3)', borderRadius: 8, zIndex: 90, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(212, 175, 104, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={14} color="#D4AF68" /><span style={{ color: '#D4AF68', fontSize: 12, fontWeight: 700 }}>MEETING TRANSCRIPT</span></div>
              <X size={16} color="#9C8C74" onClick={() => setShowTranscript(false)} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, gap: 16, display: 'flex', flexDirection: 'column' }}>
              {transcript.map((t, i) => (
                <div key={i} style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 6, borderLeft: `3px solid ${t.sender === "You" ? '#D4AF68' : t.sender === "System" ? '#8A3A3A' : '#5D7A58'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: t.sender === "You" ? '#D4AF68' : t.sender === "System" ? '#E63946' : '#E8E0D5', fontSize: 12, fontWeight: 700 }}>{t.sender}</span><span style={{ color: '#5E4F40', fontSize: 10 }}>{t.time}</span></div>
                  <div style={{ fontSize: 12, color: '#9C8C74', lineHeight: '1.5' }}>{t.text}</div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

        <SpeakingIndicator speakingCharacter={speakingCharacter} />

        <div style={{ flex: 1, position: 'relative' }}>
          <Canvas shadows camera={{ position: [-2.11, 11.84, 32.10], fov: 40 }}>
            <Suspense fallback={<Loader onLoaded={() => setIsAssetsLoaded(true)} />}>
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

              <OfficeRoom />

              {CHAR_CONFIG.map((char) => (
                <AnimatedCharacter
                  key={char.id}
                  modelName={char.model}
                  position={char.pos}
                  rotation={char.rot}
                  customScale={char.scale}
                  isSpeaking={getIsSpeaking(char.name)}
                />
              ))}

              <OrbitControls target={[0, 1, 0]} minDistance={1} maxDistance={30} enablePan={true} />
            </Suspense>
            <Loader onLoaded={() => setIsAssetsLoaded(true)} />
          </Canvas>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 100, pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto' }}>
            <button onClick={handleVoteClick} style={{ width: 44, height: 44, borderRadius: '50%', background: showVoteModal ? '#D4AF68' : 'rgba(42, 32, 28, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: showVoteModal ? '#1A120E' : '#E8E0D5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><CheckSquare size={20} /></button>
            <button onClick={() => setShowMemberInfo(!showMemberInfo)} style={{ width: 44, height: 44, borderRadius: '50%', background: showMemberInfo ? '#D4AF68' : 'rgba(42, 32, 28, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: showMemberInfo ? '#1A120E' : '#E8E0D5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Info size={20} /></button>
            <button onClick={() => setShowTranscript(!showTranscript)} style={{ height: 44, padding: '0 20px', borderRadius: 22, background: showTranscript ? '#D4AF68' : 'rgba(42, 32, 28, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: showTranscript ? '#1A120E' : '#E8E0D5', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><FileText size={16} /> TRANSCRIPT</button>
            <button onClick={() => setIsModelsMuted(!isModelsMuted)} style={{ height: 44, padding: '0 20px', borderRadius: 22, background: isModelsMuted ? '#8A3A3A' : 'rgba(42, 32, 28, 0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8E0D5', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{isModelsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />} {isModelsMuted ? "UNMUTE" : "MUTE"}</button>
          </div>

          <div style={{ flex: 1, margin: '0 20px', pointerEvents: 'auto', background: 'rgba(42, 32, 28, 0.9)', backdropFilter: 'blur(10px)', border: currentSpeaker === "User" && isWsConnected ? '1px solid #ffaa00' : '1px solid rgba(196, 168, 111, 0.3)', borderRadius: 24, display: 'flex', alignItems: 'flex-end', padding: '8px 16px', maxWidth: 800 }}>
            <textarea
              ref={inputRef}
              value={userMessage}
              onChange={handleInputResize}
              placeholder={!isWsConnected ? "Connecting to AI..." : (speakingCharacter ? `${speakingCharacter} is speaking...` : (currentSpeaker === "User" ? "It's your turn to speak..." : `${currentSpeaker}...`))}
              disabled={currentSpeaker !== "User" || speakingCharacter !== null || !isWsConnected}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#E8E0D5', fontSize: 14, resize: 'none', maxHeight: '120px', minHeight: '24px', lineHeight: '24px', opacity: (currentSpeaker === "User" && !speakingCharacter && isWsConnected) ? 1 : 0.5 }}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            />
            <button onClick={handleContinue} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 2, marginRight: 8, opacity: skipsUsed >= 3 ? 0.3 : 1 }}><FastForward size={14} color="#9C8C74" /></button>
            <button onClick={handleSendMessage} disabled={!isWsConnected} style={{ width: 32, height: 32, borderRadius: '50%', background: (currentSpeaker === "User" && !speakingCharacter && isWsConnected) ? '#ffaa00' : '#3E2F26', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isWsConnected ? 'pointer' : 'not-allowed', marginBottom: 2 }}><Send size={16} color="#1A120E" /></button>
          </div>

          <div style={{ pointerEvents: 'auto' }}>
            <button onClick={() => setShowEndConfirm(true)} style={{ padding: '0 24px', height: 44, borderRadius: 22, background: '#8A3A3A', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              <PhoneOff size={16} /> END MEETING
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showReport) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#E8E0D5', background: '#1A120E', padding: 40, borderRadius: 12, border: '1px solid rgba(196,168,111,0.2)' }}>
          <PremiumLogo size={48} />
          <h1 style={{ fontFamily: 'serif', margin: '20px 0 10px 0' }}>SESSION CONCLUDED</h1>
          <p style={{ color: '#9C8C74', marginBottom: 30 }}>Session duration: {formatTime(3600 - sessionTime)}</p>
          <button onClick={() => {
            window.location.reload();
          }} style={{ background: '#D4AF68', color: '#1A120E', border: 'none', padding: '12px 24px', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return null;
};

// --- MAIN APP COMPONENT ---
const App = () => {
  return (
    <>
      <Boardroom
        meetingTopic="Strategic Discussion"
        meetingAim="Review board objectives and optimize executive strategy."
      />
    </>
  );
};

export default App;