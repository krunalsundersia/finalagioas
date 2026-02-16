# AGIOAS Platform Frontend

React-based frontend for AGIOAS simulation platform with 4 simulations, each offering both 3D and Chat interfaces.

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
│
├── src/
│   ├── index.js            # Entry point
│   ├── index.css           # Global styles + Tailwind
│   ├── App.js              # Main dashboard (76KB)
│   │
│   ├── simulations/        # Routing wrappers
│   │   ├── Boardroom.js    # Routes to 3D or Chat
│   │   ├── Vcs.js          # Routes to 3D or Chat
│   │   ├── Customer.js     # Routes to 3D or Chat
│   │   └── CeoCoach.js     # Routes to 3D or Chat
│   │
│   ├── frontpages/         # Configuration pages
│   │   ├── BoardroomFrontpage.js   # Boardroom config (67KB)
│   │   ├── VcsFrontpage.js         # VC config (43KB)
│   │   ├── CustomerFrontpage.js    # Customer config (38KB)
│   │   └── CeoCoachFrontpage.js    # CEO config (27KB)
│   │
│   ├── Vr/                 # 3D Interfaces
│   │   ├── boardroom.js    # Boardroom 3D (94KB)
│   │   ├── vc.js           # VC 3D (60KB)
│   │   ├── customer.js     # Customer 3D (41KB)
│   │   └── ceo.js          # CEO 3D (66KB)
│   │
│   ├── chat/               # Chat Interfaces
│   │   ├── boardroomchat.js    # Boardroom Chat (38KB)
│   │   ├── vcchat.js           # VC Chat (60KB)
│   │   ├── customerchat.js     # Customer Chat (42KB)
│   │   └── ceochat.js          # CEO Chat (24KB)
│   │
│   ├── dashboards/         # Analytics dashboards (to be implemented)
│   │
│   ├── services/           # API services
│   │   └── api.js          # Backend communication
│   │
│   ├── components/         # Reusable components
│   ├── utils/              # Utility functions
│   └── hooks/              # Custom React hooks
│
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

## Technology Stack

- **React 18.2** - UI library
- **React Router 6** - Client-side routing
- **Three.js + React Three Fiber** - 3D graphics
- **@react-three/drei** - Three.js helpers
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **WebSocket API** - Real-time communication
- **Recharts** - Data visualization

## User Flow

1. **Main Dashboard (App.js)**
   - User sees 4 simulation options
   - Selects a simulation type

2. **Frontpage (Configuration)**
   - User enters simulation-specific data
   - Chooses interface mode: 3D or Chat
   - Submits configuration

3. **Simulation Wrapper**
   - Receives userData and interfaceMode
   - Routes to appropriate interface component

4. **Interface (3D or Chat)**
   - Connects to backend WebSocket
   - Sends userData to backend
   - Backend knows: simulation type + interface mode + user data
   - Starts simulation session
   - User interacts with AI agents

5. **Session End**
   - Exports session data
   - Returns to dashboard

## Quick Start

### Prerequisites
```bash
Node.js 18+ and npm 9+
```

### Installation

```bash
# Navigate to frontend directory
cd agioas_production/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Environment Variables

Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws
```

## Available Scripts

### `npm start`
Runs the app in development mode at `http://localhost:3000`

### `npm build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

### `npm run lint`
Runs ESLint on all source files

### `npm run format`
Formats code with Prettier

## API Integration

### REST API Endpoints

All API calls go through the centralized `api.js` service:

```javascript
import { sessionAPI, chatAPI, uploadAPI, WebSocketManager } from './services/api';

// Start session
const response = await sessionAPI.start('boardroom', '3d', userData);

// Send chat message (REST fallback)
await chatAPI.sendMessage('boardroom', '3d', sessionId, message);

// Upload document (Boardroom only)
await uploadAPI.uploadDocument(sessionId, file);
```

### WebSocket Connection

```javascript
// Create WebSocket manager
const ws = new WebSocketManager('boardroom', '3d', sessionId);

// Connect
await ws.connect();

// Listen for messages
ws.on('character_response', (data) => {
  console.log('Character:', data.character_name);
  console.log('Message:', data.response);
  console.log('Animation:', data.animation);
});

// Send message
ws.send({
  type: 'user_message',
  message: 'My message text',
  metadata: {}
});

// Close connection
ws.close();
```

## Simulations Overview

### 1. Boardroom Simulation
**Frontpage**: BoardroomFrontpage.js
**3D Interface**: boardroom.js
**Chat Interface**: boardroomchat.js

**Features**:
- Board member AI agents with distinct personalities
- Consensus formation algorithms
- Second-order organizational impact reasoning
- Meta-board intelligence
- Board members discuss with each other before engaging user

**User Input**:
- Company name
- Proposal description
- Financial data
- Strategic context

### 2. VC Simulation
**Frontpage**: VcsFrontpage.js
**3D Interface**: vc.js
**Chat Interface**: vcchat.js

**Features**:
- Intent manipulation detection
- Adversarial negotiation intelligence
- Coalition formation (VCs join forces)
- Meta-portfolio optimization
- Claim tracking and verification

**User Input**:
- Startup name
- Pitch deck
- Traction metrics
- Team information
- Funding ask

### 3. Customer Simulation
**Frontpage**: CustomerFrontpage.js
**3D Interface**: customer.js
**Chat Interface**: customerchat.js

**Features**:
- Persona-based behavioral psychology
- Micro-expression detection from text
- Adaptive objection handling
- Buying signal detection

**User Input**:
- Product/service description
- Customer type (Enterprise, Startup, Technical)
- Value proposition
- Pricing

### 4. CEO Coach Simulation
**Frontpage**: CeoCoachFrontpage.js
**3D Interface**: ceo.js
**Chat Interface**: ceochat.js

**Features**:
- Thinking pattern recognition
- Isolation & information asymmetry reasoning
- Multi-pressure integration engine
- Long-arc vision coherence
- Wisdom quotes every 5-6 messages

**User Input**:
- Current challenges
- Strategic context
- Pressure sources
- Decision needs

## Component Guidelines

### Creating New Components

```javascript
// components/MyComponent.js
import React from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold">{prop1}</h2>
      <p className="text-gray-400">{prop2}</p>
    </div>
  );
};

export default MyComponent;
```

### Using Tailwind CSS

Pre-defined classes in `index.css`:
- `.card` - Card styling
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Input field
- `.textarea` - Textarea
- `.glass` - Glass morphism effect

### 3D Scene Best Practices

```javascript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

<Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  {/* Your 3D objects */}
  <OrbitControls />
</Canvas>
```

## Styling Guidelines

### Color Palette
- Primary: Blue (#3b82f6)
- Background: Dark Gray (#1a1a1a, #2a2a2a)
- Text: White (#ffffff)
- Secondary Text: Gray (#9ca3af)
- Borders: Dark Gray (#374151)

### Typography
- Headings: Bold, 2xl-4xl
- Body: Regular, base-lg
- Captions: Regular, sm

### Spacing
- Padding: 4, 6, 8
- Margin: 4, 6, 8
- Gap: 4, 6

## Performance Optimization

### Code Splitting
```javascript
import { lazy, Suspense } from 'react';

const Boardroom3D = lazy(() => import('./Vr/boardroom'));

<Suspense fallback={<Loading />}>
  <Boardroom3D />
</Suspense>
```

### Memoization
```javascript
import { memo, useMemo, useCallback } from 'react';

const MyComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => /* process */);
  }, [data]);

  const handleClick = useCallback(() => {
    /* handler */
  }, []);

  return /* JSX */;
});
```

## Build & Deployment

### Production Build
```bash
npm run build
```

Output: `build/` directory with optimized production files

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel)
```bash
# Build
npm run build

# Deploy build folder
```

#### 2. Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
```

#### 3. Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

## Troubleshooting

### Issue: WebSocket connection fails
**Solution**: Ensure backend is running and WS_BASE_URL is correct

### Issue: 3D scene not rendering
**Solution**: Check Three.js dependencies and browser WebGL support

### Issue: API calls returning 404
**Solution**: Verify backend URL in `.env` and that backend is running

### Issue: Slow performance in 3D
**Solution**: Reduce polygon count, optimize textures, use LOD (Level of Detail)

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Cypress)
```bash
npm install cypress --save-dev
npx cypress open
```

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

Proprietary - AGIOAS Platform

## Support

For issues or questions, contact the development team.
