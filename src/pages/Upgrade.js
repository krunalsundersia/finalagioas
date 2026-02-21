// ============================================================================
// FILE: frontend/src/pages/Upgrade.js
// Membership Plans & Payment Page (Adapted to Executive Suite Theme)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Crown, Zap, CheckCircle, ArrowLeft, ShieldCheck,
    Target, BarChart, Lock, CreditCard, ChevronRight
} from 'lucide-react';
import RazorpayPayment from '../components/RazorpayPayment';
import axios from 'axios';

// Reusing global styles for consistency
const UPGRADE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;500;600;700;900&display=swap');

  /* ============================================================
     ROOT VARIABLES — copied from Dashboard GLOBAL_STYLES so this
     page works correctly when rendered on its own route (/upgrade)
     without Dashboard being mounted.
  ============================================================ */
  :root {
    /* Woods & Leathers */
    --bg-app: #1c1410;
    --bg-sidebar: #1b110d;
    --bg-card: #1e1610;
    --bg-input: #0c0908;

    /* Finishings */
    --bg-glass: rgba(29, 21, 16, 0.9);
    --overlay-dark: rgba(19, 19, 19, 0.8);

    /* Typography */
    --font-display: 'Cinzel', serif;
    --font-body: 'Inter', sans-serif;

    --text-primary: #E8E0D5;
    --text-secondary: #dc9a14;
    --text-tertiary: #a67c2e;

    /* Precious Metals */
    --gold-dim: #ac8042;
    --gold-mid: #dc9a14;
    --gold-bright: #ffd700;
    --gold-grad: linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%);
    --gold-glow: 0 0 25px rgba(220, 154, 20, 0.15);

    /* Status */
    --success: #5D7A58;
    --danger: #8A3A3A;
    --info: #4F6170;

    /* Borders */
    --border-subtle: rgba(196, 168, 111, 0.1);
    --border-gold: rgba(196, 168, 111, 0.25);

    --ease-elegant: cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* ============================================================
     SHARED UTILITY CLASSES — also from Dashboard GLOBAL_STYLES
  ============================================================ */
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #0F0A08; }
  ::-webkit-scrollbar-thumb { background: #261c17; border: 1px solid #1A120E; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold-dim); }

  h1 { font-family: var(--font-display); font-size: 38px; color: var(--text-primary); margin: 0; font-weight: 500; letter-spacing: -0.01em; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
  h2 { font-family: var(--font-display); font-size: 26px; color: var(--text-primary); margin: 0; font-weight: 500; }
  h3 { font-family: var(--font-display); font-size: 18px; color: var(--text-primary); margin: 0; font-weight: 600; letter-spacing: 0.02em; }
  p  { margin: 0; line-height: 1.6; font-size: 14px; color: var(--text-secondary); }

  .fade-in { animation: fadeIn 0.8s var(--ease-elegant) forwards; opacity: 0; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); filter: blur(4px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

  .stagger-appear { opacity: 0; animation: fadeIn 0.8s var(--ease-elegant) forwards; }
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.15s; }
  .delay-3 { animation-delay: 0.2s; }
  .delay-4 { animation-delay: 0.25s; }
  .delay-5 { animation-delay: 0.3s; }

  .btn-reset {
    background: none; border: none; cursor: pointer; color: inherit;
    display: flex; align-items: center; justify-content: center; padding: 0; outline: none;
  }

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

  /* ============================================================
     UPGRADE PAGE — specific styles
  ============================================================ */
  .upgrade-container {
    min-height: 100vh;
    background: radial-gradient(circle at 50% -20%, #150f0b 0%, #0F0A08 70%);
    padding: 48px;
    font-family: var(--font-body);
    color: var(--text-primary);
    overflow-y: auto;
  }

  .upgrade-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .plan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }

  .premium-card {
    background: var(--bg-card);
    border: 1px solid var(--border-gold);
    border-radius: 6px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.8);
  }

  .premium-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 30px 60px -15px rgba(0,0,0,0.95), 0 0 20px rgba(220, 154, 20, 0.1);
    border-color: var(--gold-bright);
  }

  .premium-card.active-plan {
    border: 2px solid var(--gold-mid);
    background: linear-gradient(180deg, #261C16 0%, #1A120E 100%);
  }

  .popular-tag {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--gold-grad);
    color: #1A120E;
    padding: 6px 16px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    box-shadow: var(--gold-glow);
  }

  .price-display {
    font-family: var(--font-display);
    font-size: 48px;
    color: var(--gold-bright);
    margin: 20px 0 8px 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 32px 0;
    flex: 1;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.4;
  }

  .feature-icon {
    color: var(--gold-mid);
    margin-top: 2px;
    flex-shrink: 0;
  }

  .why-agioas {
    margin-top: 80px;
    padding: 60px;
    background: rgba(185, 149, 80, 0.03);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    text-align: center;
  }
`;

function Upgrade() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMembership, setCurrentMembership] = useState(null);

    useEffect(() => {
        loadPlans();
        loadCurrentMembership();
    }, []);

    const loadPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/payment/plans/');
            setPlans(response.data.plans);
        } catch (error) {
            console.error('Failed to load plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCurrentMembership = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get('http://localhost:8000/api/v1/membership/status/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCurrentMembership(response.data.membership);
        } catch (error) {
            console.log('No current membership');
        }
    };

    const handlePaymentSuccess = (membership) => {
        setCurrentMembership(membership);
        setSelectedPlan(null);
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const handlePaymentCancel = () => {
        setSelectedPlan(null);
    };

    const getPlanIcon = (tierName) => {
        if (tierName.includes('Premium')) return <Crown size={48} />;
        if (tierName.includes('CEO')) return <ShieldCheck size={48} />;
        if (tierName.includes('VC')) return <Target size={48} />;
        return <Zap size={48} />;
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', background: '#0F0A08', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 60, height: 60, border: '2px solid #261c17', borderTopColor: '#dc9a14', borderRadius: '50%', animation: 'spin 1.5s linear infinite' }} />
                <div style={{ marginTop: 24, fontFamily: 'Cinzel', color: '#ac8042', letterSpacing: '0.2em' }}>AUTHENTICATING TIERS</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="upgrade-container">
            <style>{UPGRADE_STYLES}</style>

            <div className="upgrade-content fade-in">
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 32 }}>
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-reset"
                            style={{ color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 700, letterSpacing: '2px', marginBottom: 24 }}
                        >
                            <ArrowLeft size={14} style={{ marginRight: 8 }} /> RETURN TO DASHBOARD
                        </button>
                        <h1 style={{ fontSize: 42, marginBottom: 8 }}>Capital Allocation</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Elevate your executive clearance and unlock strategic wargame protocols.</p>
                    </div>

                    {currentMembership && (
                        <div className="info-banner" style={{ margin: 0, padding: '12px 24px' }}>
                            <CheckCircle size={18} color="var(--success)" />
                            <div>
                                <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Current Clearance</div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{currentMembership.tier_display}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Plans Grid */}
                <div className="plan-grid">
                    {plans.map((plan) => {
                        const isPopular = plan.tier === 'PREMIUM_DAILY';
                        const isCurrent = currentMembership?.tier === plan.tier;

                        return (
                            <div key={plan.tier} className={`premium-card ${isCurrent ? 'active-plan' : ''} stagger-appear`}>
                                {isPopular && <div className="popular-tag">Most Recommended</div>}

                                <div style={{ color: isCurrent ? 'var(--gold-bright)' : 'var(--gold-dim)', marginBottom: 24 }}>
                                    {getPlanIcon(plan.name)}
                                </div>

                                <h3 style={{ fontSize: 24, fontFamily: 'var(--font-display)' }}>{plan.name}</h3>

                                <div className="price-display">
                                    <span style={{ fontSize: 24, verticalAlign: 'top', marginRight: 4 }}>₹</span>
                                    {plan.price}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    Valid for {plan.duration_days} Days
                                </div>

                                <ul className="feature-list">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="feature-item">
                                            <CheckCircle size={14} className="feature-icon" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ marginTop: 'auto' }}>
                                    {selectedPlan === plan.tier ? (
                                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: 12, borderRadius: 4 }}>
                                            <RazorpayPayment
                                                tier={plan.tier}
                                                tierName={plan.name}
                                                price={plan.price}
                                                onSuccess={handlePaymentSuccess}
                                                onCancel={handlePaymentCancel}
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedPlan(plan.tier)}
                                            disabled={isCurrent}
                                            className="btn-gold"
                                            style={{
                                                width: '100%',
                                                background: isCurrent ? 'transparent' : 'var(--gold-grad)',
                                                border: isCurrent ? '1px solid var(--border-gold)' : 'none',
                                                color: isCurrent ? 'var(--text-tertiary)' : '#1A120E',
                                                opacity: isCurrent ? 0.6 : 1
                                            }}
                                        >
                                            {isCurrent ? 'Protocol Active' : 'Initiate Commission'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Comparison Section */}
                <div className="why-agioas stagger-appear delay-3">
                    <h2 style={{ marginBottom: 48, fontSize: 32 }}>The Executive Advantage</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                        <div>
                            <div style={{ width: 50, height: 50, background: 'rgba(212, 175, 104, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gold-mid)' }}>
                                <Target size={24} />
                            </div>
                            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Heuristic Realism</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Advanced AI models trained on elite corporate negotiation and boardroom dynamics.</p>
                        </div>

                        <div>
                            <div style={{ width: 50, height: 50, background: 'rgba(212, 175, 104, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gold-mid)' }}>
                                <BarChart size={24} />
                            </div>
                            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Audit-Ready Analytics</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Deep-dive performance tracking to identify weaknesses in your pitch and leadership style.</p>
                        </div>

                        <div>
                            <div style={{ width: 50, height: 50, background: 'rgba(212, 175, 104, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gold-mid)' }}>
                                <Lock size={24} />
                            </div>
                            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Sovereign Privacy</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Your strategy remains yours. All simulation data is encrypted and never utilized for training.</p>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '40px 0 100px 0', color: 'var(--text-tertiary)', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CreditCard size={14} /> SECURE RAZORPAY GATEWAY</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={14} /> 256-BIT ENCRYPTION</span>
                    </div>
                    © 2026 ASKLURK OPERATING SYSTEM. ALL RIGHTS RESERVED.
                </div>
            </div>
        </div>
    );
}

export default Upgrade;