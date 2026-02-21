import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { ShieldCheck, Briefcase, Users, Crown, AlertTriangle, ChevronRight } from 'lucide-react';

const GOOGLE_CLIENT_ID = '408257016803-5gapb07e29acavrhu804ole6nrlj0jsm.apps.googleusercontent.com';

// --- THEMED STYLES ---
const LOGIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Cinzel:wght@400;500;600;700;900&display=swap');

  .login-page {
    --bg-app: #1c1410;
    --bg-card: #1e1610;
    --gold-mid: #dc9a14;
    --gold-bright: #ffd700;
    --text-primary: #E8E0D5;
    --text-secondary: #dc9a14;
    --font-display: 'Cinzel', serif;
    --font-body: 'Inter', sans-serif;
    --gold-grad: linear-gradient(135deg, #9C7840 0%, #E8CD8C 50%, #9C7840 100%);
    
    min-height: 100vh;
    background: radial-gradient(circle at 50% -20%, #150f0b 0%, #0F0A08 70%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-body);
    color: var(--text-primary);
    padding: 24px;
  }

  .dossier-card {
    background: var(--bg-card);
    width: 100%;
    max-width: 480px;
    border: 1px solid rgba(196, 168, 111, 0.2);
    border-radius: 4px;
    padding: 56px;
    position: relative;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.5);
    overflow: hidden;
  }

  /* Wood Grain Overlay */
  .dossier-card::before {
    content: ''; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px);
    pointer-events: none;
  }

  .gold-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-mid), transparent);
    margin: 32px 0;
    opacity: 0.5;
  }

  .feature-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    color: #a67c2e;
    font-size: 13px;
    letter-spacing: 0.02em;
  }

  .feature-icon {
    color: var(--gold-mid);
    flex-shrink: 0;
  }

  .error-box {
    background: rgba(138, 58, 58, 0.1);
    border: 1px solid #8A3A3A;
    color: #E8D5D5;
    padding: 16px;
    border-radius: 2px;
    font-size: 13px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid rgba(220, 154, 20, 0.2);
    border-top-color: var(--gold-bright);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  
  .fade-in { animation: fadeIn 0.8s ease-out forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // Decode JWT
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);

      // ✅ FIX: Build profile object from Google JWT and save to localStorage
      // UserContext reads from localStorage — without this, profile is always null
      // and the dashboard shows "U" / "User" instead of the real name + photo
      const userProfile = {
        googleId: decoded.sub,
        name: decoded.name || '',
        firstName: decoded.given_name || decoded.name?.split(' ')[0] || '',
        lastName: decoded.family_name || decoded.name?.split(' ').slice(1).join(' ') || '',
        email: decoded.email || '',
        picture: decoded.picture || '',
      };
      localStorage.setItem('user_profile', JSON.stringify(userProfile));

      try {
        // Attempt Login
        const response = await authAPI.login({
          googleId: decoded.sub,
          email: decoded.email,
        });
        navigate('/dashboard');
      } catch (loginError) {
        // Fallback to Registration
        if (loginError.response?.status === 404 || loginError.response?.status === 400) {
          await authAPI.register({
            googleId: decoded.sub,
            email: decoded.email,
            givenName: decoded.given_name || decoded.name,
            familyName: decoded.family_name || '',
            imageUrl: decoded.picture || '',
          });
          navigate('/');
        } else {
          throw loginError;
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authorization failed. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Handshake failed. Google authentication refused.');
    setLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <style>{LOGIN_STYLES}</style>
      <div className="login-page">
        <div className="dossier-card fade-in">

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--gold-mid)', letterSpacing: '0.3em', marginBottom: 8, textTransform: 'uppercase' }}>
              Strategic Intelligence Portal
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '48px',
              color: 'var(--text-primary)',
              margin: 0,
              textShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}>
              ASKLURK
            </h1>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, fontStyle: 'italic' }}>
              Advanced Executive OS
            </div>
          </div>

          <div className="gold-divider" />

          {/* Value Propositions */}
          <div style={{ marginBottom: 40 }}>
            <div className="feature-row">
              <ShieldCheck className="feature-icon" size={18} />
              <span>Realistic VC Pitch Wargames</span>
            </div>
            <div className="feature-row">
              <Briefcase className="feature-icon" size={18} />
              <span>Boardroom Strategy Calibration</span>
            </div>
            <div className="feature-row">
              <Users className="feature-icon" size={18} />
              <span>Enterprise Negotiation Training</span>
            </div>
            <div className="feature-row">
              <Crown className="feature-icon" size={18} />
              <span>Elite CEO Mentorship AI</span>
            </div>
          </div>

          {/* Error Status */}
          {error && (
            <div className="error-box">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* Auth Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--gold-mid)' }}>
                <div className="loading-spinner" />
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em' }}>VERIFYING CREDENTIALS...</span>
              </div>
            ) : (
              <div style={{
                padding: '4px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '4px',
                border: '1px solid rgba(196, 168, 111, 0.1)'
              }}>
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="320"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <p style={{ color: '#555', fontSize: '10px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              BY INITIATING PROTOCOL, YOU AGREE TO THE <br />
              <a href="#" style={{ color: 'var(--gold-mid)', textDecoration: 'none' }}>TERMS OF ENGAGEMENT</a> & <br />
              <a href="#" style={{ color: 'var(--gold-mid)', textDecoration: 'none' }}>PRIVACY GOVERNANCE</a>
            </p>
          </div>

          {/* Bottom Badge */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gold-grad)'
          }} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;