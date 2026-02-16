import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import {
  Layout, Activity, Database, Settings, Search, X, Bell, Play,
  ChevronRight, ArrowLeft, Clock, ShieldCheck, TrendingUp,
  Cpu, DollarSign, Target, Shield, Lightbulb, Star,
  MoreVertical, Filter, Share2, Download, Trash2, Archive,
  CheckCircle, Briefcase, Zap, User, Save, AlertTriangle,
  FileText, Upload, Info, Grid, List, CheckSquare, Square,
  PieChart, BarChart, Layers, Globe, Users, Lock, BookOpen, Sparkles,
  Brain, Sliders, Battery, ChevronDown, Rocket, Smartphone,
  Code, Server, Cloud, Smile, Frown, MessageSquare, Mic, Volume2,
  CreditCard, UserPlus, Link, Monitor, Maximize, Minimize, ArrowRight,
  ShoppingBag, Crown, Calendar, Check, ZapOff, LogOut, Edit, Mail, Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // ADD THIS if not already there
import VcsFile from './frontpages/VcsFrontpage';
import BoardroomFile from './frontpages/BoardroomFrontpage';
import CustomerFile from './frontpages/CustomerFrontpage';
import CeoCoach from './frontpages/CeoCoachFrontpage';
import { dashboardAPI } from './services/api';

// --- CSS STYLES (PREMIUM WOODEN EXECUTIVE THEME) ---
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;500;600;700;900&display=swap');

  :root {
    /* --- THEME: THE EXECUTIVE SUITE (MAHOGANY & BRASS) --- */
    
    /* Woods & Leathers */
    --bg-app: #1c1410;              /* Deepest Ebony Wood */
    --bg-sidebar: #1b110d;          /* Dark Walnut Wood */
    --bg-card: #1e1610;             /* Polished Mahogany */
    --bg-input: #0c0908;            /* Inset Dark Oak */
    
    /* Finishings */
    --bg-glass: rgba(29, 21, 16, 0.9); /* Varnish Glass */
    --overlay-dark: rgba(19, 19, 19, 0.8);

    /* Typography */
    --font-display: 'Cinzel', serif;
    --font-body: 'Inter', sans-serif;
    
    --text-primary: #E8E0D5;        /* Parchment */
    --text-secondary: #dc9a14;      /* Aged Paper */
    --text-tertiary: #a67c2e;       /* Deep Bark */
    
    /* Precious Metals (Polished Brass/Gold) */
    --gold-dim: #ac8042;
    --gold-mid: #dc9a14;
    --gold-bright: #ffd700;        
    --gold-grad: linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%);
    --gold-glow: 0 0 25px rgba(220, 154, 20, 0.15);

    /* Status Indicators (Muted/Noble) */
    --success: #5D7A58;             /* Moss */
    --danger: #8A3A3A;              /* Dried Blood / Red Wine */
    --info: #4F6170;                /* Slate */
    
    /* Borders & Depth */
    --border-subtle: rgba(196, 168, 111, 0.1);
    --border-gold: rgba(196, 168, 111, 0.25);
    --wood-grain: repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px);
    
    /* Layout */
    --sidebar-width: 280px;
    --header-height: 84px;
    
    --ease-elegant: cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* RESET */
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  
  /* SCROLLBAR - Brass Style */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0F0A08; }
  ::-webkit-scrollbar-thumb { background: #261c17; border: 1px solid #1A120E; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold-dim); }

  html, body, #root { 
    margin: 0; padding: 0; width: 100%; height: 100%; 
    background-color: var(--bg-app); 
    color: var(--text-primary); 
    font-family: var(--font-body); 
    overflow: hidden; 
  }

  /* --- ANIMATIONS --- */
  .fade-in { animation: fadeIn 0.8s var(--ease-elegant) forwards; opacity: 0; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); filter: blur(4px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

  .stagger-appear { opacity: 0; animation: fadeIn 0.8s var(--ease-elegant) forwards; }
  .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.15s; } .delay-3 { animation-delay: 0.2s; }
  .delay-4 { animation-delay: 0.25s; } .delay-5 { animation-delay: 0.3s; }

  /* --- LAYOUT ENGINE --- */
  .app-container {
    display: flex;
    flex-direction: row; 
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at 50% -20%, #150f0b 0%, #0F0A08 70%); /* Ambient Lamp Light */
  }

  /* Sidebar - Dark Walnut */
  .sidebar {
    width: var(--sidebar-width);
    height: 100%;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-gold);
    display: flex;
    flex-direction: column;
    padding: 32px 24px;
    flex-shrink: 0; 
    z-index: 50;
    box-shadow: 10px 0 50px rgba(0,0,0,0.6); 
    position: relative;
  }
  .sidebar::before {
    content: ''; position: absolute; inset: 0;
    background-image: var(--wood-grain);
    opacity: 0.5; pointer-events: none;
  }

  /* Main Content Area */
  .main-area {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    min-width: 0;
  }

  /* Header - Varnish Finish */
  .top-bar {
    height: var(--header-height);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    border-bottom: 1px solid var(--border-gold);
    background: linear-gradient(180deg, rgba(26, 18, 14, 0.95) 0%, rgba(26,18,14,0.8) 100%);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
    z-index: 40;
    box-shadow: 0 4px 30px rgba(0,0,0,0.2);
  }

  /* Scrolling Content */
  .scroll-view {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding: 32px 48px 100px 48px; 
    scroll-behavior: smooth;
  }

  .content-max { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }

  /* --- COMPONENTS --- */

  /* Navigation Item */
  .nav-item { 
    display: flex; align-items: center; gap: 16px; padding: 14px 16px; 
    border-radius: 4px; color: var(--text-secondary); cursor: pointer; 
    font-size: 13px; font-weight: 500; margin-bottom: 4px; letter-spacing: 0.05em;
    transition: all 0.3s var(--ease-elegant); border: 1px solid transparent;
    position: relative; z-index: 2;
  }
  .nav-item:hover { background: rgba(182, 137, 54, 0.05); color: var(--text-primary); }
  .nav-item.active { 
    background: linear-gradient(90deg, rgba(198, 137, 24, 0.15) 0%, transparent 100%); 
    color: var(--gold-mid); 
    border-left: 2px solid var(--gold-mid);
    text-shadow: 0 0 15px rgba(212, 175, 104, 0.4);
  }

  /* Sub Navigation */
  .sub-nav-item { padding: 12px 16px; font-size: 13px; color: var(--text-secondary); border-radius: 4px; cursor: pointer; margin-bottom: 2px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
  .sub-nav-item:hover { color: var(--text-primary); background: rgba(212, 175, 104, 0.05); }
  .sub-nav-item.active { color: var(--gold-mid); background: rgba(212, 175, 104, 0.08); font-weight: 600; border-right: 2px solid var(--gold-mid); }

  /* Cards (Mahogany Look) */
  .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
  
  .card { 
    background: var(--bg-card); 
    border: 1px solid rgba(255,255,255,0.03);
    outline: 1px solid rgba(0,0,0,0.4); /* Deep inset */
    box-shadow: 
        0 1px 0 rgba(255,255,255,0.05) inset, /* Top Highlight */
        0 20px 40px -10px rgba(0,0,0,0.8);
    border-radius: 6px; 
    padding: 32px; 
    display: flex; flex-direction: column;
    transition: transform 0.4s var(--ease-elegant), box-shadow 0.4s var(--ease-elegant);
    position: relative;
    overflow: hidden;
  }
  .card::after {
     content: ''; position: absolute; inset: 0; pointer-events: none;
     background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%);
  }
  .card:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.95), 0 0 0 1px var(--gold-dim) inset; 
    border-color: var(--gold-dim);
  }

  /* Professional Card Variant */
  .prof-card {
    background: linear-gradient(180deg, #261C16 0%, #1A120E 100%);
    border: 1px solid rgba(196, 168, 111, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    overflow: hidden;
  }
  .prof-header-bg {
    width: 100%;
    height: 80px;
    background: linear-gradient(90deg, #2A1D16 0%, #3E2F26 100%);
    border-bottom: 1px solid var(--border-gold);
    position: relative;
  }
  .prof-avatar-container {
    margin-top: -50px;
    width: 120px;
    height: 120px;
    border-radius: 12px;
    background: #0F0A08;
    border: 2px solid var(--gold-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    z-index: 5;
    overflow: hidden;
  }
  /* Updated for images */
  .prof-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: sepia(0.2) contrast(1.1);
  }

  .prof-stat-row {
    display: flex;
    width: 100%;
    border-top: 1px solid var(--border-subtle);
    margin-top: auto;
  }
  .prof-stat {
    flex: 1;
    padding: 12px;
    text-align: center;
    border-right: 1px solid var(--border-subtle);
  }
  .prof-stat:last-child { border-right: none; }

  /* Buttons - Polished Brass */
  .btn-reset { background: none; border: none; cursor: pointer; color: inherit; display: flex; align-items: center; justify-content: center; padding: 0; outline: none; }
  
  .btn-gold { 
    background: #d89f2b; 
    color: #1A120E; 
    border-radius: 2px; 
    padding: 0 28px; height: 48px;
    font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.3);
    box-shadow: var(--gold-glow), 0 2px 5px rgba(0,0,0,0.4);
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: all 0.3s var(--ease-elegant);
    font-family: var(--font-body);
  }
  .btn-gold:hover { transform: translateY(-1px); filter: brightness(1.15); box-shadow: 0 8px 30px rgba(212, 175, 104, 0.4); }
  .btn-gold:active { transform: translateY(0); filter: brightness(0.95); }

  /* NEW: White Toggle Button (Ivory/Bone) */
  .btn-toggle {
    background: #E8E0D5; 
    color: #8A6A2E;
    border: 1px solid #C4A86F;
    border-radius: 4px;
    padding: 0 24px;
    height: 42px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: all 0.2s;
  }
  .btn-toggle:hover {
     background: #fff;
     transform: translateY(-1px);
     box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  }
  .btn-toggle.active {
    background: #fff;
    color: #b99550;
    border-color: #b99550;
    box-shadow: 0 0 15px rgba(255,255,255,0.2), inset 0 0 0 1px #b99550;
  }
  
  .btn-tab {
    padding: 0 24px; height: 40px; border-radius: 4px; font-size: 13px; font-weight: 500; 
    cursor: pointer; border: 1px solid transparent; display: flex; align-items: center; transition: all 0.2s;
    background: transparent; color: var(--text-secondary);
  }
  .btn-tab.active { background: rgba(196, 168, 111, 0.1); color: var(--gold-mid); border: 1px solid var(--gold-dim); box-shadow: 0 0 15px rgba(0,0,0,0.5); }
  .btn-tab.inactive { color: var(--text-secondary); background: transparent; }
  .btn-tab.inactive:hover { color: var(--text-primary); background: rgba(255,255,255,0.02); }

  /* Inputs & Forms (Inset Leather) */
  .form-group { margin-bottom: 28px; }
  .form-label { display: block; font-size: 11px; color: var(--gold-dim); margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; font-family: var(--font-display); }
  
  .form-input { 
    width: 100%; background: var(--bg-input); border: 1px solid var(--border-subtle); 
    padding: 16px 20px; color: var(--text-primary); border-radius: 2px; outline: none; 
    font-family: var(--font-body); font-size: 14px; 
    box-shadow: inset 0 3px 10px rgba(0,0,0,0.8);
    transition: all 0.3s;
  }
  .form-input:focus { border-color: var(--gold-mid); background: #080504; box-shadow: inset 0 3px 15px rgba(0,0,0,1), 0 0 0 1px var(--gold-dim); }

  /* Chips */
  .chip-grid { display: flex; gap: 10px; flex-wrap: wrap; }
  .chip { 
    padding: 10px 20px; border: 1px solid var(--border-subtle); border-radius: 2px; 
    font-size: 12px; cursor: pointer; color: var(--text-secondary); 
    background: rgba(0,0,0,0.2); transition: all 0.2s;
  }
  .chip:hover { border-color: var(--gold-dim); color: var(--text-primary); background: rgba(212, 175, 104, 0.05); transform: translateY(-1px); }
  .chip.selected { background: linear-gradient(135deg, var(--gold-mid) 0%, var(--gold-dim) 100%); color: #0F0C08; border-color: transparent; font-weight: 700; box-shadow: var(--gold-glow); }

  /* Sliders (Brass Knob) */
  .slider-row { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .range-slider { -webkit-appearance: none; width: 100%; height: 2px; background: rgba(255,255,255,0.1); outline: none; border-radius: 2px; }
  .range-slider::-webkit-slider-thumb { 
    -webkit-appearance: none; width: 18px; height: 18px; 
    background: radial-gradient(circle, #F0DCAA 0%, #B39052 100%); border: 1px solid #000; 
    border-radius: 50%; cursor: pointer; 
    transition: transform 0.2s;
    box-shadow: 0 0 10px rgba(196, 168, 111, 0.5);
  }
  .range-slider::-webkit-slider-thumb:hover { transform: scale(1.3); }

  /* Checkbox List */
  .checkbox-item { display: flex; align-items: center; gap: 16px; padding: 16px 0; cursor: pointer; color: var(--text-secondary); font-size: 14px; transition: color 0.2s; border-bottom: 1px solid var(--border-subtle); }
  .checkbox-item:hover { color: var(--text-primary); }
  .checkbox-item.checked { color: var(--gold-mid); }

  /* File Drop */
  .file-drop { 
    border: 1px dashed var(--gold-dim); border-radius: 4px; padding: 32px; 
    display: flex; align-items: center; gap: 20px; cursor: pointer; 
    background: rgba(0,0,0,0.3); transition: all 0.3s; 
  }
  .file-drop:hover { border-color: var(--gold-bright); background: rgba(196, 168, 111, 0.08); }

  /* Typography */
  h1 { font-family: var(--font-display); font-size: 38px; color: var(--text-primary); margin: 0; font-weight: 500; letter-spacing: -0.01em; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
  h2 { font-family: var(--font-display); font-size: 26px; color: var(--text-primary); margin: 0; font-weight: 500; }
  h3 { font-family: var(--font-display); font-size: 18px; color: var(--text-primary); margin: 0; font-weight: 600; letter-spacing: 0.02em; }
  p { margin: 0; line-height: 1.6; font-size: 14px; color: var(--text-secondary); }
  
  .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle); }

  /* Custom Visuals */
  .health-score { position: relative; width: 140px; height: 140px; border-radius: 50%; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; flex-direction: column; box-shadow: inset 0 0 40px rgba(0,0,0,0.9); background: radial-gradient(circle, rgba(212, 175, 104, 0.05) 0%, transparent 70%); }
  .health-score::before { content:''; position:absolute; inset:-1px; border-radius:50%; border:1px solid transparent; border-top-color: var(--gold-mid); border-right-color: var(--gold-dim); transform: rotate(45deg); filter: drop-shadow(0 0 10px rgba(196, 168, 111, 0.3)); }
  .progress-bar { height: 3px; background: rgba(255,255,255,0.05); width: 100%; margin-top: 20px; position: relative; border-radius: 2px; }
  .progress-fill { height: 100%; background: var(--danger); width: 0; transition: width 1s ease-out; position: absolute; box-shadow: 0 0 15px rgba(138, 58, 58, 0.6); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
  .modal-box { width: 550px; background: #1A120E; border: 1px solid var(--gold-dim); border-radius: 4px; padding: 48px; box-shadow: 0 50px 100px rgba(0,0,0,1), 0 0 0 1px rgba(0,0,0,1); }
  
  .info-banner { 
    background: linear-gradient(90deg, rgba(196, 168, 111, 0.15) 0%, rgba(196, 168, 111, 0.05) 100%); 
    border: 1px solid var(--gold-dim); 
    border-radius: 4px; 
    padding: 20px 24px; 
    margin-bottom: 32px; 
    display: flex; 
    align-items: center; 
    gap: 16px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
  }
`;

// --- HAMSTER LOADER (GOLD EDITION) ---
const HamsterLoader = () => (
  <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 60, height: 60, border: '2px solid var(--text-tertiary)', borderTopColor: 'var(--gold-mid)', borderRadius: '50%', animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite', boxShadow: '0 0 20px rgba(212, 175, 104, 0.2)' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// --- 3D ABSTRACT PLACEHOLDER (NO EXTERNAL FILES) ---
function AbstractModel() {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={mesh} scale={1.8}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#D4AF68" wireframe />
    </mesh>
  );
}

// --- DATA ---
const SIMULATIONS_DATA = [
  {
    id: 1,
    title: 'Sales Gauntlet',
    risk: 'High',
    points: ['Negotiation Tactics', 'Objection Handling', 'Pricing Defense']
  },
  {
    id: 2,
    title: 'VC Pitch Defense',
    risk: 'Critical',
    points: ['Market Sizing', 'Unit Economics', 'Go-to-Market Strategy']
  },
  {
    id: 3,
    title: 'Crisis Management',
    risk: 'Med',
    points: ['PR Statement Review', 'Stakeholder Comms', 'Legal Liability']
  },
  {
    id: 5,
    title: 'Honest CEO',
    risk: 'High',
    points: ['Radical Candor', 'Performance Review', 'Strategy Audit']
  },
];

const PROFESSIONALS_DATA = {
  vcs: [
    { id: 1, name: 'Sarah Vance', role: 'Managing Partner', experience: '15 Yrs', specialty: 'SaaS Metrics', rate: 'Aggressive', bio: 'Former CFO of a $5B SaaS giant. Known for tearing apart unit economics in the first 5 minutes.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200' },
    { id: 5, name: 'David Sacks-AI', role: 'Strategic Operator', experience: '20 Yrs', specialty: 'Product-Led Growth', rate: 'Strategic', bio: 'The definitive voice on bottom-up growth mechanics. Will ask about your viral coefficient.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200' },
    { id: 10, name: 'Marc A16z', role: 'General Partner', experience: '25 Yrs', specialty: 'Software Strategy', rate: 'Visionary', bio: 'Believes software eats the world. Focuses on huge TAM and platform plays.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200' },
    { id: 11, name: 'Roelof B.', role: 'Senior Partner', experience: '18 Yrs', specialty: 'Marketplaces', rate: 'Analytical', bio: 'Master of liquidity and take rates. Will analyze your supply-side constraints.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200' },
    { id: 12, name: 'Jessica L.', role: 'Angel Investor', experience: '10 Yrs', specialty: 'Founder Character', rate: 'Intuitive', bio: 'Invests in people, not just decks. Looks for grit, history, and storytelling ability.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200' }
  ],
  boardroom: [
    { id: 2, name: 'Dr. Aris Thorne', role: 'Chief Strategist', experience: '30 Yrs', specialty: 'Corporate Law', rate: 'Top Tier', bio: 'Has navigated 50+ M&A deals. Expert in poison pills and board control battles.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200' },
    { id: 4, name: 'Elena Rostova', role: 'Crisis Director', experience: '12 Yrs', specialty: 'Reputation', rate: 'Diplomatic', bio: 'Former press secretary. Specializes in cleaning up executive messes and leaks.', avatar: 'https://images.unsplash.com/photo-1598550874175-4d7112ee7f19?auto=format&fit=crop&w=200&h=200' },
    { id: 3, name: 'Marcus Chen', role: 'Chief Architect', experience: '18 Yrs', specialty: 'Scalable Systems', rate: 'Analytical', bio: 'Built systems handling 10M TPS. Will scrutinize your architecture diagram.', avatar: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?auto=format&fit=crop&w=200&h=200' },
    { id: 20, name: 'Olivia Sterling', role: 'Head of Audit', experience: '22 Yrs', specialty: 'Financial Audit', rate: 'Precise', bio: 'Forensic accountant background. Finds the burn rate leaks you missed.', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=200&h=200' },
    { id: 21, name: 'Gen. Maxwell', role: 'Tactical Advisor', experience: '40 Yrs', specialty: 'War Strategy', rate: 'Tactical', bio: 'Retired General. Applies battlefield tactics to competitive market dynamics.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200' },
    { id: 22, name: 'Prof. Yumi', role: 'Ethics Officer', experience: '15 Yrs', specialty: 'AI Safety', rate: 'Moral', bio: 'Academic researcher. Ensures your AI alignment isn\'t a PR disaster waiting to happen.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200' },
    { id: 23, name: 'Victor H.', role: 'Expansion Lead', experience: '14 Yrs', specialty: 'Global Markets', rate: 'Ambitious', bio: 'Opened markets in 40 countries. Knows the regulatory pitfalls of every region.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200' },
    { id: 24, name: 'Sarah Jenkins', role: 'Culture Director', experience: '16 Yrs', specialty: 'Human Capital', rate: 'Empathic', bio: 'Focuses on retention and culture scaling. "People over pixels" philosophy.', avatar: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=200&h=200' },
    { id: 25, name: 'The Silencer', role: 'Legal Defense', experience: 'Unknown', specialty: 'Litigation', rate: 'Ruthless', bio: 'You only call him when things are truly broken. He fixes it. No questions asked.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200' }
  ],
  customers: [
    { id: 30, name: 'Angry Enterprise', role: 'Fortune 500 Exec', experience: 'N/A', specialty: 'Compliance', rate: 'Impossible', bio: 'Demands SOC2 Type 2, ISO 27001, and a custom SLA before saying hello.', avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&h=200' },
    { id: 31, name: 'Confused Boomer', role: 'SMB Owner', experience: '30 Yrs', specialty: 'Basic Usage', rate: 'Frustrated', bio: 'Can\'t find the login button. Will call support 5 times a day.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200' },
    { id: 32, name: 'Procurement Mgr', role: 'Gatekeeper', experience: '10 Yrs', specialty: 'Cost Cutting', rate: 'Bureaucratic', bio: 'Bonus is tied to reducing your contract value by 20%. Good luck.', avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&h=200' },
    { id: 33, name: 'Tech Bro', role: 'Early Adopter', experience: '5 Yrs', specialty: 'Features', rate: 'Demanding', bio: 'Wants GraphQL support and dark mode or he walks.', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&h=200' },
    { id: 34, name: 'Budget SME', role: 'Bootstrap Founder', experience: '2 Yrs', specialty: 'Discount Seeking', rate: 'Cheap', bio: 'Bootstrapped. Will ask for a 90% discount in exchange for "exposure".', avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=200&h=200' },
    { id: 35, name: 'Karen F.', role: 'Power User', experience: '8 Yrs', specialty: 'UX Critique', rate: 'Loud', bio: 'Knows your product better than you do. Will tweet about every bug.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200' }
  ],
  ceo: [
    { id: 6, name: 'Honest Mentor', role: 'Chairman Emeritus', experience: '35 Yrs', specialty: 'Leadership', rate: 'Blunt', bio: 'Built and sold 3 companies. He doesn\'t care about your feelings, only your success. Radical candor personified.', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200' }
  ]
};

// --- CREATIVE RING COMPONENT (HIGH FIDELITY) ---
const CreativeRing = ({ label, value, color }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <div style={{ position: 'relative', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(145deg, #1e1610, #16100c)', boxShadow: '5px 5px 10px #0b0806, -5px -5px 10px #291e16', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer Gold Rim (Static) */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(185, 149, 80, 0.1)' }} />
      {/* Progress SVG */}
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="40" cy="40" r="38" fill="none" stroke={color} strokeWidth="2" strokeDasharray={`${value * 2.38}, 238`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{value}%</span>
      </div>
    </div>
    <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 80 }}>{label}</span>
  </div>
);

const Dashboard = () => {
  // --- STATE ---
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const navigate = useNavigate();  // ADD THIS LINE


  // Simulation State
  const [activeSim, setActiveSim] = useState(null);

  // Data
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', desc: '' });
  const [settings, setSettings] = useState({ salesAggression: 75, vcSkepticism: 80, crisisPressure: 60, techDetail: 90 });
  const [userProfile, setUserProfile] = useState({
    name: 'Kunal Sundersia',
    role: 'Founder & CEO',
    email: 'kunal@asklurk.com',
    avatar: 'KS'
  });

  // New state for Activity tab filters
  const [activityFilter, setActivityFilter] = useState('all');

  // NEW: Dashboard Analytics State
  const [dashboardAnalytics, setDashboardAnalytics] = useState({
    boardroom: { performance_percentage: 0, total_time_seconds: 0, active_time_seconds: 0 },
    vc: { performance_percentage: 0, total_time_seconds: 0, active_time_seconds: 0 },
    customer: { performance_percentage: 0, total_time_seconds: 0, active_time_seconds: 0 },
    ceo: { performance_percentage: 0, total_time_seconds: 0, active_time_seconds: 0 }
  });

  // Activity Log Data with timestamps
  const activityLog = [
    { id: 1, action: 'System Ready', detail: 'Asklurk OS Online', time: '08:00 AM', date: '2024-01-15', timestamp: '2024-01-15T08:00:00' },
    { id: 2, action: 'VC Pitch Simulation Started', detail: 'Series A Defense with Sarah Vance', time: '10:30 AM', date: '2024-01-15', timestamp: '2024-01-15T10:30:00' },
    { id: 3, action: 'Data Upload Completed', detail: 'Pitch Deck Analyzed Successfully', time: '02:15 PM', date: '2024-01-15', timestamp: '2024-01-15T14:15:00' },
    { id: 4, action: 'Sales Gauntlet Completed', detail: 'Negotiation Score: 85%', time: '04:45 PM', date: '2024-01-14', timestamp: '2024-01-14T16:45:00' },
    { id: 5, action: 'Financial Data Updated', detail: 'MRR increased to $15,000', time: '11:20 AM', date: '2024-01-14', timestamp: '2024-01-14T11:20:00' },
    { id: 6, action: 'CEO Coach Session', detail: 'Strategy review with Honest Mentor', time: '03:00 PM', date: '2024-01-13', timestamp: '2024-01-13T15:00:00' },
    { id: 7, action: 'Crisis Management Test', detail: 'PR response simulation', time: '09:15 AM', date: '2024-01-12', timestamp: '2024-01-12T09:15:00' },
    { id: 8, action: 'Team Data Added', detail: 'Updated headcount information', time: '01:45 PM', date: '2024-01-12', timestamp: '2024-01-12T13:45:00' },
    { id: 9, action: 'Monthly Report Generated', detail: 'Performance analytics compiled', time: '05:30 PM', date: '2024-01-11', timestamp: '2024-01-11T17:30:00' },
    { id: 10, action: 'Account Settings Updated', detail: 'AI behavior tuning modified', time: '10:00 AM', date: '2024-01-11', timestamp: '2024-01-11T10:00:00' },
  ];

  // Filter activity log based on selected filter
  const filteredActivityLog = activityLog.filter(item => {
    const now = new Date();
    const itemDate = new Date(item.timestamp);

    switch (activityFilter) {
      case 'today':
        return itemDate.toDateString() === now.toDateString();
      case 'weekly':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= oneWeekAgo;
      case 'monthly':
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return itemDate >= oneMonthAgo;
      case 'all':
      default:
        return true;
    }
  });

  // --- EFFECTS ---

  // App Loader
  useEffect(() => {
    setTimeout(() => setIsAppLoaded(true), 2000);
  }, []);

  // Set Favicon Programmatically (Fixed Aspect Ratio)
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);

    const img = new Image();
    img.src = 'favicon.ico'; // Make sure this path is correct

    img.onload = () => {
      // 1. Create a square canvas (standard favicon size)
      const canvas = document.createElement('canvas');
      const size = 64;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // 2. Calculate aspect ratio to "contain" the image (no squishing)
      const scale = Math.min(size / img.width, size / img.height);
      const width = img.width * scale;
      const height = img.height * scale;

      // 3. Center the image on the canvas
      const x = (size - width) / 2;
      const y = (size - height) / 2;

      // 4. Draw
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, x, y, width, height);

      // 5. Update the favicon link
      link.href = canvas.toDataURL('image/ico');
    };
  }, []);

  // NEW: Fetch Dashboard Analytics (every 5 seconds for live updates)
  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        const response = await dashboardAPI.getAnalytics();
        if (response.data) {
          setDashboardAnalytics(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        // Keep showing zeros on error
      }
    };

    // Fetch immediately
    fetchDashboardAnalytics();

    // Then fetch every 5 seconds for live updates
    const interval = setInterval(fetchDashboardAnalytics, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS ---
  const handleCreateProject = () => { if (newProject.title) { setProjects([...projects, { id: Date.now(), title: newProject.title, desc: newProject.desc }]); setShowProjectModal(false); } };
  const handleSettingChange = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));
  const handleProfileUpdate = (key, val) => setUserProfile(prev => ({ ...prev, [key]: val }));


  // NEW: Helper function to format seconds to readable time
  const formatTime = (seconds) => {
    if (seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // --- RENDERERS ---

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return (
        <div className="content-max fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><h1 style={{ marginBottom: 4 }}>Command Center</h1><p style={{ color: 'var(--text-secondary)' }}>Executive operational readiness overview.</p></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-reset" style={{ padding: '0 20px', height: 40, border: '1px solid var(--border-subtle)', borderRadius: 2, fontSize: 12, color: 'var(--text-secondary)', gap: 8 }}><Calendar size={14} /> Schedule War Room</button>
              <button className="btn-gold" style={{ height: 45 }} onClick={() => setActiveTab('simulations')}><Play size={14} /> Initiate Protocol</button>
            </div>
          </div>
          <div className="grid-layout">
            {/* Card 1: Health Score */}
            <div className="card stagger-appear delay-1" style={{ flexDirection: 'row', alignItems: 'center', gap: 22 }}>
              <div className="health-score">
                <div style={{ fontSize: 24, fontWeight: '700', color: 'var(--gold-mid)', fontFamily: 'var(--font-display)' }}>75%</div>
                <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginTop: 4 }}>Completed</div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div><div style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>System Ingestion</div><div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Knowledge Base Filling</div></div>
              </div>
            </div>

            {/* Card 2: Executive Bandwidth */}
            <div className="card stagger-appear delay-2" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3>Executive Bandwidth Allocation</h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Simulation Performance</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', paddingTop: 8 }}>
                <CreativeRing label="Boardroom" value={Math.round(dashboardAnalytics.boardroom?.performance_percentage || 0)} color="var(--gold-mid)" />
                <CreativeRing label="VC Pitch" value={Math.round(dashboardAnalytics.vc?.performance_percentage || 0)} color="var(--danger)" />
                <CreativeRing label="Sales" value={Math.round(dashboardAnalytics.customer?.performance_percentage || 0)} color="var(--info)" />
                <CreativeRing label="CEO Coach" value={Math.round(dashboardAnalytics.ceo?.performance_percentage || 0)} color="var(--success)" />
              </div>
            </div>
          </div>

          <div className="grid-layout" style={{ marginTop: 24 }}>
            {/* Row 2, Card 1: Tactical Readiness */}
            <div className="card stagger-appear delay-4" style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Tactical Readiness</h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Time Spent (Combined Chat + 3D)</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 24, marginTop: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
                {[
                  { label: 'Customer', data: dashboardAnalytics.customer },
                  { label: 'VC', data: dashboardAnalytics.vc },
                  { label: 'Boardroom', data: dashboardAnalytics.boardroom },
                  { label: 'CEO', data: dashboardAnalytics.ceo }
                ].map((sim, i) => {
                  const totalTime = (sim.data?.total_time_seconds || 0) + (sim.data?.active_time_seconds || 0);
                  const maxTime = 3600; // 1 hour for scaling
                  const heightPercentage = Math.min((totalTime / maxTime) * 100, 100);
                  const isActive = (sim.data?.active_time_seconds || 0) > 0;

                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', opacity: heightPercentage > 10 ? 1 : 0.5 }}>
                        {formatTime(totalTime)}
                        {isActive && <span style={{ color: 'var(--success)', marginLeft: 4 }}>●</span>}
                      </div>
                      <div style={{
                        width: '100%',
                        background: isActive ? 'var(--success)' : 'var(--text-tertiary)',
                        opacity: 0.8,
                        height: `${Math.max(heightPercentage, 5)}%`,
                        borderRadius: '4px 4px 0 0',
                        boxShadow: isActive ? '0 0 15px rgba(93, 122, 88, 0.4)' : 'none',
                        transition: 'all 0.3s',
                        animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none'
                      }}></div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{sim.label}</div>
                    </div>
                  );
                })}
              </div>
              <style>{`
                   @keyframes pulse {
                     0%, 100% { opacity: 0.8; }
                     50% { opacity: 1; }
                   }
                 `}</style>
            </div>

            {/* Row 2, Card 2: Traffic */}
            <div className="card stagger-appear delay-5">
              <h3>Global Traffic</h3>
              <div style={{ marginTop: 20, height: 180, position: 'relative', borderLeft: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <path d="M0,45 Q10,40 20,42 T40,30 T60,25 T80,10 T100,5" fill="none" stroke="var(--success)" strokeWidth="2" />
                  <path d="M0,45 L100,45" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
                <div style={{ position: 'absolute', top: 10, right: 0, background: 'var(--bg-card)', padding: '4px 8px', border: '1px solid var(--success)', borderRadius: 4, color: 'var(--success)', fontSize: 12, fontWeight: 'bold' }}>+24%</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span>Visitor Growth</span>
                <span>12.5k / mo</span>
              </div>
            </div>
          </div>

          {projects.length > 0 && (
            <div className="grid-layout">{projects.map((p, i) => (<div key={p.id} className={`card stagger-appear delay-${i + 1}`}><h3>{p.title}</h3><p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>{p.desc}</p></div>))}</div>
          )}
        </div>
      );
      case 'simulations':
        if (activeSim) {
          // --- ROUTING LOGIC FOR SPECIFIC SIMULATION FILES ---
          if (activeSim.title === 'VC Pitch Defense') {
            return <VcsFile activeSim={activeSim} onBack={() => setActiveSim(null)} />;
          }
          if (activeSim.title === 'Crisis Management') {
            return <BoardroomFile activeSim={activeSim} onBack={() => setActiveSim(null)} />;
          }
          if (activeSim.title === 'Sales Gauntlet') {
            return <CustomerFile activeSim={activeSim} onBack={() => setActiveSim(null)} />;
          }
          if (activeSim.title === 'Honest CEO') {
            return <CeoCoach activeSim={activeSim} onBack={() => setActiveSim(null)} />;
          }

          // Default View for other simulations (with Abstract 3D Placeholder)
          return (
            <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-app)', zIndex: 60, display: 'flex' }} className="fade-in">
              <div style={{ width: 360, background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-gold)', padding: 40, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(20px)', boxShadow: '20px 0 60px rgba(0,0,0,0.8)' }}>
                <button className="btn-reset" onClick={() => setActiveSim(null)} style={{ justifyContent: 'flex-start', color: 'var(--text-tertiary)', marginBottom: 40, fontSize: 10, fontWeight: 700, letterSpacing: '1px' }}><ArrowLeft size={12} style={{ marginRight: 6 }} /> RETURN TO LOBBY</button>
                <div style={{ marginBottom: 40 }}><div className="form-label" style={{ color: 'var(--gold-mid)' }}>Active Session</div><h2 style={{ fontSize: 32, margin: '4px 0' }}>{activeSim.title}</h2><div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{activeSim.risk} Stakes Environment</div></div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <div className="card" style={{ background: 'rgba(0,0,0,0.2)', marginBottom: 24, padding: 24, border: '1px solid var(--border-subtle)' }}>
                    <div className="form-label">Mission Objectives</div>
                    {activeSim.points.map((p, i) => <div key={i} style={{ fontSize: 13, marginBottom: 10, display: 'flex', gap: 10, color: 'var(--text-primary)' }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold-dim)', marginTop: 8 }} />{p}</div>)}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}><button className="btn-reset" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 4, height: 36, fontSize: 10, fontWeight: 700, letterSpacing: '1px' }} onClick={() => setActiveSim(null)}>TERMINATE</button><button className="btn-gold" style={{ height: 36, fontSize: 10 }}><Mic size={14} /> COMMENCE</button></div>
              </div>
              <div style={{ flex: 1, position: 'relative', background: '#000' }}>
                <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
                  <Suspense fallback={<Html center><HamsterLoader /></Html>}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                    <pointLight position={[-10, -10, -10]} />
                    <AbstractModel />
                    <Environment preset="city" />
                    <OrbitControls />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          );
        }
        return (
          <div className="content-max fade-in">
            <h1>Strategic Wargames</h1>
            <div className="grid-layout">
              {SIMULATIONS_DATA.map((sim, i) => (
                <div key={sim.id} className={`card stagger-appear delay-${i + 1}`} style={{ justifyContent: 'space-between' }}>
                  <div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h3 style={{ fontSize: 20 }}>{sim.title}</h3><span style={{ fontSize: 10, fontWeight: 700, color: sim.risk === 'High' || sim.risk === 'Critical' ? 'var(--danger)' : 'var(--success)', border: sim.risk === 'High' || sim.risk === 'Critical' ? '1px solid var(--danger)' : '1px solid var(--success)', padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sim.risk}</span></div><ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>{sim.points.map((pt, i) => <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', gap: 10 }}><div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-gold)', marginTop: 8 }} /> {pt}</li>)}</ul></div>
                  <button className="btn-gold" onClick={() => setActiveSim(sim)}><Play size={14} /> Commence Exercise</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'professionals':
        return (
          <div className="content-max fade-in">
            <h1 style={{ marginBottom: 40 }}>The Advisory Board</h1>

            {/* CEO Section */}
            <div style={{ marginBottom: 48 }} className="stagger-appear delay-1">
              <h3 style={{ color: 'var(--gold-bright)', borderBottom: '1px solid var(--gold-dim)', paddingBottom: 16, marginBottom: 32, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Crown size={18} /> CEO Mentors & Coaches
              </h3>
              <div className="grid-layout">
                {PROFESSIONALS_DATA.ceo.map(prof => (
                  <div key={prof.id} className="card prof-card" style={{ padding: 0 }}>
                    <div className="prof-header-bg" style={{ background: 'linear-gradient(90deg, #3E2F26 0%, #5E4F40 100%)' }}></div>
                    <div className="prof-avatar-container" style={{ borderColor: 'var(--gold-bright)', borderWidth: '3px' }}>
                      <img src={prof.avatar} alt={prof.name} className="prof-avatar-img" style={{ filter: 'sepia(0.3) contrast(1.2)' }} />
                    </div>
                    <div style={{ padding: '24px 24px 12px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: 20, marginBottom: 4, color: 'var(--gold-bright)' }}>{prof.name}</h3>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 8 }}>{prof.role}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.5 }}>Domain Expertise: {prof.specialty}</div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>"{prof.bio}"</p>
                      <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, justifySelf: 'center', justifyContent: 'center' }}>
                        <span className="chip" style={{ fontSize: 10, padding: '6px 10px', background: 'rgba(212, 175, 104, 0.1)' }}>{prof.specialty}</span>
                      </div>
                    </div>
                    <div className="prof-stat-row">
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Tenure</div>
                        <div style={{ fontWeight: 700, color: 'var(--gold-bright)', fontSize: 13 }}>{prof.experience}</div>
                      </div>
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Approach</div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>{prof.rate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venture Capitalists Section */}
            <div style={{ marginBottom: 48 }} className="stagger-appear delay-2">
              <h3 style={{ color: 'var(--gold-mid)', borderBottom: '1px solid var(--border-gold)', paddingBottom: 16, marginBottom: 32, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Venture Capitalists</h3>
              <div className="grid-layout">
                {PROFESSIONALS_DATA.vcs.map(prof => (
                  <div key={prof.id} className="card prof-card" style={{ padding: 0 }}>
                    <div className="prof-header-bg"></div>
                    <div className="prof-avatar-container">
                      <img src={prof.avatar} alt={prof.name} className="prof-avatar-img" />
                    </div>
                    <div style={{ padding: '24px 24px 12px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{prof.name}</h3>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>{prof.role}</div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, marginBottom: 16, lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>{prof.bio}</p>
                      <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, justifySelf: 'center', justifyContent: 'center' }}>
                        <span className="chip" style={{ fontSize: 10, padding: '4px 8px' }}>{prof.specialty}</span>
                      </div>
                    </div>
                    <div className="prof-stat-row">
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Tenure</div>
                        <div style={{ fontWeight: 600, color: 'var(--gold-mid)' }}>{prof.experience}</div>
                      </div>
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Approach</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prof.rate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boardroom Advisors Section */}
            <div style={{ marginBottom: 48 }} className="stagger-appear delay-3">
              <h3 style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 32, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Boardroom Advisors</h3>
              <div className="grid-layout">
                {PROFESSIONALS_DATA.boardroom.map(prof => (
                  <div key={prof.id} className="card prof-card" style={{ padding: 0 }}>
                    <div className="prof-header-bg" style={{ background: 'linear-gradient(90deg, #1A120E 0%, #2A1D16 100%)' }}></div>
                    <div className="prof-avatar-container" style={{ borderColor: 'var(--text-secondary)' }}>
                      <img src={prof.avatar} alt={prof.name} className="prof-avatar-img" style={{ filter: 'grayscale(0.5)' }} />
                    </div>
                    <div style={{ padding: '24px 24px 12px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{prof.name}</h3>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>{prof.role}</div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, marginBottom: 16, lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>{prof.bio}</p>
                      <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, justifySelf: 'center', justifyContent: 'center' }}>
                        <span className="chip" style={{ fontSize: 10, padding: '4px 8px' }}>{prof.specialty}</span>
                      </div>
                    </div>
                    <div className="prof-stat-row">
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Tenure</div>
                        <div style={{ fontWeight: 600, color: 'var(--info)' }}>{prof.experience}</div>
                      </div>
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Approach</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prof.rate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Customers Section */}
            <div style={{ marginBottom: 48 }} className="stagger-appear delay-4">
              <h3 style={{ color: 'var(--danger)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 32, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Demographics</h3>
              <div className="grid-layout">
                {PROFESSIONALS_DATA.customers.map(prof => (
                  <div key={prof.id} className="card prof-card" style={{ padding: 0 }}>
                    <div className="prof-header-bg" style={{ background: 'linear-gradient(90deg, #261C16 0%, #3E2F26 100%)' }}></div>
                    <div className="prof-avatar-container" style={{ borderColor: 'var(--danger)' }}>
                      <img src={prof.avatar} alt={prof.name} className="prof-avatar-img" />
                    </div>
                    <div style={{ padding: '24px 24px 12px 24px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{prof.name}</h3>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>{prof.role}</div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, marginBottom: 16, lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>{prof.bio}</p>
                      <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6, justifySelf: 'center', justifyContent: 'center' }}>
                        <span className="chip" style={{ fontSize: 10, padding: '4px 8px' }}>{prof.specialty}</span>
                      </div>
                    </div>
                    <div className="prof-stat-row">
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Tenure</div>
                        <div style={{ fontWeight: 600, color: 'var(--danger)' }}>{prof.experience}</div>
                      </div>
                      <div className="prof-stat">
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Approach</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prof.rate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="content-max fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h1>Executive Audit Trail</h1>
              <button className="btn-reset" style={{ fontSize: 12, padding: '10px 24px', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}><Download size={14} /> Extract Data</button>
            </div>

            {/* Activity Filter Toggle - UPDATED TO WHITE/BONE THEME */}
            <div className="stagger-appear delay-1" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 8, width: 'fit-content' }}>
                <button className={`btn-toggle ${activityFilter === 'today' ? 'active' : ''}`} onClick={() => setActivityFilter('today')}>Today</button>
                <button className={`btn-toggle ${activityFilter === 'weekly' ? 'active' : ''}`} onClick={() => setActivityFilter('weekly')}>Weekly</button>
                <button className={`btn-toggle ${activityFilter === 'monthly' ? 'active' : ''}`} onClick={() => setActivityFilter('monthly')}>Monthly</button>
                <button className={`btn-toggle ${activityFilter === 'all' ? 'active' : ''}`} onClick={() => setActivityFilter('all')}>All</button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 12, paddingLeft: 4 }}>
                Displaying {filteredActivityLog.length} of {activityLog.length} records ({activityFilter})
              </div>
            </div>

            <div className="card stagger-appear delay-2" style={{ marginTop: 0, padding: 0 }}>
              {filteredActivityLog.map(log => (
                <div key={log.id} style={{ display: 'flex', gap: 24, padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                  <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.02)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: 'var(--text-primary)' }}>{log.action}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{log.detail}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-tertiary)' }}>{log.time}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>{log.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'usage':
        const plans = [
          { name: 'Starter', price: '$0', features: ['500 daily requests', 'Limited Access', 'Community Support'], recommended: false, color: '#3A3A3A' },
          { name: 'Founder', price: '$49', features: ['2,000 daily requests', 'Full Board Access', 'Basic Analytics'], recommended: false, color: '#261C16' },
          { name: 'Professional', price: '$99', features: ['3,500 daily requests', 'Reduced Latency', 'Priority Support'], recommended: false, color: '#2A201A' },
          { name: 'Executive', price: '$149', features: ['5,000 daily requests', 'Advanced Intelligence', 'Concierge Onboarding'], recommended: true, color: 'linear-gradient(180deg, #2A1D16 0%, #1A120E 100%)' },
          { name: 'Global Elite', price: '$499', features: ['Unlimited Requests', 'Custom Training', 'Dedicated Account Manager'], recommended: false, color: '#100C0A' },
          { name: 'Enterprise', price: 'Custom', features: ['API Access', 'SSO / SAML', 'SLA Guarantees'], recommended: false, color: '#261C16' },
        ];

        return (
          <div className="content-max fade-in">
            <h1 style={{ marginBottom: 8 }}>Capital & Resource Allocation</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>System preferences and integrations.</p>

            {/* Upgrade Section - Added */}
            <div className="card stagger-appear delay-1" style={{ marginBottom: 32 }}>
              <div className="section-header" style={{ border: 0, padding: 0, marginBottom: 24 }}>
                <CreditCard size={24} color="var(--gold-mid)" />
                <div>
                  <h2 style={{ fontSize: 22, marginBottom: 4 }}>Elevate Status</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Unlock strategic wargames, higher throughput, and premium assets</p>
                </div>
              </div>
              <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                {plans.map((plan, i) => (
                  <div key={plan.name} className="card" style={{ padding: 24, background: plan.color, border: plan.recommended ? '1px solid var(--gold-mid)' : '1px solid var(--border-gold)', position: 'relative' }}>
                    {plan.recommended && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, color: 'var(--gold-mid)', background: 'rgba(212, 175, 104, 0.1)', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>RECOMMENDED</span>}
                    <h3 style={{ fontSize: 18, marginBottom: 12 }}>{plan.name} Plan</h3>
                    <div style={{ fontSize: 32, fontWeight: 700, color: plan.recommended ? 'var(--gold-bright)' : 'var(--gold-mid)', fontFamily: 'var(--font-display)', marginBottom: 16 }}>{plan.price}<span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/mo</span></div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                      {plan.features.map((feat, k) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Check size={14} /> {feat}</div>
                      ))}
                    </div>
                    <button className="btn-gold" style={{ width: '100%', height: 40, fontSize: 12, background: plan.recommended ? 'var(--gold-grad)' : 'transparent', color: plan.recommended ? '#1A120E' : 'var(--gold-dim)' }}>{plan.name === 'Founder' ? 'Active Commission' : 'Select Plan'}</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage Limits Section - Modified */}
            <div className="grid-layout" style={{ marginBottom: 32 }}>
              <div className="card stagger-appear delay-2">
                <h3>Active Commission</h3>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold-mid)', fontFamily: 'var(--font-display)', marginTop: 16 }}>Founder Plan</div>

                {/* Daily Limit */}
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Operational Throughput (Daily)</span>
                  <span>850 / 2,000 Operations</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{ width: '42%', background: 'var(--gold-mid)' }}></div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>Resets in 12 hours</div>

                {/* Monthly Limit */}
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Strategic Bandwidth (Monthly)</span>
                  <span>25,400 / 60,000 Operations</span>
                </div>
                <div className="progress-bar" style={{ marginTop: 8 }}>
                  <div className="progress-fill" style={{ width: '42%', background: 'var(--info)' }}></div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8 }}>Resets on 1st of next month</div>
              </div>

              <div className="card stagger-appear delay-3">
                <h3>Time Allocation</h3>
                <div style={{ marginTop: 16 }}>
                  {[
                    { name: 'VC Pitch Defense', time: '4h 25m', pct: 60 },
                    { name: 'Sales Gauntlet', time: '2h 10m', pct: 30 },
                    { name: 'Crisis Management', time: '45m', pct: 10 }
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ color: 'var(--gold-dim)' }}>{item.time}</span>
                      </div>
                      <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${item.pct}%`, background: 'var(--gold-grad)', borderRadius: 2 }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Usage Summary */}
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Wargames This Month</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>47</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Avg. Session Duration</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>24 min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="card stagger-appear delay-4">
              <h3 style={{ marginBottom: 24 }}>Ledger History</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 14, alignItems: 'center' }}>
                <span>Oct 1, 2025</span>
                <span>Founder Plan</span>
                <span>$49.00</span>
                <span style={{ color: 'var(--success)', background: 'rgba(93, 122, 88, 0.1)', padding: '4px 12px', borderRadius: 4, fontSize: 12 }}>Settled</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 14, alignItems: 'center' }}>
                <span>Sep 1, 2025</span>
                <span>Founder Plan</span>
                <span>$49.00</span>
                <span style={{ color: 'var(--success)', background: 'rgba(93, 122, 88, 0.1)', padding: '4px 12px', borderRadius: 4, fontSize: 12 }}>Settled</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', fontSize: 14, alignItems: 'center' }}>
                <span>Aug 1, 2025</span>
                <span>Founder Plan</span>
                <span>$49.00</span>
                <span style={{ color: 'var(--success)', background: 'rgba(93, 122, 88, 0.1)', padding: '4px 12px', borderRadius: 4, fontSize: 12 }}>Settled</span>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="content-max fade-in" style={{ paddingBottom: 100 }}>
            <h1 style={{ marginBottom: 8 }}>Governance & Protocols</h1><p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>System preferences and integrations.</p>
            <div className="grid-layout">
              {/* Profile Settings */}
              <div className="card stagger-appear delay-1" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <User size={20} /> <span style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>Dossier Management</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="btn-reset"
                      onClick={() => navigate('/upgrade')}
                      style={{
                        color: 'var(--gold-bright)',
                        fontSize: 12,
                        gap: 8,
                        border: '1px solid var(--gold-mid)',
                        padding: '6px 16px',
                        borderRadius: 4,
                        background: 'rgba(220, 154, 20, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(220, 154, 20, 0.2)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(220, 154, 20, 0.1)'}
                    >
                      <Crown size={14} /> UPGRADE PLAN
                    </button>
                    <button className="btn-reset" style={{ color: 'var(--danger)', fontSize: 12, gap: 8, border: '1px solid var(--danger)', padding: '6px 12px', borderRadius: 4 }}>
                      <LogOut size={14} /> LOG OUT
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--gold-grad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#0F0C08', boxShadow: 'var(--gold-glow)', position: 'relative' }}>
                      {userProfile.avatar}
                      <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#1A120E', border: '1px solid var(--gold-mid)', padding: 6, borderRadius: '50%', cursor: 'pointer' }}>
                        <Camera size={14} color="var(--gold-mid)" />
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Format: JPG, PNG</div>
                  </div>

                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={userProfile.name} onChange={(e) => handleProfileUpdate('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Title / Role</label>
                      <input className="form-input" value={userProfile.role} onChange={(e) => handleProfileUpdate('role', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Secure Communication Channel</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', top: 16, left: 16, color: 'var(--text-secondary)' }} />
                        <input className="form-input" style={{ paddingLeft: 44 }} value={userProfile.email} onChange={(e) => handleProfileUpdate('email', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Access Credentials</label>
                      <button className="btn-reset" style={{ width: '100%', border: '1px solid var(--border-subtle)', height: 50, borderRadius: 2, fontSize: 13, color: 'var(--text-secondary)', justifyContent: 'flex-start', paddingLeft: 20 }}>Reset Passphrase</button>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                  <button className="btn-gold" style={{ height: 40, fontSize: 12 }}>Update Dossier</button>
                </div>
              </div>

              <div className="card stagger-appear delay-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}><Link size={20} /> <span style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>Neural Uplinks</span></div>
                <div className="checkbox-item checked"><div style={{ width: 16, height: 16, background: 'var(--gold-mid)', borderRadius: 4, marginRight: 12 }}></div> Stripe (Linked)</div>
                <div className="checkbox-item"><div style={{ width: 16, height: 16, border: '1px solid var(--text-secondary)', borderRadius: 4, marginRight: 12 }}></div> GitHub</div>
                <div className="checkbox-item"><div style={{ width: 16, height: 16, border: '1px solid var(--text-secondary)', borderRadius: 4, marginRight: 12 }}></div> Slack</div>
              </div>

              <div className="card stagger-appear delay-3" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}><Sliders size={20} color="var(--gold-mid)" /> <span style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>Heuristic Calibration</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                  <div><label className="form-label">Sales Aggression</label><input type="range" className="range-slider" style={{ width: '100%', accentColor: 'var(--gold-mid)' }} min="0" max="100" value={settings.salesAggression} onChange={(e) => handleSettingChange('salesAggression', e.target.value)} /></div>
                  <div><label className="form-label">VC Skepticism</label><input type="range" className="range-slider" style={{ width: '100%', accentColor: 'var(--gold-mid)' }} min="0" max="100" value={settings.vcSkepticism} onChange={(e) => handleSettingChange('vcSkepticism', e.target.value)} /></div>
                  <div><label className="form-label">Crisis Pressure</label><input type="range" className="range-slider" style={{ width: '100%', accentColor: 'var(--gold-mid)' }} min="0" max="100" value={settings.crisisPressure} onChange={(e) => handleSettingChange('crisisPressure', e.target.value)} /></div>
                  <div><label className="form-label">Technical Depth</label><input type="range" className="range-slider" style={{ width: '100%', accentColor: 'var(--gold-mid)' }} min="0" max="100" value={settings.techDetail} onChange={(e) => handleSettingChange('techDetail', e.target.value)} /></div>
                </div>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (!isAppLoaded) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <HamsterLoader />
        <div style={{ marginTop: '40px', fontFamily: 'var(--font-display)', color: 'var(--text-secondary)', letterSpacing: '0.2em', fontSize: 14 }}>INITIALIZING EXECUTIVE SUITE</div>
      </div>
    );
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {showProjectModal && (
        <div className="modal-overlay fade-in" onClick={() => setShowProjectModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 28, marginBottom: 32, fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border-gold)', paddingBottom: 16 }}>Create New Protocol</h2>
            <input className="form-input" style={{ marginBottom: 20 }} placeholder="Project Name" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
            <textarea className="form-input" style={{ height: 120, resize: 'none', marginBottom: 32 }} placeholder="Briefing (optional)" value={newProject.desc} onChange={e => setNewProject({ ...newProject, desc: e.target.value })} />
            <div style={{ display: 'flex', gap: 16 }}><button className="btn-reset" style={{ flex: 1, padding: 12, border: '1px solid var(--border-subtle)', borderRadius: 4, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }} onClick={() => setShowProjectModal(false)}>Abort</button><button className="btn-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCreateProject}>Initiate Project</button></div>
          </div>
        </div>
      )}
      <div className="app-container">
        {!activeSim && (
          <div className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56, paddingLeft: 8 }}>
              <img src="logo192.png" style={{ width: 40, height: 50, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(191, 151, 78, 0.3))' }} alt="Logo" />
              <span style={{ fontSize: 22, fontWeight: 400, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Asklurk</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Overview', 'Simulations', 'Professionals', 'Activity', 'Usage', 'Settings'].map(tab => (
                <div key={tab} className={`nav-item ${activeTab === tab.toLowerCase() ? 'active' : ''}`} onClick={() => setActiveTab(tab.toLowerCase())}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
              ))}
            </div>
          </div>
        )}
        <div className="main-area">
          {!activeSim && (
            <div className="top-bar">
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Asklurk OS <ChevronRight size={10} /> {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-input)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--gold-mid)' }}>KS</div>
            </div>
          )}
          <div className="scroll-view" style={{ padding: activeSim ? 0 : 48 }}>{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;