// App.js - COMPLETE UPDATED FRONTEND CODE
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFBX, useAnimations, OrbitControls, useGLTF, Environment, useProgress } from '@react-three/drei';
import {
  Video, Mic, Wifi, Check,
  Hexagon, MicOff, PhoneOff, Send,
  FileText, Volume2, VolumeX, X, Info, AlertTriangle, Play,
  FastForward, Download, BarChart, ShieldCheck, ThumbsUp, ThumbsDown, Clock,
  User, Settings, FilePlus, ChevronDown, Lock, Maximize, History, Pencil, Activity,
  TrendingUp, Brain, Target, Zap, Crown
} from 'lucide-react';

// --- BACKEND API URL ---
const BACKEND_API_URL = "http://localhost:8000/api/v1";

// --- LOGO URL ---
const LOGO_URL = "https://via.placeholder.com/150x50/D4AF68/1A120E?text=AGIOAS"; // Replace with your actual logo path

// --- THEME: THE EXECUTIVE SUITE (FROM BOARDROOM.JS) ---
const EXECUTIVE_THEME = `
  :root {
    --bg-app: #1c1410;
    --bg-sidebar: #1b110d;
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
  }
`;

// --- TTS VOICES CONFIGURATION ---
const TTS_VOICES = [
  { name: 'Microsoft David - English (United States)', gender: 'male', lang: 'en-US' },
  { name: 'Microsoft Mark - English (United States)', gender: 'male', lang: 'en-US' },
  { name: 'Google US English Male', gender: 'male', lang: 'en-US' },
  { name: 'Microsoft Zira - English (United States)', gender: 'female', lang: 'en-US' },
  { name: 'Google US English Female', gender: 'female', lang: 'en-US' }
];

// --- 1. BACKGROUND ROOM (ROTATED) ---
const Background = () => {
  const { scene } = useGLTF("/vcs.glb");
  return <primitive object={scene} scale={1} position={[0, -1, 0]} rotation={[0, 3.875, 0]} />;
};

// --- 2. CHARACTER CONTROLLERS ---

const ArsitController = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/arsit.fbx");
  const talkAnim = useFBX("/artalk.fbx");
  const appreciateAnim = useFBX("/arapriciate.fbx");
  const angryAnim = useFBX("/ararnry.fbx");
  const dealDoneAnim = useFBX("/ardealdone.fbx");
  const noAnim = useFBX("/arno.fbx");
  const outAnim = useFBX("/arout.fbx");

  useEffect(() => {
    [base, talkAnim, appreciateAnim, angryAnim, dealDoneAnim, noAnim, outAnim].forEach(model => {
      model.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) {
      const clip = base.animations[0].clone();
      clip.name = "Idle";
      animations.push(clip);
    }
    if (talkAnim.animations[0]) {
      const clip = talkAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    if (appreciateAnim.animations[0]) {
      const clip = appreciateAnim.animations[0].clone();
      clip.name = "Nod";
      animations.push(clip);
    }
    if (angryAnim.animations[0]) {
      const clip = angryAnim.animations[0].clone();
      clip.name = "Angry";
      animations.push(clip);
    }
    if (dealDoneAnim.animations[0]) {
      const clip = dealDoneAnim.animations[0].clone();
      clip.name = "DealDone";
      animations.push(clip);
    }
    if (noAnim.animations[0]) {
      const clip = noAnim.animations[0].clone();
      clip.name = "No";
      animations.push(clip);
    }
    if (outAnim.animations[0]) {
      const clip = outAnim.animations[0].clone();
      clip.name = "Out";
      animations.push(clip);
    }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;

    const targetAnim = animation || "Idle";
    const targetAction = actions[targetAnim] || actions["Idle"];

    if (!targetAction) return;

    // Fade out all other animations
    Object.values(actions).forEach(action => {
      if (action !== targetAction && action.isRunning()) {
        action.fadeOut(0.15);
      }
    });

    // Start target animation smoothly
    if (!targetAction.isRunning()) {
      targetAction.reset().play();
    }
    targetAction.fadeIn(0.15).setEffectiveWeight(1);

  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.01} position={[-3.3, -0.9, 1]} rotation={[0, -0.8, 0]} /></group>;
};

const HarrisonController = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/hcidel.fbx");
  const talkAnim = useFBX("/hctalk.fbx");
  const appreciateAnim = useFBX("/hcapricite.fbx");
  const dealDoneAnim = useFBX("/hcdealdone.fbx");
  const focusAnim = useFBX("/hcfocus.fbx");
  const laughAnim = useFBX("/hclaugh.fbx");
  const noAnim = useFBX("/hcno.fbx");
  const observeAnim = useFBX("/hcobserve.fbx");
  const outAnim = useFBX("/hcout.fbx");

  useEffect(() => {
    [base, talkAnim, appreciateAnim, dealDoneAnim, focusAnim, laughAnim, noAnim, observeAnim, outAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) {
      const clip = base.animations[0].clone();
      clip.name = "Idle";
      animations.push(clip);
    }
    if (talkAnim.animations[0]) {
      const clip = talkAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    if (appreciateAnim.animations[0]) {
      const clip = appreciateAnim.animations[0].clone();
      clip.name = "Nod";
      animations.push(clip);
    }
    if (dealDoneAnim.animations[0]) {
      const clip = dealDoneAnim.animations[0].clone();
      clip.name = "DealDone";
      animations.push(clip);
    }
    if (focusAnim.animations[0]) {
      const clip = focusAnim.animations[0].clone();
      clip.name = "Focus";
      animations.push(clip);
    }
    if (laughAnim.animations[0]) {
      const clip = laughAnim.animations[0].clone();
      clip.name = "Laugh";
      animations.push(clip);
    }
    if (noAnim.animations[0]) {
      const clip = noAnim.animations[0].clone();
      clip.name = "No";
      animations.push(clip);
    }
    if (observeAnim.animations[0]) {
      const clip = observeAnim.animations[0].clone();
      clip.name = "Think";
      animations.push(clip);
    }
    if (outAnim.animations[0]) {
      const clip = outAnim.animations[0].clone();
      clip.name = "Out";
      animations.push(clip);
    }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;

    const targetAnim = animation || "Idle";
    const targetAction = actions[targetAnim] || actions["Idle"];

    if (!targetAction) return;

    // Fade out all other animations
    Object.values(actions).forEach(action => {
      if (action !== targetAction && action.isRunning()) {
        action.fadeOut(0.15);
      }
    });

    // Start target animation smoothly
    if (!targetAction.isRunning()) {
      targetAction.reset().play();
    }
    targetAction.fadeIn(0.15).setEffectiveWeight(1);

  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.01} position={[-1.7, -0.9, 1.5]} rotation={[0, -0.8, 0]} /></group>;
};

const SamController = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/samidel.fbx");
  const talkAnim = useFBX("/samtalk.fbx");
  const appreciateAnim = useFBX("/samappriciate.fbx");
  const confusedAnim = useFBX("/samcant understand.fbx");
  const dealDoneAnim = useFBX("/samdealdone.fbx");
  const focusedAnim = useFBX("/samfocused.fbx");
  const laughAnim = useFBX("/samlaugh.fbx");
  const noAnim = useFBX("/samno.fbx");
  const outAnim = useFBX("/samout.fbx");
  const thinkAnim = useFBX("/samthink.fbx");

  useEffect(() => {
    [base, talkAnim, appreciateAnim, confusedAnim, dealDoneAnim, focusedAnim, laughAnim, noAnim, outAnim, thinkAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) {
      const clip = base.animations[0].clone();
      clip.name = "Idle";
      animations.push(clip);
    }
    if (talkAnim.animations[0]) {
      const clip = talkAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    if (appreciateAnim.animations[0]) {
      const clip = appreciateAnim.animations[0].clone();
      clip.name = "Nod";
      animations.push(clip);
    }
    if (confusedAnim.animations[0]) {
      const clip = confusedAnim.animations[0].clone();
      clip.name = "Think";
      animations.push(clip);
    }
    if (dealDoneAnim.animations[0]) {
      const clip = dealDoneAnim.animations[0].clone();
      clip.name = "DealDone";
      animations.push(clip);
    }
    if (focusedAnim.animations[0]) {
      const clip = focusedAnim.animations[0].clone();
      clip.name = "Focus";
      animations.push(clip);
    }
    if (laughAnim.animations[0]) {
      const clip = laughAnim.animations[0].clone();
      clip.name = "Laugh";
      animations.push(clip);
    }
    if (noAnim.animations[0]) {
      const clip = noAnim.animations[0].clone();
      clip.name = "No";
      animations.push(clip);
    }
    if (outAnim.animations[0]) {
      const clip = outAnim.animations[0].clone();
      clip.name = "Out";
      animations.push(clip);
    }
    if (thinkAnim.animations[0]) {
      const clip = thinkAnim.animations[0].clone();
      clip.name = "Think";
      animations.push(clip);
    }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;

    const targetAnim = animation || "Idle";
    const targetAction = actions[targetAnim] || actions["Idle"];

    if (!targetAction) return;

    // Fade out all other animations
    Object.values(actions).forEach(action => {
      if (action !== targetAction && action.isRunning()) {
        action.fadeOut(0.15);
      }
    });

    // Start target animation smoothly
    if (!targetAction.isRunning()) {
      targetAction.reset().play();
    }
    targetAction.fadeIn(0.15).setEffectiveWeight(1);

  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.01} position={[-0.9, -0.9, 4.5]} rotation={[0, -0.9, 0]} /></group>;
};

const SharadController = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/sspose.fbx");
  const talkAnim = useFBX("/sstalk.fbx");
  const angryAnim = useFBX("/ssangry.fbx");
  const appreciateAnim = useFBX("/ssapritiaite.fbx");
  const confusedAnim = useFBX("/sscantunderstand.fbx");
  const laughAnim = useFBX("/sslaugh.fbx");
  const noAnim = useFBX("/ssno.fbx");
  const outAnim = useFBX("/ssout.fbx");
  const sitRubAnim = useFBX("/sssitrub.fbx");
  const standClapAnim = useFBX("/ssstabdclap.fbx");
  const youHaveToAnim = useFBX("/ssuhaveto.fbx");

  useEffect(() => {
    [base, talkAnim, angryAnim, appreciateAnim, confusedAnim, laughAnim, noAnim, outAnim, sitRubAnim, standClapAnim, youHaveToAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) {
      const clip = base.animations[0].clone();
      clip.name = "Idle";
      animations.push(clip);
    }
    if (talkAnim.animations[0]) {
      const clip = talkAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    if (angryAnim.animations[0]) {
      const clip = angryAnim.animations[0].clone();
      clip.name = "Angry";
      animations.push(clip);
    }
    if (appreciateAnim.animations[0]) {
      const clip = appreciateAnim.animations[0].clone();
      clip.name = "Nod";
      animations.push(clip);
    }
    if (confusedAnim.animations[0]) {
      const clip = confusedAnim.animations[0].clone();
      clip.name = "Think";
      animations.push(clip);
    }
    if (laughAnim.animations[0]) {
      const clip = laughAnim.animations[0].clone();
      clip.name = "Laugh";
      animations.push(clip);
    }
    if (noAnim.animations[0]) {
      const clip = noAnim.animations[0].clone();
      clip.name = "No";
      animations.push(clip);
    }
    if (outAnim.animations[0]) {
      const clip = outAnim.animations[0].clone();
      clip.name = "Out";
      animations.push(clip);
    }
    if (sitRubAnim.animations[0]) {
      const clip = sitRubAnim.animations[0].clone();
      clip.name = "Think";
      animations.push(clip);
    }
    if (standClapAnim.animations[0]) {
      const clip = standClapAnim.animations[0].clone();
      clip.name = "Nod";
      animations.push(clip);
    }
    if (youHaveToAnim.animations[0]) {
      const clip = youHaveToAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;

    const targetAnim = animation || "Idle";
    const targetAction = actions[targetAnim] || actions["Idle"];

    if (!targetAction) return;

    // Fade out all other animations
    Object.values(actions).forEach(action => {
      if (action !== targetAction && action.isRunning()) {
        action.fadeOut(0.15);
      }
    });

    // Start target animation smoothly
    if (!targetAction.isRunning()) {
      targetAction.reset().play();
    }
    targetAction.fadeIn(0.15).setEffectiveWeight(1);

  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.01} position={[-4.8, -0.95, 0.8]} rotation={[0, -0.8, 0]} /></group>;
};

const WarrenController = ({ animation }) => {
  const groupRef = useRef();
  const base = useFBX("/wvc2pose.fbx");
  const talkAnim = useFBX("/wvc2talk.fbx");
  const dealDoneAnim = useFBX("/wvc2done.fbx");
  const outAnim = useFBX("/wvc2out.fbx");
  const clapAnim = useFBX("/vcw2clap.fbx");
  const noAnim = useFBX("/vcw2no.fbx");
  const uHaveToAnim = useFBX("/vcw2u haveto.fbx");

  useEffect(() => {
    [base, talkAnim, dealDoneAnim, outAnim, clapAnim, noAnim, uHaveToAnim].forEach(m => {
      m.traverse((child) => { if (child.isLight) { child.intensity = 0; child.visible = false; } });
    });
  }, []);

  const allAnimations = useMemo(() => {
    const animations = [];
    if (base.animations[0]) {
      const clip = base.animations[0].clone();
      clip.name = "Idle";
      animations.push(clip);
    }
    if (talkAnim.animations[0]) {
      const clip = talkAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    if (dealDoneAnim.animations[0]) {
      const clip = dealDoneAnim.animations[0].clone();
      clip.name = "DealDone";
      animations.push(clip);
    }
    if (outAnim.animations[0]) {
      const clip = outAnim.animations[0].clone();
      clip.name = "Out";
      animations.push(clip);
    }
    if (clapAnim.animations[0]) {
      const clip = clapAnim.animations[0].clone();
      clip.name = "Nod";
      animations.push(clip);
    }
    if (noAnim.animations[0]) {
      const clip = noAnim.animations[0].clone();
      clip.name = "No";
      animations.push(clip);
    }
    if (uHaveToAnim.animations[0]) {
      const clip = uHaveToAnim.animations[0].clone();
      clip.name = "Talk";
      animations.push(clip);
    }
    return animations;
  }, []);

  const { actions } = useAnimations(allAnimations, groupRef);

  useEffect(() => {
    if (!actions) return;

    const targetAnim = animation || "Idle";
    const targetAction = actions[targetAnim] || actions["Idle"];

    if (!targetAction) return;

    // Fade out all other animations
    Object.values(actions).forEach(action => {
      if (action !== targetAction && action.isRunning()) {
        action.fadeOut(0.15);
      }
    });

    // Start target animation smoothly
    if (!targetAction.isRunning()) {
      targetAction.reset().play();
    }
    targetAction.fadeIn(0.15).setEffectiveWeight(1);

  }, [actions, animation]);

  return <group ref={groupRef}><primitive object={base} scale={0.0001} position={[-1, -0.9, 3.0]} rotation={[0, 5.3, 0]} /></group>;
};

// --- 3. LOADING SPINNER (FIXED OVERLAY) ---
const Loader = () => {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000000', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        .loader { position: relative; width: 160px; height: 160px; transform-style: preserve-3d; perspective: 1200px; }
        .node { position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; background: #ffaa00; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 20px #ffaa00, 0 0 40px rgba(255, 170, 0, 0.6); animation: nodePulse 1.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; }
        .thread { position: absolute; background: linear-gradient(90deg, transparent, rgba(255, 170, 0, 0.8), transparent); box-shadow: 0 0 10px rgba(255, 170, 0, 0.5); transform-origin: center; }
        .t1 { width: 100%; height: 2px; top: 30%; left: 0; animation: weave1 2s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
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
      <div style={{ position: 'absolute', bottom: '20%', color: '#ffaa00', fontFamily: 'monospace', letterSpacing: '0.1em' }}>ENVIRONMENT LOADING {Math.round(progress)}%</div>
    </div>
  );
};

// --- 4. ENHANCED INVESTMENT BOARD COMPONENT ---
const InvestmentBoard = ({ onClose, members, accuracyScore }) => {
  const [interestHistory, setInterestHistory] = useState(members.map(m => [100 - m.skepticism]));

  useEffect(() => {
    setInterestHistory(prev =>
      members.map((member, idx) => {
        const newInterest = 100 - member.skepticism;
        const history = prev[idx] || [];
        return [...history.slice(-19), newInterest];
      })
    );
  }, [members]);

  const totalInterest = members.reduce((acc, curr) => acc + (100 - curr.skepticism), 0);
  const avgConviction = Math.round(totalInterest / members.length);

  const getColor = (val) => {
    if (val >= 75) return '#5D7A58'; // Moss
    if (val <= 35) return '#8A3A3A'; // Red Wine
    return '#D4AF68'; // Gold
  };

  return (
    <div style={{
      position: 'absolute',
      top: 80,
      right: 20,
      bottom: 110,
      width: 320,
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-gold)',
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 90,
      boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <style>{`
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }
        `}</style>

      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={12} color="var(--gold-mid)" />
          <span style={{ color: 'var(--gold-mid)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'serif' }}>EXECUTIVE ASSESSMENT</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={12} /></button>
      </div>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map((member, idx) => {
          const interest = 100 - member.skepticism;
          const history = interestHistory[idx] || [];
          return (
            <div key={member.id} style={{
              padding: '10px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(212, 175, 104, 0.1)',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, fontFamily: 'serif' }}>{member.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{member.role}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: getColor(interest), fontFamily: 'monospace' }}>{interest}%</div>
              </div>

              <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                <div style={{
                  width: `${interest}%`,
                  height: '100%',
                  background: getColor(interest),
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          );
        })}

        <div style={{
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(212, 175, 104, 0.05) 0%, transparent 100%)',
          border: '1px solid var(--gold-dim)',
          borderRadius: 12,
          marginTop: 4
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Target size={12} color="var(--gold-mid)" />
            <span style={{ color: 'var(--gold-mid)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>PITCH ACCURACY</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-primary)', fontSize: 11 }}>Conviction</span>
            <span style={{ color: getColor(accuracyScore), fontSize: 18, fontWeight: 700, fontFamily: 'serif' }}>{accuracyScore}%</span>
          </div>

          <div style={{ height: 3, background: 'rgba(0,0,0,0.4)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${accuracyScore}%`,
              height: '100%',
              background: 'var(--gold-grad)',
              transition: 'width 0.8s ease'
            }} />
          </div>
        </div>

        {/* ADDED: RISK–RETURN FRONTIER GRAPH */}
        <div style={{ marginTop: 12, padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(212, 175, 104, 0.1)', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <TrendingUp size={12} color="var(--gold-mid)" />
            <span style={{ color: 'var(--gold-mid)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>RISK–RETURN FRONTIER</span>
          </div>
          <svg width="100%" height="60" style={{ overflow: 'visible' }}>
            <path d="M 10 50 Q 80 50 180 10" fill="none" stroke="rgba(212, 175, 104, 0.15)" strokeWidth="1" strokeDasharray="4 2" />
            {/* Efficient Frontier Curve */}
            <path d="M 10 50 Q 50 48 110 30" fill="none" stroke="var(--gold-bright)" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px var(--gold-mid))' }} />
            {/* Current Position Dot based on avg conviction */}
            <circle cx={10 + (avgConviction * 1.5)} cy={50 - (avgConviction * 0.4)} r="3" fill="var(--gold-bright)">
              <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="10" y="58" fill="var(--text-secondary)" fontSize="6" fontWeight="800">LOW RISK</text>
            <text x="140" y="58" fill="var(--text-secondary)" fontSize="6" fontWeight="800">HIGH YIELD</text>
          </svg>
        </div>

        {/* ADDED: TERM SHEET POWER CURVE GRAPH */}
        <div style={{ marginTop: 8, padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(212, 175, 104, 0.1)', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Crown size={12} color="var(--gold-mid)" />
            <span style={{ color: 'var(--gold-mid)', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>TERM SHEET POWER CURVE</span>
          </div>
          <svg width="100%" height="60" style={{ overflow: 'visible' }}>
            {/* Power Lever Curve */}
            <path d="M 10 50 C 40 50, 60 10, 190 10" fill="none" stroke="rgba(212, 175, 104, 0.15)" strokeWidth="1" />
            {/* Negotiated Dominance Line: Higher conviction = shift toward Founder Control (Left) */}
            <path d={`M 10 50 C 30 50, 45 40, ${180 - avgConviction} ${50 - (avgConviction / 2.5)}`} fill="none" stroke="#8A3A3A" strokeWidth="2" />
            <circle cx={180 - avgConviction} cy={50 - (avgConviction / 2.5)} r="3" fill="#8A3A3A" />
            <text x="10" y="58" fill="var(--text-secondary)" fontSize="6" fontWeight="800">FOUNDER CTRL</text>
            <text x="145" y="58" fill="var(--text-secondary)" fontSize="6" fontWeight="800">VC CTRL</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- 5. MAIN APP COMPONENT ---
const Vcs = ({ activeSim, onBack }) => {
  const [config] = useState({
    title: "Agioas",
    pitchText: "",
    useAssets: true,
    focusMode: true,
  });

  const [sessionId, setSessionId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showInvestmentBoard, setShowInvestmentBoard] = useState(false);
  const [sessionTime, setSessionTime] = useState(3600);
  const [responseTimer, setResponseTimer] = useState(300);
  const [isModelsMuted, setIsModelsMuted] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState("Idle");
  const [isThinking, setIsThinking] = useState(false);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(0);

  const transcriptEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthRef = useRef(null);
  const availableVoicesRef = useRef([]);
  const { progress } = useProgress();

  const [transcript, setTranscript] = useState([
    { sender: "System", text: "Session initialized. Secure channel active.", time: "00:00", complete: true }
  ]);

  const [characterConfig, setCharacterConfig] = useState([
    { id: 1, name: "Arsit Rao", role: "Lead Partner", skepticism: 50 },
    { id: 2, name: "Sam Oberoi", role: "Growth Lead", skepticism: 50 },
    { id: 3, name: "Harrison Cole", role: "Product", skepticism: 50 },
    { id: 4, name: "Sharad Singhania", role: "Finance", skepticism: 50 },
    { id: 5, name: "Warren V.", role: "Strategy", skepticism: 50 },
  ]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const voices = speechSynthRef.current.getVoices();
        availableVoicesRef.current = voices;
      };
      loadVoices();
      if (speechSynthRef.current.onvoiceschanged !== undefined) {
        speechSynthRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // --- HELPER: WORD-BY-WORD REVEAL ---
  const revealTextWordByWord = (speaker, fullText) => {
    const words = fullText.split(" ");
    let currentText = "";

    // Create the message entry
    setTranscript(prev => [...prev, {
      sender: speaker,
      text: "",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      complete: false
    }]);

    words.forEach((word, index) => {
      setTimeout(() => {
        currentText += (index === 0 ? "" : " ") + word;
        setTranscript(prev => {
          const newTranscript = [...prev];
          const lastMsg = newTranscript[newTranscript.length - 1];
          if (lastMsg && lastMsg.sender === speaker) {
            lastMsg.text = currentText;
            if (index === words.length - 1) lastMsg.complete = true;
          }
          return newTranscript;
        });
      }, index * 100); // 100ms per word reveal
    });
  };

  useEffect(() => {
    // ONLY Start once Environment is 100% loaded
    if (progress < 100) return;

    let mounted = true;

    const initializeAuthenticatedSession = async () => {
      try {
        console.log('🚀 Starting VC 3D session with authentication...');
        const { sessionAPI } = await import('../services/api');

        const response = await sessionAPI.start('vc', '3d', config || {
          simulation_type: 'vc_3d',
          interface_mode: '3d'
        });

        if (!mounted) return;

        const authenticatedSessionId = response.data.session.session_id;
        setSessionId(authenticatedSessionId);
        console.log('✅ Authenticated session started:', authenticatedSessionId);

        // [KEEP ALL YOUR ORIGINAL 3D SCENE INITIALIZATION CODE BELOW HERE]

        // ✅ FIXED: Backend uses "speaker" not "vc_name"
        const initialMsg = response.data.initial_question?.message || "Welcome to the pitch meeting. We're ready to hear about your business.";
        const speaker = response.data.initial_question?.speaker || "Sharad Singhania";
        const animation = response.data.initial_question?.animation || "Talk";

        setCurrentSpeaker(speaker);
        setCurrentAnimation(animation);

        // Speak starts exactly when text reveal starts
        speakText(initialMsg, () => {
          setCurrentSpeaker(null);
          setCurrentAnimation("Idle");
        });
        revealTextWordByWord(speaker, initialMsg);

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
    let selectedVoice = null;
    const voiceIndex = Math.floor(Math.random() * TTS_VOICES.length);
    const voiceConfig = TTS_VOICES[voiceIndex];

    for (let voice of voices) {
      if (voice.name.includes(voiceConfig.name.split(' - ')[0]) ||
        (voice.lang === voiceConfig.lang && voice.name.toLowerCase().includes(voiceConfig.gender))) {
        selectedVoice = voice;
        break;
      }
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.95; // Slightly slower for boardroom gravitas
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onend = () => { if (onEndCallback) onEndCallback(); };
    utterance.onerror = () => { if (onEndCallback) onEndCallback(); };
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
        setSessionTime((prev) => { if (prev <= 1) { handleEndSession(); return 0; } return prev - 1; });
        setResponseTimer((prev) => { if (prev <= 1) { alert("Session Timeout. Meeting Adjourned."); handleEndSession(); return 300; } return prev - 1; });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMeetingStarted, isPaused, showReport]);

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

  const handleEndSession = () => { setIsMeetingStarted(false); setShowReport(true); };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !sessionId) return;

    setTranscript(prev => [...prev, {
      sender: "You",
      text: userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      complete: true
    }]);

    const messageToSend = userMessage;
    setUserMessage("");
    setResponseTimer(300);
    setIsThinking(true);

    try {
      const response = await fetch(`${BACKEND_API_URL}/sessions/${sessionId}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Backend response:', data);
      setIsThinking(false);

      // ✅ Backend returns "responses" array
      const vcResponses = data.responses || [];

      // ✅ IMPROVED: Play each VC response with proper delays
      for (let i = 0; i < vcResponses.length; i++) {
        const vcResponse = vcResponses[i];
        const speaker = vcResponse.speaker;
        const responseText = vcResponse.message;
        const animation = vcResponse.animation || "Talk";
        const vcState = vcResponse.vc_state;

        // Update character skepticism in Investment Board - LIVE UPDATE FROM AI
        if (vcState && typeof vcState.skepticism === 'number') {
          setCharacterConfig(prev => prev.map(char => {
            if (char.name === speaker) {
              return { ...char, skepticism: Math.max(0, Math.min(100, vcState.skepticism)) };
            }
            return char;
          }));
        }

        // ✅ LIVE UPDATE: Update accuracy score from AI performance data
        if (vcResponse.performance_score !== undefined) {
          setAccuracyScore(vcResponse.performance_score);
        }

        // Set speaker and animation
        setCurrentSpeaker(speaker);
        setCurrentAnimation(animation);

        // ✅ Wait for animation to load (critical!)
        await new Promise(resolve => setTimeout(resolve, 300));

        // Start text reveal
        revealTextWordByWord(speaker, responseText);

        // ✅ Play speech and wait for completion
        await new Promise(resolve => {
          speakText(responseText, resolve);
        });

        // ✅ Small pause between VCs
        await new Promise(resolve => setTimeout(resolve, 800));

        // Reset to idle before next VC
        setCurrentSpeaker(null);
        setCurrentAnimation("Idle");

        // ✅ Brief pause to let idle animation settle
        if (i < vcResponses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }

    } catch (error) {
      console.error('❌ Backend API error:', error);
      setIsThinking(false);
      const fallbackText = "Could you elaborate further on your technical architecture?";
      setCurrentSpeaker("Harrison Cole");
      setCurrentAnimation("Talk");

      await new Promise(resolve => setTimeout(resolve, 300));

      speakText(fallbackText, () => {
        setCurrentSpeaker(null);
        setCurrentAnimation("Idle");
      });
      revealTextWordByWord("Harrison Cole", fallbackText);
    }
    if (inputRef.current) inputRef.current.style.height = '48px';
  };

  const handleContinue = () => {
    if (skipsUsed >= 5) { alert("Strategic pivot limit reached."); return; }
    setSkipsUsed(prev => prev + 1);
    setTranscript(prev => [...prev, { sender: "System", text: "Proceeding to next item...", time: "Now", complete: true }]);

    const replyText = "Understood. Moving the discussion toward the go-to-market strategy.";
    setCurrentSpeaker("Arsit Rao");
    setCurrentAnimation("Talk");
    speakText(replyText, () => {
      setCurrentSpeaker(null);
      setCurrentAnimation("Idle");
    });
    revealTextWordByWord("Arsit Rao", replyText);
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
    setTranscript([{ sender: "System", text: "Session re-initialized.", time: "00:00", complete: true }]);
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
        <div style={{ width: 800, background: 'var(--bg-card)', border: '1px solid var(--gold-dim)', borderRadius: 16, padding: 40, boxShadow: '0 40px 100px rgba(0,0,0,0.9)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}><img src={LOGO_URL} alt="Logo" style={{ height: 40, marginBottom: 16 }} /><h2 style={{ fontSize: 32, fontFamily: 'serif', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.05em' }}>SESSION DEBRIEF</h2><p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Operational analysis concluded.</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 12, border: '1px solid var(--border-gold)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><BarChart size={20} color="var(--gold-mid)" /><span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>CONVICTION SCORE</span></div><div style={{ fontSize: 48, fontWeight: 700, color: 'var(--gold-mid)', fontFamily: 'serif' }}>{accuracyScore}<span style={{ fontSize: 20, color: '#5E4F40' }}>/100</span></div><p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>High-level technical alignment verified.</p></div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 12, border: '1px solid var(--border-gold)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}><ShieldCheck size={20} color="var(--gold-mid)" /><span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>STRATEGIC FEEDBACK</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}><ThumbsUp size={14} color="#5D7A58" /> Comprehensive market vision. </div><div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}><ThumbsDown size={14} color="#8A3A3A" /> Unit economics require audit.</div></div></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}><button onClick={handleExitFull} style={{ background: 'none', border: 'none', color: 'var(--gold-dim)', fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>RE-ENTER BOARDROOM</button></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-app)', zIndex: 70, display: 'flex', flexDirection: 'column' }} className="fade-in">
      <style>{EXECUTIVE_THEME}</style>
      <style>{`
              .custom-scrollbar::-webkit-scrollbar { width: 4px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }
              @keyframes thinking { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
              .thinking-dot { animation: thinking 1.4s ease-in-out infinite; }
              .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
              .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
            `}</style>

      <Loader />

      {isPaused && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(15, 10, 8, 0.9)', backdropFilter: 'blur(15px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
          <img src={LOGO_URL} alt="Logo" style={{ height: 60, filter: 'drop-shadow(0 0 20px rgba(212, 175, 104, 0.3))' }} />
          <div style={{ textAlign: 'center' }}><h2 style={{ fontSize: 32, fontFamily: 'serif', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.1em' }}>SESSION PAUSED</h2><p style={{ color: 'var(--text-secondary)', marginTop: 8, letterSpacing: '0.05em' }}>The environment is secured. Board members are on standby.</p></div>
          <button onClick={() => setIsPaused(false)} style={{ padding: '16px 48px', background: 'var(--gold-grad)', border: 'none', borderRadius: 12, color: '#1A120E', fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 30px rgba(212, 175, 104, 0.3)' }}><Play size={16} fill="#1A120E" /> RESUME SESSION</button>
        </div>
      )}

      {/* CLEAN TOP BAR (NO NAVBAR) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, zIndex: 80, display: 'flex', alignItems: 'center', padding: '0 30px' }}>
        {/* LOGO LEFT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={LOGO_URL} alt="Agioas" style={{ height: 26 }} />
          <span style={{ fontSize: 16, color: 'var(--text-primary)', fontFamily: 'serif', fontWeight: 600 }}>Agioas</span>
        </div>

        {/* TITLE MIDDLE */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: 8, color: 'var(--gold-mid)', letterSpacing: '0.3em', fontWeight: 800, marginBottom: 2 }}>EXECUTIVE TERMINAL</div>
          <div style={{ fontSize: 20, color: 'var(--text-primary)', fontFamily: 'serif', letterSpacing: '0.05em' }}>{config.title} OS</div>
        </div>

        {/* STATUS RIGHT */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: responseTimer < 60 ? '#8A3A3A' : 'var(--text-secondary)' }}><AlertTriangle size={12} /><span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }}>{formatResponseTime(responseTimer)}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', padding: '4px 14px', borderRadius: 20, border: '1px solid var(--border-gold)' }}><Clock size={12} color="var(--gold-mid)" /><span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{formatTime(sessionTime)}</span></div>
        </div>
      </div>

      {showTranscript && (
        <div style={{ position: 'absolute', top: 90, left: 20, bottom: 110, width: 320, background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-gold)', borderRadius: 16, display: 'flex', flexDirection: 'column', zIndex: 90, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--gold-mid)', fontSize: 10, fontWeight: 800, letterSpacing: '0.15em' }}>SESSION LOG</span><button onClick={() => setShowTranscript(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={12} /></button></div>
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {transcript.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: msg.sender === "You" ? 'var(--gold-mid)' : 'var(--text-primary)', fontSize: 10, fontWeight: 800, fontFamily: 'serif' }}>{msg.sender}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 8 }}>{msg.time}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.5 }}>{msg.text}{!msg.complete && "..."}</div>
              </div>
            ))}
            {isThinking && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px', background: 'rgba(212, 175, 104, 0.05)', borderRadius: 8 }}>
                <Brain size={12} color="var(--gold-mid)" />
                <span style={{ color: 'var(--gold-mid)', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em' }}>ANALYZING...</span>
                <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
                  <div className="thinking-dot" style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gold-mid)' }} />
                  <div className="thinking-dot" style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gold-mid)' }} />
                  <div className="thinking-dot" style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gold-mid)' }} />
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}

      {showInvestmentBoard && (
        <InvestmentBoard
          onClose={() => setShowInvestmentBoard(false)}
          members={characterConfig}
          accuracyScore={accuracyScore}
        />
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [-10.83, 1.50, 9.94], fov: 45 }} gl={{ toneMappingExposure: 1.0 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} color="#ffffff" />
            <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#fff6e5" />
            <Environment preset="city" environmentIntensity={1.0} />

            <Background />

            <ArsitController animation={currentSpeaker === "Arsit Rao" ? currentAnimation : "Idle"} />
            <HarrisonController animation={currentSpeaker === "Harrison Cole" ? currentAnimation : "Idle"} />
            <SamController animation={currentSpeaker === "Sam Oberoi" ? currentAnimation : "Idle"} />
            <SharadController animation={currentSpeaker === "Sharad Singhania" ? currentAnimation : "Idle"} />
            <WarrenController animation={currentSpeaker === "Warren V." ? currentAnimation : "Idle"} />

            <OrbitControls
              target={[-5, 0, 5]}
              enablePan={true}
              minDistance={8}
              maxDistance={18}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
          <button onClick={() => setShowInvestmentBoard(!showInvestmentBoard)} style={{ width: 100, height: 30, borderRadius: 20, background: showInvestmentBoard ? 'var(--gold-grad)' : 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', color: showInvestmentBoard ? '#1A120E' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>Transcript</button>
          <button onClick={() => setShowTranscript(!showTranscript)} style={{ height: 40, padding: '0 18px', borderRadius: 12, background: showTranscript ? 'var(--gold-grad)' : 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', color: showTranscript ? '#1A120E' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}><FileText size={14} /> LOGS</button>
          <button onClick={() => setIsModelsMuted(!isModelsMuted)} style={{ width: 40, height: 40, borderRadius: 12, background: isModelsMuted ? '#8A3A3A' : 'rgba(0,0,0,0.3)', border: '1px solid var(--border-gold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{isModelsMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
        </div>

        <div style={{ flex: 1, margin: '0 20px', pointerEvents: 'auto', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-gold)', borderRadius: 35, display: 'flex', alignItems: 'flex-end', padding: '8px 16px', maxWidth: 750, transition: 'all 0.4s ease' }}>
          <textarea ref={inputRef} value={userMessage} onChange={handleInputResize} placeholder={currentSpeaker === null && !isThinking ? "Address the board..." : isThinking ? "Processing..." : "Investor speaking..."} disabled={currentSpeaker !== null || isThinking} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 14, resize: 'none', maxHeight: '100px', minHeight: '28px', lineHeight: '28px', opacity: currentSpeaker === null && !isThinking ? 1 : 0.4 }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
          <button onClick={handleContinue} disabled={currentSpeaker !== null || isThinking} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 4, marginRight: 6 }}><FastForward size={14} color="var(--gold-dim)" /></button>
          <button onClick={handleSendMessage} disabled={currentSpeaker !== null || isThinking} style={{ width: 36, height: 36, borderRadius: 10, background: currentSpeaker === null && !isThinking ? 'var(--gold-grad)' : '#261C16', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 2 }}>
            {isThinking ? (
              <div style={{ display: 'flex', gap: 2 }}><div className="thinking-dot" style={{ width: 3, height: 3, borderRadius: '50%', background: '#1A120E' }} /><div className="thinking-dot" style={{ width: 3, height: 3, borderRadius: '50%', background: '#1A120E' }} /><div className="thinking-dot" style={{ width: 3, height: 3, borderRadius: '50%', background: '#1A120E' }} /></div>
            ) : (
              <Send size={16} color={currentSpeaker === null ? "#1A120E" : "#5E4F40"} />
            )}
          </button>
        </div>

        <div style={{ pointerEvents: 'auto' }}><button onClick={handleEndSession} style={{ padding: '0 20px', height: 40, borderRadius: 12, background: '#8A3A3A', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}><PhoneOff size={14} /> END</button></div>
      </div>
    </div>
  );
};

export default Vcs;