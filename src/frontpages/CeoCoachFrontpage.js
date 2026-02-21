import Boardroom3D from '../Vr/ceo';
import BoardroomChat from '../chat/ceochat';
import React, { useState, useEffect } from 'react';
import {
    Check, X, Brain, Activity, Heart, ChevronDown, Save, AlertTriangle,
    Clock, Hexagon, Target, Zap, MessageSquare, Box, Shield,
    Video, Mic, Wifi, Maximize, TrendingUp, Scale, Flag, Calendar,
    BarChart2, Lock, Eye, Terminal, FileText
} from 'lucide-react';

const CeoCoachFrontpage = ({ onBack }) => {
    // --- STATE MANAGEMENT ---
    const [config, setConfig] = useState({
        title: "Executive Strategy Session",

        // STRATEGIC CONTEXT
        decisionType: "Strategic",
        urgency: "This Quarter",
        timeHorizon: "1 Year",

        // CORE PROBLEM
        strategicDilemma: "",
        successCriteria: "",
        failureAvoid: "",

        // CONSTRAINTS & TRADEOFFS
        hardConstraints: "",
        nonNegotiables: "",
        acceptedTradeoffs: "",

        // MARKET COORDINATES
        businessStage: "Scaling (Series A-B)",
        industrySector: "SaaS / AI",

        // VITALS
        runwayMonths: "12",
        burnRate: "High",

        // PSYCHOGRAPHICS & PRESSURE
        stressLevel: 50,
        clarityLevel: 50,
        energyLevel: 80,
        confidence: 50,

        // STAKEHOLDER PRESSURE
        pressure: {
            board: 50,
            investor: 50,
            market: 50,
            team: 50
        },

        // SESSION SETTINGS
        meetingMode: "3d",
        focusMode: true,
    });

    // SYSTEM CHECKS & RULES STATE
    const [systemCheck, setSystemCheck] = useState({
        camera: false,
        mic: false,
        network: false,
        encryption: false,
        ready: false
    });

    // Functionality Toggles (Sidebar)
    const [protocols, setProtocols] = useState({
        honesty: false,    // Brutal Honesty
        confidential: false // Encryption
    });

    // The Main Directive Acknowledgment (From Image)
    const [directivesAck, setDirectivesAck] = useState(false);

    const [history, setHistory] = useState([]);
    const [currentView, setCurrentView] = useState('setup');

    // --- INITIALIZATION ---

    // Load Title from LocalStorage
    useEffect(() => {
        const savedTitle = localStorage.getItem('agioas_ceo_title');
        if (savedTitle) setConfig(prev => ({ ...prev, title: savedTitle }));
    }, []);

    // Simulate Technical System Checks
    useEffect(() => {
        const timers = [
            setTimeout(() => setSystemCheck(prev => ({ ...prev, network: true })), 500),
            setTimeout(() => setSystemCheck(prev => ({ ...prev, encryption: true })), 1000),
            setTimeout(() => setSystemCheck(prev => ({ ...prev, mic: true })), 1500),
            setTimeout(() => setSystemCheck(prev => ({ ...prev, camera: true })), 2000),
            setTimeout(() => setSystemCheck(prev => ({ ...prev, ready: true })), 2500),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    // --- HANDLERS ---

    const handlePressureChange = (key, val) => {
        setConfig(prev => ({ ...prev, pressure: { ...prev.pressure, [key]: val } }));
    };

    const handleStart = () => {
        // Strict Validation
        if (!systemCheck.ready) {
            alert("System initialization incomplete. Please wait for secure uplink.");
            return;
        }

        if (!directivesAck) {
            alert("ACCESS DENIED: You must acknowledge the Operational Directives.");
            return;
        }

        if (!config.strategicDilemma) {
            alert("STRATEGY MISSING: Define the core dilemma.");
            return;
        }

        // ✅ FIXED BUG: Pass full config to chat so ceochat.js can send company_context
        // Previously only { id, title } was saved — all form data was lost
        const newSession = { id: Date.now(), title: config.title, ...config };
        setHistory(prev => [{ id: newSession.id, title: newSession.title }, ...prev]);

        if (config.meetingMode === '3d') setCurrentView('3d');
        else setCurrentView('chat');
    };

    const toggleProtocol = (key) => {
        setProtocols(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // --- COMPONENTS ---

    const PillButton = ({ label, active, onClick }) => (
        <button
            onClick={onClick}
            style={{
                flex: 1, padding: '8px 4px', fontSize: 11, cursor: 'pointer',
                background: active ? '#D4AF68' : 'transparent',
                color: active ? '#1A120E' : '#9C8C74',
                border: `1px solid ${active ? '#D4AF68' : 'rgba(196, 168, 111, 0.25)'}`,
                borderRadius: 4, fontWeight: active ? 700 : 400,
                transition: 'all 0.2s', whiteSpace: 'nowrap', textAlign: 'center'
            }}
        >
            {label}
        </button>
    );

    const CheckItem = ({ label, isReady, icon: Icon, isInteractive, onClick }) => (
        <div
            onClick={isInteractive ? onClick : undefined}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontSize: 12, color: isReady ? '#E8E0D5' : '#9C8C74',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
                cursor: isInteractive ? 'pointer' : 'default',
                transition: 'all 0.2s'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {Icon && <Icon size={12} color={isReady ? '#D4AF68' : '#5E4F40'} />}
                <span style={{ fontWeight: isReady ? 500 : 400 }}>{label}</span>
            </div>
            {isReady ?
                <Check size={14} color="#5D7A58" /> :
                (isInteractive ? <div style={{ width: 12, height: 12, border: '1px solid #5E4F40', borderRadius: 2 }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8A3A3A' }} />)
            }
        </div>
    );

    // --- STYLES ---
    const styles = {
        sectionTitle: { color: '#8F7045', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16, marginTop: 32, display: 'flex', alignItems: 'center', gap: 8 },
        input: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, transition: 'all 0.3s ease' },
        label: { color: '#9C8C74', fontSize: 11, marginBottom: 8, display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' },
        card: { background: 'rgba(26, 18, 14, 0.6)', border: '1px solid rgba(196, 168, 111, 0.15)', borderRadius: 6, padding: 20, transition: 'all 0.3s ease', boxSizing: 'border-box' },
        textArea: { width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(196, 168, 111, 0.25)', color: '#E8E0D5', padding: '12px', borderRadius: 4, outline: 'none', fontSize: 14, minHeight: 80, resize: 'none', fontFamily: 'inherit' },
        goldBtn: {
            background: 'linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%)',
            color: '#1A120E', border: 'none', borderRadius: 2, height: 40, padding: '0 32px',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 15px rgba(212, 175, 104, 0.15)'
        },
        subLabel: { fontSize: 10, color: '#9C8C74', marginBottom: 6, display: 'block', letterSpacing: '0.05em', textTransform: 'uppercase' },
        // Directives specific styles
        directivesCard: {
            background: 'rgba(15, 10, 8, 0.8)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 8,
            padding: 24,
            marginTop: 32
        },
        directiveRow: {
            display: 'flex',
            gap: 16,
            marginBottom: 12,
            fontSize: 13,
            lineHeight: 1.5,
            color: '#9C8C74',
            alignItems: 'flex-start'
        },
        directiveNum: {
            color: '#D4AF68',
            fontWeight: 700,
            minWidth: 20
        }
    };

    const operationalRules = [
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

    // --- RENDER VIEWS ---
    if (currentView === '3d') return <Boardroom3D config={config} onBack={() => setCurrentView('setup')} />;
    if (currentView === 'chat') return <BoardroomChat config={config} onBack={() => setCurrentView('setup')} />;

    return (
        <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', zIndex: 60, display: 'flex' }} className="fade-in">
            <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1A120E; }
        ::-webkit-scrollbar-thumb { background: #3E2F26; border-radius: 3px; }
        .range-slider { width: 100%; accent-color: #D4AF68; height: 4px; background: rgba(255,255,255,0.1); appearance: auto; cursor: pointer; }
      `}</style>

            {/* --- LEFT SIDEBAR --- */}
            <div style={{ width: 280, background: '#1A120E', borderRight: '1px solid rgba(196, 168, 111, 0.25)', padding: '40px 20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, color: '#D4AF68', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <Hexagon size={18} fill="rgba(212, 175, 104, 0.1)" /> AGIOAS <span style={{ fontSize: 9, opacity: 0.5 }}>EXEC</span>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 24, margin: '4px 0', color: '#E8E0D5', fontFamily: 'serif' }}>War Room</h2>
                    <div style={{ fontSize: 13, color: '#9C8C74' }}>Pre-Flight Sequence</div>
                </div>

                {/* 1. TECHNICAL SYSTEM CHECKS */}
                <div style={{ marginBottom: 24, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 10, color: '#8F7045', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>I. Uplink Status</div>
                    <CheckItem label="Secure Neural Link" isReady={systemCheck.network} icon={Wifi} />
                    <CheckItem label="256-bit Encryption" isReady={systemCheck.encryption} icon={Lock} />
                    <CheckItem label="Voice Biometrics" isReady={systemCheck.mic} icon={Mic} />
                    <CheckItem label="Video Feed" isReady={systemCheck.camera} icon={Video} />
                    <div style={{ marginTop: 8, fontSize: 10, color: systemCheck.ready ? '#5D7A58' : '#8A3A3A', textAlign: 'right' }}>
                        {systemCheck.ready ? "ALL SYSTEMS GO" : "INITIALIZING..."}
                    </div>
                </div>

                {/* 2. AI SETTINGS (Formerly Rules) */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 10, color: '#D4AF68', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>II. AI Configuration</div>
                    <CheckItem
                        label="Brutal Honesty Mode"
                        isReady={protocols.honesty}
                        icon={Terminal}
                        isInteractive={true}
                        onClick={() => toggleProtocol('honesty')}
                    />
                    <CheckItem
                        label="Strict Confidentiality"
                        isReady={protocols.confidential}
                        icon={Shield}
                        isInteractive={true}
                        onClick={() => toggleProtocol('confidential')}
                    />
                </div>

                {/* HISTORY */}
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#8F7045', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Past Summits</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {history.map((h) => (
                            <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Clock size={12} color="#5E4F40" />
                                <span style={{ fontSize: 12, color: '#9C8C74' }}>{h.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>

                {/* HEADER & DECISION CONTEXT */}
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                    <label style={styles.label}>SESSION OBJECTIVE</label>
                    <input
                        style={{ ...styles.input, fontSize: 32, fontFamily: 'serif', height: 70, background: 'transparent', borderBottom: '1px solid #D4AF68', borderTop: 0, borderLeft: 0, borderRight: 0, paddingLeft: 0, textAlign: 'center' }}
                        value={config.title}
                        onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    />

                    {/* PILLS ROW (Decision Type & Urgency) */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: '#9C8C74', marginRight: 8 }}>TYPE:</span>
                            {['Strategic', 'Operational', 'Crisis', 'Financial'].map(t => (
                                <button key={t} onClick={() => setConfig({ ...config, decisionType: t })} style={{ background: 'transparent', border: config.decisionType === t ? '1px solid #D4AF68' : '1px solid #333', color: config.decisionType === t ? '#D4AF68' : '#666', padding: '4px 12px', borderRadius: 12, fontSize: 10, cursor: 'pointer' }}>{t}</button>
                            ))}
                        </div>
                        <div style={{ width: 1, height: 20, background: '#333' }}></div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: '#9C8C74', marginRight: 8 }}>URGENCY:</span>
                            {['Immediate', 'This Quarter', 'Long Term'].map(u => (
                                <button key={u} onClick={() => setConfig({ ...config, urgency: u })} style={{ background: 'transparent', border: config.urgency === u ? '1px solid #8A3A3A' : '1px solid #333', color: config.urgency === u ? '#8A3A3A' : '#666', padding: '4px 12px', borderRadius: 12, fontSize: 10, cursor: 'pointer' }}>{u}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>

                    {/* LEFT COLUMN: STRATEGY & CONSTRAINTS */}
                    <div>
                        {/* 1. STRATEGIC DEFINITION */}
                        <div style={styles.sectionTitle}><Target size={14} /> Strategic Core</div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={styles.label}>THE DILEMMA (What keeps you up at night?)</label>
                            <textarea
                                style={styles.textArea}
                                placeholder="Describe the bottleneck, market threat, or opportunity..."
                                value={config.strategicDilemma}
                                onChange={(e) => setConfig({ ...config, strategicDilemma: e.target.value })}
                            />
                        </div>

                        {/* 2. SUCCESS & FAILURE */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                            <div>
                                <span style={styles.subLabel}><Flag size={10} style={{ display: 'inline' }} /> SUCCESS CRITERIA</span>
                                <textarea style={{ ...styles.textArea, minHeight: 60 }} placeholder="What does winning look like?" value={config.successCriteria} onChange={(e) => setConfig({ ...config, successCriteria: e.target.value })} />
                            </div>
                            <div>
                                <span style={styles.subLabel}><AlertTriangle size={10} style={{ display: 'inline' }} /> FAILURE TO AVOID</span>
                                <textarea style={{ ...styles.textArea, minHeight: 60 }} placeholder="Worst case scenario..." value={config.failureAvoid} onChange={(e) => setConfig({ ...config, failureAvoid: e.target.value })} />
                            </div>
                        </div>

                        {/* 3. CONSTRAINTS & TRADEOFFS */}
                        <div style={styles.sectionTitle}><Scale size={14} /> Constraints Matrix</div>
                        <div style={{ ...styles.card, marginBottom: 32 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <span style={styles.subLabel}>HARD CONSTRAINTS</span>
                                    <input style={styles.input} placeholder="Budget, Timeline, Legal..." value={config.hardConstraints} onChange={(e) => setConfig({ ...config, hardConstraints: e.target.value })} />
                                </div>
                                <div>
                                    <span style={styles.subLabel}>NON-NEGOTIABLES</span>
                                    <input style={styles.input} placeholder="Core Values, Brand Safety..." value={config.nonNegotiables} onChange={(e) => setConfig({ ...config, nonNegotiables: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <span style={styles.subLabel}>ACCEPTABLE TRADEOFFS</span>
                                <textarea style={{ ...styles.textArea, minHeight: 50 }} placeholder="What can be sacrificed for speed or growth?" value={config.acceptedTradeoffs} onChange={(e) => setConfig({ ...config, acceptedTradeoffs: e.target.value })} />
                            </div>
                        </div>

                        {/* 4. OPERATIONAL DIRECTIVES (FROM IMAGE) */}
                        <div style={styles.sectionTitle}><FileText size={14} /> Operational Directives</div>
                        <div style={styles.directivesCard}>
                            {operationalRules.map((rule, idx) => (
                                <div key={idx} style={styles.directiveRow}>
                                    <span style={styles.directiveNum}>{idx + 1}.</span>
                                    <span>{rule}</span>
                                </div>
                            ))}

                            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div
                                    onClick={() => setDirectivesAck(!directivesAck)}
                                    style={{ width: 18, height: 18, border: `1px solid ${directivesAck ? '#D4AF68' : '#5E4F40'}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: directivesAck ? 'rgba(212, 175, 104, 0.2)' : 'transparent' }}
                                >
                                    {directivesAck && <Check size={12} color="#D4AF68" />}
                                </div>
                                <span
                                    onClick={() => setDirectivesAck(!directivesAck)}
                                    style={{ fontSize: 13, color: directivesAck ? '#D4AF68' : '#9C8C74', cursor: 'pointer' }}
                                >
                                    I acknowledge these directives and adhere to the protocols.
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: MARKET & PSYCHOGRAPHICS */}
                    <div>
                        <div style={styles.sectionTitle}><Box size={14} /> Simulation Interface</div>

                        {/* 1. MEETING MODE & FOCUS */}
                        <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setConfig({ ...config, meetingMode: 'chat' })}
                                style={{ flex: 1, padding: 12, background: config.meetingMode === 'chat' ? 'rgba(212, 175, 104, 0.1)' : 'transparent', border: `1px solid ${config.meetingMode === 'chat' ? '#D4AF68' : '#333'}`, borderRadius: 4, color: '#E8E0D5', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                            >
                                <MessageSquare size={16} /> <span style={{ fontSize: 10 }}>ENCRYPTED CHAT</span>
                            </button>
                            <button
                                onClick={() => setConfig({ ...config, meetingMode: '3d' })}
                                style={{ flex: 1, padding: 12, background: config.meetingMode === '3d' ? 'rgba(212, 175, 104, 0.1)' : 'transparent', border: `1px solid ${config.meetingMode === '3d' ? '#D4AF68' : '#333'}`, borderRadius: 4, color: '#E8E0D5', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                            >
                                <Box size={16} /> <span style={{ fontSize: 10 }}>VR BOARDROOM</span>
                            </button>
                            <div onClick={() => setConfig({ ...config, focusMode: !config.focusMode })} style={{ width: 40, border: '1px solid #333', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: config.focusMode ? '#D4AF68' : 'transparent' }}>
                                <Maximize size={16} color={config.focusMode ? '#1A120E' : '#666'} />
                            </div>
                        </div>

                        {/* 2. FOUNDER PSYCHOGRAPHICS */}
                        <div style={styles.sectionTitle}><Brain size={14} /> Founder State</div>
                        <div style={{ ...styles.card, marginBottom: 32 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 16 }}>
                                <div>
                                    <span style={styles.subLabel}>STRESS</span>
                                    <input type="range" className="range-slider" value={config.stressLevel} onChange={(e) => setConfig({ ...config, stressLevel: e.target.value })} />
                                </div>
                                <div>
                                    <span style={styles.subLabel}>CLARITY</span>
                                    <input type="range" className="range-slider" value={config.clarityLevel} onChange={(e) => setConfig({ ...config, clarityLevel: e.target.value })} />
                                </div>
                                <div>
                                    <span style={styles.subLabel}>ENERGY</span>
                                    <input type="range" className="range-slider" value={config.energyLevel} onChange={(e) => setConfig({ ...config, energyLevel: e.target.value })} />
                                </div>
                            </div>
                            {/* Confidence Meter */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 16 }}>
                                <span style={{ ...styles.subLabel, marginBottom: 0, width: 80 }}>CONFIDENCE</span>
                                <input type="range" className="range-slider" value={config.confidence} onChange={(e) => setConfig({ ...config, confidence: e.target.value })} style={{ accentColor: '#5D7A58' }} />
                                <span style={{ fontSize: 12, color: '#E8E0D5', fontWeight: 700 }}>{config.confidence}%</span>
                            </div>
                        </div>

                        {/* 3. MARKET CONTEXT */}
                        <div style={{ ...styles.card, marginBottom: 32 }}>
                            <div style={{ marginBottom: 12 }}>
                                <span style={styles.subLabel}>BUSINESS STAGE</span>
                                <select style={{ ...styles.input, padding: 8 }} value={config.businessStage} onChange={(e) => setConfig({ ...config, businessStage: e.target.value })}>
                                    <option>Seed (Validation)</option>
                                    <option>Scaling (Series A-B)</option>
                                    <option>Hypergrowth (Series C+)</option>
                                    <option>Distressed (Turnaround)</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <span style={styles.subLabel}>RUNWAY & BURN</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input style={styles.input} placeholder="Months" value={config.runwayMonths} onChange={(e) => setConfig({ ...config, runwayMonths: e.target.value })} />
                                    <select style={styles.input} value={config.burnRate} onChange={(e) => setConfig({ ...config, burnRate: e.target.value })}>
                                        <option>Low Burn</option>
                                        <option>High Burn</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <span style={styles.subLabel}><Calendar size={10} style={{ display: 'inline' }} /> TIMELINE HORIZON</span>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {['6 Mo', '1 Yr', '3 Yr', '5 Yr'].map(t => (
                                        <PillButton key={t} label={t} active={config.timeHorizon === t} onClick={() => setConfig({ ...config, timeHorizon: t })} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 4. STAKEHOLDER PRESSURE */}
                        <div style={styles.sectionTitle}><BarChart2 size={14} /> Pressure Map</div>
                        <div style={{ ...styles.card, marginBottom: 32 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                {Object.keys(config.pressure).map(key => (
                                    <div key={key}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 10, textTransform: 'capitalize', color: '#9C8C74' }}>
                                            <span>{key}</span>
                                            <span style={{ color: config.pressure[key] > 70 ? '#D45D5D' : '#D4AF68' }}>{config.pressure[key]}%</span>
                                        </div>
                                        <input type="range" className="range-slider" value={config.pressure[key]} onChange={(e) => handlePressureChange(key, e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid rgba(196, 168, 111, 0.25)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={handleStart} style={{ ...styles.goldBtn, opacity: (systemCheck.ready && directivesAck) ? 1 : 0.5 }}>
                        {systemCheck.ready ? "SUMMON BOARD" : "INITIALIZING..."}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CeoCoachFrontpage;