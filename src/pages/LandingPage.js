import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';  // ← ADD THIS LINE
import { Canvas } from '@react-three/fiber';
import { useFBX, useAnimations, OrbitControls } from '@react-three/drei';

import {
    ChevronRight, LayoutGrid, Menu, ArrowDown,
    Activity, X, Target, TrendingUp, Users, Crown,
    Layers, Brain, Search, ArrowUpRight, ShieldAlert,
    BrainCircuit, ShieldCheck, Lock,
    Cpu, Fingerprint, ScanEye, Key, Globe,
    Zap, Compass, AlertCircle, Eye, Heart, Scale,
    BarChart, Sparkles, Radio, Signal
} from 'lucide-react';

// =====================================================
// 3D CHARACTER ANIMATION COMPONENT
// =====================================================
const CharacterController = ({ animation }) => {
    const groupRef = useRef();

    // Load the base model and all animations
    const base = useFBX("/motion1.fbx");
    const anim1 = useFBX("/motion1.fbx");
    const anim2 = useFBX("/motion2.fbx");
    const anim3 = useFBX("/motion3.fbx");

    // Remove any lights from the FBX files
    useEffect(() => {
        [base, anim1, anim2, anim3].forEach(model => {
            model.traverse((child) => {
                if (child.isLight) {
                    child.intensity = 0;
                    child.visible = false;
                }
            });
        });
    }, [base, anim1, anim2, anim3]);

    // Combine all animations
    const allAnimations = useMemo(() => {
        const animations = [];
        const addClip = (animObj, name) => {
            if (animObj.animations && animObj.animations[0]) {
                const clip = animObj.animations[0].clone();
                clip.name = name;
                animations.push(clip);
            }
        };
        addClip(anim1, "Motion1");
        addClip(anim2, "Motion2");
        addClip(anim3, "Motion3");
        return animations;
    }, [anim1, anim2, anim3]);

    const { actions } = useAnimations(allAnimations, groupRef);

    // Handle animation changes
    useEffect(() => {
        if (actions && animation) {
            Object.values(actions).forEach(a => a?.fadeOut(0.5));
            actions[animation]?.reset().fadeIn(0.5).play();
        }
    }, [animation, actions]);

    return (
        <group ref={groupRef} position={[0, -1.3, 0]} scale={0.011} rotation={[0.15, 0, 0]}>
            <primitive object={base} />
        </group>
    );
};

// Animation Scene with Canvas
const AnimationScene = () => {
    const [currentAnimation, setCurrentAnimation] = useState("Motion1");
    const animationSequence = ["Motion1", "Motion2", "Motion3"];
    const currentIndexRef = useRef(0);

    // Cycle through animations
    useEffect(() => {
        const interval = setInterval(() => {
            currentIndexRef.current = (currentIndexRef.current + 1) % animationSequence.length;
            setCurrentAnimation(animationSequence[currentIndexRef.current]);
        }, 5000); // Change animation every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Reset animation when component becomes visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentIndexRef.current = 0;
                        setCurrentAnimation("Motion1");
                    }
                });
            },
            { threshold: 0.3 }
        );

        const element = document.getElementById('animation-container');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            id="animation-container"
            style={{
                width: '350px',
                height: '500px',
                position: 'relative',
                borderRadius: '0',
                overflow: 'visible'
            }}
        >
            <Canvas
                camera={{ position: [0, 0.5, 3.5], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1.2} color="#ffffff" />
                    <directionalLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" castShadow />
                    <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#ffffff" />
                    <spotLight position={[0, 10, 0]} intensity={0.6} angle={0.6} penumbra={1} color="#ffffff" />

                    <CharacterController animation={currentAnimation} />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 2}
                        autoRotate={false}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

// =====================================================
// GLOBAL THEME & ANIMATIONS
// =====================================================
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Crimson+Text:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600;6..96,700;6..96,800;6..96,900&family=Cinzel:wght@400;500;600;700;800;900&family=Libre+Baskerville:wght@400;700&family=EB+Garamond:wght@400;500;600;700;800&family=Spectral:wght@200;300;400;500;600;700;800&display=swap');

  :root {
    --bg-app: #1c1410;
    --bg-sidebar: #1b110d;
    --bg-card: #1e1610;
    --bg-input: #0c0908;
    --bg-glass: rgba(29, 21, 16, 0.85);
    --bg-core: #0F0A08;
    --bg-panel: #120C08;
    
    --text-primary: #E8E0D5;
    --text-secondary: #957443;
    --text-tertiary: #a67c2e;
    --text-muted: #6B7280;
    
    --gold-dim: #ac8042;
    --gold-mid: #b99550;
    --gold-bright: #ffcd5a;
    --gold-primary: #C4A86F;
    --gold-grad: linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%);
    --gold-border: rgba(196, 168, 111, 0.2);
    --gold-glow: 0 0 25px rgba(29, 21, 16, 0.9);
    
    --accent-blue: #4F6170;
    --accent-red: #8A3A3A;
    --accent-green: #5D7A58;
    
    --ease-luxury: cubic-bezier(0.25, 1, 0.5, 1);
    --ease-elegant: cubic-bezier(0.25, 1, 0.5, 1);
    
    --font-display: 'Cormorant Garamond', serif;
    --font-playfair: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-elegant: 'Crimson Text', serif;
    --font-premium: 'Bodoni Moda', serif;
    --font-luxury: 'Cinzel', serif;
    --font-classic: 'Libre Baskerville', serif;
    --font-refined: 'EB Garamond', serif;
    --font-editorial: 'Spectral', serif;
  }

  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
  
  /* THEMED SCROLLBAR */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bg-core);
    border-left: 1px solid var(--gold-border);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--gold-dim) 0%, var(--gold-mid) 100%);
    border-radius: 10px;
    border: 2px solid var(--bg-core);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, var(--gold-mid) 0%, var(--gold-bright) 100%);
  }
  
  body { 
    margin: 0; 
    background: linear-gradient(180deg, #0a0705 0%, #1c1410 50%, #0a0705 100%);
    background-attachment: fixed;
    font-family: var(--font-body); 
    color: var(--text-primary);
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  /* === STICKY NAVBAR === */
  .sticky-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(28, 20, 16, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--gold-border);
    padding: 12px 4vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transform: translateY(-100%);
    transition: transform 0.4s var(--ease-luxury);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }

  .sticky-nav.visible {
    transform: translateY(0);
  }

  .sticky-nav .logo {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: var(--gold-mid);
    font-family: serif;
  }

  .sticky-nav .nav-links {
    display: flex;
    gap: 32px;
  }

  .sticky-nav .nav-link {
    font-size: 10px;
  }

  .sticky-nav .button-container {
    display: flex;
    gap: 10px;
  }

  .sticky-nav .icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--gold-border);
    background: rgba(255,255,255,0.02);
    color: var(--gold-mid);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .sticky-nav .icon-btn:hover {
    background: rgba(212, 175, 104, 0.1);
    border-color: var(--gold-mid);
  }

  .sticky-nav .pill-btn {
    background: var(--gold-grad);
    color: #1a120e;
    border: none;
    border-radius: 8px;
    padding: 0 20px;
    height: 36px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* === ANIMATIONS === */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInUp { 
    from { 
      opacity: 0; 
      transform: translateY(60px) scale(0.95); 
    } 
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    } 
  }
  @keyframes drawLine { to { stroke-dashoffset: 0; } }
  @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes float-medium { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes scan-vertical { 0% { top: 5%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 95%; opacity: 0; } }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes blink { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; text-shadow: 0 0 10px var(--gold-mid); } }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 5px rgba(196, 168, 111, 0.3); }
    50% { box-shadow: 0 0 20px rgba(196, 168, 111, 0.6); }
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .animate-on-scroll {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s var(--ease-luxury), transform 0.8s var(--ease-luxury);
  }

  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
  @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
  @keyframes slideDown { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 10px var(--gold-dim); } 50% { box-shadow: 0 0 20px var(--gold-bright); } }
  @keyframes slide-left { from { transform: translateX(10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes scale-up { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
  @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes ping { 0% { transform: scale(1); opacity: 1; } 75%, 100% { transform: scale(2); opacity: 0; } }
  @keyframes footer-slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes footer-fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes icon-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
  @keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
  @keyframes rotateIn { from { opacity: 0; transform: rotate(-10deg) scale(0.9); } to { opacity: 1; transform: rotate(0deg) scale(1); } }
  @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
  @keyframes slideInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 20px rgba(196, 168, 111, 0.3); } 50% { box-shadow: 0 0 40px rgba(196, 168, 111, 0.6); } }
  @keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }

  /* === SCROLL INDICATOR === */
  .scroll-indicator {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    animation: bounce 2s infinite;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  .scroll-indicator:hover {
    opacity: 0.7;
  }

  /* === NAV LINK STYLES === */
  .nav-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: color 0.3s ease;
    cursor: pointer;
  }

  .nav-link:hover {
    color: var(--gold-bright);
  }

  /* === IMAGE POSITIONING === */
  #img1-executive {
    position: absolute;
    top: 150px;
    left: 100px;
    width: 280px;
    transform: rotate(-10deg);
    height: 165px;
    object-fit: cover;
    border: 1px solid var(--gold-border);
    border-radius: 8px;
    transition: transform 0.4s ease;
    z-index: 5;
  }

  #img2-architecture {
    position: absolute;
    top: 120px;
    transform: rotate(10deg);
    right: 700px;
    width: 220px;
    height: 200px;
    object-fit: cover;
    border: 1px solid var(--gold-border);
    border-radius: 8px;
    transition: transform 0.4s ease;
    z-index: 5;
  }

  #img3-professional {
    position: absolute;
    bottom: 200px;
    left: 100px;
    width: 285px;
    transform: rotate(-5deg);
    height: 155px;
    object-fit: cover;
    border: 1px solid var(--gold-border);
    border-radius: 8px;
    transition: transform 0.4s ease;
    z-index: 5;
  }

  #img4-luxury {
    position: absolute;
    bottom: 250px;
    right: 150px;
    transform: rotate(5deg);
    width: 340px;
    top: 150px;
    height: 180px;
    object-fit: cover;
    border: 1px solid var(--gold-border);
    border-radius: 8px;
    transition: transform 0.4s ease;
    z-index: 5;
  }

  #img1-executive:hover, #img2-architecture:hover, #img3-professional:hover, #img4-luxury:hover {
    transform: scale(1.05);
    border-color: var(--gold-mid);
    box-shadow: 0 0 15px rgba(185, 149, 80, 0.3);
  }

  /* === CARDS & UTILITIES === */
  .fade-in { 
    animation: fadeIn 1s var(--ease-elegant) forwards; 
    opacity: 0; 
  }

  .card-premium { 
    background: var(--bg-card); 
    border: 1px solid rgba(255,255,255,0.03);
    outline: 1px solid rgba(0,0,0,0.4);
    box-shadow: 
        0 1px 0 rgba(255,255,255,0.05) inset, 
        0 20px 40px -10px rgba(0,0,0,0.8);
    border-radius: 12px; 
    position: relative;
    overflow: hidden;
  }

  .number-badge {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--gold-dim);
    color: #1A120E;
    font-size: 11px;
    font-weight: 700;
    display: flex; 
    align-items: center; 
    justify-content: center;
    box-shadow: var(--gold-glow);
    font-family: var(--font-body);
    border: 1px solid var(--gold-bright);
  }

  .step-visual-container {
    height: 220px;
    width: 100%;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin: 24px 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--gold-border);
    overflow: hidden;
    box-shadow: inset 0 0 40px rgba(0,0,0,0.6);
  }

  /* === DASHBOARD STYLES === */
  .page-container {
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    width: 100%; 
    min-height: 100vh;
    padding: 100px 0 100px 0; 
    gap: 320px;
    background: radial-gradient(circle at 50% -20%, #2a1d16 0%, #080504 70%);
  }
   .feature1 {
    position: absolute;
    height: 180px;
    width: 400px;
    top: 2275px;
    right:41%;
    /* Add these */
    z-index: 299; 
    pointer-events: none; /* Optional: allows you to click things underneath it */
}
    .feature2 {
    position: absolute;
    height: 180px;
    width: 200px;
    top: 4800px;
  left:15%;
    /* Add these */
    z-index: 299; 
    pointer-events: none; /* Optional: allows you to click things underneath it */
}
    .feature3 {
    position: absolute;
    height: 220px;
    width: 370px;
    top: 3950px;
    border-radius:20px;
  left:11%;
    /* Add these */
    z-index: 299; 
    pointer-events: none; /* Optional: allows you to click things underneath it */
}
.chator3d {
    position: absolute;
    height: 40px;
    width: 250px;
    top: 2255px;
    right:20%;
    /* Add these */
    z-index: 299; 
    pointer-events: none; /* Optional: allows you to click things underneath it */
}
    .chator3d2 {
    position: absolute;
    height: 40px;
    width: 250px;
    top: 4935px;
    right:22%;
    /* Add these */
    z-index: 299; 
    pointer-events: none; /* Optional: allows you to click things underneath it */
}
 .chator3d3 {
    position: absolute;
    height: 40px;
    width: 250px;
    top: 4170px;
    right:22%;
    /* Add these */
    z-index: 299; 
    pointer-events: none; /* Optional: allows you to click things underneath it */
}

  .executive-widget {
    position: relative; 
    width: 1100px; 
    min-height: 250px;
    background: linear-gradient(180deg, rgba(20, 13, 10, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
    border: 1px solid rgba(196, 168, 111, 0.15);
    border-top: 1px solid rgba(196, 168, 111, 0.3);
    border-radius: 12px;
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.9);
    display: flex; 
    flex-direction: column;
    padding: 24px 32px; 
    gap: 20px;
    opacity: 0; 
    animation: fadeUp 0.8s var(--ease-luxury) forwards;
  }

  /* Decorative corner accents */
  .executive-widget::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 60px;
    height: 60px;
    border-top: 2px solid var(--gold-mid);
    border-left: 2px solid var(--gold-mid);
    border-radius: 12px 0 0 0;
    opacity: 0.6;
  }

  .executive-widget::after {
    content: '';
    position: absolute;
    bottom: -1px;
    right: -1px;
    width: 60px;
    height: 60px;
    border-bottom: 2px solid var(--gold-mid);
    border-right: 2px solid var(--gold-mid);
    border-radius: 0 0 12px 0;
    opacity: 0.6;
  }

  .widget-header {
    display: flex; 
    justify-content: space-between; 
    align-items: flex-end;
    padding-bottom: 12px; 
    border-bottom: 1px solid rgba(196, 168, 111, 0.1);
  }

  .main-title { 
    font-family: var(--font-display); 
    font-size: 24px; 
    font-weight: 600; 
    color: var(--text-primary); 
    margin: 0;
    background: linear-gradient(90deg, #F0EAD6 0%, #C4A86F 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    animation: fadeInLeft 0.8s var(--ease-luxury) forwards;
  }

  .main-desc { 
    font-size: 10px; 
    color: var(--text-muted); 
    margin-top: 4px; 
    text-transform: uppercase; 
    letter-spacing: 0.05em;
    animation: fadeInLeft 1s var(--ease-luxury) forwards; 
  }

  .content-row {
    display: flex; 
    gap: 12px;
    flex: 1;
    overflow: visible;
  }

  .image-frame {
    flex: 1; 
    min-height: 450px;
    position: relative;
    border-radius: 6px; 
    overflow: hidden;
    border: 1px solid rgba(196, 168, 111, 0.1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    animation: fadeInLeft 1s var(--ease-luxury) forwards;
  }

  .clean-image {
    width: 100%; 
    height: 400px; 
    object-fit: cover; 
    opacity: 0.8;
    transition: transform 3s var(--ease-luxury);
  }

  .image-frame:hover .clean-image { 
    transform: scale(1.05); 
    opacity: 1; 
  }

  .features-overlay {
    position: absolute; 
    bottom: 20px; 
    right: -10px;
    display: flex; 
    flex-direction: column; 
    gap: 1px;
    z-index: 10;
  }

  .feature-card {
    width: 240px; 
    height:50px;
    padding: 2px 6px;
    background: rgba(18, 12, 8, 0.95);
    border: 1px solid rgba(196, 168, 111, 0.2); 
    border-left: 3px solid #C4A86F;
    border-radius: 4px; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    display: flex; 
    align-items: center; 
    gap: 12px; 
    backdrop-filter: blur(8px);
    transition: all 0.3s; 
    cursor: pointer;
    animation: fadeInRight 0.8s var(--ease-luxury) forwards;
  }

  .feature-card:nth-child(1) { animation-delay: 0.2s; }
  .feature-card:nth-child(2) { animation-delay: 0.3s; }
  .feature-card:nth-child(3) { animation-delay: 0.4s; }

  .feature-card:hover { 
    transform: translateX(-8px); 
    border-color: #F0EAD6;
    box-shadow: 0 15px 40px rgba(196, 168, 111, 0.3);
  }

  .feat-icon { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    opacity: 0.8; 
  }

  .feat-text { 
    display: flex; 
    flex-direction: column; 
  }

  .feat-title { 
    font-family: var(--font-display); 
    font-size: 12px; 
    font-weight: 700; 
    color: #F0EAD6; 
  }

  .feat-sub { 
    font-size: 9px; 
    color: #8a7030; 
    text-transform: uppercase; 
    margin-top: 2px; 
  }

  .hud-panel {
    width: 380px; 
    min-height: 450px;
    flex-shrink: 0;
    background: var(--bg-panel);
    border: 1px solid var(--gold-border);
    border-radius: 6px;
    display: flex; 
    flex-direction: column; 
    overflow: hidden;
    animation: fadeInRight 1s var(--ease-luxury) forwards;
  }

  .stats-header-row {
    display: flex; 
    justify-content: space-between; 
    padding: 18px 24px 12px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }

  .stat-col { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 4px; 
  }

  .stat-label { 
    font-size: 9px; 
    color: #887766; 
    text-transform: uppercase; 
  }

  .stat-val { 
    font-family: var(--font-display); 
    font-size: 15px; 
    color: var(--gold-primary); 
    font-weight: 700; 
  }

  .graph-container {
    padding: 20px 24px; 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    justify-content: space-evenly;
  }

  .graph-title-row { 
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 8px; 
    align-items: center; 
  }

  .graph-title { 
    font-family: var(--font-display); 
    font-size: 11px; 
    font-weight: 700; 
    color: #F0EAD6; 
    letter-spacing: 0.05em; 
  }

  .graph-status { 
    font-size: 10px; 
    font-weight: 600; 
  }

  .graph-svg-area { 
    width: 100%; 
    height: 50px; 
    position: relative; 
    overflow: hidden; 
    border-bottom: 1px solid rgba(255,255,255,0.05); 
  }

  .exec-header {
    padding: 14px 20px; 
    border-bottom: 1px solid var(--gold-border);
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    background: linear-gradient(90deg, rgba(62, 47, 24, 0.2) 0%, transparent 100%);
  }

  .exec-header-title { 
    font-family: var(--font-display); 
    font-size: 11px; 
    font-weight: 700; 
    color: var(--gold-primary); 
    letter-spacing: 0.1em; 
  }

  .scroll-content { 
    flex: 1; 
    overflow-y: auto; 
    padding: 0 20px 20px 20px; 
  }

  .scroll-content::-webkit-scrollbar { 
    width: 4px; 
  }
  
  .scroll-content::-webkit-scrollbar-thumb { 
    background: var(--gold-dim); 
    border-radius: 2px; 
  }

  .exec-item {
    padding: 12px 6px; 
    border-bottom: 1px solid rgba(62, 47, 24, 0.3);
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    animation: fadeIn 0.6s var(--ease-luxury) forwards;
    opacity: 0;
  }

  .exec-item:nth-child(1) { animation-delay: 0.1s; }
  .exec-item:nth-child(2) { animation-delay: 0.2s; }
  .exec-item:nth-child(3) { animation-delay: 0.3s; }
  .exec-item:nth-child(4) { animation-delay: 0.4s; }
  .exec-item:nth-child(5) { animation-delay: 0.5s; }

  .exec-name { 
    font-family: var(--font-display); 
    font-size: 13px; 
    font-weight: 700; 
    color: #F0EAD6; 
  }

  .exec-role { 
    font-size: 9px; 
    font-weight: 600; 
    color: #8a7030; 
    text-transform: uppercase; 
    margin-top: 2px; 
  }

  .exec-score { 
    font-family: var(--font-display); 
    font-size: 13px; 
    font-weight: 700; 
    color: var(--gold-primary); 
  }

  .gold-card {
    margin-top: 14px; 
    border: 1px solid var(--gold-dim);
    border-radius: 6px; 
    padding: 14px;
    background: rgba(138, 112, 48, 0.05);
    animation: fadeIn 0.8s var(--ease-luxury) forwards;
    opacity: 0;
  }

  .card-title-row { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    margin-bottom: 10px; 
  }

  .card-title { 
    font-family: var(--font-display); 
    font-size: 10px; 
    font-weight: 700; 
    color: var(--gold-primary); 
    letter-spacing: 0.1em; 
  }

  .pitch-val-row { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
  }

  .pitch-num { 
    font-family: var(--font-display); 
    font-size: 18px; 
    font-weight: 700; 
    color: var(--gold-primary); 
  }

  .progress-bg { 
    width: 100%; 
    height: 7px; 
    background: rgba(255,255,255,0.05); 
    border-radius: 3px; 
    overflow: hidden; 
  }

  .curve-container { 
    height: 40px; 
    width: 100%; 
    position: relative; 
    margin-top: 4px; 
  }

  .axis-row { 
    display: flex; 
    justify-content: space-between; 
    margin-top: 4px; 
  }

  .axis-label { 
    font-size: 7px; 
    color: var(--gold-dim); 
    text-transform: uppercase; 
    font-weight: 700; 
  }

  .path-draw { 
    stroke-dasharray: 200; 
    stroke-dashoffset: 200; 
    animation: drawLine 2s ease-out forwards 0.5s; 
  }

  /* === CEO & CUSTOMER SPECIFIC STYLES === */
  .metric-card {
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--gold-border);
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 12px;
    animation: slide-left 0.6s var(--ease-luxury) forwards;
    opacity: 0;
    transition: all 0.3s ease;
  }

  .metric-card:hover {
    background: rgba(0,0,0,0.5);
    border-color: var(--gold-mid);
    transform: translateX(-5px);
  }

  .metric-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .metric-label {
    font-family: var(--font-display);
    font-size: 10px;
    font-weight: 700;
    color: var(--gold-primary);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .metric-value {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    color: var(--gold-bright);
    text-align: center;
    margin: 10px 0;
  }

  .progress-bar {
    width: 100%;
    height: 7px;
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: var(--gold-grad);
    border-radius: 3px;
    transition: width 2s var(--ease-luxury);
    box-shadow: 0 0 10px var(--gold-dim);
    position: relative;
    overflow: hidden;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  .radar-chart {
    width: 100%;
    height: 160px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 90px;
    gap: 10px;
    padding: 12px 0;
  }

  .bar {
    flex: 1;
    background: linear-gradient(to top, var(--gold-dim), var(--gold-bright));
    border-radius: 3px 3px 0 0;
    transition: all 0.6s var(--ease-luxury);
    animation: scale-up 0.8s var(--ease-luxury) forwards;
    position: relative;
    cursor: pointer;
  }

  .bar::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: var(--gold-bright);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .bar:hover {
    background: linear-gradient(to top, var(--gold-bright), var(--gold-bright));
    transform: scaleY(1.15);
  }

  .bar:hover::after {
    opacity: 1;
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .matrix-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 5px;
    padding: 12px;
  }

  .matrix-cell {
    aspect-ratio: 1;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 3px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .matrix-cell:hover {
    background: rgba(196,168,111,0.2);
    transform: scale(1.1);
  }

  .matrix-cell.active {
    background: var(--gold-dim);
    box-shadow: 0 0 15px var(--gold-dim);
    animation: glow-pulse 2s infinite;
  }

  .wave-chart {
    width: 100%;
    height: 70px;
    position: relative;
  }

  .polarity-slider {
    width: 100%;
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }

  .polarity-track {
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-red) 0%, var(--gold-dim) 50%, var(--accent-green) 100%);
    position: relative;
    border-radius: 2px;
  }

  .polarity-marker {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--gold-bright);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px var(--gold-bright);
    animation: glow-pulse 2s infinite;
  }

  .polarity-marker::after {
    content: '';
    position: absolute;
    inset: -5px;
    border: 2px solid var(--gold-bright);
    border-radius: 50%;
    opacity: 0.5;
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .polarity-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 8px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    font-weight: 700;
  }

  /* Floating particles effect */
  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--gold-dim);
    border-radius: 50%;
    opacity: 0.4;
    animation: float-particle 10s infinite;
  }

  @keyframes float-particle {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
    10% { opacity: 0.4; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
  }

  /* Status indicators */
  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border: 1px solid var(--gold-dim);
    border-radius: 3px;
    font-size: 9px;
    color: var(--gold-primary);
    background: rgba(196, 168, 111, 0.05);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--gold-bright);
    box-shadow: 0 0 8px var(--gold-bright);
    animation: glow-pulse 2s infinite;
  }

  /* === SECTION TRANSITIONS === */
  section {
    min-height: 100vh;
    position: relative;
    opacity: 0;
    animation: fadeIn 1s ease-out forwards;
  }

  section:nth-child(1) { animation-delay: 0s; }
  section:nth-child(2) { animation-delay: 0.2s; }
  section:nth-child(3) { animation-delay: 0.4s; }

  /* === PREMIUM FEATURES GRID === */
  .features-section {
    padding: 150px 4vw;
    background: linear-gradient(180deg, var(--bg-core) 0%, var(--bg-panel) 100%);
    position: relative;
    margin-top: 100px;
    backdrop-filter: blur(10px);
  }

  .features-section::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(196, 168, 111, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }

  .features-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-border) 50%, transparent 100%);
  }

  .features-container {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .features-header {
    text-align: center;
    margin-bottom: 80px;
    animation: fadeUp 1s ease-out;
  }

  .features-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--gold-mid);
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .features-title {
    font-family: var(--font-display);
    font-size: 52px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--text-primary);
    margin-bottom: 12px;
    background: var(--gold-grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    white-space: nowrap;
    line-height: 1.2;
  }

  .features-subtitle {
    font-size: 15.5px;
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.7;
    font-weight: 400;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 50px;
  }

  .feature-card {
    background: linear-gradient(135deg, rgba(30, 22, 16, 0.6) 0%, rgba(18, 12, 8, 0.8) 100%);
    border: 1px solid var(--gold-border);
    border-radius: 10px;
    padding: 20px 18px;
    position: relative;
    overflow: hidden;
    transition: all 0.4s var(--ease-luxury);
    animation: fadeUp 1s ease-out both;
    min-height: 10px;
    box-shadow: inset 0 1px 0 rgba(196, 168, 111, 0.05);
  }

  .feature-card:nth-child(1) { animation-delay: 0.1s; }
  .feature-card:nth-child(2) { animation-delay: 0.2s; }
  .feature-card:nth-child(3) { animation-delay: 0.3s; }
  .feature-card:nth-child(4) { animation-delay: 0.4s; }
  .feature-card:nth-child(5) { animation-delay: 0.5s; }
  .feature-card:nth-child(6) { animation-delay: 0.6s; }
  .feature-card:nth-child(7) { animation-delay: 0.7s; }
  .feature-card:nth-child(8) { animation-delay: 0.8s; }
  .feature-card:nth-child(9) { animation-delay: 0.9s; }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-mid) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .feature-card:hover {
    transform: translateY(-6px);
    border-color: var(--gold-mid);
    background: linear-gradient(135deg, rgba(30, 22, 16, 0.85) 0%, rgba(18, 12, 8, 1) 100%);
    box-shadow: 0 16px 48px rgba(196, 168, 111, 0.2), 0 0 1px rgba(196, 168, 111, 0.5);
  }

  .feature-card:hover::before {
    opacity: 1;
  }

  .feature-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--gold-border);
    background: rgba(196, 168, 111, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
  }

  .feature-icon-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold-grad);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .feature-card:hover .feature-icon-wrapper {
    background: rgba(196, 168, 111, 0.1);
    border-color: var(--gold-mid);
    transform: scale(1.05);
  }

  .feature-card:hover .feature-icon-wrapper::before {
    opacity: 0.1;
  }

  .feature-icon-wrapper svg {
    position: relative;
    z-index: 1;
    color: var(--gold-mid);
    transition: all 0.3s ease;
    width: 20px;
    height: 20px;
  }

  .feature-card:hover .feature-icon-wrapper svg {
    color: var(--gold-bright);
    transform: scale(1.1);
  }

  .feature-content h3 {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
    letter-spacing: 0.02em;
    line-height: 1.3;
  }

  .feature-content p {
    font-size: 12.5px;
    line-height: 1.6;
    color: var(--text-secondary);
    margin: 0;
    font-weight: 400;
  }

  .feature-highlight {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    background: linear-gradient(135deg, rgba(30, 22, 16, 0.6) 0%, rgba(18, 12, 8, 0.8) 100%);
    border: 1px solid var(--gold-border);
    border-radius: 12px;
    padding: 36px;
    animation: fadeUp 1s ease-out 1s both;
    position: relative;
    overflow: hidden;
  }

  .feature-highlight::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-mid) 50%, transparent 100%);
  }

  .highlight-content h3 {
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
    letter-spacing: 0.01em;
    background: var(--gold-grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.3;
  }

  .highlight-content p {
    font-size: 15px;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .highlight-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(196, 168, 111, 0.08);
    border: 1px solid var(--gold-border);
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--gold-mid);
    text-transform: uppercase;
  }

  .highlight-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .strategic-radar {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .radar-label-top {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--gold-mid);
    text-align: center;
  }

  .radar-subtitle {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
    text-align: center;
    margin-top: -15px;
  }

  .radar-svg {
    filter: drop-shadow(0 4px 20px rgba(196, 168, 111, 0.15));
  }

  .radar-labels {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .radar-label {
    position: absolute;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: var(--text-secondary);
  }

  .radar-polarity {
    width: 100%;
    max-width: 300px;
  }

  .polarity-labels-radar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
  }

  .polarity-center {
    color: var(--gold-mid);
  }

  .polarity-track-radar {
    height: 6px;
    background: rgba(196, 168, 111, 0.1);
    border-radius: 10px;
    position: relative;
    border: 1px solid var(--gold-border);
  }

  .polarity-fill-radar {
    height: 100%;
    width: 65%;
    background: var(--gold-grad);
    border-radius: 10px;
    transition: width 0.6s ease;
  }

  .polarity-marker-radar {
    position: absolute;
    right: 35%;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: var(--gold-bright);
    border-radius: 50%;
    border: 2px solid var(--bg-panel);
    box-shadow: 0 0 10px rgba(255, 205, 90, 0.6);
    animation: pulse-ring 2s ease-in-out infinite;
  }

  .highlight-orbs {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    align-items: center;
  }

  .orb {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(196, 168, 111, 0.3), rgba(196, 168, 111, 0.05));
    border: 1px solid var(--gold-border);
    position: relative;
    animation: float-slow 4s ease-in-out infinite;
  }

  .orb:nth-child(1) { animation-delay: 0s; }
  .orb:nth-child(2) { animation-delay: 0.5s; }
  .orb:nth-child(3) { animation-delay: 1s; }
  .orb:nth-child(4) { animation-delay: 1.5s; }
  .orb:nth-child(5) { animation-delay: 2s; }
  .orb:nth-child(6) { animation-delay: 2.5s; }

  .orb::before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 205, 90, 0.2), transparent);
    animation: pulse-ring 3s ease-in-out infinite;
  }

  /* Features Responsive */
  @media (max-width: 1024px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .feature-highlight {
      grid-template-columns: 1fr;
    }

    .highlight-orbs {
      grid-template-columns: repeat(3, 1fr);
      height: 200px;
    }
  }

  @media (max-width: 768px) {
    .features-section {
      padding: 100px 6vw;
      margin-top: 60px;
    }

    .features-title {
      font-size: 32px;
      white-space: normal;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .feature-card {
      padding: 24px;
    }

    .feature-highlight {
      padding: 24px;
    }

    .highlight-orbs {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* === SECURITY FEATURES SECTION === */
  .security-features-section {
  margin-top: 100px;
    padding: 60px 4vw;
    background: linear-gradient(180deg, var(--bg-core) 0%, #0a0605 100%);
    position: relative;
  }

  .security-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .security-header {
    text-align: center;
    margin-bottom: 50px;
  }

  .security-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    background: rgba(196, 168, 111, 0.1);
    border: 1px solid var(--gold-border);
    border-radius: 50px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--gold-mid);
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .security-title {
    font-family: var(--font-playfair);
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #E8E0D5 0%, #C4A86F 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12px;
  }

  .security-subtitle {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  .security-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .security-card {
    background: rgba(30, 22, 16, 0.6);
    border: 1px solid var(--gold-border);
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
    transition: all 0.5s var(--ease-luxury);
    position: relative;
  }

  .security-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(196, 168, 111, 0.1), transparent);
    transition: left 0.6s ease;
  }

  .security-card:hover::before {
    left: 100%;
  }

  .security-card:hover {
    transform: translateY(-6px);
    border-color: var(--gold-mid);
    box-shadow: 0 15px 40px rgba(196, 168, 111, 0.2);
  }

  .security-card-visual {
    height: 140px;
    background: linear-gradient(135deg, #1a120e 0%, #0f0a08 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--gold-border);
  }

  .security-card-visual::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(196, 168, 111, 0.1) 0%, transparent 70%);
  }

  .security-visual-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .security-card-content {
    padding: 20px;
  }

  .security-card-title {
    font-family: var(--font-playfair);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .security-card-description {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-secondary);
  }

  /* Radar Visual */
  .security-radar {
    width: 100px;
    height: 100px;
    position: relative;
  }

  .radar-circle {
    position: absolute;
    border: 1px solid var(--gold-border);
    border-radius: 50%;
    opacity: 0.3;
  }

  .radar-circle:nth-child(1) { width: 100px; height: 100px; top: 0; left: 0; }
  .radar-circle:nth-child(2) { width: 70px; height: 70px; top: 15px; left: 15px; opacity: 0.5; }
  .radar-circle:nth-child(3) { width: 40px; height: 40px; top: 30px; left: 30px; opacity: 0.7; }

  .radar-center {
    position: absolute;
    width: 16px;
    height: 16px;
    background: var(--gold-grad);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px rgba(196, 168, 111, 0.6);
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .radar-line {
    position: absolute;
    width: 1px;
    height: 50px;
    background: linear-gradient(to bottom, var(--gold-mid), transparent);
    top: 50%;
    left: 50%;
    transform-origin: bottom center;
    animation: radar-sweep 4s linear infinite;
  }

  @keyframes radar-sweep {
    from { transform: translate(-50%, -100%) rotate(0deg); }
    to { transform: translate(-50%, -100%) rotate(360deg); }
  }

  /* Domain Visual */
  .security-domains {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .domain-item {
    background: rgba(196, 168, 111, 0.05);
    border: 1px solid var(--gold-border);
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 11px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .domain-icon {
    width: 18px;
    height: 18px;
    background: var(--gold-grad);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a120e;
    font-size: 9px;
    font-weight: 700;
  }

  /* Permissions Visual */
  .security-permissions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .permission-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .permission-checkbox {
    width: 16px;
    height: 16px;
    border: 2px solid var(--gold-mid);
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(196, 168, 111, 0.1);
  }

  .permission-checkbox svg {
    color: var(--gold-bright);
  }

  .permission-text {
    font-size: 11px;
    color: var(--text-secondary);
  }

  /* Access Control Visual */
  .security-access {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .access-user {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(196, 168, 111, 0.05);
    border: 1px solid var(--gold-border);
    border-radius: 6px;
    padding: 8px 10px;
  }

  .access-avatar {
    width: 24px;
    height: 24px;
    background: var(--gold-grad);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a120e;
    font-size: 10px;
    font-weight: 700;
  }

  .access-info {
    flex: 1;
  }

  .access-email {
    font-size: 10px;
    color: var(--text-primary);
    font-family: var(--font-mono);
  }

  .access-role {
    font-size: 8px;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Projects Visual */
  .security-projects {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .project-folder {
    background: rgba(196, 168, 111, 0.05);
    border: 1px solid var(--gold-border);
    border-radius: 6px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .project-icon {
    color: var(--gold-mid);
  }

  .project-name {
    font-size: 11px;
    color: var(--text-primary);
    font-weight: 500;
  }

  /* Deployment Visual */
  .security-deployment {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .deployment-step {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .step-indicator {
    width: 20px;
    height: 20px;
    background: var(--gold-grad);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a120e;
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-text {
    font-size: 10px;
    color: var(--text-secondary);
  }

  .step-success {
    color: var(--gold-mid);
    font-weight: 600;
  }

  @media (max-width: 968px) {
    .security-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  /* === PREMIUM FOOTER === */
  .premium-footer {
    background: linear-gradient(180deg, rgba(12, 9, 8, 0.5) 0%, #0c0908 100%);
    border-top: 1px solid var(--gold-border);
    padding: 80px 4vw 0;
    margin-top: 80px;
    position: relative;
    overflow: hidden;
  }

  .premium-footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-mid) 50%, transparent 100%);
    animation: shimmer 3s infinite;
  }

  .footer-content {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 60px;
    margin-bottom: 60px;
    animation: footer-slide-up 0.8s var(--ease-luxury) forwards;
  }

  .footer-brand {
    animation: footer-fade-in 1s ease-out 0.2s both;
  }

  .footer-logo {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--gold-mid);
    margin-bottom: 20px;
    background: var(--gold-grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-tagline {
    font-size: 13px;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 30px;
    max-width: 450px;
    font-weight: 300;
  }

  .social-links {
    display: flex;
    gap: 12px;
  }

  .social-icon {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    border: 1px solid var(--gold-border);
    background: rgba(196, 168, 111, 0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold-dim);
    transition: all 0.3s var(--ease-luxury);
    cursor: pointer;
  }

  .social-icon:hover {
    background: rgba(196, 168, 111, 0.1);
    border-color: var(--gold-mid);
    color: var(--gold-bright);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(196, 168, 111, 0.15);
    animation: icon-hover 0.6s ease-in-out;
  }

  .footer-columns {
    display: contents;
  }

  .footer-column {
    animation: footer-fade-in 1s ease-out both;
  }

  .footer-column:nth-child(1) { animation-delay: 0.3s; }
  .footer-column:nth-child(2) { animation-delay: 0.4s; }
  .footer-column:nth-child(3) { animation-delay: 0.5s; }

  .footer-column-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--gold-mid);
    margin-bottom: 24px;
    font-family: var(--font-body);
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 14px;
  }

  .footer-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 400;
  }

  .footer-link svg {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }

  .footer-link:hover {
    color: var(--gold-bright);
    padding-left: 8px;
  }

  .footer-link:hover svg {
    opacity: 1;
    transform: translateX(0);
  }

  .footer-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--gold-border) 50%, transparent 100%);
    margin: 60px 0 30px;
    animation: footer-fade-in 1.2s ease-out 0.6s both;
  }

  .footer-bottom {
    max-width: 1400px;
    margin: 0 auto;
    padding-bottom: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: footer-fade-in 1.2s ease-out 0.7s both;
  }

  .footer-bottom-content {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
  }

  .copyright {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 300;
  }

  .footer-bottom-links {
    display: flex;
    gap: 24px;
  }

  .footer-bottom-link {
    font-size: 11px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s ease;
    font-weight: 400;
  }

  .footer-bottom-link:hover {
    color: var(--gold-bright);
  }

  .scroll-to-top {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--gold-border);
    background: rgba(196, 168, 111, 0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold-dim);
    cursor: pointer;
    transition: all 0.4s var(--ease-luxury);
  }

  .scroll-to-top svg {
    transform: rotate(180deg);
    transition: transform 0.3s ease;
  }

  .scroll-to-top:hover {
    background: rgba(196, 168, 111, 0.1);
    border-color: var(--gold-mid);
    color: var(--gold-bright);
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(196, 168, 111, 0.2);
  }

  .scroll-to-top:hover svg {
    transform: rotate(180deg) translateY(-2px);
  }

  /* Footer Responsive */
  @media (max-width: 1024px) {
    .footer-content {
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .footer-brand {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 768px) {
    .premium-footer {
      padding: 60px 6vw 0;
      margin-top: 80px;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-brand {
      grid-column: auto;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 24px;
      align-items: flex-start;
    }

    .footer-bottom-content {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .scroll-to-top {
      align-self: center;
    }

  }
`;

// =====================================================
// DATA
// =====================================================
const EXECUTIVES = [
    { name: 'Arsit Rao', role: 'Lead Partner', score: '50%' },
    { name: 'Sam Oberoi', role: 'Growth Lead', score: '50%' },
    { name: 'Harrison Cole', role: 'Product', score: '50%' },
    { name: 'Sharad Singhania', role: 'Finance', score: '50%' },
    { name: 'Warren V.', role: 'Strategy', score: '50%' },
];

const SYNDICATE_FEATS = [
    { title: 'Portfolio Logic', sub: 'Asset Construction', icon: <Layers size={14} color="#F0EAD6" /> },
    { title: 'Competitive Model', sub: 'Decision Matrix', icon: <Brain size={14} color="#F0EAD6" /> },
    { title: 'Asymmetric Search', sub: 'Upside Optimization', icon: <Search size={14} color="#F0EAD6" /> }
];

const CEO_METRICS = [
    { title: 'Directional Clarity', icon: <Compass size={12} />, value: 65 },
    { title: 'Decision Velocity', icon: <Zap size={12} />, value: 88 },
    { title: 'Impact Awareness', icon: <Target size={12} />, value: 73 },
    { title: 'Dual Focus', icon: <Eye size={12} />, value: 82 },
    { title: 'Accountability', icon: <ShieldCheck size={12} />, value: 69 }
];

const CUSTOMER_METRICS = [
    { title: 'Value Perception', icon: <Heart size={12} />, value: 76 },
    { title: 'Fairness Detection', icon: <Scale size={12} />, value: 84 },
    { title: 'Emotional Overlay', icon: <Activity size={12} />, value: 68 },
    { title: 'Trust Accumulation', icon: <ShieldCheck size={12} />, value: 92 }
];

// =====================================================
// MAIN COMPONENT
// =====================================================
const PremiumLanding = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const navigate = useNavigate();
    const [showStickyNav, setShowStickyNav] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const section = Math.floor(scrollPosition / windowHeight);
            setCurrentSection(section);

            setShowStickyNav(scrollPosition > windowHeight * 0.8);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll animation observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToNext = () => {
        window.scrollTo({
            top: window.innerHeight * (currentSection + 1),
            behavior: 'smooth'
        });
    };

    const scrollToSection = (section) => {
        window.scrollTo({
            top: window.innerHeight * section,
            behavior: 'smooth'
        });
    };

    const styles = {
        wrapper: {
            backgroundColor: 'var(--bg-app)',
            minHeight: '100vh',
            margin: 0,
            padding: '2.5vw 4vw',
            fontFamily: 'var(--font-playfair)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            color: 'var(--text-primary)',
            overflowX: 'hidden',
            position: 'relative',
        },
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5vh',
            zIndex: 10,
        },
        logo: {
            fontSize: '22px',
            fontWeight: '800',
            letterSpacing: '0.1em',
            color: 'var(--gold-mid)',
            fontFamily: 'serif',
            flex: '1',
        },
        navLinksContainer: {
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            flex: '2',
        },
        buttonContainer: {
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: '1',
        },
        iconBtn: {
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            border: '1px solid var(--gold-border)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            color: 'var(--gold-mid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        pillBtnDark: {
            background: 'var(--gold-grad)',
            color: '#1a120e',
            border: 'none',
            borderRadius: '10px',
            padding: '0 24px',
            height: '44px',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s ease',
        },
        mainHero: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px 0',
            position: 'relative',
            zIndex: 10,
        },
        heroTitle: {
            fontSize: 'clamp(22px, 3vw, 50px)',
            fontFamily: 'var(--font-playfair)',
            fontWeight: '200',
            lineHeight: '1.1',
            margin: '0 0 24px 0',
            background: 'var(--gold-grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.01em',
            position: 'relative',
            zIndex: 15,
        },
        heroSubtitle: {
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            lineHeight: '1.6',
            fontWeight: '300',
            fontFamily: 'serif',
            fontStyle: 'italic',
            opacity: 0.8,
            position: 'relative',
            zIndex: 15,
        },
        footer: {
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            padding: '30px 0',
            fontSize: '10px',
            fontWeight: '800',
            letterSpacing: '0.3em',
            color: 'var(--gold-dim)',
            borderTop: '1px solid var(--gold-border)',
            position: 'relative',
            zIndex: 10,
        },
        divider: {
            height: '1px',
            background: 'var(--gold-border)',
            width: '100%',
        }
    };

    return (
        <>
            <style>{GLOBAL_STYLES}</style>

            {/* Floating Particles Background */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* STICKY NAVBAR */}
            <nav className={`sticky-nav ${showStickyNav ? 'visible' : ''}`}>
                <div className="logo">AGIOAS</div>

                <div className="nav-links">
                    <span className="nav-link" onClick={() => scrollToSection(0)}>Preview</span>
                    <span className="nav-link" onClick={() => scrollToSection(1)}>Pricing</span>
                    <span className="nav-link" onClick={() => scrollToSection(1)}>Info</span>
                    <span className="nav-link" onClick={() => scrollToSection(2)}>Dashboard</span>
                </div>

                <div className="button-container">
                    <button className="icon-btn">
                        <LayoutGrid size={16} />
                    </button>

                    <button className="pill-btn" onClick={() => navigate('/login')}>
                        ENTER SUITE <ChevronRight size={12} />
                    </button>
                </div>
            </nav>

            {/* =====================================================
          SECTION 1: EXECUTIVE LANDING
          ===================================================== */}
            <section style={styles.wrapper}>
                <header style={styles.nav}>

                    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                            src="/logo.png.png"
                            alt="AGIOAS Logo"
                            style={{ height: '52px', width: 'auto', objectFit: 'contain', padding: '0px', margin: '0px' }}
                        />
                        <span style={showStickyNav ? {} : styles.logo}>AGIOAS</span>
                    </div>

                    <div style={styles.navLinksContainer}>
                        <span className="nav-link" onClick={() => scrollToSection(0)}>Preview</span>
                        <span className="nav-link" onClick={() => scrollToSection(1)}>Features</span>
                        <span className="nav-link" onClick={() => scrollToSection(1)}>Info</span>
                        <span className="nav-link" onClick={() => scrollToSection(2)}>Dashboard</span>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.iconBtn}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 104, 0.1)';
                                e.currentTarget.style.borderColor = 'var(--gold-mid)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                                e.currentTarget.style.borderColor = 'var(--gold-border)';
                            }}
                        >
                            <LayoutGrid size={18} />
                        </button>

                        <button
                            style={styles.pillBtnDark}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => navigate('/login')}
                        >
                            ENTER SUITE <ChevronRight size={10} />
                        </button>
                    </div>
                </header>

                <img
                    id="img1-executive"
                    src="/img4.png"
                    alt="Executive Office"
                />

                <img
                    id="img2-architecture"
                    src="/img2.png"
                    alt="Architecture"
                />

                <img
                    id="img3-professional"
                    src="/img1.png"
                    alt="Professional Suit"
                />

                <img
                    id="img4-luxury"
                    src="/img3.png"
                    alt="Luxury Interior"
                />

                <main style={styles.mainHero}>
                    <h1 style={styles.heroTitle}>
                        The World’s First Simulation OS for Founders.
                    </h1>
                    <p style={styles.heroSubtitle}>
                        “Where ideas are pressure-tested, decisions are weaponized, and founders become unstoppable.” <br />

                    </p>
                </main>

                <footer style={styles.footer}>
                    <div style={styles.divider}></div>
                    <div style={{ padding: '0 40px' }}>Enter OS</div>
                    <div style={styles.divider}></div>
                </footer>

                {currentSection === 0 && (
                    <div className="scroll-indicator" onClick={scrollToNext}>
                        <ArrowDown size={32} color="var(--gold-mid)" />
                    </div>
                )}

                {/* 3D Animation Character */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '8%',
                    transform: 'translateY(-50%)',
                    zIndex: 10000,
                    background: 'transparent',
                    border: 'none',
                    padding: '0',
                    pointerEvents: 'none'
                }}>
                    <AnimationScene />
                </div>
            </section>

            {/* =====================================================
          SECTION 2: FEATURES SHOWCASE
          ===================================================== */}
            <section style={{
                width: '100vw',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 0%, #2a1d16 0%, #0F0A08 80%)',
                padding: 40
            }}>
                <div className="card-premium fade-in" style={{
                    width: '100%',
                    maxWidth: 1200,
                    padding: '50px 60px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 60,
                    background: 'linear-gradient(180deg, #1e1610 0%, #16100c 100%)'
                }}>

                    {/* FEATURE 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div className="number-badge">01</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.05em' }}>The Grandmaster's Eye</h3>
                        </div>

                        <div className="step-visual-container">
                            <div style={{ position: 'absolute', left: '20%', zIndex: 10 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: '50%',
                                    background: 'radial-gradient(circle, var(--gold-bright) 0%, var(--gold-dim) 100%)',
                                    boxShadow: '0 0 30px var(--gold-dim)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '1px solid #fff'
                                }}>
                                    <BrainCircuit size={22} color="#1A120E" />
                                </div>
                                <div style={{
                                    position: 'absolute', inset: -10, border: '1px solid var(--gold-mid)', borderRadius: '50%',
                                    animation: 'pulse-ring 3s infinite'
                                }}></div>
                            </div>

                            <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                <path d="M 60 110 C 100 110, 120 70, 170 70" fill="none" stroke="var(--gold-dim)" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                                <circle r="2" fill="var(--gold-bright)">
                                    <animateMotion dur="4s" repeatCount="indefinite" path="M 60 110 C 100 110, 120 70, 170 70" />
                                </circle>
                                <path d="M 60 110 C 100 110, 120 150, 170 150" fill="none" stroke="var(--gold-dim)" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                                <circle r="2" fill="var(--gold-bright)">
                                    <animateMotion dur="4s" repeatCount="indefinite" begin="2s" path="M 60 110 C 100 110, 120 150, 170 150" />
                                </circle>
                            </svg>

                            <div style={{ position: 'absolute', right: '15%', top: '25%', animation: 'blink 5s infinite' }}>
                                <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginBottom: 4, textAlign: 'right' }}>OUTCOME A</div>
                                <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--text-tertiary)', borderRadius: 2, fontSize: 10, color: 'var(--text-secondary)' }}>Ripple Effect</div>
                            </div>

                            <div style={{ position: 'absolute', right: '15%', bottom: '25%', animation: 'blink 5s infinite 2.5s' }}>
                                <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginBottom: 4, textAlign: 'right' }}>OUTCOME B</div>
                                <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--text-tertiary)', borderRadius: 2, fontSize: 10, color: 'var(--text-secondary)' }}>Market Shift</div>
                            </div>

                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--gold-border) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.2 }}></div>
                        </div>

                        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-tertiary)' }}>
                            We don't just predict the move; we predict the market's counter-move. Our <strong>Second-Order Intelligence</strong> models the invisible ripple effects of your decisions.
                        </p>
                    </div>

                    {/* FEATURE 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div className="number-badge">02</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.05em' }}>The War Room of Ghosts</h3>
                        </div>

                        <div className="step-visual-container">
                            <div style={{
                                position: 'absolute', left: 20, zIndex: 2, top: 60,
                                animation: 'float-slow 6s ease-in-out infinite'
                            }}>
                                <div style={{
                                    width: 70, height: 90, background: 'linear-gradient(180deg, #1A120E, #0F0A08)',
                                    border: '1px solid var(--accent-blue)', borderRadius: 4,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                                }}>
                                    <Cpu size={16} color="var(--accent-blue)" style={{ marginBottom: 8 }} />
                                    <div style={{ fontSize: 8, color: 'var(--accent-blue)', letterSpacing: '0.1em', fontWeight: 700 }}>LOGIC</div>
                                    <div style={{ fontSize: 7, color: 'var(--text-tertiary)', marginTop: 4, textAlign: 'center' }}>SKEPTICISM<br />LVL 99</div>
                                </div>
                            </div>

                            <div style={{
                                position: 'absolute', right: 20, zIndex: 2, top: 40,
                                animation: 'float-medium 5s ease-in-out infinite'
                            }}>
                                <div style={{
                                    width: 70, height: 90, background: 'linear-gradient(180deg, #1A120E, #0F0A08)',
                                    border: '1px solid var(--accent-red)', borderRadius: 4,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                                }}>
                                    <Activity size={16} color="var(--accent-red)" style={{ marginBottom: 8 }} />
                                    <div style={{ fontSize: 8, color: 'var(--accent-red)', letterSpacing: '0.1em', fontWeight: 700 }}>FURY</div>
                                    <div style={{ fontSize: 7, color: 'var(--text-tertiary)', marginTop: 4, textAlign: 'center' }}>EMOTION<br />LVL 85</div>
                                </div>
                            </div>

                            <div style={{
                                position: 'absolute', zIndex: 10,
                                animation: 'float-medium 7s ease-in-out infinite'
                            }}>
                                <div style={{
                                    width: 100, height: 120, background: 'linear-gradient(180deg, #2A1D16, #1e1610)',
                                    border: '1px solid var(--gold-mid)', borderRadius: 6,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16,
                                    boxShadow: '0 0 40px rgba(220, 154, 20, 0.2)'
                                }}>
                                    <Fingerprint size={32} color="var(--gold-mid)" style={{ marginBottom: 12 }} />
                                    <div style={{ width: '100%', height: 1, background: 'var(--gold-dim)', marginBottom: 8 }}></div>
                                    <div style={{ fontSize: 9, color: 'var(--text-primary)', textAlign: 'center', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>HUMANOID<br />FINGERPRINT</div>
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-tertiary)' }}>
                            We simulate the boardroom, not just the data. Our agents emulate <strong>Adversarial Cognition</strong>—mirroring specific biases and skepticism of stakeholders.
                        </p>
                    </div>

                    {/* FEATURE 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <div className="number-badge">03</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.05em' }}>The Black Box Protocol</h3>
                        </div>

                        <div className="step-visual-container">
                            <div style={{
                                position: 'absolute', width: 160, height: 160,
                                border: '1px dashed var(--gold-border)', borderRadius: '50%',
                                animation: 'spin-slow 25s linear infinite', opacity: 0.4
                            }}></div>
                            <div style={{
                                position: 'absolute', width: 130, height: 130,
                                border: '1px solid var(--gold-border)', borderRadius: '50%',
                                animation: 'spin-slow 15s linear reverse infinite', opacity: 0.3
                            }}></div>

                            <div style={{ position: 'absolute', zIndex: 5 }}>
                                <ShieldCheck size={56} color="var(--gold-dim)" strokeWidth={1} fill="rgba(0,0,0,0.8)" />
                            </div>

                            <div style={{ position: 'absolute', zIndex: 10 }}>
                                <Lock size={20} color="#fff" fill="var(--gold-mid)" />
                            </div>

                            <div style={{
                                position: 'absolute', width: '70%', height: 2,
                                background: 'linear-gradient(90deg, transparent 0%, var(--gold-bright) 50%, transparent 100%)',
                                boxShadow: '0 0 15px var(--gold-mid)',
                                animation: 'scan-vertical 3s ease-in-out infinite'
                            }}></div>

                            <div style={{ position: 'absolute', top: 30, right: 30, opacity: 0.5 }}>
                                <Globe size={14} color="var(--text-tertiary)" />
                            </div>
                            <div style={{ position: 'absolute', bottom: 30, left: 30, opacity: 0.5 }}>
                                <Key size={14} color="var(--text-tertiary)" />
                            </div>
                            <div style={{ position: 'absolute', top: 30, left: 30, opacity: 0.5 }}>
                                <ScanEye size={14} color="var(--text-tertiary)" />
                            </div>

                            <div style={{
                                position: 'absolute', bottom: 20,
                                display: 'flex', gap: 6, alignItems: 'center',
                                padding: '4px 8px', background: 'rgba(33, 12, 12, 0.6)', borderRadius: 4, border: '1px solid var(--gold-border)'
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-mid)', boxShadow: '0 0 5px var(--gold-mid)' }}></div>
                                <div style={{ fontSize: 8, letterSpacing: '0.1em', color: 'var(--text-primary)', fontWeight: 700 }}>AIR-GAPPED</div>
                            </div>
                        </div>

                        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-tertiary)' }}>
                            Your strategy is a state secret. Utilizing <strong>Sovereign Data Enclaves</strong> and ephemeral processing, your IP remains invisible to everyone but you.
                        </p>
                    </div>

                </div>

                {currentSection === 1 && (
                    <div className="scroll-indicator" onClick={scrollToNext}>
                        <ArrowDown size={32} color="var(--gold-mid)" />
                    </div>
                )}
            </section>

            <img src="/wmremove-transformed (8).png" className="feature1" alt="Strategy" />
            <img src="/Screenshot 2026-02-15 134452.png" className="chator3d" alt="Strategy" />
            <img src="/wmremove-transformed (6).png" className="feature2" alt="Strategy" />
            <img src="/Screenshot 2026-02-15 134452.png" className="chator3d2" alt="Strategy" />
            <img src="/wmremove-transformed (7).png" className="feature3" alt="Strategy" />\
            <img src="/Screenshot 2026-02-15 134452.png" className="chator3d3" alt="Strategy" />




            {/* =====================================================
          SECTION 3: DASHBOARD (4 WIDGETS)
          ===================================================== */}
            <section>
                <div className="page-container">

                    {/* WIDGET 1: Strategic Forecast */}
                    <div className="executive-widget" style={{ animationDelay: '0.1s' }}>
                        <div className="widget-header">
                            <div>
                                <h1 className="main-title">C-Suite Engine</h1>
                                <div className="main-desc">A fully operational virtual C-Suite that analyzes your data, pressure-tests your strategy, and delivers unified executive direction with precision and authority.</div>
                            </div>
                            <div className="status-indicator">
                                <div className="status-dot"></div>
                                LIVE
                            </div>
                        </div>

                        <div className="content-row">
                            <div className="image-frame">
                                <img src="/wmremove-transformed (9).png" className="clean-image" alt="Strategy" />
                            </div>

                            <div className="hud-panel">
                                <div className="stats-header-row">
                                    <div className="stat-col"><span className="stat-label">Avg Support</span><span className="stat-val">50%</span></div>
                                    <div className="stat-col"><span className="stat-label">Engagement</span><span className="stat-val">50%</span></div>
                                    <div className="stat-col"><span className="stat-label">Total Speaks</span><span className="stat-val">0</span></div>
                                </div>

                                <div className="graph-container">
                                    <div className="graph-block">
                                        <div className="graph-title-row">
                                            <span className="graph-title">COMPANY DIRECTION</span>
                                            <span className="graph-status" style={{ color: '#5D7A58', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <TrendingUp size={10} /> Trending Up
                                            </span>
                                        </div>
                                        <div className="graph-svg-area">
                                            <svg width="100%" height="100%" preserveAspectRatio="none">
                                                <defs><linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5D7A58" stopOpacity="0.3" /><stop offset="100%" stopColor="#5D7A58" stopOpacity="0.0" /></linearGradient></defs>
                                                <path d="M0,45 C80,42 160,40 320,35 L320,50 L0,50 Z" fill="url(#gradGreen)" />
                                                <path d="M0,45 C80,42 160,40 320,35" fill="none" stroke="#5D7A58" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="graph-block">
                                        <div className="graph-title-row">
                                            <span className="graph-title">RISK ANALYSIS</span>
                                            <span className="graph-status" style={{ color: '#C0392B', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <AlertCircle size={10} /> Mitigating
                                            </span>
                                        </div>
                                        <div className="graph-svg-area">
                                            <svg width="100%" height="100%" preserveAspectRatio="none">
                                                <defs><linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#C0392B" stopOpacity="0.3" /><stop offset="100%" stopColor="#C0392B" stopOpacity="0.0" /></linearGradient></defs>
                                                <path d="M0,15 L320,35 L320,50 L0,50 Z" fill="url(#gradRed)" />
                                                <path d="M0,15 L320,35" fill="none" stroke="#C0392B" strokeWidth="2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 2: The Syndicate */}
                    <div className="executive-widget" style={{ animationDelay: '0.2s' }}>
                        <div className="widget-header">
                            <div>
                                <h1 className="main-title">The Deal Maverick</h1>
                                <div className="main-desc">A precision-engineered deal simulation platform built to dissect your pitch, pressure-test your strategy, and prepare you to dominate critical business conversations.</div>
                            </div>
                            <div className="status-indicator">
                                <div className="status-dot"></div>
                                ACTIVE
                            </div>
                        </div>

                        <div className="content-row">
                            <div className="image-frame">
                                <img src="/wmremove-transformed (12).png" className="clean-image" alt="Syndicate" />

                                <div className="features-overlay">
                                    {SYNDICATE_FEATS.map((feat, i) => (
                                        <div key={i} className="feature-card">
                                            <div className="feat-icon">{feat.icon}</div>
                                            <div className="feat-text">
                                                <span className="feat-title">{feat.title}</span>
                                                <span className="feat-sub">{feat.sub}</span>
                                            </div>
                                            <ChevronRight size={12} color="#8a7030" style={{ marginLeft: 'auto' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="hud-panel">
                                <div className="exec-header">
                                    <div className="exec-header-title">
                                        <Activity size={12} style={{ marginRight: 6, display: 'inline' }} />
                                        EXECUTIVE ASSESSMENT
                                    </div>
                                    <X size={12} color="#8a7030" style={{ cursor: 'pointer' }} />
                                </div>

                                <div className="scroll-content">

                                    <div className="gold-card">
                                        <div className="card-title-row">
                                            <Target size={12} className="card-icon" color="#8a7030" />
                                            <span className="card-title">PITCH ACCURACY</span>
                                        </div>
                                        <div className="pitch-val-row">
                                            <span style={{ fontSize: 11, color: '#ccc' }}>Conviction</span>
                                            <span className="pitch-num">0%</span>
                                        </div>
                                        <div className="progress-bg"></div>
                                    </div>

                                    <div className="gold-card">
                                        <div className="card-title-row">
                                            <TrendingUp size={12} className="card-icon" color="#8a7030" />
                                            <span className="card-title">RISK-RETURN FRONTIER</span>
                                        </div>
                                        <div className="curve-container">
                                            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                                                <path d="M0,35 Q100,30 200,10" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="3,3" />
                                                <path className="path-draw" d="M0,35 Q60,32 120,25" fill="none" stroke="#F1C40F" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="120" cy="25" r="2.5" fill="#F1C40F" />
                                            </svg>
                                        </div>
                                        <div className="axis-row">
                                            <span className="axis-label">LOW RISK</span>
                                            <span className="axis-label">HIGH YIELD</span>
                                        </div>
                                    </div>

                                    <div className="gold-card" style={{ marginBottom: 0 }}>
                                        <div className="card-title-row">
                                            <Crown size={12} className="card-icon" color="#8a7030" />
                                            <span className="card-title">TERM SHEET POWER CURVE</span>
                                        </div>
                                        <div className="curve-container">
                                            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                                                <path d="M0,35 Q100,20 200,15" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="3,3" />
                                                <path className="path-draw" d="M0,35 L140,25" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
                                                <circle cx="140" cy="25" r="2.5" fill="#C0392B" />
                                            </svg>
                                        </div>
                                        <div className="axis-row">
                                            <span className="axis-label">FOUNDER CTRL</span>
                                            <span className="axis-label">VC CTRL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 3: CEO Command Center */}
                    <div className="executive-widget" style={{ animationDelay: '0.3s' }}>
                        <div className="widget-header">
                            <div>
                                <h1 className="main-title">Executive Mind</h1>
                                <div className="main-desc">A professional leadership framework providing objective analysis and decisive strategic direction.</div>
                            </div>
                            <div className="status-indicator">
                                <div className="status-dot"></div>
                                EXECUTIVE
                            </div>
                        </div>

                        <div className="content-row">
                            <div className="image-frame">
                                <img src="/wmremove-transformed (10).png" className="clean-image" alt="CEO" />
                            </div>

                            <div className="hud-panel">
                                <div className="exec-header">
                                    <div className="exec-header-title">
                                        <Crown size={12} style={{ marginRight: 6, display: 'inline' }} />
                                        STRATEGIC RADAR
                                    </div>
                                    <X size={12} color="#8a7030" style={{ cursor: 'pointer' }} />
                                </div>

                                <div className="scroll-content">
                                    {/* Pentagon Radar Chart */}
                                    <div className="radar-chart">
                                        <svg width="160" height="160" viewBox="0 0 160 160">
                                            <defs>
                                                <filter id="glow">
                                                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>

                                            {/* Background Pentagon Layers */}
                                            <polygon points="80,20 140,60 120,120 40,120 20,60" fill="none" stroke="rgba(196,168,111,0.1)" strokeWidth="1" />
                                            <polygon points="80,35 125,65 110,105 50,105 35,65" fill="none" stroke="rgba(196,168,111,0.15)" strokeWidth="1" />
                                            <polygon points="80,50 110,70 100,90 60,90 50,70" fill="none" stroke="rgba(196,168,111,0.2)" strokeWidth="1" />

                                            {/* Data Pentagon */}
                                            <polygon points="80,25 132,62 117,115 43,115 28,62" fill="rgba(196,168,111,0.15)" stroke="var(--gold-mid)" strokeWidth="2" filter="url(#glow)" />

                                            {/* Grid Lines from Center */}
                                            <line x1="80" y1="80" x2="80" y2="20" stroke="rgba(196,168,111,0.2)" strokeWidth="1" strokeDasharray="2,2" />
                                            <line x1="80" y1="80" x2="140" y2="60" stroke="rgba(196,168,111,0.2)" strokeWidth="1" strokeDasharray="2,2" />
                                            <line x1="80" y1="80" x2="120" y2="120" stroke="rgba(196,168,111,0.2)" strokeWidth="1" strokeDasharray="2,2" />
                                            <line x1="80" y1="80" x2="40" y2="120" stroke="rgba(196,168,111,0.2)" strokeWidth="1" strokeDasharray="2,2" />
                                            <line x1="80" y1="80" x2="20" y2="60" stroke="rgba(196,168,111,0.2)" strokeWidth="1" strokeDasharray="2,2" />

                                            {/* Value Points */}
                                            <circle cx="80" cy="25" r="4" fill="var(--gold-bright)" filter="url(#glow)">
                                                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" />
                                            </circle>
                                            <circle cx="132" cy="62" r="4" fill="var(--gold-bright)" filter="url(#glow)">
                                                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin="0.4s" />
                                            </circle>
                                            <circle cx="117" cy="115" r="4" fill="var(--gold-bright)" filter="url(#glow)">
                                                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin="0.8s" />
                                            </circle>
                                            <circle cx="43" cy="115" r="4" fill="var(--gold-bright)" filter="url(#glow)">
                                                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin="1.2s" />
                                            </circle>
                                            <circle cx="28" cy="62" r="4" fill="var(--gold-bright)" filter="url(#glow)">
                                                <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite" begin="1.6s" />
                                            </circle>
                                        </svg>
                                    </div>

                                    {/* CEO Metrics */}


                                    {/* Polarity Slider */}
                                    <div className="gold-card" style={{ marginTop: 16, marginBottom: 0 }}>
                                        <div className="card-title-row">
                                            <Compass size={12} color="#8a7030" />
                                            <span className="card-title">POLARITY</span>
                                        </div>
                                        <div className="polarity-slider">
                                            <div className="polarity-track">
                                                <div className="polarity-marker" style={{ left: '70%' }}></div>
                                            </div>
                                        </div>
                                        <div className="polarity-labels">
                                            <span>DEFENSIVE</span>
                                            <span>ASSERTIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 4: Customer Perception Matrix */}
                    <div className="executive-widget" style={{ animationDelay: '0.4s' }}>
                        <div className="widget-header">
                            <div>
                                <h1 className="main-title">Customer Interaction Pod (CIP)</h1>
                                <div className="main-desc">Engage with six distinct customer personas powered by layered intelligence to rigorously test positioning, messaging, and buying psychology.</div>
                            </div>
                            <div className="status-indicator">
                                <div className="status-dot"></div>
                                INSIGHTS
                            </div>
                        </div>

                        <div className="content-row">
                            <div className="image-frame">
                                <img src="/wmremove-transformed (11).png" className="clean-image" alt="Customer" />
                            </div>

                            <div className="hud-panel">
                                <div className="exec-header">
                                    <div className="exec-header-title">
                                        <Heart size={12} style={{ marginRight: 6, display: 'inline' }} />
                                        PSYCHOLOGICAL METRICS
                                    </div>
                                    <X size={12} color="#8a7030" style={{ cursor: 'pointer' }} />
                                </div>

                                <div className="scroll-content">
                                    {/* Trust Wave Graph */}
                                    <div className="gold-card">
                                        <div className="card-title-row">
                                            <TrendingUp size={12} color="#8a7030" />
                                            <span className="card-title">TRUST ACCUMULATION & BETRAYAL</span>
                                        </div>
                                        <div className="wave-chart">
                                            <svg width="100%" height="100%" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="var(--gold-mid)" stopOpacity="0.3" />
                                                        <stop offset="100%" stopColor="var(--gold-mid)" stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M0,50 Q40,40 80,42 T160,35 Q200,33 240,37 T340,30" fill="none" stroke="var(--gold-mid)" strokeWidth="2" className="path-draw" />
                                                <path d="M0,50 Q40,40 80,42 T160,35 Q200,33 240,37 T340,30 L340,70 L0,70 Z" fill="url(#trustGrad)" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Perception Bar Chart */}
                                    <div className="gold-card">
                                        <div className="card-title-row">
                                            <AlertCircle size={12} color="#8a7030" />
                                            <span className="card-title">PERCEPTION VS REALITY GAP</span>
                                        </div>
                                        <div className="bar-chart">
                                            <div className="bar" style={{ height: '45%' }}></div>
                                            <div className="bar" style={{ height: '75%' }}></div>
                                            <div className="bar" style={{ height: '55%' }}></div>
                                            <div className="bar" style={{ height: '85%' }}></div>
                                            <div className="bar" style={{ height: '60%' }}></div>
                                            <div className="bar" style={{ height: '70%' }}></div>
                                        </div>
                                    </div>

                                    {/* Customer Metrics */}

                                    {/* Reality Matrix Grid */}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SECURITY FEATURES SECTION */}
            <section className="security-features-section animate-on-scroll">
                <div className="security-container">
                    <div className="security-header">
                        <div className="security-badge">
                            <ShieldCheck size={14} />
                            ENTERPRISE SECURITY
                        </div>
                        <h2 className="security-title">
                            Military-Grade Security Infrastructure
                        </h2>
                        <p className="security-subtitle">
                            Comprehensive security and compliance features designed for enterprise-scale operations with zero-trust architecture
                        </p>
                    </div>

                    <div className="security-grid">
                        {/* Card 1 - SOC 2 Compliance */}
                        <div className="security-card">
                            <div className="security-card-visual">
                                <div className="security-visual-content">
                                    <div className="security-radar">
                                        <div className="radar-circle"></div>
                                        <div className="radar-circle"></div>
                                        <div className="radar-circle"></div>
                                        <div className="radar-center"></div>
                                        <div className="radar-line"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="security-card-content">
                                <h3 className="security-card-title">SOC 2 Compliance</h3>
                                <p className="security-card-description">
                                    Our product meets SOC 2 standards for secure handling of sensitive information with continuous monitoring and auditing
                                </p>
                            </div>
                        </div>

                        {/* Card 2 - SSO and Domain Capture */}
                        <div className="security-card">
                            <div className="security-card-visual">
                                <div className="security-visual-content">
                                    <div className="security-domains">
                                        <div className="domain-item">
                                            <div className="domain-icon">@</div>
                                            <span>@company.com</span>
                                        </div>
                                        <div className="domain-item">
                                            <div className="domain-icon">@</div>
                                            <span>@sub.company.com</span>
                                        </div>
                                        <div className="domain-item" style={{ border: '1px solid var(--gold-mid)', background: 'rgba(196, 168, 111, 0.1)' }}>
                                            <ShieldCheck size={14} color="var(--gold-mid)" />
                                            <span style={{ color: 'var(--gold-mid)', fontWeight: 600 }}>Acme Inc Organization</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="security-card-content">
                                <h3 className="security-card-title">SSO and Domain Capture</h3>
                                <p className="security-card-description">
                                    Seamlessly manage users with SSO and domain capture for centralized authentication and access control
                                </p>
                            </div>
                        </div>

                        {/* Card 3 - Fine-Grained Permissions */}
                        <div className="security-card">
                            <div className="security-card-visual">
                                <div className="security-visual-content">
                                    <div className="security-permissions">
                                        <div className="permission-row">
                                            <div className="permission-checkbox">
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <span className="permission-text">Share by link is enabled</span>
                                        </div>
                                        <div style={{ marginLeft: 30, fontSize: 10, color: 'var(--text-tertiary)' }}>
                                            <div style={{ marginBottom: 8 }}>Any Plasmic user with the link is a <span style={{ color: 'var(--gold-mid)' }}>Viewer</span></div>
                                            <div style={{ marginBottom: 8 }}>Everyone in <strong>Workspace</strong> can access</div>
                                            <div>Everyone in <strong>Acme</strong> can access</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="security-card-content">
                                <h3 className="security-card-title">Fine-Grained Permissions</h3>
                                <p className="security-card-description">
                                    Effortlessly assign and manage fine-grained permissions with our comprehensive solution
                                </p>
                            </div>
                        </div>

                        {/* Card 4 - Role-Based Access Control */}
                        <div className="security-card">
                            <div className="security-card-visual">
                                <div className="security-visual-content">
                                    <div className="security-access">
                                        <div className="access-user">
                                            <div className="access-avatar">CW</div>
                                            <div className="access-info">
                                                <div className="access-email">curtis.weaver@example.com</div>
                                                <div className="access-role">Owner</div>
                                            </div>
                                        </div>
                                        <div className="access-user">
                                            <div className="access-avatar">TH</div>
                                            <div className="access-info">
                                                <div className="access-email">tanya.hill@example.com</div>
                                                <div className="access-role">Designer</div>
                                            </div>
                                        </div>
                                        <div className="access-user">
                                            <div className="access-avatar">TJ</div>
                                            <div className="access-info">
                                                <div className="access-email">tim.jennings@example.com</div>
                                                <div className="access-role">Developer</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="security-card-content">
                                <h3 className="security-card-title">Role-Based Access Control</h3>
                                <p className="security-card-description">
                                    Ensure enterprise security and compliance with role-based access management for precise control
                                </p>
                            </div>
                        </div>

                        {/* Card 5 - Workspaces Per Organization */}
                        <div className="security-card">
                            <div className="security-card-visual">
                                <div className="security-visual-content">
                                    <div className="security-projects">
                                        <div className="project-folder">
                                            <LayoutGrid size={16} className="project-icon" />
                                            <span className="project-name">All projects</span>
                                        </div>
                                        <div className="project-folder">
                                            <Users size={16} className="project-icon" />
                                            <span className="project-name">My projects</span>
                                        </div>
                                        <div className="project-folder" style={{ background: 'rgba(196, 168, 111, 0.1)', borderColor: 'var(--gold-mid)' }}>
                                            <Target size={16} style={{ color: 'var(--gold-mid)' }} />
                                            <span className="project-name" style={{ color: 'var(--gold-mid)', fontWeight: 600 }}>Acme</span>
                                        </div>
                                        <div style={{ marginLeft: 36, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Design System</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Marketing Design</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="security-card-content">
                                <h3 className="security-card-title">Workspaces Per Organization</h3>
                                <p className="security-card-description">
                                    Organize projects effectively with multiple workspaces per organization for streamlined collaboration
                                </p>
                            </div>
                        </div>

                        {/* Card 6 - On-Premise Deployment */}
                        <div className="security-card">
                            <div className="security-card-visual">
                                <div className="security-visual-content">
                                    <div className="security-deployment">
                                        <div className="deployment-step">
                                            <div className="step-indicator">✓</div>
                                            <div className="step-text step-success">Successfully saved Acme Marketing Website</div>
                                        </div>
                                        <div className="deployment-step">
                                            <div className="step-indicator">✓</div>
                                            <div className="step-text step-success">Pushed updates to CDN cache</div>
                                        </div>
                                        <div className="deployment-step">
                                            <div className="step-indicator">
                                                <Globe size={12} />
                                            </div>
                                            <div className="step-text">Push to GitHub</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="security-card-content">
                                <h3 className="security-card-title">On-Premise Deployment</h3>
                                <p className="security-card-description">
                                    Deploy Plasmic app on-premise for enhanced control and security with full infrastructure ownership
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div style={{ height: '100px' }}></div>
            {/* PREMIUM FOOTER */}
            <footer className="premium-footer">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <h2 className="footer-logo">IMPERIUM</h2>
                        <p className="footer-tagline">
                            The premier executive intelligence platform for forward-thinking leaders who demand excellence in strategic decision-making and operational analytics.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="#" className="social-icon">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="footer-columns">
                        <div className="footer-column">
                            <h3 className="footer-column-title">PLATFORM</h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Dashboard</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Analytics</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Intelligence</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Security</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-column-title">COMPANY</h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> About Us</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Careers</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Press</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-column-title">RESOURCES</h3>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Documentation</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> API Reference</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Support Center</a></li>
                                <li><a href="#" className="footer-link"><ChevronRight size={12} /> Community</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-divider"></div>
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">© 2026 Imperium Intelligence. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <a href="#" className="footer-bottom-link">Privacy Policy</a>
                            <a href="#" className="footer-bottom-link">Terms of Service</a>
                            <a href="#" className="footer-bottom-link">Cookie Settings</a>
                        </div>
                    </div>
                    <div className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <ArrowDown size={16} />
                    </div>
                </div>
            </footer>
        </>
    );
};

export default PremiumLanding;