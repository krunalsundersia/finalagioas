// ============================================================================
// NEW FILE: frontend/src/pages/Upgrade.js
// Membership Plans & Payment Page
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, CheckCircle } from 'lucide-react';
import RazorpayPayment from '../components/RazorpayPayment';
import axios from 'axios';

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
        if (tierName.includes('Premium')) return '👑';
        if (tierName.includes('Balanced')) return '⚖️';
        if (tierName.includes('Boardroom')) return '🏢';
        if (tierName.includes('CEO')) return '👔';
        if (tierName.includes('VC')) return '🎯';
        if (tierName.includes('Customer')) return '👥';
        return '⭐';
    };

    const getPlanColor = (tierName) => {
        if (tierName.includes('Premium')) return 'from-purple-500 to-pink-500';
        if (tierName.includes('Balanced')) return 'from-blue-500 to-cyan-500';
        if (tierName.includes('Boardroom')) return 'from-orange-500 to-red-500';
        if (tierName.includes('CEO')) return 'from-green-500 to-emerald-500';
        if (tierName.includes('VC')) return 'from-yellow-500 to-orange-500';
        return 'from-gray-500 to-slate-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
                <div className="text-white text-xl">Loading plans...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-400 hover:text-white mb-4"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="text-4xl font-bold text-white mb-2">Choose Your Plan</h1>
                <p className="text-gray-300">Unlock the full power of AGIOAS simulations</p>

                {currentMembership && (
                    <div className="mt-4 bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={20} />
                            <span>Current Plan: {currentMembership.tier_display}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Plans Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isPopular = plan.tier === 'PREMIUM_DAILY';
                    const isCurrent = currentMembership?.tier === plan.tier;

                    return (
                        <div
                            key={plan.tier}
                            className={`relative bg-white/10 backdrop-blur-lg rounded-xl p-6 border ${isPopular ? 'border-purple-500 scale-105' : 'border-white/20'
                                } ${isCurrent ? 'ring-2 ring-green-500' : ''} transition-all hover:scale-105`}
                        >
                            {/* Popular Badge */}
                            {isPopular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Crown size={14} />
                                        <span>POPULAR</span>
                                    </div>
                                </div>
                            )}

                            {/* Current Badge */}
                            {isCurrent && (
                                <div className="absolute -top-3 right-4">
                                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <CheckCircle size={12} />
                                        <span>ACTIVE</span>
                                    </div>
                                </div>
                            )}

                            {/* Plan Icon */}
                            <div className="text-6xl mb-4 text-center">
                                {getPlanIcon(plan.name)}
                            </div>

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-white mb-2 text-center">
                                {plan.name}
                            </h3>

                            {/* Price */}
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-white">
                                    ₹{plan.price}
                                </div>
                                <div className="text-gray-400 text-sm">for {plan.duration_days} days</div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-300">
                                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <div className="mt-auto">
                                {selectedPlan === plan.tier ? (
                                    <RazorpayPayment
                                        tier={plan.tier}
                                        tierName={plan.name}
                                        price={plan.price}
                                        onSuccess={handlePaymentSuccess}
                                        onCancel={handlePaymentCancel}
                                    />
                                ) : (
                                    <button
                                        onClick={() => setSelectedPlan(plan.tier)}
                                        disabled={isCurrent}
                                        className={`w-full font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 ${isCurrent
                                                ? 'bg-gray-500/50 cursor-not-allowed text-gray-400'
                                                : `bg-gradient-to-r ${getPlanColor(plan.name)} text-white hover:shadow-lg`
                                            }`}
                                    >
                                        {isCurrent ? 'Current Plan' : 'Select Plan'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Features Comparison */}
            <div className="max-w-7xl mx-auto mt-16 bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Why Choose AGIOAS?</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-white mb-2">Realistic AI Simulations</h3>
                        <p className="text-gray-400">Practice with AI that responds like real people</p>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-white mb-2">Performance Analytics</h3>
                        <p className="text-gray-400">Track your progress and improve over time</p>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
                        <p className="text-gray-400">Your data is encrypted and never shared</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upgrade;