/**
 * Customer Simulation Wrapper
 * Routes to 3D or Chat interface based on user selection
 */

import React from 'react';
import Customer3D from '../Vr/customer';
import CustomerChat from '../chat/customerchat';

const Customer = ({ interfaceMode, userData, onBack }) => {
  // Props passed from App.js state management
  
  if (!interfaceMode || !userData) {
    return <div>No configuration data. Please go back and configure the simulation.</div>;
  }

  if (interfaceMode === '3d') {
    return <Customer3D userData={userData} onBack={onBack} />;
  } else if (interfaceMode === 'chat') {
    return <CustomerChat userData={userData} onBack={onBack} />;
  }

  return <div>Invalid interface mode</div>;
};

export default Customer;
