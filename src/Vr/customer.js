import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFBX, useAnimations, OrbitControls, useGLTF, Environment, useProgress } from '@react-three/drei';
import {
  Hexagon, PhoneOff, Send,
  FileText, Volume2, VolumeX, X, Info, AlertTriangle, Play,
  FastForward, BarChart, ShieldCheck, ThumbsUp, ThumbsDown, Clock,
  Activity, Target, Brain, TrendingUp, TrendingDown, Zap, Grid
} from 'lucide-react';
import * as THREE from 'three';

// --- BACKEND API URL ---
const BACKEND_API_URL = "http://localhost:8000/api/v1";

// --- CSS STYLES FOR NEW LOADER & ANIMATIONS ---
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  .loader-container {
    position: relative;
    width: 160px;
    height: 160px;
    transform-style: preserve-3d;
    perspective: 1200px;
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
    box-shadow: 0 0 20px #ffaa00, 0 0 40px rgba(255, 170, 0, 0.6);
    animation: nodePulse 1.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
  }
  .thread {
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(255, 170, 0, 0.8), transparent);
    box-shadow: 0 0 10px rgba(255, 170, 0, 0.5);
    transform-origin: center;
  }
  .t1 { width: 100%; height: 2px; top: 30%; left: 0; animation: weave1 2s infinite; }
  .t2 { width: 2px; height: 100%; top: 0; left: 70%; animation: weave2 2.2s infinite; }
  .t3 { width: 100%; height: 2px; bottom: 30%; left: 0; animation: weave3 2.4s infinite; }
  .t4 { width: 2px; height: 100%; top: 0; left: 30%; animation: weave4 2.6s infinite; }
  @keyframes nodePulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px #ffaa00, 0 0 40px rgba(255, 170, 0, 0.6); }
    50% { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 30px #ffaa00, 0 0 60px rgba(255, 170, 0, 0.8); }
  }
  @keyframes weave1 { 0%, 100% { transform: translateY(0) rotateX(0deg); opacity: 0.8; } 50% { transform: translateY(40px) rotateX(60deg); opacity: 1; } }
  @keyframes weave2 { 0%, 100% { transform: translateX(0) rotateY(0deg); opacity: 0.8; } 50% { transform: translateX(-40px) rotateY(60deg); opacity: 1; } }
  @keyframes weave3 { 0%, 100% { transform: translateY(0) rotateX(0deg); opacity: 0.8; } 50% { transform: translateY(-40px) rotateX(-60deg); opacity: 1; } }
  @keyframes weave4 { 0%, 100% { transform: translateX(0) rotateY(0deg); opacity: 0.8; } 50% { transform: translateX(40px) rotateY(-60deg); opacity: 1; } }
  
  .word-pop {
    display: inline-block;
    animation: wordFadeIn 0.2s ease forwards;
    opacity: 0;
    margin-right: 4px;
  }
  @keyframes wordFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  .matrix-cell {
    aspect-ratio: 1;
    background: rgba(212, 175, 104, 0.05);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  .matrix-cell:hover {
    background: rgba(212, 175, 104, 0.2);
    border-color: rgba(212, 175, 104, 0.4);
  }
`;
document.head.appendChild(styleTag);

// --- 1. CONFIGURATIONS ---

const ALL_CUSTOMERS = ["Cus1", "Cus2", "Cus3", "Cus4", "Cus5", "Cus6"];

const VOICE_MAP = {
  "Cus1": { gender: 'female', lang: 'en-US' },
  "Cus2": { gender: 'male', lang: 'en-US' },
  "Cus3": { gender: 'female', lang: 'en-GB' },
  "Cus4": { gender: 'male', lang: 'en-GB' },
  "Cus5": { gender: 'female', lang: 'en-US' },
  "Cus6": { gender: 'male', lang: 'en-US' }
};

// --- 2. ANIMATION CLEANER ---
const cleanAnimation = (clip) => {
  if (!clip) return null;
  const newClip = clip.clone();
  newClip.tracks = newClip.tracks.filter(track =>
    !track.name.toLowerCase().includes('position')
  );
  return newClip;
};

// --- 3. BACKGROUND ---
const Background = () => {
  const { scene } = useGLTF("/customer.glb");
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />;
};

// --- 4. CUSTOMER CONTROLLERS WITH SMOOTH TRANSITIONS ---

const Customer1Controller = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/cus1pose.fbx");
  const talkAnim = useFBX("/cus1talk.fbx");
  const cantUnderstandAnim = useFBX("/cus1cantunderstand.fbx");
  const clapAnim = useFBX("/cus1clap.fbx");
  const noAnim = useFBX("/cus1no.fbx");

  useEffect(() => {
    [base, talkAnim, cantUnderstandAnim, clapAnim, noAnim].forEach(model => {
      model.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) { const clip = cleanAnimation(base.animations[0]); clip.name = "Idle"; animations.push(clip); }
    if (talkAnim.animations[0]) { const clip = cleanAnimation(talkAnim.animations[0]); clip.name = "Talk"; animations.push(clip); }
    if (cantUnderstandAnim.animations[0]) { const clip = cleanAnimation(cantUnderstandAnim.animations[0]); clip.name = "Think"; animations.push(clip); }
    if (clapAnim.animations[0]) { const clip = cleanAnimation(clapAnim.animations[0]); clip.name = "Clap"; animations.push(clip); }
    if (noAnim.animations[0]) { const clip = cleanAnimation(noAnim.animations[0]); clip.name = "No"; animations.push(clip); }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const targetAnim = animation || "Idle";
    const currentAction = actions[targetAnim];

    if (currentAction) {
      // SMOOTH TRANSITION: Longer fade time, reset action
      Object.keys(actions).forEach((key) => {
        if (key !== targetAnim && actions[key].isRunning()) {
          actions[key].fadeOut(0.5); // Smooth fade out
        }
      });

      currentAction.reset().fadeIn(0.5).play();
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.000008} position={[-1.4, -1.2, -2.9]} rotation={[0, 0, 0]} /></group>;
};

const Customer2Controller = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/cus2pose.fbx");
  const talkAnim = useFBX("/cus2talk.fbx");
  const clapAnim = useFBX("/cus2clap.fbx");
  const listenAnim = useFBX("/cus2listen.fbx");
  const noAnim = useFBX("/cus2no.fbx");

  useEffect(() => {
    [base, talkAnim, clapAnim, listenAnim, noAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) { const clip = cleanAnimation(base.animations[0]); clip.name = "Idle"; animations.push(clip); }
    if (talkAnim.animations[0]) { const clip = cleanAnimation(talkAnim.animations[0]); clip.name = "Talk"; animations.push(clip); }
    if (clapAnim.animations[0]) { const clip = cleanAnimation(clapAnim.animations[0]); clip.name = "Clap"; animations.push(clip); }
    if (listenAnim.animations[0]) { const clip = cleanAnimation(listenAnim.animations[0]); clip.name = "Listen"; animations.push(clip); }
    if (noAnim.animations[0]) { const clip = cleanAnimation(noAnim.animations[0]); clip.name = "No"; animations.push(clip); }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const targetAnim = animation || "Idle";
    const currentAction = actions[targetAnim];

    if (currentAction) {
      Object.keys(actions).forEach((key) => {
        if (key !== targetAnim && actions[key].isRunning()) {
          actions[key].fadeOut(0.5);
        }
      });
      currentAction.reset().fadeIn(0.5).play();
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.00001} position={[1.1, -0.4, -1.9]} rotation={[0, -0.5, 0]} /></group>;
};

const Customer3Controller = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/cus3pose.fbx");
  const talkAnim = useFBX("/cus3talk.fbx");
  const angryAnim = useFBX("/cus3angry.fbx");
  const clapAnim = useFBX("/cus3clap.fbx");
  const noAnim = useFBX("/cus3no.fbx");

  useEffect(() => {
    [base, talkAnim, angryAnim, clapAnim, noAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) { const clip = cleanAnimation(base.animations[0]); clip.name = "Idle"; animations.push(clip); }
    if (talkAnim.animations[0]) { const clip = cleanAnimation(talkAnim.animations[0]); clip.name = "Talk"; animations.push(clip); }
    if (angryAnim.animations[0]) { const clip = cleanAnimation(angryAnim.animations[0]); clip.name = "Angry"; animations.push(clip); }
    if (clapAnim.animations[0]) { const clip = cleanAnimation(clapAnim.animations[0]); clip.name = "Clap"; animations.push(clip); }
    if (noAnim.animations[0]) { const clip = cleanAnimation(noAnim.animations[0]); clip.name = "No"; animations.push(clip); }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const targetAnim = animation || "Idle";
    const currentAction = actions[targetAnim];

    if (currentAction) {
      Object.keys(actions).forEach((key) => {
        if (key !== targetAnim && actions[key].isRunning()) {
          actions[key].fadeOut(0.5);
        }
      });
      currentAction.reset().fadeIn(0.5).play();
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.00023} position={[-2.2, -1.12, -1.7]} rotation={[0, 1.4, 0]} /></group>;
};

const Customer4Controller = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/cus4pose.fbx");
  const talkAnim = useFBX("/cus4talk.fbx");
  const clapAnim = useFBX("/cus4clap.fbx");
  const listenAnim = useFBX("/cus4listen.fbx");
  const noAnim = useFBX("/cus4no.fbx");

  useEffect(() => {
    [base, talkAnim, clapAnim, listenAnim, noAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) { const clip = cleanAnimation(base.animations[0]); clip.name = "Idle"; animations.push(clip); }
    if (talkAnim.animations[0]) { const clip = cleanAnimation(talkAnim.animations[0]); clip.name = "Talk"; animations.push(clip); }
    if (clapAnim.animations[0]) { const clip = cleanAnimation(clapAnim.animations[0]); clip.name = "Clap"; animations.push(clip); }
    if (listenAnim.animations[0]) { const clip = cleanAnimation(listenAnim.animations[0]); clip.name = "Listen"; animations.push(clip); }
    if (noAnim.animations[0]) { const clip = cleanAnimation(noAnim.animations[0]); clip.name = "No"; animations.push(clip); }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const targetAnim = animation || "Idle";
    const currentAction = actions[targetAnim];

    if (currentAction) {
      Object.keys(actions).forEach((key) => {
        if (key !== targetAnim && actions[key].isRunning()) {
          actions[key].fadeOut(0.5);
        }
      });
      currentAction.reset().fadeIn(0.5).play();
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.01} position={[-2.2, -2.25, -0.8]} rotation={[0, 1.4, 0]} /></group>;
};

const Customer5Controller = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/cus5pose.fbx");
  const talkAnim = useFBX("/cus5talk.fbx");
  const clapAnim = useFBX("/cus5clap.fbx");
  const noAnim = useFBX("/cus5no.fbx");
  const ohAnim = useFBX("/cus5oh.fbx");

  useEffect(() => {
    [base, talkAnim, clapAnim, noAnim, ohAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) { const clip = cleanAnimation(base.animations[0]); clip.name = "Idle"; animations.push(clip); }
    if (talkAnim.animations[0]) { const clip = cleanAnimation(talkAnim.animations[0]); clip.name = "Talk"; animations.push(clip); }
    if (clapAnim.animations[0]) { const clip = cleanAnimation(clapAnim.animations[0]); clip.name = "Clap"; animations.push(clip); }
    if (noAnim.animations[0]) { const clip = cleanAnimation(noAnim.animations[0]); clip.name = "No"; animations.push(clip); }
    if (ohAnim.animations[0]) { const clip = cleanAnimation(ohAnim.animations[0]); clip.name = "Oh"; animations.push(clip); }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const targetAnim = animation || "Idle";
    const currentAction = actions[targetAnim];

    if (currentAction) {
      Object.keys(actions).forEach((key) => {
        if (key !== targetAnim && actions[key].isRunning()) {
          actions[key].fadeOut(0.5);
        }
      });
      currentAction.reset().fadeIn(0.5).play();
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.0082} position={[-0.8, -1.25, -2.85]} rotation={[0, 0, 0]} /></group>;
};

const Customer6Controller = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/cus6pose.fbx");
  const talkAnim = useFBX("/cus6talk.fbx");
  const angryAnim = useFBX("/cus6angry.fbx");
  const clapAnim = useFBX("/cus6clap.fbx");
  const damitAnim = useFBX("/cus6damit.fbx");

  useEffect(() => {
    [base, talkAnim, angryAnim, clapAnim, damitAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) { const clip = cleanAnimation(base.animations[0]); clip.name = "Idle"; animations.push(clip); }
    if (talkAnim.animations[0]) { const clip = cleanAnimation(talkAnim.animations[0]); clip.name = "Talk"; animations.push(clip); }
    if (angryAnim.animations[0]) { const clip = cleanAnimation(angryAnim.animations[0]); clip.name = "Angry"; animations.push(clip); }
    if (clapAnim.animations[0]) { const clip = cleanAnimation(clapAnim.animations[0]); clip.name = "Clap"; animations.push(clip); }
    if (damitAnim.animations[0]) { const clip = cleanAnimation(damitAnim.animations[0]); clip.name = "Damit"; animations.push(clip); }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;
    const targetAnim = animation || "Idle";
    const currentAction = actions[targetAnim];

    if (currentAction) {
      Object.keys(actions).forEach((key) => {
        if (key !== targetAnim && actions[key].isRunning()) {
          actions[key].fadeOut(0.5);
        }
      });
      currentAction.reset().fadeIn(0.5).play();
    }
  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.008} position={[-0.2, -1.25, -2.8]} rotation={[0, 0, 0]} /></group>;
};

// --- 5. UPDATED LOADING SPINNER ---
const Loader = () => {
  const { active } = useProgress();
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000000', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader-container">
        <div className="thread t1"></div>
        <div className="thread t2"></div>
        <div className="thread t3"></div>
        <div className="thread t4"></div>
        <div className="node"></div>
      </div>
    </div>
  );
};

// --- 6. SATISFACTION BOARD (CREATIVE GRAPHS WITH SPACING) ---
const SatisfactionBoard = ({ onClose, customers, performanceScore }) => {
  const getColor = (val) => val >= 75 ? '#5D7A58' : val <= 35 ? '#8A3A3A' : '#D4AF68';

  return (
    <div style={{
      position: 'absolute', top: 80, right: 40, bottom: 100, width: 400,
      background: 'rgba(26, 18, 14, 0.95)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(196, 168, 111, 0.2)', borderRadius: 8,
      display: 'flex', flexDirection: 'column', zIndex: 90,
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} color="#D4AF68" /><span style={{ color: '#D4AF68', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>PSYCHOLOGICAL METRICS</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C74' }}><X size={14} /></button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Trust Accumulation & Betrayal Graph */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#E8E0D5', fontWeight: 600 }}>Trust Accumulation & Betrayal Graph</span>
            <TrendingUp size={14} color="#5D7A58" />
          </div>
          <div style={{ height: 80, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <path d="M0 60 Q 50 20, 100 55 T 200 30 T 400 50" fill="none" stroke="#D4AF68" strokeWidth="2" />
              <path d="M0 70 Q 80 65, 150 68 T 400 69" fill="none" stroke="#8A3A3A" strokeWidth="1" strokeDasharray="4" />
            </svg>
          </div>
        </div>

        {/* Perception vs Reality Gap Chart */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#E8E0D5', fontWeight: 600 }}>Perception vs Reality Gap Chart</span>
            <Zap size={14} color="#D4AF68" />
          </div>
          <div style={{ display: 'flex', gap: 6, height: 60, alignItems: 'flex-end' }}>
            {[35, 75, 50, 95, 60, 85, 40, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i % 2 === 0 ? 'rgba(212, 175, 104, 0.3)' : '#D4AF68', borderRadius: '2px 2px 0 0', transition: 'height 0.5s ease' }} />
            ))}
          </div>
        </div>

        {/* Expectation Inflation Curve */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#E8E0D5', fontWeight: 600 }}>Expectation Inflation Curve</span>
            <TrendingDown size={14} color="#8A3A3A" />
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #5D7A58, #D4AF68, #8A3A3A)', borderRadius: 3 }} />
          </div>
        </div>

        {/* SIMULATION FIDELITY */}
        <div style={{ padding: '20px', background: 'rgba(212, 175, 104, 0.05)', border: '1px solid rgba(212, 175, 104, 0.15)', borderRadius: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={14} color="#D4AF68" /><span style={{ color: '#D4AF68', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>SIMULATION FIDELITY</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: '#E8E0D5', fontSize: 10 }}>Agent Performance Sync</span><span style={{ color: getColor(performanceScore), fontSize: 14, fontWeight: 700 }}>{performanceScore}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <div style={{ width: `${performanceScore}%`, height: '100%', background: getColor(performanceScore), borderRadius: 2 }} />
          </div>
        </div>

        {/* Final Customer Reality Matrix */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: '#E8E0D5', fontWeight: 600, letterSpacing: '0.05em' }}>FINAL CUSTOMER REALITY MATRIX</span>
            <Grid size={14} color="#D4AF68" />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '4px',
            padding: '12px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="matrix-cell"
                style={{
                  opacity: 0.2 + (Math.random() * 0.8),
                  backgroundColor: Math.random() > 0.8 ? '#D4AF68' : 'rgba(212, 175, 104, 0.1)'
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 8, color: '#5E4F40', textTransform: 'uppercase' }}>Subconscious Bias</span>
            <span style={{ fontSize: 8, color: '#5E4F40', textTransform: 'uppercase' }}>Resolution Vector</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- 7. WORD-BY-WORD TEXT COMPONENT ---
const TypewriterText = ({ text, onComplete }) => {
  const [displayedWords, setDisplayedWords] = useState([]);
  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    setDisplayedWords([]);
    let index = 0;
    const interval = setInterval(() => {
      if (index < words.length) {
        setDisplayedWords(prev => [...prev, words[index]]);
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 150);
    return () => clearInterval(interval);
  }, [words, onComplete]);

  return (
    <>
      {displayedWords.map((word, i) => (
        <span key={i} className="word-pop">{word} </span>
      ))}
    </>
  );
};

// --- 8. MAIN APP COMPONENT WITH FIXED STATE MANAGEMENT ---
const CustomerService = ({ onBack }) => {
  const [config] = useState({ title: "AGIOAS", focusMode: true });
  const [sessionId, setSessionId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showSatisfactionBoard, setShowSatisfactionBoard] = useState(false);
  const [sessionTime, setSessionTime] = useState(1800);
  const [responseTimer, setResponseTimer] = useState(180);
  const [isModelsMuted, setIsModelsMuted] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  // FIX: Add missing state variables for animations
  const [characterAnimations, setCharacterAnimations] = useState({
    Cus1: "Idle",
    Cus2: "Idle",
    Cus3: "Idle",
    Cus4: "Idle",
    Cus5: "Idle",
    Cus6: "Idle"
  });
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isThinking, setIsThinking] = useState(false);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(65);

  const transcriptEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthRef = useRef(null);
  const availableVoicesRef = useRef([]);
  const { active: assetsLoading } = useProgress();

  const [transcript, setTranscript] = useState([
    { sender: "System", text: "Simulation Protocol Initiated.", time: "00:00" }
  ]);

  const [customerConfig, setCustomerConfig] = useState([
    { id: 1, name: "Cus1", issue: "Order Delay", satisfaction: 40 },
    { id: 2, name: "Cus2", issue: "Billing Error", satisfaction: 55 },
    { id: 3, name: "Cus3", issue: "Defective Item", satisfaction: 30 },
    { id: 4, name: "Cus4", issue: "Login Issue", satisfaction: 65 },
    { id: 5, name: "Cus5", issue: "Refund Status", satisfaction: 50 },
    { id: 6, name: "Cus6", issue: "Tech Support", satisfaction: 45 },
  ]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
      const loadVoices = () => { availableVoicesRef.current = speechSynthRef.current.getVoices(); };
      loadVoices();
      if (speechSynthRef.current.onvoiceschanged !== undefined) speechSynthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (!assetsLoading && !sessionId) {
      let mounted = true;

      const initializeAuthenticatedSession = async () => {
        try {
          console.log('🚀 Starting Customer 3D session with authentication...');
          const { sessionAPI } = await import('../services/api');

          const response = await sessionAPI.start('customer', '3d', config || {});

          if (!mounted) return;

          const authenticatedSessionId = response.data.session.session_id;
          setSessionId(authenticatedSessionId);
          console.log('✅ Authenticated session started:', authenticatedSessionId);

          // [KEEP ALL YOUR ORIGINAL 3D SCENE INITIALIZATION CODE BELOW HERE]

          const speaker = response.data.speaker || ALL_CUSTOMERS[Math.floor(Math.random() * ALL_CUSTOMERS.length)];
          const initialMsg = response.data.initial_message || "Hello, I have a problem with my order.";

          setTranscript(prev => [...prev, { sender: speaker, text: initialMsg, time: "00:00" }]);
          setCurrentSpeaker(speaker);

          // FIX: Update animations properly
          setCharacterAnimations(prev => ({ ...prev, [speaker]: "Talk" }));
          setIsSpeaking(true);

          speakText(initialMsg, speaker, () => {
            setCurrentSpeaker(null);
            setCharacterAnimations(prev => ({ ...prev, [speaker]: "Idle" }));
            setIsSpeaking(false);
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
    }
  }, [assetsLoading, sessionId]);

  const speakText = (text, speakerName, onEndCallback) => {
    if (!speechSynthRef.current || isModelsMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }
    speechSynthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = availableVoicesRef.current;
    const config = VOICE_MAP[speakerName] || { gender: 'female', lang: 'en-US' };
    const voice = voices.find(v => v.lang === config.lang && v.name.toLowerCase().includes(config.gender)) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.onend = () => { if (onEndCallback) onEndCallback(); };
    speechSynthRef.current.speak(utterance);
  };

  useEffect(() => {
    const handleVisibilityChange = () => { if (document.hidden && isMeetingStarted && !showReport) setIsPaused(true); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isMeetingStarted, showReport]);

  useEffect(() => {
    let interval;
    if (isMeetingStarted && !isPaused && !showReport) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev <= 1 ? 0 : prev - 1);
        setResponseTimer((prev) => prev <= 1 ? 180 : prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingStarted, isPaused, showReport]);

  useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [transcript, showTranscript]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => { setIsMeetingStarted(false); setShowReport(true); };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !sessionId) return;
    setTranscript(prev => [...prev, { sender: "You (Agent)", text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    const messageToSend = userMessage;
    setUserMessage("");
    setResponseTimer(180);
    setIsThinking(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/sessions/${sessionId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });
      const data = await response.json();

      // Handle responses array
      const responses = data.responses || [];

      setIsThinking(false);

      // Process each response (may have multiple customers responding)
      for (const responseData of responses) {
        const responseText = responseData.message || responseData.response;
        const speaker = responseData.speaker || ALL_CUSTOMERS[Math.floor(Math.random() * ALL_CUSTOMERS.length)];
        const animation = responseData.animation || "Talk";
        const emotion = responseData.emotion || "neutral";

        setCurrentSpeaker(speaker);
        setCurrentEmotion(emotion);

        // FIX: Set animation for specific speaker
        setCharacterAnimations(prev => ({ ...prev, [speaker]: animation }));
        setIsSpeaking(true);

        if (responseData.performance_score) setPerformanceScore(responseData.performance_score);

        setTranscript(prev => [...prev, { sender: speaker, text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

        // Wait for speech to complete before next response
        await new Promise((resolve) => {
          speakText(responseText, speaker, () => {
            setCharacterAnimations(prev => ({ ...prev, [speaker]: "Idle" }));
            setIsSpeaking(false);
            resolve();
          });
        });

        // Small delay between multiple responses
        if (responses.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setCurrentSpeaker(null);

    } catch (error) {
      console.error("Chat error:", error);
      setIsThinking(false);
      const mockSpeaker = ALL_CUSTOMERS[Math.floor(Math.random() * ALL_CUSTOMERS.length)];
      const mockReply = "I see. Please expedite the process.";
      setCurrentSpeaker(mockSpeaker);
      setCharacterAnimations(prev => ({ ...prev, [mockSpeaker]: "Talk" }));
      setIsSpeaking(true);
      setTranscript(prev => [...prev, { sender: mockSpeaker, text: mockReply, time: "Now" }]);
      speakText(mockReply, mockSpeaker, () => {
        setCurrentSpeaker(null);
        setCharacterAnimations(prev => ({ ...prev, [mockSpeaker]: "Idle" }));
        setIsSpeaking(false);
      });
    }
  };

  const handleContinue = () => {
    if (skipsUsed >= 3) return;
    setSkipsUsed(prev => prev + 1);
    const nextSpeaker = ALL_CUSTOMERS[Math.floor(Math.random() * ALL_CUSTOMERS.length)];
    const replyText = "Fine. I will wait.";
    setCurrentSpeaker(nextSpeaker);
    setCharacterAnimations(prev => ({ ...prev, [nextSpeaker]: "Talk" }));
    setIsSpeaking(true);
    speakText(replyText, nextSpeaker, () => {
      setCurrentSpeaker(null);
      setCharacterAnimations(prev => ({ ...prev, [nextSpeaker]: "Idle" }));
      setIsSpeaking(false);
    });
  };

  const handleExitFull = () => {
    if (speechSynthRef.current) speechSynthRef.current.cancel();
    setShowReport(false);
    setIsMeetingStarted(true);
    setSessionTime(1800);
    setTranscript([{ sender: "System", text: "Session restarted.", time: "00:00" }]);
    setCharacterAnimations({
      Cus1: "Idle",
      Cus2: "Idle",
      Cus3: "Idle",
      Cus4: "Idle",
      Cus5: "Idle",
      Cus6: "Idle"
    });
    if (onBack) onBack();
  }

  if (showReport) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 800, background: '#1A120E', border: '1px solid #D4AF68', borderRadius: 8, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}><img src="/logo.png" alt="Logo" style={{ width: 60, height: 60, marginBottom: 16 }} /><h2 style={{ fontSize: 32, fontFamily: 'serif', color: '#E8E0D5', margin: 0 }}>INTELLIGENCE REPORT</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><BarChart size={20} color="#D4AF68" /><span style={{ fontSize: 14, fontWeight: 700, color: '#E8E0D5' }}>SUCCESS RATE</span></div>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#D4AF68' }}>{performanceScore}%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><ShieldCheck size={20} color="#D4AF68" /><span style={{ fontSize: 14, fontWeight: 700, color: '#E8E0D5' }}>FEEDBACK</span></div>
              <div style={{ color: '#E8E0D5', fontSize: 13 }}>Optimized engagement strategy detected.</div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}><button onClick={handleExitFull} style={{ background: 'none', border: 'none', color: '#D4AF68', cursor: 'pointer' }}>RESTART SIMULATION</button></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 70, display: 'flex', flexDirection: 'column' }}>
      <Loader />
      {isPaused && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(15, 10, 8, 0.95)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
          <img src="logo.png" alt="Logo" style={{ width: 100, height: 100, animation: 'pulse 2s infinite' }} />
          <h2 style={{ fontSize: 32, fontFamily: 'serif', color: '#E8E0D5', margin: 0 }}>EXECUTIVE PAUSE</h2>
          <button onClick={() => setIsPaused(false)} style={{ padding: '16px 48px', background: '#D4AF68', border: 'none', borderRadius: 4, color: '#1A120E', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}><Play size={16} fill="#1A120E" /> RESUME SESSION</button>
        </div>
      )}

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 70, background: 'linear-gradient(180deg, rgba(15, 10, 8, 0.9) 0%, transparent 100%)', zIndex: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 10, color: '#D4AF68', letterSpacing: '0.15em', fontWeight: 700 }}>NEURAL SIMULATION</span><span style={{ fontSize: 20, color: '#E8E0D5', fontFamily: 'serif' }}>{config.title}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: 4, border: '1px solid rgba(212, 175, 104, 0.2)' }}><Clock size={16} color="#D4AF68" /><span style={{ fontSize: 16, fontFamily: 'monospace', color: '#E8E0D5' }}>{formatTime(sessionTime)}</span></div>
        </div>
      </div>

      {showTranscript && (
        <div style={{ position: 'absolute', top: 80, left: 40, bottom: 100, width: 360, background: 'rgba(26, 18, 14, 0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196, 168, 111, 0.2)', borderRadius: 8, display: 'flex', flexDirection: 'column', zIndex: 90 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: '#D4AF68', fontSize: 12, fontWeight: 700 }}>TRANSCRIPT</span><button onClick={() => setShowTranscript(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C8C74' }}><X size={14} /></button></div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {transcript.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: msg.sender.includes("You") ? '#D4AF68' : '#E8E0D5', fontSize: 11, fontWeight: 700 }}>{msg.sender}</span>
                <div style={{ color: '#9C8C74', fontSize: 13, lineHeight: 1.4 }}>
                  {idx === transcript.length - 1 && msg.sender !== "You (Agent)" && msg.sender !== "System" ? <TypewriterText text={msg.text} /> : msg.text}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {showSatisfactionBoard && <SatisfactionBoard onClose={() => setShowSatisfactionBoard(false)} customers={customerConfig} performanceScore={performanceScore} />}

      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <Environment preset="city" />
            <Background />
            <Customer1Controller animation={characterAnimations.Cus1} />
            <Customer2Controller animation={characterAnimations.Cus2} />
            <Customer3Controller animation={characterAnimations.Cus3} />
            <Customer4Controller animation={characterAnimations.Cus4} />
            <Customer5Controller animation={characterAnimations.Cus5} />
            <Customer6Controller animation={characterAnimations.Cus6} />
            <OrbitControls target={[0, 0, 0]} enableDamping={true} />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: 12, pointerEvents: 'auto' }}>
          <button onClick={() => setShowSatisfactionBoard(!showSatisfactionBoard)} style={{ width: 44, height: 44, borderRadius: '50%', background: showSatisfactionBoard ? '#D4AF68' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: showSatisfactionBoard ? '#1A120E' : '#E8E0D5', cursor: 'pointer' }}><Info size={20} /></button>
          <button onClick={() => setShowTranscript(!showTranscript)} style={{ height: 44, padding: '0 20px', borderRadius: 22, background: showTranscript ? '#D4AF68' : 'rgba(255,255,255,0.05)', color: showTranscript ? '#1A120E' : '#E8E0D5', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><FileText size={16} /> DATA FEED</button>
          <button onClick={() => setIsModelsMuted(!isModelsMuted)} style={{ height: 44, padding: '0 20px', borderRadius: 22, background: isModelsMuted ? '#8A3A3A' : 'rgba(255,255,255,0.05)', color: '#E8E0D5', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>{isModelsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        </div>
        <div style={{ flex: 1, margin: '0 20px', pointerEvents: 'auto', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', border: '1px solid #D4AF68', borderRadius: 24, display: 'flex', alignItems: 'flex-end', padding: '8px 16px', maxWidth: 800 }}>
          <textarea ref={inputRef} value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Type simulation response..." disabled={currentSpeaker !== null || isThinking} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#E8E0D5', fontSize: 14, resize: 'none' }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
          <button onClick={handleContinue} disabled={currentSpeaker !== null || isThinking} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', marginRight: 8 }}><FastForward size={14} color="#9C8C74" /></button>
          <button onClick={handleSendMessage} disabled={currentSpeaker !== null || isThinking} style={{ width: 32, height: 32, borderRadius: '50%', background: '#D4AF68', border: 'none', cursor: 'pointer' }}><Send size={16} color="#1A120E" /></button>
        </div>
        <div style={{ pointerEvents: 'auto' }}><button onClick={handleEndSession} style={{ padding: '0 24px', height: 44, borderRadius: 22, background: '#8A3A3A', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><PhoneOff size={16} /> ABORT SESSION</button></div>
      </div>
    </div>
  );
};

export default CustomerService;