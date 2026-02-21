import React, { useState, useEffect, useRef } from 'react';
import {
  Send, PhoneOff, Users, Clock, Timer,
  PauseCircle, Play, Paperclip, AlertTriangle, CheckCircle,
  Vote, Plus, Trash2, X, ChevronLeft, ChevronRight, FileText, FileBarChart,
  Download, RefreshCcw, Disc, MessageSquare, Coffee, TrendingUp, ShieldAlert, PlusSquare,
  Crown, HelpCircle, Brain, Activity, Zap
} from 'lucide-react';

// ✅ REMOVED: import { WebSocketManager } from '../services/api';
// ✅ ADDED: Direct WebSocket URL
const WS_URL = 'ws://localhost:8000/ws/boardroom';

// --- CONFIGURATION (UNCHANGED) ---
const USER_NAME = "Chairman";
const USER_PROFILE_IMG = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

// --- THEME: THE EXECUTIVE SUITE (MAHOGANY & BRASS) - COMPLETELY UNCHANGED ---
const colors = {
  gold: '#b99550',
  goldDim: 'rgba(185, 149, 80, 0.15)',
  goldBright: '#ffcd5a',
  textMain: '#E8E0D5',
  textDim: '#957443',
  textDark: '#211b15',
  border: 'rgba(196, 168, 111, 0.25)',
  success: '#5D7A58',
  danger: '#8A3A3A',
  bgApp: '#1c1410',
  bgSidebar: '#1b110d',
  bgCard: '#1e1610',
  bgInput: '#0c0908',
  goldGrad: 'linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%)',
  darkGlass: 'rgba(29, 21, 16, 0.9)'
};

const animationStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;500;600;700;900&display=swap');

  * { scroll-behavior: smooth; box-sizing: border-box; }

  /* SCROLLBAR - Brass Style */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0F0A08; }
  ::-webkit-scrollbar-thumb { background: #261c17; border: 1px solid #1A120E; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${colors.gold}; }

  /* --- ANIMATIONS --- */
  @keyframes msgPopIn {
    0% { opacity: 0; transform: translateY(10px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes dotPulse {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 10px 2px rgba(212, 175, 104, 0.4); }
  }

  @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
  @keyframes fadeInBlur { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(12px); } }
  @keyframes scaleIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
  @keyframes slideInRight { 0% { opacity: 0; transform: translateX(20px); } 100% { opacity: 1; transform: translateX(0); } }

  .smooth-transition { transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
  .interactive-hover:hover { transform: translateY(-2px); filter: brightness(1.1); }
  .interactive-press:active { transform: scale(0.95); }
  
  .sidebar-closed { width: 0 !important; padding: 0 !important; overflow: hidden; opacity: 0; }
  .sidebar-open { width: 300px; opacity: 1; }

  /* WOOD GRAIN OVERLAY */
  .wood-grain {
    background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 4px);
    pointer-events: none;
    position: absolute;
    inset: 0;
    opacity: 0.5;
  }

  /* HIGH CONTRAST GRID BACKGROUND */
  .main-grid-container {
    background-color: #0F0A08;
    background-image: 
      linear-gradient(to right, rgba(26, 18, 14, 1) 2px, transparent 2px),
      linear-gradient(to bottom, rgba(26, 18, 14, 1) 2px, transparent 2px);
    background-size: 60px 60px;
    position: absolute;
    inset: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .cinzel-font { font-family: 'Cinzel', serif; }
  .inter-font { font-family: 'Inter', sans-serif; }
`;

// ✅ UPDATED: Board members matching 3D boardroom (AI intelligence upgrade)
const INITIAL_BOARD_MEMBERS = [
  { id: 1, name: "Arthur Vance", role: "CEO", initials: "AV", conviction: 50, engagement: 70, status: "online", speakCount: 0 },
  { id: 2, name: "Beatrice Sterling", role: "CFO", initials: "BS", conviction: 50, engagement: 45, status: "online", speakCount: 0 },
  { id: 3, name: "Cyrus Thorne", role: "CTO", initials: "CT", conviction: 20, engagement: 30, status: "online", speakCount: 0 },
  { id: 4, name: "Diana Prince", role: "COO", initials: "DP", conviction: 80, engagement: 90, status: "online", speakCount: 0 },
  { id: 5, name: "Elias Thorne", role: "CMO", initials: "ET", conviction: 65, engagement: 85, status: "online", speakCount: 0 },
  { id: 6, name: "Fiona Frost", role: "CHRO", initials: "FF", conviction: 40, engagement: 60, status: "online", speakCount: 0 },
  { id: 7, name: "Gideon Grave", role: "CLO", initials: "GG", conviction: 95, engagement: 50, status: "online", speakCount: 0 },
  { id: 8, name: "Helena Vane", role: "CSO", initials: "HV", conviction: 30, engagement: 75, status: "online", speakCount: 0 },
  { id: 9, name: "Ian Irons", role: "CISO", initials: "II", conviction: 85, engagement: 40, status: "online", speakCount: 0 },
];

const INITIAL_MESSAGES = [
  { id: 1, sender: "System", text: "Secure channel established. Connected to AGIOAS Neural Core.", type: 'system' },
];

// --- MINI COMPONENTS (UNCHANGED) ---

const ThinkingBubble = ({ member }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, animation: 'msgPopIn 0.3s ease-out', paddingBottom: 8 }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold, fontSize: 10, animation: 'pulse 1.5s infinite' }}>
      {member?.initials || 'AI'}
    </div>
    <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: '16px 16px 16px 2px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)', boxShadow: `0 4px 15px rgba(0,0,0,0.4)` }}>
      <span style={{ fontSize: 11, color: colors.textDim, marginRight: 6, fontWeight: 600, fontFamily: 'Cinzel' }}>{member?.name ? member.name.toUpperCase() : 'ANALYZING'}</span>
      <div style={{ width: 6, height: 6, background: colors.gold, borderRadius: '50%', animation: 'dotPulse 1.2s infinite ease-in-out', animationDelay: '0s' }}></div>
      <div style={{ width: 6, height: 6, background: colors.gold, borderRadius: '50%', animation: 'dotPulse 1.2s infinite ease-in-out', animationDelay: '0.2s' }}></div>
      <div style={{ width: 6, height: 6, background: colors.gold, borderRadius: '50%', animation: 'dotPulse 1.2s infinite ease-in-out', animationDelay: '0.4s' }}></div>
    </div>
  </div>
);

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  useEffect(() => {
    if (!text) return;
    const words = text.split(" ");
    const interval = setInterval(() => {
      if (indexRef.current < words.length) {
        setDisplayedText((prev) => prev + (indexRef.current === 0 ? "" : " ") + words[indexRef.current]);
        indexRef.current++;
      } else { clearInterval(interval); }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayedText}</span>;
};

const SidebarGraph = ({ title, icon: Icon, data, color }) => (
  <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.border}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colors.textDim, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12, fontFamily: 'Cinzel' }}>
      <Icon size={14} color={color} /> {title}
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40, paddingLeft: 4 }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, background: color, opacity: 0.3 + (val / 100), height: `${val}%`, borderRadius: '2px 2px 0 0', transition: 'height 1s ease' }}></div>
      ))}
    </div>
  </div>
);

const BoardroomChat = ({ config, onBack }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState(false);
  const [typingMemberId, setTypingMemberId] = useState(null);
  const [endReason, setEndReason] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isConfirmEndOpen, setIsConfirmEndOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [customBreakTime, setCustomBreakTime] = useState("");
  const [speakerCount, setSpeakerCount] = useState({});

  // Voting
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isVotingInProgress, setIsVotingInProgress] = useState(false);
  const [votingProgress, setVotingProgress] = useState(0);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [voteTopic, setVoteTopic] = useState("");
  const [voteDesc, setVoteDesc] = useState("");
  const [isCustomVote, setIsCustomVote] = useState(false);
  const [customOptions, setCustomOptions] = useState(["Option A", "Option B"]);
  const [newOptionText, setNewOptionText] = useState("");
  const [voteResults, setVoteResults] = useState(null);

  const [sessionTime, setSessionTime] = useState(3600);
  const [activityTime, setActivityTime] = useState(300);
  const chatEndRef = useRef(null);

  // ✅ AI-POWERED STATE (NEW)
  const [sessionId, setSessionId] = useState(null);
  const [boardMembers, setBoardMembers] = useState(INITIAL_BOARD_MEMBERS);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [currentMessageBuffer, setCurrentMessageBuffer] = useState("");
  const wsRef = useRef(null);

  // ✅ WEBSOCKET CONNECTION (REPLACES WebSocketManager)
  // ========================================================================
  // ✅ AUTHENTICATION FIX: SESSION START + WEBSOCKET CONNECTION
  // ========================================================================
  useEffect(() => {
    let ws = null;
    let mounted = true;

    const initializeAuthenticatedSession = async () => {
      try {
        console.log('🚀 Starting boardroom session with authentication...');
        const { sessionAPI } = await import('../services/api');

        const response = await sessionAPI.start('boardroom', 'chat', config || {});

        if (!mounted) return;

        const authenticatedSessionId = response.data.session.session_id;
        setSessionId(authenticatedSessionId);
        console.log('✅ Authenticated session started:', authenticatedSessionId);

        console.log(`🔌 Connecting to WebSocket: ${WS_URL}/chat/${authenticatedSessionId}`);
        ws = new WebSocket(`${WS_URL}/chat/${authenticatedSessionId}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✅ WebSocket connected');
          setIsWsConnected(true);

          // ✅ FIXED BUG: Send company context so AI knows what meeting this is about
          // config is the meetingConfig object from BoardroomFrontpage (has .context nested inside)
          const ctxSource = config?.context || config || {};
          ws.send(JSON.stringify({
            type: 'company_context',
            context: {
              title: ctxSource.title || 'Boardroom Session',
              meetingAim: ctxSource.meetingAim || '',
              agendaText: ctxSource.agendaText || '',
              meetingType: ctxSource.meetingType || 'Quarterly Review',
              companyStage: ctxSource.companyStage || 'Growth (Series B+)',
              strategicFocus: ctxSource.strategicFocus || '',
              companyHealth: ctxSource.companyHealth || 'Stable Growth',
              discussionHorizon: ctxSource.discussionHorizon || 'Strategic (Long-Term)',
              adaptiveData: ctxSource.adaptiveData || {},
              boardMembers: ctxSource.boardMembers || [],
            }
          }));
          console.log('📊 Boardroom context sent:', ctxSource.meetingAim || ctxSource.title);

          setTimeout(() => {
            const ceo = boardMembers[0];
            setMessages(prev => [...prev, {
              id: Date.now(),
              sender: ceo.name,
              initials: ceo.initials,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: `Welcome to the boardroom. I'm ${ceo.name}, CEO. Let's begin our strategic discussion.`,
              type: 'agent',
              sentiment: 'neutral'
            }]);
          }, 1500);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (e) {
            console.log('WS text:', event.data);
          }
        };

        ws.onclose = () => {
          console.log('❌ WebSocket disconnected');
          setIsWsConnected(false);
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          setIsWsConnected(false);
        };

      } catch (error) {
        console.error('❌ Failed to start authenticated session:', error);

        if (error.response?.status === 401) {
          alert('Authentication required. Please log in again.');
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          const errorMsg = error.response?.data?.error || 'Access denied';
          alert(`Session start failed: ${errorMsg}\n\nPlease check your membership status.`);
          if (onBack) onBack();
        } else {
          alert('Failed to start session. Please try again.');
          if (onBack) onBack();
        }
      }
    };

    initializeAuthenticatedSession();

    return () => {
      mounted = false;
      if (ws) {
        ws.close();
      }
    };
  }, [config]);

  // ✅ HANDLE WEBSOCKET MESSAGES (NEW - WORD STREAMING)
  const handleWebSocketMessage = (data) => {
    console.log('📨 WS Message:', data.type);

    if (data.type === 'connection_established') {
      console.log('✅ Connection established');
    }

    else if (data.type === 'thinking') {
      const member = boardMembers.find(m => m.name === data.character_name);
      if (member) {
        console.log(`🤔 ${member.name} is thinking...`);
        setTypingMemberId(member.id);
      }
    }

    else if (data.type === 'word_stream') {
      const { character_name, word, is_complete } = data;

      setCurrentMessageBuffer(prev => {
        const newMessage = prev ? `${prev} ${word}` : word;

        if (is_complete) {
          console.log(`✅ ${character_name} finished speaking`);

          const member = boardMembers.find(m => m.name === character_name);
          const newMsg = {
            id: Date.now(),
            sender: character_name,
            initials: member?.initials || character_name.substring(0, 2).toUpperCase(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: newMessage,
            type: 'agent',
            sentiment: detectSentiment(newMessage)
          };

          setMessages(prevMsgs => [...prevMsgs, newMsg]);
          updateSpeakerCount(character_name);
          updateBoardMemberStats(character_name, newMessage);
          setTypingMemberId(null);
          setActivityTime(300);

          return "";
        }

        return newMessage;
      });
    }

    else if (data.type === 'character_response') {
      const { character_name, message } = data;
      const member = boardMembers.find(m => m.name === character_name);

      const newMsg = {
        id: Date.now(),
        sender: character_name,
        initials: member?.initials || character_name.substring(0, 2).toUpperCase(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: message,
        type: 'agent',
        sentiment: detectSentiment(message)
      };

      setMessages(prev => [...prev, newMsg]);
      updateSpeakerCount(character_name);
      updateBoardMemberStats(character_name, message);
      setTypingMemberId(null);
      setActivityTime(300);
    }

    else if (data.type === 'executive_states') {
      console.log('📊 Updating executive states');
      const states = data.states || [];

      setBoardMembers(prev => prev.map(member => {
        const state = states.find(s => s.name === member.name);
        if (state) {
          return {
            ...member,
            conviction: state.supportLevel || member.conviction,
            engagement: state.engagement || member.engagement,
            speakCount: state.speakCount || member.speakCount
          };
        }
        return member;
      }));
    }

    else if (data.type === 'vote_results') {
      handleVoteResults(data);
    }

    else if (data.type === 'ai_response' || data.type === 'message') {
      // Legacy fallback
      const newMsg = {
        id: Date.now(),
        sender: data.sender || "Board Member",
        initials: data.sender ? data.sender.substring(0, 2).toUpperCase() : "AI",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.message || data.content,
        type: 'agent',
        sentiment: detectSentiment(data.message || data.content)
      };
      setMessages(prev => [...prev, newMsg]);
      updateSpeakerCount(newMsg.sender);
      setTypingMemberId(null);
    }

    else if (data.type === 'error') {
      console.error('❌ Server error:', data.message);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: "System",
        text: "Connection error. Please check backend.",
        type: 'system'
      }]);
      setTypingMemberId(null);
    }
  };

  // ✅ SENTIMENT DETECTION (NEW)
  const detectSentiment = (text) => {
    const textLower = text.toLowerCase();

    if (textLower.match(/\b(excellent|great|impressive|strong|approve|support|agree|perfect|outstanding)\b/)) {
      return 'agree';
    }
    if (textLower.match(/\b(concern|risk|problem|issue|disagree|oppose|worried|dangerous|problematic)\b/)) {
      return 'disagree';
    }
    return 'neutral';
  };

  // ✅ UPDATE BOARD MEMBER STATS (NEW)
  const updateBoardMemberStats = (memberName, message) => {
    setBoardMembers(prev => prev.map(member => {
      if (member.name === memberName) {
        const sentiment = detectSentiment(message);
        let convictionDelta = 0;
        if (sentiment === 'agree') convictionDelta = 10;
        else if (sentiment === 'disagree') convictionDelta = -10;

        return {
          ...member,
          speakCount: member.speakCount + 1,
          conviction: Math.max(0, Math.min(100, member.conviction + convictionDelta)),
          engagement: Math.min(100, member.engagement + 5)
        };
      }
      return member;
    }));
  };

  useEffect(() => {
    const handleVisibilityChange = () => { if (document.hidden) setIsPaused(true); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (isMeetingEnded || isPaused) return;
    const interval = setInterval(() => {
      setSessionTime(p => p <= 1 ? (setEndReason("Time Limit Exceeded"), setIsMeetingEnded(true), 0) : p - 1);
      setActivityTime(p => p <= 1 ? (setEndReason("Inactivity Timeout"), setIsMeetingEnded(true), 0) : p - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isMeetingEnded, isPaused]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingMemberId]);

  // ✅ SEND MESSAGE (UPDATED FOR DIRECT WEBSOCKET)
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setActivityTime(300);

    const newMsg = {
      id: Date.now(),
      sender: USER_NAME,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      type: 'me'
    };
    setMessages(prev => [...prev, newMsg]);
    updateSpeakerCount(USER_NAME);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // ✅ SHOW THINKING IMMEDIATELY
      setTypingMemberId(boardMembers[0]?.id || 1); // Show first board member thinking

      wsRef.current.send(JSON.stringify({
        type: 'user_message',
        message: inputText
      }));
      console.log('📤 Sent user message via WebSocket');
      console.log('🤔 Showing thinking indicator...');
    }

    setInputText('');
  };

  const updateSpeakerCount = (name) => {
    setSpeakerCount(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const handleBreak = (mins) => {
    const time = parseInt(mins);
    if (isNaN(time)) return;
    setIsPaused(true);
    setIsBreakModalOpen(false);
    setMessages(prev => [...prev, { id: Date.now(), sender: "System", text: `Recess initiated: ${time} minutes.`, type: 'system' }]);
  };

  // ✅ REAL AI-POWERED VOTING (UPDATED)
  const startVotingSequence = () => {
    if (!voteTopic.trim()) return;

    setIsVotingInProgress(true);
    setVotingProgress(0);

    // Send vote request to backend
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'vote_request',
        topic: voteTopic,
        description: voteDesc,
        options: isCustomVote ? customOptions : ["Yes", "No"]
      }));
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setVotingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        finalizeVote();
      }
    }, 200);
  };

  const finalizeVote = () => {
    setIsVotingInProgress(false);
    setIsVoteModalOpen(false);

    let options = isCustomVote ? [...customOptions] : ["Yes", "No"];
    options.push("NOTA");

    const results = {};
    options.forEach(op => results[op] = 0);

    // AI-powered voting based on conviction levels
    boardMembers.forEach(member => {
      const convictionWeight = member.conviction / 100;
      if (convictionWeight > 0.7) {
        results[options[0]]++;
      } else if (convictionWeight < 0.3) {
        results[options.length > 2 ? options[1] : "NOTA"]++;
      } else {
        const randomOption = options[Math.floor(Math.random() * options.length)];
        results[randomOption]++;
      }
    });

    setVoteResults({ topic: voteTopic, options: options, results: results, total: boardMembers.length });
    setIsResultModalOpen(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "System",
      text: `Voting Concluded for: "${voteTopic}". Results available.`,
      type: 'system'
    }]);
  };

  const handleVoteResults = (data) => {
    setVoteResults(data.results);
    setIsVotingInProgress(false);
    setIsVoteModalOpen(false);
    setIsResultModalOpen(true);
  };

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      setCustomOptions([...customOptions, newOptionText]);
      setNewOptionText("");
    }
  };

  const handleRemoveOption = (index) => {
    const newOpts = [...customOptions];
    newOpts.splice(index, 1);
    setCustomOptions(newOpts);
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // --- RENDER (UI COMPLETELY UNCHANGED) ---
  return (
    <div className="main-grid-container inter-font">
      <style>{animationStyles}</style>

      {/* --- CONFIRM END MODAL --- */}
      {isConfirmEndOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInBlur 0.3s forwards' }}>
          <div style={{ width: 450, background: '#1A120E', border: `1px solid ${colors.danger}`, borderRadius: 8, padding: 40, textAlign: 'center', boxShadow: `0 40px 80px rgba(0,0,0,0.8)` }}>
            <AlertTriangle size={48} color={colors.danger} style={{ marginBottom: 20 }} />
            <h2 className="cinzel-font" style={{ color: '#fff', margin: '0 0 10px 0', fontSize: 24 }}>Terminate Session?</h2>
            <p style={{ color: colors.textDim, fontSize: 14, marginBottom: 32, lineHeight: 1.6 }}>Closing the office now will generate the final executive reports and archive this strategic timeline.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => setIsConfirmEndOpen(false)} style={{ flex: 1, padding: '14px', borderRadius: 4, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMain, cursor: 'pointer', fontWeight: 600 }}>CANCEL</button>
              <button onClick={() => { setIsConfirmEndOpen(false); setEndReason("Concluded by Chair"); setIsMeetingEnded(true); if (wsRef.current) wsRef.current.close(); if (onBack) onBack(); }} style={{ flex: 1, padding: '14px', borderRadius: 4, border: 'none', background: colors.danger, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>END SESSION</button>
            </div>
          </div>
        </div>
      )}

      {/* --- BREAK MODAL --- */}
      {isBreakModalOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInBlur 0.3s forwards' }}>
          <div style={{ width: 400, background: '#1A120E', border: `1px solid ${colors.gold}`, borderRadius: 8, padding: 40, textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }}>
            <Coffee size={40} color={colors.gold} style={{ marginBottom: 20 }} />
            <h2 className="cinzel-font" style={{ color: colors.gold, margin: '0 0 24px 0', fontSize: 20, letterSpacing: '0.1em' }}>SCHEDULE RECESS</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {[5, 10, 30].map(m => (
                <button key={m} onClick={() => handleBreak(m)} className="interactive-hover" style={{ padding: 14, background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors.border}`, color: '#fff', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>{m} MIN</button>
              ))}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 4, border: `1px solid ${colors.border}` }}>
                <input value={customBreakTime} onChange={(e) => setCustomBreakTime(e.target.value)} placeholder="Custom" style={{ width: '100%', background: 'transparent', border: 'none', padding: '0 12px', color: '#fff', outline: 'none', fontSize: 13 }} />
                <button onClick={() => handleBreak(customBreakTime)} style={{ padding: '0 12px', background: colors.gold, border: 'none', cursor: 'pointer', color: '#1A120E' }}><Plus size={16} /></button>
              </div>
            </div>
            <button onClick={() => setIsBreakModalOpen(false)} style={{ color: colors.textDim, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Back to Strategy</button>
          </div>
        </div>
      )}

      {/* --- VOTING MODAL --- */}
      {isVoteModalOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInBlur 0.4s forwards' }}>
          <div style={{ width: 500, background: '#1A120E', border: `1px solid ${colors.gold}`, borderRadius: 8, padding: 40, display: 'flex', flexDirection: 'column', gap: 24, boxShadow: `0 0 60px rgba(185, 149, 80, 0.2)`, position: 'relative', animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: 16 }}>
              <h2 className="cinzel-font" style={{ color: colors.gold, margin: 0, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{isVotingInProgress ? "Collecting Ballots..." : "Initiate Vote"}</h2>
              {!isVotingInProgress && <button onClick={() => setIsVoteModalOpen(false)} style={{ background: 'none', border: 'none', color: colors.textDim, cursor: 'pointer' }}><X size={20} /></button>}
            </div>
            {!isVotingInProgress ? (
              <>
                <div><label style={{ color: colors.gold, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8, textTransform: 'uppercase', fontFamily: 'Cinzel' }}>MOTION TOPIC</label><input value={voteTopic} onChange={(e) => setVoteTopic(e.target.value)} style={{ width: '100%', background: colors.bgInput, border: `1px solid ${colors.border}`, color: '#fff', padding: 14, borderRadius: 4, outline: 'none' }} placeholder="e.g. Expand to APAC Market" /></div>
                <div><label style={{ color: colors.gold, fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8, textTransform: 'uppercase', fontFamily: 'Cinzel' }}>DESCRIPTION</label><textarea value={voteDesc} onChange={(e) => setVoteDesc(e.target.value)} style={{ width: '100%', background: colors.bgInput, border: `1px solid ${colors.border}`, color: '#fff', padding: 14, borderRadius: 4, outline: 'none', resize: 'none', height: 80 }} placeholder="Strategic context for the executive board..." /></div>
                <div style={{ display: 'flex', gap: 16 }}><div onClick={() => setIsCustomVote(false)} style={{ flex: 1, padding: 14, border: `1px solid ${!isCustomVote ? colors.gold : colors.border}`, background: !isCustomVote ? 'rgba(185, 149, 80, 0.1)' : 'transparent', borderRadius: 4, cursor: 'pointer', textAlign: 'center', color: !isCustomVote ? colors.gold : colors.textDim, fontSize: 13, fontWeight: 700 }}>YES / NO</div><div onClick={() => setIsCustomVote(true)} style={{ flex: 1, padding: 14, border: `1px solid ${isCustomVote ? colors.gold : colors.border}`, background: isCustomVote ? 'rgba(185, 149, 80, 0.1)' : 'transparent', borderRadius: 4, cursor: 'pointer', textAlign: 'center', color: isCustomVote ? colors.gold : colors.textDim, fontSize: 13, fontWeight: 700 }}>CUSTOM</div></div>
                {isCustomVote && (<div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 4 }}>{customOptions.map((opt, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }}>{opt}<Trash2 size={16} color={colors.danger} style={{ cursor: 'pointer' }} onClick={() => handleRemoveOption(i)} /></div>))}<div style={{ display: 'flex', marginTop: 16, gap: 10 }}><input value={newOptionText} onChange={(e) => setNewOptionText(e.target.value)} placeholder="Add Option..." style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 4, fontSize: 13, outline: 'none' }} /><button onClick={handleAddOption} style={{ background: colors.gold, border: 'none', borderRadius: 4, width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={20} /></button></div></div>)}
                <button onClick={startVotingSequence} className="interactive-hover interactive-press" style={{ width: '100%', padding: 16, background: colors.gold, border: 'none', borderRadius: 4, color: '#1A120E', fontWeight: 800, fontSize: 13, letterSpacing: '0.15em', cursor: 'pointer', marginTop: 10 }}>START VOTE SEQUENCE</button>
              </>
            ) : (
              <div style={{ padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                <div style={{ fontSize: 14, color: colors.textMain }}>Synchronizing AI executive intelligence...</div>
                <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}><div style={{ width: `${votingProgress}%`, height: '100%', background: colors.gold, transition: 'width 0.2s ease-linear' }}></div></div>
                <div style={{ color: colors.gold, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', animation: 'pulse 1s infinite' }}>PROCESSING VOTES...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- RESULTS MODAL --- */}
      {isResultModalOpen && voteResults && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInBlur 0.4s forwards' }}>
          <div style={{ width: 600, background: '#1A120E', border: `1px solid ${colors.gold}`, borderRadius: 12, padding: 50, display: 'flex', flexDirection: 'column', gap: 32, boxShadow: `0 40px 100px rgba(0,0,0,0.9)`, animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={{ textAlign: 'center' }}><div className="cinzel-font" style={{ color: colors.textDim, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 12 }}>Executive Summary</div><h2 className="cinzel-font" style={{ color: '#fff', margin: 0, fontSize: 26 }}>{voteResults.topic}</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{voteResults.options.map((opt, i) => { const count = voteResults.results[opt]; const percent = Math.round((count / voteResults.total) * 100); return (<div key={opt} style={{ animation: `slideInRight 0.5s ease forwards ${i * 0.1}s`, opacity: 0 }}><div style={{ display: 'flex', justifyContent: 'space-between', color: colors.textMain, fontSize: 14, marginBottom: 8 }}><span>{opt}</span><span style={{ color: colors.gold, fontWeight: 700 }}>{percent}% ({count})</span></div><div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${percent}%`, height: '100%', background: opt === 'NOTA' ? colors.danger : colors.gold, borderRadius: 4 }}></div></div></div>); })}</div>
            <button onClick={() => setIsResultModalOpen(false)} style={{ width: '100%', padding: 16, background: 'transparent', border: `1px solid ${colors.gold}`, borderRadius: 4, color: colors.gold, fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: '0.2em' }} className="interactive-hover">RESUME SESSION</button>
          </div>
        </div>
      )}

      {/* --- END SCREEN --- */}
      {isMeetingEnded && (() => {
        const agentMsgs = messages.filter(m => m.type === 'agent');
        const userMsgs = messages.filter(m => m.type === 'me');
        const downloadTranscript = () => {
          const lines = messages.filter(m => m.type !== 'system' || m.sender === 'System').map(m => `[${m.time || '--:--'}] ${m.sender}: ${m.text}`).join('\n');
          const blob = new Blob([`AGIOAS BOARDROOM TRANSCRIPT\n${'='.repeat(40)}\nDate: ${new Date().toLocaleDateString()}\n${'='.repeat(40)}\n\n${lines}`], { type: 'text/plain' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'boardroom_transcript.txt'; a.click();
        };
        const downloadMoM = () => {
          const tasks = agentMsgs.slice(-5).map((m, i) => `${i + 1}. Action from ${m.sender}: "${m.text.substring(0, 100)}"`).join('\n');
          const content = `AGIOAS BOARDROOM - MINUTES OF MEETING\n${'='.repeat(40)}\nDate: ${new Date().toLocaleDateString()}\nReason: ${endReason}\n${'='.repeat(40)}\n\nBOARD MEMBERS\n${boardMembers.map(m => `• ${m.name} (${m.role})`).join('\n')}\n\nDISCUSSION\n${agentMsgs.map(m => `[${m.sender}] ${m.text}`).join('\n\n')}\n\nACTION ITEMS\n${tasks}`;
          const blob = new Blob([content], { type: 'text/plain' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'minutes_of_meeting.txt'; a.click();
        };
        const downloadReport = () => {
          const topSpeakers = boardMembers.sort((a, b) => b.speakCount - a.speakCount).slice(0, 3).map(m => `• ${m.name}: ${m.speakCount} contributions (Conviction: ${m.conviction}%)`).join('\n');
          const content = `AGIOAS BOARDROOM - EXECUTIVE REPORT\n${'='.repeat(40)}\nDate: ${new Date().toLocaleDateString()}\nSession End: ${endReason}\n${'='.repeat(40)}\n\nSTATISTICS\n• Board Responses: ${agentMsgs.length}\n• User Messages: ${userMsgs.length}\n• Total Exchanges: ${messages.length}\n\nTOP CONTRIBUTORS\n${topSpeakers}\n\nKEY HIGHLIGHTS\n${agentMsgs.slice(0, 5).map(m => `[${m.sender}]: ${m.text}`).join('\n\n')}`;
          const blob = new Blob([content], { type: 'text/plain' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'executive_report.txt'; a.click();
        };
        return (
          <div style={{ position: 'absolute', inset: 0, background: '#0F0A08', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 3000 }}>
            <div className="smooth-transition" style={{ width: '100%', maxWidth: 550, background: '#1A120E', border: `1px solid ${colors.border}`, borderRadius: 12, padding: 50, textAlign: 'center', boxShadow: '0 50px 100px rgba(0,0,0,1)', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'scaleIn 0.5s ease' }}>
              <img src="/logo.png" alt="AGIOAS" style={{ width: 48, height: 48, objectFit: 'contain', marginBottom: 24 }} />
              <h1 className="cinzel-font" style={{ color: colors.textMain, fontSize: 32, marginBottom: 12, letterSpacing: '0.1em' }}>SESSION CONCLUDED</h1>
              <div style={{ color: colors.gold, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 40 }}>{endReason}</div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
                <button onClick={downloadMoM} className="interactive-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMain, cursor: 'pointer', fontSize: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><FileText size={18} color={colors.gold} /> Minutes of Meeting (MoM)</div><Download size={16} color={colors.textDim} /></button>
                <button onClick={downloadReport} className="interactive-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMain, cursor: 'pointer', fontSize: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><FileBarChart size={18} color={colors.gold} /> Executive Report & Task List</div><Download size={16} color={colors.textDim} /></button>
                <button onClick={downloadTranscript} className="interactive-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${colors.border}`, borderRadius: 6, color: colors.textMain, cursor: 'pointer', fontSize: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><MessageSquare size={18} color={colors.gold} /> Full Transcript (TXT)</div><Download size={16} color={colors.textDim} /></button>
              </div>
              <button onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', gap: 10, color: colors.textDim, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><RefreshCcw size={14} /> NEW TIMELINE</button>
            </div>
          </div>
        );
      })()}

      {/* --- PAUSE OVERLAY --- */}
      {isPaused && (<div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeInBlur 0.3s forwards' }}><PauseCircle size={64} color={colors.gold} style={{ marginBottom: 20 }} /><h1 className="cinzel-font" style={{ color: colors.textMain, fontSize: 26, letterSpacing: '0.2em' }}>SESSION PAUSED</h1><button onClick={() => setIsPaused(false)} className="interactive-hover" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 40px', background: colors.gold, border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700, color: '#1A120E', letterSpacing: '0.1em' }}><Play size={18} fill="currentColor" /> RESUME</button></div>)}

      {/* --- HEADER --- */}
      <div style={{ height: 70, background: 'rgba(26, 18, 14, 0.95)', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0, backdropFilter: 'blur(12px)', zIndex: 100, boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="AGIOAS" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span className="cinzel-font" style={{ fontSize: 20, fontWeight: 700, color: colors.textMain, letterSpacing: '0.1em' }}>AGIOAS</span>
          </div>
          <div style={{ width: 1, height: 24, background: colors.border }}></div>
          <span style={{ fontSize: 13, color: colors.textDim, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Strategic Command</span>
          {isWsConnected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12, padding: '4px 10px', background: 'rgba(93, 122, 88, 0.1)', border: '1px solid rgba(93, 122, 88, 0.3)', borderRadius: 12 }}>
              <Activity size={12} color={colors.success} />
              <span style={{ fontSize: 10, color: colors.success, fontWeight: 700 }}>AI ONLINE</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: sessionTime < 60 ? colors.danger : colors.textMain }}><Clock size={16} /><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{formatTime(sessionTime)}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: activityTime < 60 ? colors.danger : colors.gold }}><Timer size={16} /><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>{formatTime(activityTime)}</span></div>
          <button onClick={() => setIsConfirmEndOpen(true)} className="interactive-hover interactive-press" style={{ padding: '10px 20px', background: 'rgba(138, 58, 58, 0.1)', border: `1px solid ${colors.danger}`, color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, letterSpacing: '0.1em' }}><PhoneOff size={14} /> END SESSION</button>
        </div>
      </div>

      {/* --- MAIN BODY --- */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* SIDEBAR TOGGLE */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="interactive-hover" style={{ position: 'absolute', top: 20, left: isSidebarOpen ? 285 : 10, zIndex: 100, width: 28, height: 28, borderRadius: '50%', background: colors.gold, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>{isSidebarOpen ? <ChevronLeft size={18} color="#1A120E" /> : <ChevronRight size={18} color="#1A120E" />}</button>

        {/* SIDEBAR */}
        <div className={`smooth-transition ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ background: colors.bgSidebar, borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', backdropFilter: 'blur(10px)', flexShrink: 0, position: 'relative' }}>
          <div className="wood-grain" />

          {/* GRAPHS */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <SidebarGraph title="Risk Analysis" icon={ShieldAlert} color={colors.danger} data={[20, 45, 30, 60, 40, 55, 70]} />
            <SidebarGraph title="Company Velocity" icon={TrendingUp} color={colors.success} data={[10, 20, 35, 30, 50, 65, 85]} />
          </div>

          {/* ACTION BUTTONS (BREAK & PITCH) */}
          <div style={{ padding: '24px 20px', borderBottom: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 2 }}>
            <button onClick={() => setIsBreakModalOpen(true)} className="interactive-hover interactive-press" style={{ width: '100%', padding: '14px', background: 'transparent', border: `1px solid ${colors.gold}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}>
              <Coffee size={18} color={colors.gold} />
              <span className="cinzel-font" style={{ color: colors.gold, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>TAKE A BREAK</span>
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="interactive-hover interactive-press" style={{ flex: 1, padding: '12px', background: 'transparent', border: `1px solid ${colors.gold}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}>
                <PlusSquare size={16} color={colors.gold} />
                <span className="cinzel-font" style={{ color: colors.gold, fontSize: 11, fontWeight: 700 }}>New Pitch</span>
              </button>
              <button className="interactive-hover interactive-press" style={{ width: 44, padding: '12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${colors.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <HelpCircle size={18} color={colors.textDim} />
              </button>
            </div>
          </div>

          {/* AI EXECUTIVE CONFIDENCE */}
          <div className="cinzel-font" style={{ padding: '20px 20px 10px 20px', color: colors.gold, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={14} color={colors.gold} />
            AI Executive Confidence
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px 20px', position: 'relative', zIndex: 2 }}>
            {boardMembers.map(member => {
              const isThinking = typingMemberId === member.id;
              return (
                <div key={member.id} style={{ marginBottom: 24, padding: '12px 0', borderBottom: `1px solid rgba(196, 168, 111, 0.05)`, transition: 'all 0.3s', background: isThinking ? 'rgba(185, 149, 80, 0.05)' : 'transparent', borderRadius: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ position: 'relative', width: 36, height: 36 }}>
                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2.5" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#4A90E2" strokeWidth="2.5" strokeDasharray={`${member.engagement}, 100`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold, fontSize: 10, fontWeight: 800, fontFamily: 'Cinzel' }}>{member.initials}</div>
                      </div>
                      <div style={{ fontSize: 13, color: colors.textMain, fontWeight: 700 }}>{member.name}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <div className="cinzel-font" style={{ fontSize: 9, color: colors.textDim, fontWeight: 700 }}>{member.role}</div>
                      {isThinking && <Zap size={12} color={colors.gold} style={{ animation: 'pulse 1s infinite', marginTop: 4 }} />}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 2, marginBottom: 6 }}>
                    <div style={{ width: `${member.engagement}%`, height: '100%', background: colors.gold, borderRadius: 2, transition: 'width 1.5s ease' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 9, color: colors.textDim, fontWeight: 500 }}>Conviction: <span style={{ color: member.conviction > 70 ? colors.success : member.conviction < 30 ? colors.danger : colors.textMain }}>{member.conviction}%</span></div>
                    <div style={{ fontSize: 10, color: colors.gold, fontWeight: 800, fontFamily: 'Cinzel' }}>{member.engagement}%</div>
                    <div style={{ fontSize: 9, color: colors.textDim, fontWeight: 500 }}>Spoke: <span style={{ color: colors.textMain }}>{member.speakCount}</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VOTE */}
          <div style={{ padding: 24, borderTop: `1px solid ${colors.border}`, position: 'relative', zIndex: 2 }}>
            <button onClick={() => setIsVoteModalOpen(true)} className="interactive-hover interactive-press" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px', background: 'rgba(185, 149, 80, 0.1)', border: `1px solid ${colors.gold}`, color: colors.gold, borderRadius: 4, cursor: 'pointer', fontWeight: 800, fontSize: 12, letterSpacing: '0.15em', fontFamily: 'Cinzel' }}><Vote size={18} /> INITIATE VOTE</button>
          </div>
        </div>

        {/* CHAT FEED */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px 120px 60px', display: 'flex', flexDirection: 'column', gap: 32, zIndex: 1 }}>
            {messages.map((msg) => {
              const isRightSide = msg.type === 'me' || (msg.type === 'agent' && msg.sentiment === 'agree');
              let bubbleBg = colors.darkGlass, bubbleBorder = colors.border;
              if (msg.type === 'me') { bubbleBg = 'rgba(185, 149, 80, 0.1)'; bubbleBorder = colors.gold; }
              else if (msg.sentiment === 'agree') { bubbleBg = colors.bgCard; bubbleBorder = colors.success; }
              else if (msg.sentiment === 'disagree') { bubbleBg = 'rgba(138, 58, 58, 0.05)'; bubbleBorder = colors.danger; }
              const anim = msg.type === 'system' ? 'msgPopIn 0.8s ease' : 'msgPopIn 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

              return (
                <div key={msg.id} style={{ alignSelf: msg.type === 'system' ? 'center' : (isRightSide ? 'flex-end' : 'flex-start'), maxWidth: msg.type === 'system' ? '100%' : '70%', display: 'flex', flexDirection: 'column', alignItems: msg.type === 'system' ? 'center' : (isRightSide ? 'flex-end' : 'flex-start'), animation: anim }}>
                  {msg.type === 'system' && <div className="cinzel-font" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 2, padding: '6px 20px', fontSize: 10, color: colors.gold, border: `1px solid ${colors.border}`, letterSpacing: '0.2em' }}>{msg.text.toUpperCase()}</div>}
                  {msg.type !== 'system' && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexDirection: isRightSide ? 'row-reverse' : 'row' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0F0A08', border: `1px solid ${bubbleBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.gold, fontSize: 12, flexShrink: 0, overflow: 'hidden', boxShadow: `0 8px 20px rgba(0,0,0,0.5)` }}>{msg.type === 'me' ? <img src={USER_PROFILE_IMG} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="cinzel-font" style={{ fontWeight: 800 }}>{msg.initials}</span>}</div>
                        <div className="interactive-hover" style={{ background: bubbleBg, color: colors.textMain, padding: '16px 22px', borderRadius: isRightSide ? '12px 12px 2px 12px' : '12px 12px 12px 2px', fontSize: 15, lineHeight: 1.7, border: `1px solid ${bubbleBorder}`, backdropFilter: 'blur(8px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>
                          <div className="cinzel-font" style={{ fontSize: 11, fontWeight: 800, marginBottom: 8, color: bubbleBorder, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: isRightSide ? 'right' : 'left' }}>{msg.sender}</div>
                          {msg.type === 'agent' ? <TypewriterText text={msg.text} /> : msg.text}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: colors.textDim, marginTop: 10, marginRight: isRightSide ? 60 : 0, marginLeft: isRightSide ? 0 : 60, fontWeight: 600 }}>{msg.time}</div>
                    </>
                  )}
                </div>
              );
            })}
            {typingMemberId && (
              <div style={{
                display: 'flex',
                gap: 12,
                padding: '12px 16px',
                animation: 'msgPopIn 0.3s ease-out',
                background: 'rgba(185, 149, 80, 0.05)', // ✅ Slight highlight
                borderRadius: 8,
                border: `1px solid rgba(185, 149, 80, 0.15)` // ✅ Border for visibility
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: colors.goldGrad,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: colors.textDark,
                  boxShadow: '0 0 20px rgba(185, 149, 80, 0.4)' // ✅ Glow effect
                }}>
                  {boardMembers.find(m => m.id === typingMemberId)?.initials}
                </div>
                <div style={{
                  flex: 1,
                  background: colors.bgCard,
                  borderRadius: 8,
                  padding: '12px 16px',
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: colors.gold,
                        animation: `dotPulse 1.4s infinite ease-in-out ${i * 0.2}s`,
                        boxShadow: '0 0 10px rgba(185, 149, 80, 0.6)' // ✅ Dot glow
                      }} />
                    ))}
                  </div>
                  <span style={{
                    color: colors.textDim,
                    fontSize: 13,
                    fontStyle: 'italic'
                  }}>
                    {boardMembers.find(m => m.id === typingMemberId)?.name} is thinking...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT DOCK */}
          <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 850, zIndex: 10 }}>
            <div className="interactive-hover" style={{ background: colors.bgSidebar, borderRadius: 4, border: isInputFocused ? `1px solid ${colors.gold}` : `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', padding: '12px 12px 12px 24px', backdropFilter: 'blur(20px)', boxShadow: isInputFocused ? `0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px ${colors.goldDim}` : '0 15px 40px rgba(0,0,0,0.6)', transition: 'all 0.4s ease' }}>
              <input
                value={inputText}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isWsConnected ? "Type a strategic directive..." : "Connecting to AI..."}
                disabled={!isWsConnected}
                style={{ flex: 1, background: 'transparent', border: 'none', color: colors.textMain, fontSize: 16, outline: 'none', caretColor: colors.gold, opacity: isWsConnected ? 1 : 0.5 }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="interactive-hover" style={{ padding: 12, background: 'transparent', border: 'none', color: colors.textDim, cursor: 'pointer' }}><Paperclip size={22} /></button>
                <button onClick={handleSendMessage} disabled={!isWsConnected} className="interactive-hover interactive-press" style={{ width: 48, height: 48, borderRadius: 4, background: isWsConnected ? colors.goldGrad : 'rgba(156, 120, 64, 0.3)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isWsConnected ? 'pointer' : 'not-allowed', color: '#1A120E', boxShadow: isWsConnected ? `0 4px 20px rgba(185, 149, 80, 0.4)` : 'none' }}><Send size={20} fill="currentColor" style={{ marginLeft: 3 }} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardroomChat;