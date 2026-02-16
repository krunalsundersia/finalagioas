/**
 * VC Simulation Wrapper
 * Routes to 3D or Chat interface based on user selection
 */

import React from 'react';
import VC3D from '../Vr/vc';
import VCChat from '../chat/vcchat';

const Vcs = ({ interfaceMode, userData, onBack }) => {
  if (!interfaceMode || !userData) {
    return <div>No configuration data. Please go back and configure the simulation.</div>;
  }

  if (interfaceMode === '3d') {
    return <VC3D userData={userData} onBack={onBack} />;
  } else if (interfaceMode === 'chat') {
    return <VCChat userData={userData} onBack={onBack} />;
  }

  return <div>Invalid interface mode</div>;
};

export default Vcs;
