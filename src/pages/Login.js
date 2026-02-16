import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const GOOGLE_CLIENT_ID = '634946932681-sqptlo424t4k1lirtmf37a4dtmg3e061.apps.googleusercontent.com';

function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // Decode the JWT credential to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);

      console.log('Google user data:', decoded);

      // Try to login first
      try {
        const response = await authAPI.login({
          googleId: decoded.sub,
          email: decoded.email,
        });

        console.log('Login successful:', response.data);

        // Redirect to dashboard
        navigate('/');
      } catch (loginError) {
        // If login fails (user doesn't exist), try to register
        if (loginError.response?.status === 404 || loginError.response?.status === 400) {
          console.log('User not found, registering...');

          const registerResponse = await authAPI.register({
            googleId: decoded.sub,
            email: decoded.email,
            givenName: decoded.given_name || decoded.name,
            familyName: decoded.family_name || '',
            imageUrl: decoded.picture || '',
          });

          console.log('Registration successful:', registerResponse.data);

          // Redirect to dashboard
          navigate('/');
        } else {
          throw loginError;
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.response?.data?.error || 'Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    setError('Google authentication failed. Please try again.');
    setLoading(false);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
              AGIOAS
            </h1>
            <p className="text-gray-300 text-lg">AI-Powered Business Simulations</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Features */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Realistic VC pitch simulations</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Boardroom strategy sessions</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Customer interaction training</span>
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>CEO coaching & decision-making</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center mb-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="text-gray-300 mt-2">Authenticating...</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="300"
            />
          </div>

          {/* Terms */}
          <p className="text-gray-400 text-xs text-center">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;