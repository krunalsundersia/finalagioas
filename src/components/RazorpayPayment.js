// ============================================================================
// NEW FILE: frontend/src/components/RazorpayPayment.js
// Razorpay Payment Component
// ============================================================================

import React, { useState } from 'react';
import axios from 'axios';

const RazorpayPayment = ({ tier, tierName, price, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Razorpay SDK failed to load');
            }

            // Get auth token
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            // Create Razorpay order
            const orderResponse = await axios.post(
                'http://localhost:8000/api/v1/payment/create-order/',
                { tier },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { order_id, amount, currency, key } = orderResponse.data;

            // Razorpay payment options
            const options = {
                key: key,
                amount: amount,
                currency: currency,
                name: 'AGIOAS',
                description: tierName,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        const verifyResponse = await axios.post(
                            'http://localhost:8000/api/v1/payment/verify/',
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                tier: tier
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (verifyResponse.data.verified) {
                            alert('Payment successful! Your membership has been activated.');
                            if (onSuccess) onSuccess(verifyResponse.data.membership);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Payment verification error:', err);
                        setError('Payment verification failed. Please contact support.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: '', // Will be filled from user data
                    email: '', // Will be filled from user data
                },
                theme: {
                    color: '#3B82F6'
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        if (onCancel) onCancel();
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            console.error('Payment initiation error:', err);
            setError(err.response?.data?.error || err.message || 'Payment failed');
            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Processing...</span>
                    </div>
                ) : (
                    `Pay ₹${price} - Activate ${tierName}`
                )}
            </button>
        </div>
    );
};

export default RazorpayPayment;