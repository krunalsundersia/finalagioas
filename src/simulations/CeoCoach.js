/**
 * CEO Coach Simulation Wrapper
 * Routes to 3D or Chat interface based on user selection
 */

import React from 'react';
import CEO3D from '../Vr/ceo';
import CEOChat from '../chat/ceochat';

const CeoCoach = ({ interfaceMode, userData, onBack }) => {
  if (!interfaceMode || !userData) {
    return <div>No configuration data. Please go back and configure the simulation.</div>;
  }

  if (interfaceMode === '3d') {
    return <CEO3D userData={userData} onBack={onBack} />;
  } else if (interfaceMode === 'chat') {
    return <CEOChat userData={userData} onBack={onBack} />;
  }

  return <div>Invalid interface mode</div>;
};

export default CeoCoach;
