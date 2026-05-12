import React from 'react';

const Onboarding = ({ onComplete }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
      background: 'var(--bg-color)', zIndex: 100, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px', textAlign: 'center'
    }}>
      <h1 style={{ color: '#C9A84C', fontSize: '3rem', marginBottom: '10px' }}>Stash</h1>
      
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
        <h3 style={{ marginBottom: '15px', color: '#C9A84C' }}>Privacy First:</h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
          <li>👀 We only READ your data, never touch money</li>
          <li>📱 Your data stays on YOUR phone only</li>
          <li>🤐 We never share anything with anyone</li>
          <li>⚖️ Under PECA 2016 your data is protected</li>
          <li>🚓 You can report any breach to FIA Cyber Crime Wing: 0800-FIA-FIA</li>
        </ul>
      </div>

      <p style={{ marginTop: '30px', fontSize: '1.1rem', fontStyle: 'italic' }}>
        "Yaar seriously padh lo, 30 seconds — pinky promise 🤙"
      </p>

      <button onClick={onComplete} className="stash-btn" style={{ marginTop: '40px', maxWidth: '300px', fontSize: '1.2rem', padding: '15px' }}>
        Let's Go!
      </button>
    </div>
  );
};

export default Onboarding;
