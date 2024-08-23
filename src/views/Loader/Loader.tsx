import React from 'react';

import './Loader.css'; // Import your CSS file
import Logo from '@/components/layout/shared/Logo';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <Logo />
    </div>
  );
};

export default Loader;
