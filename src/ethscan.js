    import React from 'react';

const EventsViewer = () => {
  return (
    <div>
      <iframe
        title="Etherscan"
        src="https://sepolia.etherscan.io/"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none'
        }}
      />
    </div>
  );
};

export default EventsViewer;


