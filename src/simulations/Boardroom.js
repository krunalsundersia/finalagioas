/**
 * Boardroom Simulation Wrapper
 * Routes to 3D or Chat interface based on user selection
 */

import React from 'react';
import Boardroom3D from '../Vr/boardroom';
import BoardroomChat from '../chat/boardroomchat';

const Boardroom = ({ interfaceMode, userData, onBack }) => {
  if (!interfaceMode || !userData) {
    return <div>No configuration data. Please go back and configure the simulation.</div>;
  }

  if (interfaceMode === '3d') {
    return <Boardroom3D userData={userData} onBack={onBack} />;
  } else if (interfaceMode === 'chat') {
    return <BoardroomChat userData={userData} onBack={onBack} />;
  }

  return <div>Invalid interface mode</div>;
};

export default Boardroom;
