// Vcs.js - COMPLETE CODE WITH COMPONENT ROUTING
import React, { useState, useEffect } from 'react';
import { 
  Check, X, User, FileText, UploadCloud, ChevronDown, Lock, Save, AlertTriangle,
  Database, Clock, Hexagon, MapPin, Target, TrendingUp, MessageSquare, Box, Briefcase,
  DollarSign, Activity, PieChart, Users, Zap, Brain, Rocket, Shield, Layers, Sliders,
  Tag, Hash, Award, Globe, Key, Send, PhoneOff
} from 'lucide-react';

import Vc3DMode from '../Vr/vc';
import VcChatMode from '../chat/vcchat';

const VCPanel = ({ activeSim, onBack }) => {
  const [currentView, setCurrentView] = useState('setup'); // 'setup', '3d', 'chat'
  const [meetingConfig, setMeetingConfig] = useState(null);
  
  // --- STATE ---
  const [config, setConfig] = useState({
    title: "The Deal Maverick", 
    pitchText: "", 
    valueProp: "", 
    fundStage: "Seed",
    checkSize: "$1M - $3M",
    sectorFocus: "B2B SaaS",
    meetingMode: "3d", // 3d or chat
    useAssets: false, 
    metrics_mrr: "",
    metrics_burn: "",
    metrics_runway: "",
    metrics_cac: "",
    metrics_ltv: "",
    metrics_team: "",
    founderType: "visionary",
    strategy_growth_profit: 50,
    strategy_product_sales: 50,
    strategy_speed_quality: 50,
    tags_technical: true,
    tags_repeat: false,
    tags_patent: false,
    tags_solo: false,
    tags_global: true
  });

  const [instructionsChecked, setInstructionsChecked] = useState(false);
  const [history, setHistory] = useState([]); 
  const [unsavedCharChanges, setUnsavedCharChanges] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // --- INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
    const savedTitle = localStorage.getItem('asklurk_vc_title');
    if (savedTitle) {
      setConfig(prev => ({ ...prev, title: savedTitle }));
    }
  }, []);

  useEffect(() => {
    const generateToken = () => {
      const array = new Uint32Array(8);
      window.crypto.getRandomValues(array);
      let token = "";
      for (let i = 0; i < array.length; i++) {
        token += array[i].toString(16);
      }
      return token;
    };
    setCsrfToken(generateToken());
  }, []);

  // DEFAULT VC CHARACTERS
  const defaultCharacters = [
    { 
      id: 1, name: "Arthur V.", role: "Managing Partner", initials: "AV", color: "#5D4037",
      behaviors: [
        { id: 'b1', name: "Market Size (TAM)", val: 95 },
        { id: 'b2', name: "Exit Potential", val: 90 },
        { id: 'b3', name: "Team Pedigree", val: 80 }
      ]
    },
    { 
      id: 2, name: "Jessica L.", role: "Principal Investor", initials: "JL", color: "#3E4F5E",
      behaviors: [
        { id: 'b1', name: "Unit Economics", val: 95 },
        { id: 'b2', name: "CAC / LTV Ratio", val: 90 },
        { id: 'b3', name: "Churn Analysis", val: 85 }
      ]
    },
    { 
      id: 3, name: "Rohan M.", role: "Technical Partner", initials: "RM", color: "#4A5D4A",
      behaviors: [
        { id: 'b1', name: "Tech Stack & IP", val: 95 },
        { id: 'b2', name: "Scalability Risk", val: 85 },
        { id: 'b3', name: "Product Roadmap", val: 80 }
      ]
    },
    { 
      id: 4, name: "Sasha K.", role: "Associate (Diligence)", initials: "SK", color: "#6D5C40",
      behaviors: [
        { id: 'b1', name: "Competitive Landscape", val: 95 },
        { id: 'b2', name: "Reference Checks", val: 90 },
        { id: 'b3', name: "Market Trends", val: 75 }
      ]
    },
    { 
      id: 5, name: "David B.", role: "Operator / Angel", initials: "DB", color: "#582C2C",
      behaviors: [
        { id: 'b1', name: "Founder Fit", val: 95 },
        { id: 'b2', name: "GTM Strategy", val: 90 },
        { id: 'b3', name: "Hiring Plan", val: 80 }
      ]
    }
  ];

  const [characters, setCharacters] = useState(defaultCharacters);
  const [expandedChar, setExpandedChar] = useState(1); 

  useEffect(() => {
    const savedChars = localStorage.getItem('asklurk_vc_chars');
    if (savedChars) {
      try {
        setCharacters(JSON.parse(savedChars));
      } catch (e) {
        console.error("Failed to load saved characters", e);
      }
    }
  }, []);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setConfig(prev => ({ ...prev, title: newTitle }));
    localStorage.setItem('asklurk_vc_title', newTitle);
  };

  // --- DERIVED STATUS ---
  const status = {
    pitch: config.pitchText.trim().length > 0,
    target: config.fundStage && config.checkSize && config.sectorFocus,
    metrics: config.metrics_mrr && config.metrics_burn, 
    strategy: true,
    directives: instructionsChecked
  };

  const completionPercent = Math.round(
    (Object.values(status).filter(Boolean).length / Object.keys(status).length) * 100
  );

  // --- HANDLERS ---
  const handleBehaviorChange = (charId, behaviorId, newVal) => {
    setUnsavedCharChanges(true);
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      return {
        ...c,
        behaviors: c.behaviors.map(b => b.id === behaviorId ? { ...b, val: newVal } : b)
      };
    }));
  };

  const handleSaveCharacters = (e) => {
    e.stopPropagation();
    if (!csrfToken) {
      console.warn("Security Alert: Missing CSRF Token on save action.");
    }
    localStorage.setItem('asklurk_vc_chars', JSON.stringify(characters));
    setUnsavedCharChanges(false);
    alert("Investment Committee configuration has been successfully persisted to local storage.");
  };

  const handleStart = () => {
    // STRICT VALIDATION
    const missing = [];
    if (!status.pitch) missing.push("Investment Thesis (Pitch Narrative)");
    if (!status.metrics) missing.push("Venture Metrics (Health Check)");
    if (!status.directives) missing.push("Operational Directives (Acknowledgment)");

    if (missing.length > 0) {
      alert(`INITIATION HALTED.\n\nThe following mandatory protocols are incomplete:\n\n- ${missing.join('\n- ')}\n\nPlease populate all required fields to proceed.`);
      return;
    }
    
    const newSession = { 
        id: Date.now(), 
        title: config.title,
        securityToken: csrfToken,
        mode: config.meetingMode,
        metrics: {
            mrr: config.metrics_mrr,
            burn: config.metrics_burn,
            runway: config.metrics_runway
        },
        strategy: {
            growth: config.strategy_growth_profit,
            sales: config.strategy_product_sales,
            founderType: config.founderType,
            tags: {
                technical: config.tags_technical,
                repeat: config.tags_repeat,
                patent: config.tags_patent
            }
        }
    };
    
    setHistory(prev => [newSession, ...prev]);
    setMeetingConfig(newSession);
    
    localStorage.setItem('vc_meeting_config', JSON.stringify(newSession));

    // ===== INTERNAL ROUTING LOGIC =====
    // Sets view state to trigger conditional rendering below
    if (config.meetingMode === '3d') {
      setCurrentView('3d');
    } else {
      setCurrentView('chat');
    }
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
  };

  // ===== CONDITIONAL RENDERING (The Route Logic) =====
  // This matches the pattern in your parent component
  if (currentView === '3d') {
    return <Vc3DMode config={meetingConfig} onBack={handleBackToSetup} />;
  }

  if (currentView === 'chat') {
    return <VcChatMode config={meetingConfig} onBack={handleBackToSetup} />;
  }

  // DEFAULT VIEW (SETUP)
  // --- STYLES ---
  const styles = {
    sectionTitle: { color: '#8F7045', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16, marginTop: 32 },
    input: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, transition: 'all 0.3s ease' },
    select: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 13, cursor: 'pointer', appearance: 'none' },
    label: { color: '#9C8C74', fontSize: 13, marginBottom: 8, display: 'block' },
    card: { background: 'rgba(26, 18, 14, 0.6)', border: '1px solid rgba(196, 168, 111, 0.15)', borderRadius: 6, padding: 20, transition: 'all 0.3s ease', boxSizing: 'border-box' },
    goldBtn: { 
        background: completionPercent === 100 ? 'linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%)' : '#3E2F26', 
        color: completionPercent === 100 ? '#1A120E' : '#5E4F40', 
        border: 'none', borderRadius: 2, height: 40, padding: '0 32px', 
        fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', 
        cursor: completionPercent === 100 ? 'pointer' : 'not-allowed', 
        display: 'flex', alignItems: 'center', gap: 8, 
        boxShadow: completionPercent === 100 ? '0 0 15px rgba(212, 175, 104, 0.15)' : 'none', 
        transition: 'all 0.3s ease' 
    },
    saveBtn: {
        background: 'rgba(212, 175, 104, 0.1)', border: '1px solid #D4AF68', color: '#D4AF68',
        borderRadius: 2, padding: '4px 12px', fontSize: 10, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        textTransform: 'uppercase', letterSpacing: '0.05em'
    },
    textArea: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, minHeight: 100, resize: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.3s ease' },
    metricCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(196, 168, 111, 0.1)', padding: 12, borderRadius: 4 },
    personaCard: { cursor: 'pointer', flex: 1, padding: 16, border: '1px solid', borderRadius: 6, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' },
    sliderContainer: { marginBottom: 24, padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' },
    sliderLabel: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9C8C74', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' },
    tagBtn: { flex: 1, border: '1px solid', borderRadius: 4, padding: '10px', fontSize: 11, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'all 0.2s' },
    sliderValueDisplay: { textAlign: 'center', marginTop: 8, fontSize: 12, fontWeight: 700, color: '#E8E0D5', background: 'rgba(212, 175, 104, 0.1)', padding: '4px 8px', borderRadius: 4, border: '1px solid rgba(212, 175, 104, 0.3)', display: 'inline-block' }
  };

  const instructions = [
    "Simulation duration is strictly capped at sixty (60) minutes per session.",
    "User allocation is limited to five (5) high-fidelity simulations per calendar month.",
    "Participant must register at least one substantive response every five (5) minutes to maintain session viability.",
    "Interaction volume is capped at 500 distinct message units to ensure exchange efficiency.",
    "Strategic 'skip' actions are restricted to a maximum of three (3) instances per session.",
    "The interface includes real-time analytical telemetry (dynamic graphs and bars) for performance monitoring.",
    "All discourse must adhere to strict professional standards; colloquialisms are prohibited.",
    "Active engagement with investor queries is mandatory; silence or avoidance will result in penalty.",
    "Navigating away from the active interface will trigger an automatic pause protocol.",
    "Session conclusion occurs automatically upon Term Sheet issuance or Hard Pass."
  ];

  const CompletionCircle = ({ percentage }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="32" cy="32" r={radius} stroke="#3E2F26" strokeWidth="4" fill="transparent" />
          <circle cx="32" cy="32" r={radius} stroke={percentage === 100 ? "#5D7A58" : "#D4AF68"} strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease' }} />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: percentage === 100 ? "#5D7A58" : "#D4AF68", transition: 'color 0.3s' }}>{percentage}%</div>
        </div>
      </div>
    );
  };

  const ModeOption = ({ mode, icon: Icon, label }) => {
    const isSelected = config.meetingMode === mode;
    return (
        <div 
            onClick={() => setConfig({...config, meetingMode: mode})}
            style={{ 
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 12, borderRadius: 4, cursor: 'pointer',
                background: isSelected ? 'rgba(212, 175, 104, 0.1)' : 'transparent',
                border: `1px solid ${isSelected ? '#D4AF68' : 'rgba(255,255,255,0.1)'}`,
                transition: 'all 0.2s'
            }}
        >
            <Icon size={18} color={isSelected ? '#D4AF68' : '#9C8C74'} />
            <span style={{ fontSize: 11, color: isSelected ? '#E8E0D5' : '#9C8C74', fontWeight: isSelected ? 600 : 400 }}>{label}</span>
        </div>
    );
  };

  const ArchetypeCard = ({ type, icon: Icon, title, desc }) => {
    const isActive = config.founderType === type;
    return (
        <div 
            onClick={() => setConfig({...config, founderType: type})}
            style={{ 
                ...styles.personaCard,
                background: isActive ? 'rgba(212, 175, 104, 0.15)' : 'rgba(255,255,255,0.02)',
                borderColor: isActive ? '#D4AF68' : 'transparent',
            }}
        >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: isActive ? '#D4AF68' : '#2A201A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={isActive ? '#1A120E' : '#9C8C74'} />
            </div>
            <div>
                <div style={{ color: isActive ? '#E8E0D5' : '#9C8C74', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{title}</div>
                <div style={{ color: '#5E4F40', fontSize: 10, marginTop: 4 }}>{desc}</div>
            </div>
        </div>
    );
  };

  const getSliderText = (val, leftLabel, rightLabel) => {
    if (val === 50) return "Balanced Approach";
    if (val < 50) return `${Math.abs(val - 100)}% ${leftLabel}`;
    return `${val}% ${rightLabel}`;
  };

  const StatusItem = ({ label, isReady }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#9C8C74', padding: '4px 0' }}>
        <span>{label}</span>
        {isReady ? <Check size={14} color="#5D7A58" /> : <X size={14} color="#8A3A3A" />}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 60, display: 'flex' }} className="fade-in">
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1A120E; }
        ::-webkit-scrollbar-thumb { background: #3E2F26; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #D4AF68; }
        .char-card { transition: background 0.3s ease, border-color 0.3s ease; }
        .char-card:hover { border-color: rgba(212, 175, 104, 0.4); }
        .expand-enter { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .btn-hover:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .btn-hover:active { transform: translateY(1px); filter: brightness(0.95); }
        .interactive-row:hover { background: rgba(255,255,255,0.03); }
        .instruction-item { display: flex; gap: 12px; margin-bottom: 12px; font-size: 13px; color: #9C8C74; line-height: 1.5; align-items: flex-start; }
        .instruction-num { color: #D4AF68; font-weight: 700; min-width: 20px; }
        .file-upload-zone { 
            width: 100%; box-sizing: border-box; 
            border: 1px dashed #5E4F40; background: rgba(255,255,255,0.02); 
            border-radius: 4px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; 
        }
        .file-upload-zone:hover { border-color: #D4AF68; background: rgba(212, 175, 104, 0.05); }
        select option { background: #1A120E; color: #E8E0D5; }
        .avatar-circle {
            width: 36px; height: 36px; border-radius: 50%;
            display: flex; alignItems: center; justifyContent: center;
            font-size: 13px; font-weight: 700; color: #E8E0D5;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 12px; width: 12px; border-radius: 50%; background: #D4AF68; margin-top: -4px; cursor: pointer; border: 2px solid #1A120E; }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* --- LEFT SIDEBAR --- */}
      <div style={{ width: 220, background: '#1A120E', borderRight: '1px solid rgba(196, 168, 111, 0.25)', padding: '40px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, color: '#D4AF68', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <Hexagon size={18} fill="rgba(212, 175, 104, 0.1)" /> AGIOAS
        </div>
        
        <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, margin: '4px 0', color: '#E8E0D5', fontFamily: 'serif' }}>Initialization</h2>
            <div style={{ fontSize: 13, color: '#9C8C74' }}>Simulation Setup</div>
        </div>

        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <CompletionCircle percentage={completionPercent} />
            <div>
                <div style={{ fontSize: 12, color: '#9C8C74', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Readiness</div>
                <div style={{ fontSize: 13, color: '#E8E0D5' }}>{completionPercent === 100 ? 'Authorized' : 'Pending'}</div>
            </div>
        </div>

        <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8F7045', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Session Logs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.length > 0 ? (
                    history.map((h) => (
                        <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Clock size={12} color="#5E4F40" />
                            <span style={{ fontSize: 12, color: '#9C8C74' }}>{h.title}</span>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '8px 0', fontSize: 12, color: '#5E4F40', fontStyle: 'italic' }}>No archival data</div>
                )}
            </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8F7045', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>System Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <StatusItem label="Investment Thesis" isReady={status.pitch} />
                <StatusItem label="Founder Archetype" isReady={true} />
                <StatusItem label="Venture Metrics" isReady={status.metrics} />
                <StatusItem label="Strategic Alignment" isReady={status.strategy} />
                <StatusItem label="Fund Mandate" isReady={status.target} />
                <StatusItem label="Directives Ack." isReady={status.directives} />
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <label style={styles.label}>SIMULATION IDENTIFIER</label>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <input 
                    style={{ ...styles.input, fontSize: 32, fontFamily: 'serif', height: 70, background: 'transparent', borderBottom: '1px solid #D4AF68', borderTop: 0, borderLeft: 0, borderRight: 0, paddingLeft: 0, textAlign: 'center', paddingRight: 0 }} 
                    value={config.title} 
                    onChange={handleTitleChange}
                    placeholder="Enter Session Title..."
                />
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 40 }}>
            
            {/* LEFT COLUMN */}
            <div>
                <div style={styles.sectionTitle}>Investment Thesis</div>
                <div style={{ marginBottom: 32 }}>
                    <label style={styles.label}>PITCH NARRATIVE & VALUE PROPOSITION</label>
                    <textarea 
                        style={styles.textArea} 
                        placeholder="Articulate the unique selling proposition and primary objective..."
                        value={config.pitchText}
                        onChange={(e) => setConfig({...config, pitchText: e.target.value})}
                    />
                </div>

                <div style={styles.sectionTitle}>Founder Persona</div>
                <div style={{ marginBottom: 32 }}>
                    <label style={styles.label}>SELECT YOUR SIMULATION AVATAR</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <ArchetypeCard type="visionary" icon={Brain} title="The Visionary" desc="High Charisma, Low Detail" />
                        <ArchetypeCard type="hacker" icon={Zap} title="The Hacker" desc="High Tech, Low Sales" />
                        <ArchetypeCard type="operator" icon={Shield} title="The Operator" desc="Balanced, Risk-Averse" />
                    </div>
                </div>

                <div style={styles.sectionTitle}>Rapid Context</div>
                <div style={{ marginBottom: 32 }}>
                    <label style={styles.label}>QUICK TOGGLES (SELECT ALL THAT APPLY)</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                            { key: 'tags_technical', label: "Technical Founder", icon: Hash },
                            { key: 'tags_repeat', label: "Repeat Entrepreneur", icon: Award },
                            { key: 'tags_patent', label: "IP / Patent Pending", icon: Key },
                            { key: 'tags_solo', label: "Solo Founder", icon: User },
                            { key: 'tags_global', label: "Global Day 1", icon: Globe }
                        ].map(tag => (
                            <div 
                                key={tag.key}
                                onClick={() => setConfig({...config, [tag.key]: !config[tag.key]})}
                                style={{ 
                                    ...styles.tagBtn, 
                                    background: config[tag.key] ? 'rgba(212, 175, 104, 0.2)' : 'transparent',
                                    borderColor: config[tag.key] ? '#D4AF68' : 'rgba(94, 79, 64, 0.5)',
                                    color: config[tag.key] ? '#D4AF68' : '#9C8C74'
                                }}
                            >
                                <tag.icon size={14} />
                                {tag.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.sectionTitle}>Strategic Calibration</div>
                <div style={{ ...styles.card, padding: 24, marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: '#D4AF68', fontSize: 12, fontWeight: 700 }}>
                        <Sliders size={14} /> DEFINE OPERATING MODEL
                    </div>

                    <div style={styles.sliderContainer}>
                        <div style={styles.sliderLabel}>
                            <span>Profitability</span>
                            <span>Aggressive Growth</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" 
                            value={config.strategy_growth_profit}
                            onChange={(e) => setConfig({...config, strategy_growth_profit: parseInt(e.target.value)})}
                        />
                        <div style={{ textAlign: 'center' }}>
                            <div style={styles.sliderValueDisplay}>
                                {getSliderText(config.strategy_growth_profit, "Profit Focus", "Growth Focus")}
                            </div>
                        </div>
                    </div>

                    <div style={styles.sliderContainer}>
                        <div style={styles.sliderLabel}>
                            <span>Product-Led</span>
                            <span>Sales-Led</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" 
                            value={config.strategy_product_sales}
                            onChange={(e) => setConfig({...config, strategy_product_sales: parseInt(e.target.value)})}
                        />
                         <div style={{ textAlign: 'center' }}>
                            <div style={styles.sliderValueDisplay}>
                                {getSliderText(config.strategy_product_sales, "Product DNA", "Sales DNA")}
                            </div>
                        </div>
                    </div>

                    <div style={{ ...styles.sliderContainer, marginBottom: 0 }}>
                        <div style={styles.sliderLabel}>
                            <span>Move Fast</span>
                            <span>Perfectionist</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" 
                            value={config.strategy_speed_quality}
                            onChange={(e) => setConfig({...config, strategy_speed_quality: parseInt(e.target.value)})}
                        />
                         <div style={{ textAlign: 'center' }}>
                            <div style={styles.sliderValueDisplay}>
                                {getSliderText(config.strategy_speed_quality, "Rapid Iteration", "High Assurance")}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.sectionTitle}>Operational Directives</div>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: 20, border: '1px solid rgba(196, 168, 111, 0.1)' }}>
                    {instructions.map((inst, i) => (
                        <div key={i} className="instruction-item">
                            <span className="instruction-num">{i + 1}.</span>
                            <span>{inst}</span>
                        </div>
                    ))}
                    
                    <div 
                        onClick={() => setInstructionsChecked(!instructionsChecked)}
                        style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 12, cursor: 'pointer' }}
                    >
                        <div style={{ width: 20, height: 20, border: `1px solid ${instructionsChecked ? '#D4AF68' : '#5E4F40'}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
                            {instructionsChecked && <Check size={14} color="#1A120E" fill="#D4AF68" style={{ background: '#D4AF68', borderRadius: 2, width: '100%', height: '100%' }} />}
                        </div>
                        <span style={{ fontSize: 13, color: instructionsChecked ? '#D4AF68' : '#9C8C74', fontWeight: 500, transition: 'color 0.2s' }}>
                            I acknowledge these directives and adhere to the protocols.
                        </span>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN */}
            <div>
                <div style={styles.sectionTitle}>Simulation Parameters</div>
                
                <div style={{ marginBottom: 16 }}>
                    <label style={styles.label}>INTERACTION MODE</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <ModeOption mode="chat" icon={MessageSquare} label="Text Interface" />
                        <ModeOption mode="3d" icon={Box} label="3D Environment" />
                    </div>
                </div>

                <div style={styles.sectionTitle}>Venture Health</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={styles.metricCard}>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <DollarSign size={12} /> MRR (Current)
                            </label>
                            <input 
                                style={{ ...styles.input, border: 'none', background: 'transparent', padding: '4px 0', fontSize: 16, fontWeight: 600 }}
                                placeholder="$0.00"
                                value={config.metrics_mrr}
                                onChange={(e) => setConfig({...config, metrics_mrr: e.target.value})}
                            />
                        </div>
                        <div style={styles.metricCard}>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Zap size={12} /> Burn Rate
                            </label>
                            <input 
                                style={{ ...styles.input, border: 'none', background: 'transparent', padding: '4px 0', fontSize: 16, fontWeight: 600 }}
                                placeholder="$0.00"
                                value={config.metrics_burn}
                                onChange={(e) => setConfig({...config, metrics_burn: e.target.value})}
                            />
                        </div>
                        <div style={styles.metricCard}>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Activity size={12} /> Runway
                            </label>
                            <input 
                                style={{ ...styles.input, border: 'none', background: 'transparent', padding: '4px 0', fontSize: 16, fontWeight: 600 }}
                                placeholder="Months"
                                value={config.metrics_runway}
                                onChange={(e) => setConfig({...config, metrics_runway: e.target.value})}
                            />
                        </div>
                        <div style={styles.metricCard}>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Users size={12} /> Team Size
                            </label>
                            <input 
                                style={{ ...styles.input, border: 'none', background: 'transparent', padding: '4px 0', fontSize: 16, fontWeight: 600 }}
                                placeholder="0"
                                value={config.metrics_team}
                                onChange={(e) => setConfig({...config, metrics_team: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.sectionTitle}>Fund Mandate Profile</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    
                    <input type="hidden" name="_csrf" value={csrfToken || ''} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        
                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} /> INVESTMENT STAGE</label>
                            <select 
                                style={styles.select}
                                value={config.fundStage}
                                onChange={(e) => setConfig({...config, fundStage: e.target.value})}
                            >
                                <option>Pre-Seed</option>
                                <option>Seed</option>
                                <option>Series A</option>
                                <option>Series B</option>
                                <option>Growth</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} /> CHEQUE SIZE</label>
                            <select 
                                style={styles.select}
                                value={config.checkSize}
                                onChange={(e) => setConfig({...config, checkSize: e.target.value})}
                            >
                                <option>$100k - $500k</option>
                                <option>$500k - $1M</option>
                                <option>$1M - $3M</option>
                                <option>$3M - $10M</option>
                                <option>$10M+</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <Target size={12} style={{ display: 'inline', marginRight: 4 }} /> SECTOR FOCUS</label>
                            <select 
                                style={styles.select}
                                value={config.sectorFocus}
                                onChange={(e) => setConfig({...config, sectorFocus: e.target.value})}
                            >
                                <option>B2B SaaS</option>
                                <option>Fintech</option>
                                <option>DeepTech / AI</option>
                                <option>Consumer / D2C</option>
                                <option>HealthTech</option>
                                <option>Cleantech</option>
                            </select>
                        </div>

                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ ...styles.sectionTitle, margin: 0 }}>Investment Committee</div>
                        <div style={{ background: 'rgba(212, 175, 104, 0.1)', border: '1px solid #D4AF68', borderRadius: 4, padding: '2px 8px', fontSize: 10, color: '#D4AF68', fontWeight: 700 }}>VC</div>
                    </div>
                    {unsavedCharChanges && (
                        <button onClick={handleSaveCharacters} style={styles.saveBtn}>
                            <Save size={10} /> Commit Updates
                        </button>
                    )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                    {characters.map((char) => {
                        const isExpanded = expandedChar === char.id;
                        return (
                            <div key={char.id} className="char-card" style={{ border: `1px solid ${isExpanded ? 'rgba(212, 175, 104, 0.4)' : 'rgba(196, 168, 111, 0.15)'}`, borderRadius: 6, background: isExpanded ? 'rgba(26, 18, 14, 0.8)' : 'rgba(26, 18, 14, 0.4)', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                                <div 
                                    onClick={() => setExpandedChar(isExpanded ? null : char.id)}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', cursor: 'pointer', background: isExpanded ? 'rgba(212, 175, 104, 0.05)' : 'transparent' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div className="avatar-circle" style={{ background: char.color }}>
                                            {char.initials}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, color: isExpanded ? '#D4AF68' : '#E8E0D5', fontWeight: 500, transition: 'color 0.3s' }}>{char.name}</div>
                                            <div style={{ fontSize: 11, color: '#9C8C74' }}>{char.role}</div>
                                        </div>
                                    </div>
                                    <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.4s ease', color: '#9C8C74' }}>
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="expand-enter" style={{ padding: '0 16px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                        {char.behaviors.map((beh) => (
                                            <div key={beh.id} style={{ marginTop: 16 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                                                    <span style={{ color: '#9C8C74' }}>{beh.name}</span>
                                                    <span style={{ color: '#D4AF68' }}>{beh.val}%</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="100" value={beh.val}
                                                    onChange={(e) => handleBehaviorChange(char.id, beh.id, parseInt(e.target.value))}
                                                    className="range-slider"
                                                    style={{ width: '100%', accentColor: '#D4AF68', height: 4, background: 'rgba(255,255,255,0.1)', appearance: 'auto', cursor: 'pointer' }} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>

        <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid rgba(196, 168, 111, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onBack} className="btn-hover" style={{ background: 'none', border: 'none', color: '#8A3A3A', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer', transition: 'color 0.2s' }}>
                ABORT SETUP
            </button>
            <div style={{ position: 'relative' }}>
                <button 
                    onClick={handleStart} 
                    style={{
                        ...styles.goldBtn,
                        opacity: completionPercent === 100 ? 1 : 0.7 
                    }}
                >
                    {completionPercent === 100 ? "INITIATE SIMULATION" : <><AlertTriangle size={12} /> INITIATION PENDING</>}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default VCPanel;