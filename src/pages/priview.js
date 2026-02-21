import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
  :root {
    --bg:       #1a110c;
    --bg-card:  #251a13;
    --gold:     #f0a820;
    --gold-dim: #c89450;
    --gold-hi:  #ffe060;
    --gold-grad:linear-gradient(135deg,#b88c48 0%,#f0d888 50%,#b88c48 100%);
    --parchment:#f2ece4;
    --muted:    #c49040;
    --faint:    #8a6838;
    --border:   rgba(210,178,120,0.28);
    --wood:     repeating-linear-gradient(45deg,rgba(0,0,0,0.03) 0,rgba(0,0,0,0.03) 2px,transparent 2px,transparent 5px);
    --ease:     cubic-bezier(.25,1,.5,1);
    --font-d:   'Cinzel', serif;
    --font-b:   'EB Garamond', serif;
  }
  * { box-sizing:border-box; -webkit-font-smoothing:antialiased; margin:0; padding:0; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:#150f0a; }
  ::-webkit-scrollbar-thumb { background:#4a3828; border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:var(--gold-dim); }
  @keyframes shimmer  { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
  @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%{box-shadow:0 0 0 0 rgba(240,168,32,0)} 70%{box-shadow:0 0 0 8px rgba(240,168,32,0)} 100%{box-shadow:0 0 0 0 rgba(240,168,32,0)} }
  @keyframes scanH    { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
  @keyframes spinSlow { to{transform:rotate(360deg)} }
  @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
`;

const CHAT = {
    vcs: [
        { from: "ai", name: "VCS Coach", msg: "Your pitch pace was 23% faster than optimal. Investors disengage after 90 seconds of dense data — let's restructure slide 4.", time: "09:42" },
        { from: "user", msg: "How should I handle the unit economics objection?", time: "09:43" },
        { from: "ai", name: "VCS Coach", msg: "Lead with your LTV:CAC ratio (3.2x). Acknowledge the burn, then pivot to payback period — 14 months is defensible for your sector.", time: "09:43" },
        { from: "user", msg: "Got it. Can we run the Q&A gauntlet again?", time: "09:44" },
        { from: "ai", name: "VCS Coach", msg: "Commencing high-pressure VC simulation. Sarah Vance is entering the room. Confidence score: 71% — let's get it to 90.", time: "09:44" },
    ],
    office: [
        { from: "ai", name: "CFO", msg: "Your Q3 burn rate increased 34% MoM. Based on your uploaded financials, you have 8.2 months runway at current velocity.", time: "14:02" },
        { from: "ai", name: "CMO", msg: "CAC from paid channels is $340 vs $110 organic. I recommend reallocating 60% of paid budget to content and SEO for Q4.", time: "14:02" },
        { from: "user", msg: "What does the board think about the Series A timing?", time: "14:03" },
        { from: "ai", name: "CEO", msg: "Consensus: too early by 2 quarters. Hit $180k MRR and sub-3% churn before approaching tier-1 VCs. The story needs another chapter.", time: "14:03" },
        { from: "ai", name: "CTO", msg: "Technical debt in your auth layer could become a diligence red flag. I've flagged 3 critical refactors that should precede any data room.", time: "14:04" },
    ],
    boardroom: [
        { from: "ai", name: "Dr. Aris Thorne", msg: "The hostile acquisition attempt has three legal vectors. Poison pill is your fastest defense — I can draft the board resolution in 4 hours.", time: "11:15" },
        { from: "user", msg: "What's our exposure if the press gets the leak story?", time: "11:16" },
        { from: "ai", name: "Elena Rostova", msg: "High exposure. I recommend a controlled narrative release within 6 hours. Silence amplifies. I've drafted 3 statement variants — review now.", time: "11:16" },
        { from: "user", msg: "And the shareholder vote?", time: "11:17" },
        { from: "ai", name: "Dr. Aris Thorne", msg: "You need 67% to block the motion. Current proxy analysis shows 54% aligned. We have 11 days. I've identified 7 swing shareholders.", time: "11:17" },
    ],
    ceo: [
        { from: "user", msg: "I feel like my team has lost confidence in me after the layoffs.", time: "08:30" },
        { from: "ai", name: "Honest CEO", msg: "I've noticed across our last 6 sessions that you ask fewer questions about strategy and more about team perception. That shift is telling.", time: "08:31" },
        { from: "user", msg: "Is that bad?", time: "08:31" },
        { from: "ai", name: "Honest CEO", msg: "It's human. But leadership authority is not rebuilt through reassurance — it's rebuilt through visible decisions. You need one bold move this week.", time: "08:32" },
        { from: "user", msg: "What would you do?", time: "08:32" },
        { from: "ai", name: "Honest CEO", msg: "Town hall. No slides. Take every question. Your team does not need a polished CEO right now — they need an honest one. That's your edge.", time: "08:33" },
    ],
};

const SECTIONS = [
    {
        id: "vcs", num: "01", badge: "VCS",
        title: "Virtual Communication Suite",
        subtitle: "Master every high-stakes conversation before it happens",
        color: "#f0a820",
        tagline: "3D Simulation · Real-Time Coaching · Pitch Intelligence",
        desc: "Step into immersive 3D boardrooms, pitch stages, and customer scenarios powered by AI. Practice against razor-sharp AI avatars that react, challenge, and push back exactly like real investors and clients. Every session generates a deep performance report, vocal analysis, engagement scoring, and personalised training paths.",
        features: [
            { icon: "🎯", label: "Pitch Training", desc: "Simulate investor Q&A with hyper-realistic VC avatars that model real objection patterns." },
            { icon: "🎤", label: "Real-Time Feedback", desc: "Live coaching on tone, pacing, filler words, and confidence metrics during your session." },
            { icon: "📊", label: "Performance Analytics", desc: "Post-session scoring against industry benchmarks with personalised improvement roadmaps." },
            { icon: "🤝", label: "Customer Training", desc: "Practice complex sales cycles, objection handling, and de-escalation in safe 3D environments." },
        ],
        imgs: ["Pitch Arena — 3D Simulation Room", "Performance Analytics Dashboard", "VC Avatar Interaction Panel", "Real-Time Vocal Coaching View"],
        sceneIcon: "🎯", sceneLabel: "Pitch Arena — Live Simulation",
        rings: 3, particles: 12,
    },
    {
        id: "office", num: "02", badge: "VIRTUAL OFFICE",
        title: "The Executive Office",
        subtitle: "Nine world-class AI executives. One mission: your business.",
        color: "#6ab878",
        tagline: "9 AI Executives · Live Meetings · Strategic Intelligence",
        desc: "Upload your financials, pitch deck, team data, and market research. Your AI executive team — CEO, CFO, CMO, COO, CTO, CHRO, CLO, CSO, and CDO — immediately gets to work. They hold real meetings, debate strategies, flag risks, and produce board-ready reports. A full C-suite, on demand.",
        features: [
            { icon: "💼", label: "Full C-Suite Access", desc: "9 specialized AI executives each with deep domain expertise in their functional area." },
            { icon: "📋", label: "Live Board Meetings", desc: "Run actual meetings with agendas, minutes, debate, and action items tracked automatically." },
            { icon: "🔬", label: "Data Intelligence", desc: "Upload raw data and watch your AI team convert it into strategic insights and recommendations." },
            { icon: "🧩", label: "Brainstorming Engine", desc: "Multi-executive ideation sessions that surface strategies, risks, and opportunities you missed." },
        ],
        imgs: ["Executive Meeting Room — 9 Agents", "Financial Data Analysis View", "Strategy Brainstorm Session", "Board Report Generation Panel"],
        sceneIcon: "⚡", sceneLabel: "Executive Boardroom — 9 AI Agents Online",
        rings: 2, particles: 9,
    },
    {
        id: "boardroom", num: "03", badge: "WAR ROOM",
        title: "The War Room",
        subtitle: "Elite advisors forged in the hardest business battles.",
        color: "#c04848",
        tagline: "Crisis Management · Legal Defense · Power Strategy",
        desc: "When the stakes are existential, you need advisors who have seen everything. Your War Room brings together corporate strategists, crisis directors, legal architects, forensic accountants, and tactical operators. Whether it is a hostile acquisition, a PR disaster, or a shareholder revolt — they have navigated it before.",
        features: [
            { icon: "⚖", label: "Legal Architecture", desc: "Corporate law, M&A defense, poison pill structures, and board control strategies." },
            { icon: "🛡", label: "Crisis Direction", desc: "Reputation management, controlled narrative release, and stakeholder communication playbooks." },
            { icon: "📜", label: "Regulatory Defense", desc: "Compliance frameworks, audit preparation, and regulator-facing documentation strategy." },
            { icon: "🔐", label: "Shareholder Intelligence", desc: "Proxy analysis, swing voter identification, and board vote strategy for contested situations." },
        ],
        imgs: ["War Room — Crisis Protocol View", "Legal Defense Strategy Panel", "Stakeholder Proxy Analysis Map", "Crisis Timeline Command Center"],
        sceneIcon: "⚔", sceneLabel: "War Room — Crisis Protocol Active",
        rings: 4, particles: 16,
    },
    {
        id: "ceo", num: "04", badge: "HONEST CEO",
        title: "The Honest CEO",
        subtitle: "The only advisor who tells you what you actually need to hear.",
        color: "#5878a0",
        tagline: "Behavioural Analysis · Intent Reasoning · Radical Candour",
        desc: "Most advisors tell you what you want to hear. The Honest CEO analyses your communication patterns, intent signals, and decision history to understand what you really need — then delivers it with radical candour. Ask anything from growth strategy to team dynamics to personal leadership.",
        features: [
            { icon: "🧠", label: "Behavioural Analysis", desc: "Continuously analyses your communication patterns, question types, and interaction history to personalise responses." },
            { icon: "💡", label: "Intent-Based Reasoning", desc: "Goes beyond your literal question to understand the real concern beneath it and addresses that instead." },
            { icon: "🔭", label: "360 Advisory", desc: "Company growth, leadership gaps, team dynamics, financial decisions, personal development — all in one." },
            { icon: "⚡", label: "Radical Candour", desc: "Delivers hard truths, blind spots, and uncomfortable realities that other advisors would soften or skip." },
        ],
        imgs: ["CEO Mirror — Behavioural Analysis", "Intent Reasoning Visualisation", "Leadership Pattern Heatmap", "Emotional Intelligence Dashboard"],
        sceneIcon: "🧠", sceneLabel: "CEO Mirror — Intent Analysis Running",
        rings: 2, particles: 8,
    },
];

function Scene3D({ section }) {
    const c = section.color;
    return (
        <div style={{ width: "100%", height: "100%", background: `radial-gradient(circle at 50% 50%,${c}22 0%,transparent 65%),#1c1410`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", backgroundImage: `linear-gradient(${c}35 1px,transparent 1px),linear-gradient(90deg,${c}35 1px,transparent 1px)`, backgroundSize: "40px 40px", maskImage: "linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 100%)", WebkitMaskImage: "linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 100%)", transform: "perspective(400px) rotateX(60deg) translateY(30%)", transformOrigin: "bottom" }} />
            <div style={{ position: "absolute", top: 0, left: "-100%", right: 0, height: "100%", background: `linear-gradient(90deg,transparent,${c}15,transparent)`, animation: "scanH 3s ease-in-out infinite" }} />
            {Array.from({ length: section.particles }).map((_, i) => (
                <div key={i} style={{ position: "absolute", width: i % 2 === 0 ? 3 : 2, height: i % 2 === 0 ? 3 : 2, borderRadius: "50%", background: c, left: `${10 + (i * 73) % 80}%`, top: `${5 + (i * 47) % 85}%`, opacity: 0.7, animation: `floatY ${2.5 + (i % 4) * 0.8}s ease-in-out infinite`, animationDelay: `${(i * 0.4) % 3}s`, boxShadow: `0 0 10px ${c},0 0 20px ${c}80` }} />
            ))}
            {Array.from({ length: section.rings }).map((_, i) => (
                <div key={i} style={{ position: "absolute", width: 120 + i * 60, height: 120 + i * 60, borderRadius: "50%", border: `1px solid ${c}${i === 0 ? "70" : i === 1 ? "45" : "28"}`, animation: `spinSlow ${6 + i * 3}s linear infinite ${i % 2 === 0 ? "" : "reverse"}` }}>
                    {i === 0 && <div style={{ position: "absolute", top: "50%", left: "50%", width: 8, height: 8, borderRadius: "50%", background: c, marginTop: -4, marginLeft: -4, animation: "spinSlow 6s linear infinite", boxShadow: `0 0 10px ${c}` }} />}
                </div>
            ))}
            <div style={{ position: "relative", zIndex: 10, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${c}65 0%,${c}28 60%,transparent 100%)`, border: `2px solid ${c}80`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${c}80,0 0 90px ${c}40,inset 0 0 30px ${c}30`, animation: "pulse 3s ease-out infinite" }}>
                <span style={{ fontSize: 32, filter: "drop-shadow(0 0 8px currentColor)" }}>{section.sceneIcon}</span>
            </div>
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.6)", border: `1px solid ${c}50`, borderRadius: 3, padding: "8px 12px", backdropFilter: "blur(8px)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, animation: "pulse 2s ease-out infinite", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: c, fontFamily: "var(--font-d)", letterSpacing: ".1em", textTransform: "uppercase" }}>{section.sceneLabel}</span>
            </div>
            {[[{ top: 12, left: 12 }, "top", "left"], [{ top: 12, right: 12 }, "top", "right"], [{ bottom: 12, left: 12 }, "bottom", "left"], [{ bottom: 12, right: 12 }, "bottom", "right"]].map(([pos, v, h], i) => (
                <div key={i} style={{ position: "absolute", ...pos, width: 14, height: 14, borderTop: v === "top" ? `1px solid ${c}70` : "none", borderBottom: v === "bottom" ? `1px solid ${c}70` : "none", borderLeft: h === "left" ? `1px solid ${c}70` : "none", borderRight: h === "right" ? `1px solid ${c}70` : "none" }} />
            ))}
        </div>
    );
}

function ChatPreview({ messages, color }) {
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);
    return (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#1c1410 0%,#211710 100%)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(210,178,120,0.15)", background: "rgba(36,24,16,0.9)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}`, animation: "pulse 2s ease-out infinite" }} />
                <span style={{ fontFamily: "var(--font-d)", fontSize: 10, color: "var(--muted)", letterSpacing: ".12em", textTransform: "uppercase" }}>Live Session · AI Analysis Active</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    {["#c04848", "#f0a820", "#6ab878"].map((cl, i) => (
                        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: cl, opacity: 0.8 }} />
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: m.from === "user" ? "row-reverse" : "row", gap: 10, animation: "fadeUp .4s var(--ease) forwards", animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                        {m.from === "ai" && (
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `radial-gradient(circle,${color}90 0%,${color}35 100%)`, border: `1px solid ${color}90`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontFamily: "var(--font-d)", color: color, fontWeight: 800 }}>
                                {m.name?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 3, alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
                            {m.from === "ai" && <span style={{ fontSize: 9, color: color, fontFamily: "var(--font-d)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>{m.name}</span>}
                            <div style={{ background: m.from === "user" ? `linear-gradient(135deg,${color}35,${color}18)` : "rgba(255,255,255,0.05)", border: `1px solid ${m.from === "user" ? color + "80" : "rgba(210,178,120,0.18)"}`, borderRadius: m.from === "user" ? "12px 12px 2px 12px" : "2px 12px 12px 12px", padding: "9px 13px" }}>
                                <p style={{ fontSize: 12, lineHeight: 1.55, color: m.from === "user" ? "var(--parchment)" : "rgba(242,238,228,0.85)", letterSpacing: "-.01em" }}>{m.msg}</p>
                            </div>
                            <span style={{ fontSize: 9, color: "var(--faint)", letterSpacing: ".06em" }}>{m.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
            <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(210,178,120,0.12)", background: "rgba(0,0,0,0.4)", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <div style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(210,178,120,0.22)", borderRadius: 3, padding: "8px 12px", fontSize: 11, color: "rgba(196,148,64,0.5)", fontFamily: "var(--font-b)", fontStyle: "italic" }}>Message your AI team…</div>
                <button style={{ width: 34, height: 34, background: color, border: "none", borderRadius: 2, color: "#0f0a08", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>▶</button>
            </div>
        </div>
    );
}

function ImageSlot({ idx, label, color }) {
    const icons = ["📊", "🎤", "🎯", "📈", "💼", "📋", "🔬", "📡", "⚖", "🛡", "📜", "🔐", "🧠", "💡", "🔭", "⚡"];
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ width: "100%", aspectRatio: "16/9", background: "linear-gradient(135deg,#2e1e12 0%,#1e140c 100%)", border: `1px solid ${hov ? color + "70" : color + "35"}`, borderRadius: 6, position: "relative", overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-3px)" : "none", transition: "all 0.3s var(--ease)", boxShadow: hov ? `0 12px 40px rgba(0,0,0,0.7),0 0 20px ${color}20` : "0 4px 16px rgba(0,0,0,0.5)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--wood)", opacity: 0.3, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 40%,${color}20 0%,transparent 55%),radial-gradient(ellipse at 70% 60%,${color}10 0%,transparent 50%)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${color}18 1px,transparent 1px),linear-gradient(90deg,${color}18 1px,transparent 1px)`, backgroundSize: "30px 30px" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `radial-gradient(circle,${color}30 0%,transparent 70%)`, border: `1px dashed ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, animation: "floatY 3s ease-in-out infinite", animationDelay: `${idx * 0.5}s`, filter: `drop-shadow(0 0 12px ${color}80)` }}>
                    {icons[idx % icons.length]}
                </div>
                <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: `${color}90`, letterSpacing: ".16em", textTransform: "uppercase", textAlign: "center", padding: "0 20px", lineHeight: 1.5 }}>{label}</div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: hov ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)", backdropFilter: hov ? "blur(4px)" : "none", display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 1 : 0, transition: "all 0.25s" }}>
                <div style={{ fontFamily: "var(--font-d)", fontSize: 10, color: color, letterSpacing: ".14em", textTransform: "uppercase", border: `1px solid ${color}60`, padding: "8px 18px", borderRadius: 2 }}>+ Add Image</div>
            </div>
            {[[{ top: 8, left: 8 }, "top", "left"], [{ top: 8, right: 8 }, "top", "right"], [{ bottom: 8, left: 8 }, "bottom", "left"], [{ bottom: 8, right: 8 }, "bottom", "right"]].map(([pos, v, h], i) => (
                <div key={i} style={{ position: "absolute", ...pos, width: 10, height: 10, borderTop: v === "top" ? `1px solid ${color}60` : "none", borderBottom: v === "bottom" ? `1px solid ${color}60` : "none", borderLeft: h === "left" ? `1px solid ${color}60` : "none", borderRight: h === "right" ? `1px solid ${color}60` : "none" }} />
            ))}
            <div style={{ position: "absolute", top: 10, left: 12, fontSize: 8, color: `${color}70`, fontFamily: "var(--font-d)", letterSpacing: ".12em", textTransform: "uppercase" }}>IMG {idx + 1}</div>
        </div>
    );
}

function FeatureCard({ f, color }) {
    const [hov, setHov] = useState(false);
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `${color}28` : `${color}15`, border: `1px solid ${hov ? color + "55" : color + "28"}`, borderRadius: 4, padding: "16px 18px", transform: hov ? "translateY(-2px)" : "none", transition: "all 0.3s var(--ease)", cursor: "default", position: "relative", overflow: "hidden" }}>
            <div style={{ backgroundImage: "var(--wood)", position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontSize: 18, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontFamily: "var(--font-d)", fontSize: 10, color: color, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</div>
                <p style={{ fontFamily: "var(--font-b)", fontSize: 12, color: "rgba(215,172,82,0.85)", lineHeight: 1.55, letterSpacing: "-.01em" }}>{f.desc}</p>
            </div>
        </div>
    );
}

function NavLink({ section }) {
    const [hov, setHov] = useState(false);
    return (
        <a href={`#section-${section.id}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ fontFamily: "var(--font-d)", fontSize: 9, color: hov ? section.color : "rgba(180,140,70,0.9)", letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none", padding: "6px 14px", borderRadius: 2, border: `1px solid ${hov ? section.color + "50" : "transparent"}`, background: hov ? `${section.color}12` : "transparent", transition: "all .2s" }}>
            {section.badge}
        </a>
    );
}

function HeroPill({ section }) {
    const [hov, setHov] = useState(false);
    return (
        <a href={`#section-${section.id}`} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: hov ? `${section.color}30` : `${section.color}15`, border: `1px solid ${hov ? section.color + "70" : section.color + "38"}`, borderRadius: 3, padding: "8px 18px", fontFamily: "var(--font-d)", fontSize: 9, color: section.color, letterSpacing: ".14em", textTransform: "uppercase", textDecoration: "none", transform: hov ? "translateY(-2px)" : "none", transition: "all .3s" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: section.color, flexShrink: 0 }} />
            {section.badge}
        </a>
    );
}

function CtaButton({ label, primary, color }) {
    const [hov, setHov] = useState(false);
    return (
        <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
            background: primary ? color : "transparent",
            color: primary ? "#0f0a08" : (hov ? color : "var(--muted)"),
            border: primary ? "none" : `1px solid ${hov ? color + "70" : "rgba(210,178,120,0.25)"}`,
            borderRadius: 2, padding: "0 28px", height: 44,
            fontFamily: "var(--font-d)", fontSize: 10, fontWeight: primary ? 700 : 400,
            letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer",
            boxShadow: primary ? (hov ? `0 0 40px ${color}70,0 4px 16px rgba(0,0,0,0.5)` : `0 0 28px ${color}45,0 4px 16px rgba(0,0,0,0.5)`) : "none",
            transform: hov ? "translateY(-2px)" : "none",
            transition: "all 0.3s var(--ease)",
        }}>{label}</button>
    );
}

function Section({ section, index }) {
    const [mode, setMode] = useState("3d");
    const [imgPair, setImgPair] = useState(0);
    const isEven = index % 2 === 0;
    const c = section.color;

    return (
        <section style={{ position: "relative", padding: "80px 0", borderBottom: "1px solid rgba(210,178,120,0.08)", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "50%", left: isEven ? "0%" : "auto", right: isEven ? "auto" : "0%", transform: "translateY(-50%)", width: "40%", height: "60%", background: `radial-gradient(ellipse,${c}18 0%,transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "50%", [isEven ? "right" : "left"]: "5%", transform: "translateY(-50%)", fontFamily: "var(--font-d)", fontSize: "18vw", fontWeight: 900, color: `${c}07`, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>{section.num}</div>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48, animation: "fadeUp .7s var(--ease) forwards" }}>
                    <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: c, letterSpacing: ".22em", textTransform: "uppercase", padding: "5px 14px", border: `1px solid ${c}70`, borderRadius: 2, background: `${c}18` }}>{section.badge}</div>
                    <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg,${c}50,transparent)`, animation: "lineGrow .8s var(--ease) forwards" }} />
                    <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--faint)", letterSpacing: ".14em" }}>{section.num} / 04</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isEven ? "1fr 1.1fr" : "1.1fr 1fr", gap: 48, alignItems: "start", marginBottom: 52 }}>
                    <div style={{ order: isEven ? 0 : 1 }}>
                        <h2 style={{ fontFamily: "var(--font-d)", fontSize: 36, fontWeight: 500, color: "var(--parchment)", letterSpacing: "-.01em", lineHeight: 1.15, marginBottom: 12 }}>{section.title}</h2>
                        <p style={{ fontFamily: "var(--font-d)", fontSize: 11, color: c, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 18 }}>{section.tagline}</p>
                        <p style={{ fontFamily: "var(--font-b)", fontSize: 15, color: "rgba(242,238,228,0.82)", lineHeight: 1.7, marginBottom: 32, letterSpacing: "-.01em" }}>{section.desc}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                            {section.features.map((f, i) => <FeatureCard key={i} f={f} color={c} />)}
                        </div>
                        <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
                            <CtaButton label={`Enter ${section.badge}`} primary={true} color={c} />
                            <CtaButton label="Learn More" primary={false} color={c} />
                        </div>
                    </div>
                    <div style={{ order: isEven ? 1 : 0 }}>
                        <div style={{ display: "inline-flex", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(210,178,120,0.22)", borderRadius: 4, padding: 3, marginBottom: 14, gap: 2 }}>
                            {[{ key: "3d", icon: "◈", label: "3D View" }, { key: "chat", icon: "◉", label: "Chat Preview" }].map(btn => (
                                <button key={btn.key} onClick={() => setMode(btn.key)} style={{ display: "flex", alignItems: "center", gap: 7, background: mode === btn.key ? `${c}35` : "transparent", border: `1px solid ${mode === btn.key ? c + "70" : "transparent"}`, borderRadius: 3, padding: "7px 16px", cursor: "pointer", fontFamily: "var(--font-d)", fontSize: 10, color: mode === btn.key ? c : "var(--faint)", letterSpacing: ".1em", textTransform: "uppercase", transition: "all .25s" }}>
                                    <span style={{ fontSize: 13 }}>{btn.icon}</span>{btn.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ height: 340, background: "#1c1410", border: `1px solid ${c}50`, borderRadius: 6, overflow: "hidden", position: "relative", boxShadow: `0 0 40px ${c}15,0 20px 60px rgba(0,0,0,0.8)` }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c}80,transparent)`, zIndex: 10 }} />
                            {mode === "3d" ? <Scene3D section={section} /> : <ChatPreview messages={CHAT[section.id]} color={c} />}
                        </div>
                        <p style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--faint)", letterSpacing: ".14em", textTransform: "uppercase", textAlign: "center", marginTop: 10 }}>{section.subtitle}</p>
                    </div>
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                        <span style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--faint)", letterSpacing: ".18em", textTransform: "uppercase" }}>Platform Screenshots</span>
                        <div style={{ height: 1, flex: 1, background: "rgba(210,178,120,0.1)" }} />
                        <div style={{ display: "flex", gap: 6 }}>
                            {[0, 1].map(i => (
                                <button key={i} onClick={() => setImgPair(i)} style={{ width: 28, height: 28, borderRadius: 2, background: imgPair === i ? `${c}28` : "transparent", border: `1px solid ${imgPair === i ? c + "70" : "rgba(210,178,120,0.2)"}`, color: imgPair === i ? c : "var(--faint)", fontFamily: "var(--font-d)", fontSize: 10, cursor: "pointer", transition: "all .2s" }}>{i + 1}</button>
                            ))}
                        </div>
                        <span style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--faint)", letterSpacing: ".1em" }}>Pair {imgPair + 1} of 2</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[0, 1].map(i => <ImageSlot key={`${section.id}-${imgPair}-${i}`} idx={imgPair * 2 + i} label={section.imgs[imgPair * 2 + i]} color={c} />)}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FooterBtn({ label, primary }) {
    const [hov, setHov] = useState(false);
    return (
        <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
            background: primary ? "#f0b030" : "transparent",
            color: primary ? "#0f0a08" : (hov ? "var(--gold)" : "var(--muted)"),
            border: primary ? "1px solid rgba(255,255,255,0.25)" : `1px solid ${hov ? "var(--gold-dim)" : "rgba(210,178,120,0.28)"}`,
            borderRadius: 2, padding: "0 40px", height: 52,
            fontFamily: "var(--font-d)", fontSize: 11, fontWeight: primary ? 700 : 400,
            letterSpacing: ".15em", textTransform: "uppercase", cursor: "pointer",
            boxShadow: primary ? (hov ? "0 10px 50px rgba(240,180,48,0.7)" : "0 0 40px rgba(240,180,48,0.4),0 4px 20px rgba(0,0,0,0.6)") : "none",
            transform: hov ? "translateY(-3px)" : "none",
            transition: "all .3s var(--ease)",
        }}>{label}</button>
    );
}

function HeaderBtn({ label, primary }) {
    const [hov, setHov] = useState(false);
    return (
        <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
            background: primary ? "var(--gold)" : "transparent",
            border: primary ? "none" : `1px solid ${hov ? "var(--gold-dim)" : "rgba(210,178,120,0.28)"}`,
            borderRadius: 2, padding: "0 20px", height: 36,
            fontFamily: "var(--font-d)", fontSize: 9, fontWeight: primary ? 700 : 400,
            color: primary ? "#0f0a08" : (hov ? "var(--gold)" : "var(--muted)"),
            letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer",
            boxShadow: primary ? "0 0 20px rgba(240,168,32,0.3)" : "none",
            transform: hov ? "translateY(-1px)" : "none",
            filter: primary && hov ? "brightness(1.1)" : "none",
            transition: "all .2s",
        }}>{label}</button>
    );
}

export default function PreviewPage() {
    const [scrollY, setScrollY] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const h = () => setScrollY(el.scrollTop);
        el.addEventListener("scroll", h, { passive: true });
        return () => el.removeEventListener("scroll", h);
    }, []);

    return (
        <>
            <style>{STYLES}</style>
            <div ref={ref} style={{ height: "100vh", overflowY: "auto", background: "var(--bg)" }}>

                <header style={{ position: "sticky", top: 0, zIndex: 200, height: 64, background: `rgba(26,17,12,${Math.min(scrollY / 100, 0.97)})`, backdropFilter: "blur(16px)", borderBottom: `1px solid rgba(210,178,120,${Math.min(scrollY / 100, 0.35)})`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", transition: "background .3s,border-color .3s" }}>
                    <div style={{ backgroundImage: "var(--wood)", position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 2 }}>
                        <div style={{ width: 34, height: 34, background: "var(--gold-grad)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-d)", fontSize: 14, color: "#0f0a08", fontWeight: 700, boxShadow: "0 0 24px rgba(240,168,32,0.45),0 0 50px rgba(240,168,32,0.2)" }}>A</div>
                        <span style={{ fontFamily: "var(--font-d)", fontSize: 17, color: "var(--parchment)", letterSpacing: ".02em" }}>Agioas</span>
                    </div>
                    <nav style={{ display: "flex", gap: 4, position: "relative", zIndex: 2 }}>
                        {SECTIONS.map(s => <NavLink key={s.id} section={s} />)}
                    </nav>
                    <div style={{ display: "flex", gap: 10, position: "relative", zIndex: 2 }}>
                        <HeaderBtn label="Sign In" primary={false} />
                        <HeaderBtn label="Get Started" primary={true} />
                    </div>
                </header>

                {/* Hero */}
                <div style={{ position: "relative", overflow: "hidden", padding: "90px 48px 80px", background: "radial-gradient(ellipse at 50% -10%,#3a2818 0%,#1a110c 60%)", borderBottom: "1px solid rgba(210,178,120,0.12)" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(240,168,32,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(240,168,32,0.07) 1px,transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at center,black 0%,transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse at center,black 0%,transparent 75%)" }} />
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "var(--wood)", opacity: 0.4, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--gold-hi),transparent)" }} />
                    {[["15%", "20%", "#f0a82050"], ["75%", "60%", "#6ab87840"], ["50%", "80%", "#c0484835"], ["85%", "15%", "#5878a035"]].map(([l, t, bg], i) => (
                        <div key={i} style={{ position: "absolute", left: l, top: t, width: "150px", height: "150px", borderRadius: "50%", background: bg, filter: "blur(40px)", animation: `floatY ${4 + i}s ease-in-out infinite`, animationDelay: `${i * 0.8}s`, pointerEvents: "none" }} />
                    ))}
                    <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 18px", border: "1px solid rgba(220,188,120,0.40)", borderRadius: 2, background: "rgba(220,168,80,0.12)", marginBottom: 24, animation: "fadeUp .6s var(--ease) forwards" }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", boxShadow: "0 0 8px var(--gold)", animation: "pulse 2s ease-out infinite" }} />
                            <span style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--gold-dim)", letterSpacing: ".22em", textTransform: "uppercase" }}>VCS · Virtual Office · War Room · Honest CEO</span>
                        </div>
                        <h1 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(36px,6vw,72px)", fontWeight: 500, color: "var(--parchment)", lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 20, animation: "fadeUp .8s .1s var(--ease) both", textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
                            Your Complete{" "}
                            <span style={{ background: "var(--gold-grad)", backgroundSize: "300%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 5s linear infinite" }}>AI Executive</span>
                            <br />Platform
                        </h1>
                        <p style={{ fontFamily: "var(--font-b)", fontSize: 17, color: "rgba(242,238,228,0.80)", lineHeight: 1.65, maxWidth: 640, margin: "0 auto 36px", letterSpacing: "-.01em", animation: "fadeUp .8s .2s var(--ease) both" }}>
                            Four battle-tested products. Every business scenario covered. From mastering the pitch to running a full executive office to navigating crisis — Agioas has the intelligence you need.
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", animation: "fadeUp .8s .3s var(--ease) both", marginBottom: 48 }}>
                            {SECTIONS.map(s => <HeroPill key={s.id} section={s} />)}
                        </div>
                        <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(4,1fr)", background: "rgba(38,26,16,0.82)", border: "1px solid rgba(210,178,120,0.35)", borderRadius: 6, overflow: "hidden", backdropFilter: "blur(12px)", animation: "fadeUp .8s .4s var(--ease) both" }}>
                            {[["9", "AI Executives"], ["3D + Chat", "Dual Interface"], ["24/7", "Always On"], ["0", "Human Bias"]].map(([v, l], i) => (
                                <div key={i} style={{ padding: "20px 28px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(210,178,120,0.12)" : "none", position: "relative", overflow: "hidden" }}>
                                    <div style={{ backgroundImage: "var(--wood)", position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />
                                    <div style={{ fontFamily: "var(--font-d)", fontSize: 22, fontWeight: 700, color: "var(--gold-hi)", position: "relative", zIndex: 2, textShadow: "0 0 20px rgba(240,168,32,0.4)" }}>{v}</div>
                                    <div style={{ fontFamily: "var(--font-d)", fontSize: 8, color: "var(--faint)", letterSpacing: ".14em", textTransform: "uppercase", marginTop: 4, position: "relative", zIndex: 2 }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {SECTIONS.map((s, i) => (
                    <div key={s.id} id={`section-${s.id}`}>
                        <Section section={s} index={i} />
                    </div>
                ))}

                <div style={{ padding: "80px 48px", textAlign: "center", background: "radial-gradient(ellipse at 50% 50%,#3a2818 0%,#1a110c 70%)", borderTop: "1px solid rgba(210,178,120,0.12)", position: "relative", overflow: "hidden" }}>
                    <div style={{ backgroundImage: "var(--wood)", position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--gold-hi),transparent)" }} />
                    <div style={{ position: "relative", zIndex: 2 }}>
                        <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--muted)", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: 20 }}>Ready to deploy your AI executive team?</div>
                        <h2 style={{ fontFamily: "var(--font-d)", fontSize: 38, fontWeight: 500, color: "var(--parchment)", marginBottom: 16, letterSpacing: "-.01em" }}>
                            Start Your{" "}
                            <span style={{ background: "var(--gold-grad)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 4s linear infinite" }}>Executive Suite</span>
                        </h2>
                        <p style={{ fontFamily: "var(--font-b)", fontSize: 15, color: "rgba(215,172,82,0.88)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 36px", letterSpacing: "-.01em" }}>VCS, Virtual Office, War Room and Honest CEO — all four platforms, one unified intelligence layer.</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
                            <FooterBtn label="Begin Your Mandate" primary={true} />
                            <FooterBtn label="Watch Demo" primary={false} />
                        </div>
                        <div style={{ marginTop: 48, borderTop: "1px solid rgba(210,178,120,0.1)", paddingTop: 28, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
                            {[["VCS", "Pitch & Communication Training"], ["Virtual Office", "9-Executive AI Team"], ["War Room", "Crisis & Strategy Command"], ["Honest CEO", "Behavioural Intelligence"]].map(([name, desc]) => (
                                <div key={name} style={{ textAlign: "center" }}>
                                    <div style={{ fontFamily: "var(--font-d)", fontSize: 9, color: "var(--gold-dim)", letterSpacing: ".14em", textTransform: "uppercase" }}>{name}</div>
                                    <div style={{ fontFamily: "var(--font-b)", fontSize: 11, color: "var(--faint)", marginTop: 4 }}>{desc}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 32, fontFamily: "var(--font-d)", fontSize: 8, color: "rgba(138,104,56,0.5)", letterSpacing: ".14em", textTransform: "uppercase" }}>2026 Agioas · All Rights Reserved · Executive AI Platform</div>
                    </div>
                </div>

            </div>
        </>
    );
}