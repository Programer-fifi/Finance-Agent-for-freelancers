import React from 'react';

const Welcome = ({ onExplore, onConnectBank }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
      background: 'var(--bg-color)', zIndex: 100, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', textAlign: 'center'
    }}>
      <h1 style={{ color: '#C9A84C', fontSize: '3.5rem', marginBottom: '10px' }}>Stash</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '50px', fontSize: '1.2rem' }}>
        The smarter way to manage freelance money.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '300px' }}>
        <button onClick={onExplore} className="stash-btn" style={{ padding: '15px', fontSize: '1.1rem' }}>
          Explore App
        </button>
        <button onClick={onConnectBank} className="stash-btn" style={{ padding: '15px', fontSize: '1.1rem', background: 'transparent', border: '2px solid #C9A84C', color: '#C9A84C' }}>
          Connect Your Bank
        </button>
      </div>
    </div>
  );
};

export default Welcome;
