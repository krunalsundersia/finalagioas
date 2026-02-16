// --- IMPORTING EXTERNAL MODES (ROUTING) ---
// Note: Ensure these files exist in your project at these exact paths
import Boardroom3D from '../Vr/customer';             
import BoardroomChat from '../chat/customerchat';         
import React, { useState, useEffect } from 'react';
import { 
  Check, X,
  User, FileText, UploadCloud,
  ChevronDown, Lock, Save, AlertTriangle,
  Database, Clock, Hexagon, Image, MapPin, Target, TrendingUp, MessageSquare, Box, BarChart3,
  Info, ListChecks, ShieldAlert, Zap
} from 'lucide-react';

const Customer = ({ activeSim, onBack }) => {
  // --- STATE ---
  const [config, setConfig] = useState({
    title: "Customer Interaction Pod (CIP)", 
    pitchText: "", 
    valueProp: "", 
    
    // Dropdown Defaults
    targetJourney: "Discovery",
    targetArea: "North America",
    targetPocket: "Mid-Market",
    
    productDesc: "",
    productImage: null,
    
    meetingMode: "3d", 
    
    // New Fields for Product Review Prerequisites
    preReviewContext: "",
    knownLimitations: "",
    competitorContext: "",
    successMetrics: "",
    technicalPrereqs: false,
    legalDisclaimer: false,
  });

  const [instructionsChecked, setInstructionsChecked] = useState(false);
  const [history, setHistory] = useState([]); 
  const [unsavedCharChanges, setUnsavedCharChanges] = useState(false);
  const [meetingConfig, setMeetingConfig] = useState(null);  // NEW: Store meeting config with context
  
  // --- NEW: VIEW STATE FOR ROUTING ---
  const [currentView, setCurrentView] = useState('setup');

  // --- INITIALIZATION & PERSISTENCE ---

  // Load Title
  useEffect(() => {
    const savedTitle = localStorage.getItem('asklurk_sim_title');
    if (savedTitle) {
      setConfig(prev => ({ ...prev, title: savedTitle }));
    }
  }, []);

  // DEFAULT CHARACTERS
  const defaultCharacters = [
    { 
      id: 1, name: "Linda G.", role: "Procurement Lead", initials: "LG", color: "#5D4037",
      behaviors: [
        { id: 'b1', name: "Price Sensitivity", val: 95 },
        { id: 'b2', name: "Contract Terms", val: 90 },
        { id: 'b3', name: "Vendor Consolidation", val: 70 }
      ]
    },
    { 
      id: 2, name: "Marcus Thorne", role: "Economic Buyer (VP)", initials: "MT", color: "#3E4F5E",
      behaviors: [
        { id: 'b1', name: "ROI Focus", val: 90 },
        { id: 'b2', name: "Strategic Alignment", val: 85 },
        { id: 'b3', name: "Decision Speed", val: 60 }
      ]
    },
    { 
      id: 3, name: "Dave Chen", role: "Technical Skeptic", initials: "DC", color: "#4A5D4A",
      behaviors: [
        { id: 'b1', name: "Integration Risk", val: 95 },
        { id: 'b2', name: "Security Audit", val: 99 },
        { id: 'b3', name: "Feature Parity", val: 80 }
      ]
    },
    { 
      id: 4, name: "Sarah Jenkins", role: "Internal Champion", initials: "SJ", color: "#6D5C40",
      behaviors: [
        { id: 'b1', name: "Enthusiasm", val: 90 },
        { id: 'b2', name: "Political Capital", val: 75 },
        { id: 'b3', name: "Urgency", val: 85 }
      ]
    },
    { 
      id: 5, name: "End User Panel", role: "Daily Operations", initials: "EU", color: "#5E4F40",
      behaviors: [
        { id: 'b1', name: "UX Friction", val: 85 },
        { id: 'b2', name: "Learning Curve", val: 80 },
        { id: 'b3', name: "Workflow Fit", val: 90 }
      ]
    },
    { 
      id: 6, name: "Elena V.", role: "Compliance Officer", initials: "EV", color: "#582C2C",
      behaviors: [
        { id: 'b1', name: "Regulatory Risk", val: 95 },
        { id: 'b2', name: "Data Sovereignty", val: 90 },
        { id: 'b3', name: "Audit Trails", val: 85 }
      ]
    }
  ];

  const [characters, setCharacters] = useState(defaultCharacters);
  const [expandedChar, setExpandedChar] = useState(1); 

  // Load Characters
  useEffect(() => {
    const savedChars = localStorage.getItem('asklurk_sim_chars');
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
    localStorage.setItem('asklurk_sim_title', newTitle);
  };

  // --- DERIVED STATUS ---
  const status = {
    pitch: config.pitchText.trim().length > 0,
    // Replaced assets check with context check
    context: config.preReviewContext.trim().length > 0 && config.technicalPrereqs, 
    visual: config.productDesc.trim().length > 0,
    target: config.targetJourney && config.targetArea && config.targetPocket,
    adjustment: true, 
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
    localStorage.setItem('asklurk_sim_chars', JSON.stringify(characters));
    setUnsavedCharChanges(false);
    alert("Stakeholder Committee configuration has been successfully persisted to local storage.");
  };

  const handleStart = () => {
    // STRICT VALIDATION
    const missing = [];
    if (!status.pitch) missing.push("Strategic Narrative (Pitch Text)");
    if (!status.context) missing.push("Product Review Prerequisites (Context & Ack)");
    if (!status.visual) missing.push("Demonstration Assets (Visual Description)");
    if (!status.directives) missing.push("Operational Directives (Acknowledgment)");

    if (missing.length > 0) {
      alert(`INITIATION HALTED.\n\nThe following mandatory protocols are incomplete:\n\n- ${missing.join('\n- ')}\n\nPlease populate all required fields to proceed.`);
      return;
    }
    
    // ✅ BUILD COMPLETE COMPANY CONTEXT
    const companyContext = {
        // Product Review Setup
        title: config.title,
        productName: config.productName,
        productPitch: config.productPitch,
        visualDescription: config.visualDescription,
        meetingObjective: config.meetingObjective,
        meetingMode: config.meetingMode,
        
        // Product Details
        productStage: config.productStage,
        industry: config.industry,
        targetCustomer: config.targetCustomer,
        
        // Pricing & Competition
        pricingTier: config.pricingTier,
        competitors: config.competitors,
        
        // Stakeholder Committee
        stakeholders: characters.map(c => ({
            name: c.name,
            role: c.role,
            initials: c.initials,
            behaviors: c.behaviors
        })),
        
        // Session metadata
        sessionId: Date.now(),
        timestamp: new Date().toISOString()
    };
    
    console.log('📊 Customer Context Being Sent:', companyContext);
    
    // Simulate saving current session to history WITH context
    const newSession = { 
        id: Date.now(), 
        title: config.title,
        config: config,
        context: companyContext  // ← IMPORTANT: Include full context
    };
    setHistory(prev => [newSession, ...prev]);
    setMeetingConfig(newSession);

    // --- INTERNAL ROUTING SWITCH ---
    // Instead of window.location, we set the state view
    if (config.meetingMode === '3d') {
      setCurrentView('3d');
    } else {
      setCurrentView('chat');
    }
  };

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
    textArea: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, minHeight: 100, resize: 'none', fontFamily: 'var(--font-body)', transition: 'border-color 0.3s ease' }
  };

  const instructions = [
    "Simulation duration is strictly capped at sixty (60) minutes per session.",
    "User allocation is limited to five (5) high-fidelity simulations per calendar month.",
    "Participant must register at least one substantive response every five (5) minutes to maintain session viability.",
    "Interaction volume is capped at 500 distinct message units to ensure exchange efficiency.",
    "Strategic 'skip' actions are restricted to a maximum of three (3) instances per session.",
    "The interface includes real-time analytical telemetry (dynamic graphs and bars) for performance monitoring.",
    "All discourse must adhere to strict professional standards; colloquialisms are prohibited.",
    "Active engagement with customer queries is mandatory; silence or avoidance will result in penalty.",
    "Navigating away from the active interface will trigger an automatic pause protocol.",
    "Session conclusion occurs automatically upon Deal Execution or Hard Rejection."
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

  const StatusItem = ({ label, isReady }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#9C8C74', padding: '4px 0' }}>
        <span>{label}</span>
        {isReady ? <Check size={14} color="#5D7A58" /> : <X size={14} color="#8A3A3A" />}
    </div>
  );

  // --- RENDER CONDITIONAL VIEWS ---
  if (currentView === '3d') {
    return <Boardroom3D config={meetingConfig || config} characters={characters} onBack={() => setCurrentView('setup')} />;
  }
  if (currentView === 'chat') {
    return <BoardroomChat config={meetingConfig || config} characters={characters} onBack={() => setCurrentView('setup')} />;
  }

  // --- DEFAULT RENDER (SETUP VIEW) ---
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
      `}</style>

      {/* --- LEFT SIDEBAR --- */}
      <div style={{ width: 220, background: '#1A120E', borderRight: '1px solid rgba(196, 168, 111, 0.25)', padding: '40px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* BRAND LABEL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, color: '#D4AF68', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <Hexagon size={18} fill="rgba(212, 175, 104, 0.1)" /> AGIOAS
        </div>
        
        <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, margin: '4px 0', color: '#E8E0D5', fontFamily: 'serif' }}>Initialization</h2>
            <div style={{ fontSize: 13, color: '#9C8C74' }}>Simulation Setup</div>
        </div>

        {/* COMPLETION CIRCLE */}
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
            <CompletionCircle percentage={completionPercent} />
            <div>
                <div style={{ fontSize: 12, color: '#9C8C74', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Readiness</div>
                <div style={{ fontSize: 13, color: '#E8E0D5' }}>{completionPercent === 100 ? 'Authorized' : 'Pending'}</div>
            </div>
        </div>

        {/* PREVIOUS SESSIONS (History) */}
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

        {/* STATUS CHECKLIST (Live Updates) */}
        <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8F7045', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>System Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <StatusItem label="Strategic Narrative" isReady={status.pitch} />
                <StatusItem label="Context & Prereqs" isReady={status.context} />
                <StatusItem label="Visual Assets" isReady={status.visual} />
                <StatusItem label="ICP Configuration" isReady={status.target} />
                <StatusItem label="Stakeholder Alignment" isReady={status.adjustment} />
                <StatusItem label="Directives Ack." isReady={status.directives} />
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        
        {/* CENTERED HEADER */}
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
                {/* SALES SCRIPT / PITCH */}
                <div style={styles.sectionTitle}>Strategic Narrative</div>
                <div style={{ marginBottom: 32 }}>
                    <label style={styles.label}>OPENING STATEMENT & VALUE PROPOSITION</label>
                    <textarea 
                        style={styles.textArea} 
                        placeholder="Articulate the unique selling proposition and primary objective..."
                        value={config.pitchText}
                        onChange={(e) => setConfig({...config, pitchText: e.target.value})}
                    />
                </div>

                {/* --- PRODUCT REVIEW PREREQUISITES (Replaces Deal Room) --- */}
                <div style={styles.sectionTitle}>Product Review Prerequisites</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: '#D4AF68', fontSize: 12, borderBottom: '1px solid rgba(196, 168, 111, 0.2)', paddingBottom: 10 }}>
                        <Info size={14} />
                        <span>All inputs below are mandatory for simulation fidelity.</span>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={styles.label}>ESSENTIAL CONTEXT & BACKGROUND</label>
                        <textarea 
                            style={{...styles.textArea, minHeight: 80}} 
                            placeholder="Detail the problem space, historical context, and why the customer is evaluating this now..."
                            value={config.preReviewContext}
                            onChange={(e) => setConfig({...config, preReviewContext: e.target.value})}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{...styles.label, color: '#8A6A4B'}}> <ShieldAlert size={12} style={{display:'inline', marginBottom:-2}} /> KNOWN LIMITATIONS & WORKAROUNDS</label>
                        <textarea 
                            style={{...styles.textArea, minHeight: 60, borderColor: 'rgba(138, 58, 58, 0.3)'}} 
                            placeholder="List any current bugs, missing features, or friction points the customer might encounter..."
                            value={config.knownLimitations}
                            onChange={(e) => setConfig({...config, knownLimitations: e.target.value})}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                        <div>
                            <label style={styles.label}>COMPETITOR LANDSCAPE</label>
                            <textarea 
                                style={{...styles.textArea, minHeight: 80}} 
                                placeholder="Who are we up against? (e.g. Incumbent, DIY, Startup)"
                                value={config.competitorContext}
                                onChange={(e) => setConfig({...config, competitorContext: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={styles.label}>SUCCESS CRITERIA</label>
                            <textarea 
                                style={{...styles.textArea, minHeight: 80}} 
                                placeholder="What metrics define a 'win' for this review? (e.g. Speed, ROI)"
                                value={config.successMetrics}
                                onChange={(e) => setConfig({...config, successMetrics: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 4 }}>
                        <label style={{...styles.label, marginBottom: 10}}>READINESS CHECKLIST</label>
                        
                        <div 
                            onClick={() => setConfig({...config, technicalPrereqs: !config.technicalPrereqs})}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 8 }}
                        >
                            <div style={{ width: 16, height: 16, border: `1px solid ${config.technicalPrereqs ? '#5D7A58' : '#5E4F40'}`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: config.technicalPrereqs ? 'rgba(93, 122, 88, 0.2)' : 'transparent' }}>
                                {config.technicalPrereqs && <Check size={10} color="#5D7A58" />}
                            </div>
                            <span style={{ fontSize: 12, color: config.technicalPrereqs ? '#E8E0D5' : '#9C8C74' }}>
                                I confirm technical environment is provisioned and stable.
                            </span>
                        </div>

                        <div 
                            onClick={() => setConfig({...config, legalDisclaimer: !config.legalDisclaimer})}
                            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        >
                            <div style={{ width: 16, height: 16, border: `1px solid ${config.legalDisclaimer ? '#5D7A58' : '#5E4F40'}`, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: config.legalDisclaimer ? 'rgba(93, 122, 88, 0.2)' : 'transparent' }}>
                                {config.legalDisclaimer && <Check size={10} color="#5D7A58" />}
                            </div>
                            <span style={{ fontSize: 12, color: config.legalDisclaimer ? '#E8E0D5' : '#9C8C74' }}>
                                I have reviewed the NDA and confidentiality constraints.
                            </span>
                        </div>
                    </div>
                </div>

                {/* DEMONSTRATION ASSETS */}
                <div style={styles.sectionTitle}>Demonstration Assets</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={styles.label}>VISUAL DESCRIPTOR</label>
                        <textarea 
                            style={{ ...styles.textArea, minHeight: 60, fontSize: 13 }} 
                            placeholder="Describe product aesthetics, key UI components, or physical design parameters..."
                            value={config.productDesc}
                            onChange={(e) => setConfig({...config, productDesc: e.target.value})}
                        />
                    </div>
                    
                    <div className="file-upload-zone" onClick={() => document.getElementById('prod-img-upload').click()}>
                        <input id="prod-img-upload" type="file" style={{ display: 'none' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#9C8C74' }}>
                            <Image size={24} color="#5E4F40" />
                            <span style={{ fontSize: 12 }}>Upload Image Reference</span>
                        </div>
                    </div>
                </div>

                {/* DIRECTIVES */}
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
                {/* Session */}
                <div style={styles.sectionTitle}>Simulation Parameters</div>
                
                {/* MEETING MODE SELECTOR */}
                <div style={{ marginBottom: 16 }}>
                    <label style={styles.label}>INTERACTION MODE</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <ModeOption mode="chat" icon={MessageSquare} label="Text Interface" />
                        <ModeOption mode="3d" icon={Box} label="3D Environment" />
                    </div>
                </div>

                {/* TARGET PROFILE CONFIGURATION */}
                <div style={styles.sectionTitle}>Ideal Customer Profile (ICP)</div>
                <div style={{ ...styles.card, marginBottom: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        
                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} /> LIFECYCLE STAGE</label>
                            <select 
                                style={styles.select}
                                value={config.targetJourney}
                                onChange={(e) => setConfig({...config, targetJourney: e.target.value})}
                            >
                                <option>Discovery</option>
                                <option>Validation</option>
                                <option>Negotiation</option>
                                <option>Renewal</option>
                                <option>Expansion</option>
                                <option>Onboarding</option>
                                <option>Churn Prevention</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> GEOGRAPHIC REGION</label>
                            <select 
                                style={styles.select}
                                value={config.targetArea}
                                onChange={(e) => setConfig({...config, targetArea: e.target.value})}
                            >
                                <option>North America</option>
                                <option>EMEA</option>
                                <option>APAC</option>
                                <option>LATAM</option>
                                <option>Global</option>
                                <option>DACH</option>
                                <option>Benelux</option>
                                <option>Nordics</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ ...styles.label, fontSize: 11, color: '#D4AF68' }}> <Target size={12} style={{ display: 'inline', marginRight: 4 }} /> MARKET SEGMENT</label>
                            <select 
                                style={styles.select}
                                value={config.targetPocket}
                                onChange={(e) => setConfig({...config, targetPocket: e.target.value})}
                            >
                                <option>SMB</option>
                                <option>Mid-Market</option>
                                <option>Enterprise</option>
                                <option>Gov / Public</option>
                                <option>Startup</option>
                                <option>Fortune 500</option>
                            </select>
                        </div>

                    </div>
                </div>

                {/* STAKEHOLDER COMMITTEE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
                    <div style={styles.sectionTitle} style={{ margin: 0 }}>Stakeholder Committee</div>
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
                                        {/* Avatar Slot */}
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

        {/* Footer Actions */}
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

export default Customer;