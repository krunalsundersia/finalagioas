/**
 * UPGRADED API Service for AGIOAS Platform
 * ✅ Authentication APIs
 * ✅ Membership APIs
 * ✅ Usage & Activity APIs
 * ✅ All existing simulation APIs preserved
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

// ============================================================================
// AUTH TOKEN MANAGEMENT
// ============================================================================

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response || error);

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authAPI = {
  // Register with Google OAuth
  register: (googleData) => {
    return apiClient.post('auth/register/', {
      google_id: googleData.googleId,
      email: googleData.email,
      first_name: googleData.givenName,
      last_name: googleData.familyName,
      avatar_url: googleData.imageUrl,
    }).then(response => {
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      return response;
    });
  },

  // Login with Google OAuth
  login: (googleData) => {
    return apiClient.post('auth/login/', {
      google_id: googleData.googleId,
      email: googleData.email,
    }).then(response => {
      if (response.data.token) {
        setAuthToken(response.data.token);
      }
      return response;
    });
  },

  // Logout
  logout: () => {
    return apiClient.post('auth/logout/').finally(() => {
      removeAuthToken();
    });
  },

  // Get current user
  getCurrentUser: () => {
    return apiClient.get('auth/me/');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Get token
  getToken: () => {
    return getAuthToken();
  },

  // Set token manually
  setToken: (token) => {
    setAuthToken(token);
  },

  // Remove token
  removeToken: () => {
    removeAuthToken();
  },
};

// ============================================================================
// MEMBERSHIP API
// ============================================================================

export const membershipAPI = {
  // Purchase or upgrade membership
  purchase: (tier, paymentData = {}) => {
    return apiClient.post('membership/purchase/', {
      tier,
      payment_method: paymentData.method || 'card',
      amount_paid: paymentData.amount || 0,
    });
  },

  // Get membership status
  getStatus: () => {
    return apiClient.get('membership/status/');
  },

  // Check if can access simulation
  canAccess: (simulationType) => {
    return apiClient.get('membership/status/').then(response => {
      return response.data.can_access?.[simulationType] || false;
    });
  },
};

// ============================================================================
// DASHBOARD API (UPGRADED)
// ============================================================================

export const dashboardAPI = {
  // Get complete dashboard analytics
  getAnalytics: () => {
    return apiClient.get('dashboard/analytics/');
  },

  // Get activity feed
  getActivityFeed: () => {
    return apiClient.get('activity/feed/');
  },

  // Legacy method (kept for compatibility)
  get: (simulationType, sessionId) => {
    return apiClient.get(`dashboard/${simulationType}/${sessionId}`);
  },
};

// ============================================================================
// SESSION API (UPGRADED with membership validation)
// ============================================================================

export const sessionAPI = {
  // Start session (checks membership automatically on backend)
  // simulation_type must be the combined key e.g. 'vc_chat', 'boardroom_3d'
  // sent at the TOP LEVEL so the backend can find it in request.data.get('simulation_type')
  start: (simulationType, interfaceMode, userData) => {
    const endpoint = `${simulationType}/${interfaceMode}/sessions/start/`;
    const combinedType = `${simulationType}_${interfaceMode}`;
    return apiClient.post(endpoint, {
      simulation_type: combinedType,
      interface_mode: interfaceMode,
      user_data: userData,
    });
  },

  // Pause session
  pause: (simulationType, interfaceMode, sessionId) => {
    const endpoint = `${simulationType}/${interfaceMode}/sessions/${sessionId}/pause`;
    return apiClient.post(endpoint);
  },

  // End session (tracks usage automatically)
  end: (sessionId) => {
    return apiClient.post(`sessions/${sessionId}/end`);
  },

  // Get session details
  get: (sessionId) => {
    return apiClient.get(`sessions/${sessionId}`);
  },

  // Export session
  export: (sessionId) => {
    return apiClient.get(`sessions/${sessionId}/export`);
  },
};

// ============================================================================
// CHAT API (PRESERVED)
// ============================================================================

export const chatAPI = {
  sendMessage: (simulationType, interfaceMode, sessionId, message, metadata = {}) => {
    const endpoint = `${simulationType}/${interfaceMode}/sessions/${sessionId}/chat`;
    return apiClient.post(endpoint, {
      message,
      metadata,
    });
  },
};

// ============================================================================
// UPLOAD API (PRESERVED)
// ============================================================================

export const uploadAPI = {
  uploadDocument: (sessionId, file, documentType = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    return apiClient.post(`boardroom/3d/sessions/${sessionId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ============================================================================
// WEBSOCKET CONNECTION MANAGER (UPGRADED)
// ============================================================================

export class WebSocketManager {
  constructor(simulationType, interfaceMode, sessionId) {
    this.simulationType = simulationType;
    this.interfaceMode = interfaceMode;
    this.sessionId = sessionId;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.messageHandlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      const wsUrl = `${WS_BASE_URL}/${this.simulationType}/${this.interfaceMode}/${this.sessionId}/`;
      console.log(`Connecting to WebSocket: ${wsUrl}`);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          this._handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this._attemptReconnect();
      };
    });
  }

  _handleMessage(data) {
    const type = data.type || 'unknown';
    const handlers = this.messageHandlers.get(type) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in message handler for type '${type}':`, error);
      }
    });
  }

  _attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  on(messageType, handler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType).push(handler);
  }

  off(messageType, handler) {
    if (this.messageHandlers.has(messageType)) {
      const handlers = this.messageHandlers.get(messageType);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
      console.log('WebSocket message sent:', data);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// ============================================================================
// HEALTH CHECK (PRESERVED)
// ============================================================================

export const healthCheck = () => {
  return apiClient.get('/health');
};

export default apiClient;
// ============================================================================
// SESSION HISTORY & ANALYTICS API (NEW — Neon DB powered)
// ============================================================================

export const historyAPI = {
  // Get all messages for a session
  getSessionMessages: (sessionId) => {
    return apiClient.get(`sessions/${sessionId}/messages/`);
  },

  // Get all sessions for current user (with frontpage config + message count)
  getMySessions: (params = {}) => {
    return apiClient.get('sessions/my/', { params });
  },

  // Get frontpage config for a session
  getSessionConfig: (sessionId) => {
    return apiClient.get(`sessions/${sessionId}/config/`);
  },

  // Get full event audit trail for a session
  getSessionEvents: (sessionId) => {
    return apiClient.get(`sessions/${sessionId}/events/`);
  },

  // Get all events for current user (login times, simulations, durations)
  getMyEvents: (params = {}) => {
    return apiClient.get('events/my/', { params });
  },

  // Get aggregate usage stats
  getMyStats: () => {
    return apiClient.get('stats/my/');
  },
};

// ============================================================================
// FRONTPAGE CONFIG — Save config before launching simulation
// (Call this from each frontpage's handleStart/handleLaunch before sessionAPI.start)
// ============================================================================

export const frontpageAPI = {
  // Save frontpage form data (called automatically inside sessionAPI.start
  // on the backend — this is available if you need to call it manually)
  save: (sessionId, simulationSource, configData) => {
    return apiClient.post('frontpage/save/', {
      session_id: sessionId,
      simulation_source: simulationSource,
      config: configData,
    });
  },
};