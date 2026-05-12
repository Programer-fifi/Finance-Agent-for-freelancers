import React, { useState } from 'react';
import { Lock, Bell, CreditCard, ChevronDown } from 'lucide-react';

const Banking = () => {
  const [accounts, setAccounts] = useState(['']); // array to hold multiple accounts

  const banks = ['Meezan', 'HBL', 'UBL', 'MCB', 'Easypaisa', 'JazzCash', 'Sadapay', 'Other'];

  const addAccount = () => {
    setAccounts([...accounts, '']);
  };

  const updateAccount = (index, value) => {
    const newAccs = [...accounts];
    newAccs[index] = value;
    setAccounts(newAccs);
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
        <Lock size={40} color="#4ade80" style={{ marginBottom: '15px' }} />
        <h2 style={{ marginBottom: '10px', color: '#C9A84C', fontSize: '1.2rem' }}>Bank Grade Security</h2>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.6', textAlign: 'left', opacity: 0.9, fontSize: '0.9rem' }}>
          <li>✓ No actual banking credentials ever stored</li>
          <li>✓ We only read SMS/Notifications to track expenses</li>
          <li>✓ Your data never leaves your device</li>
          <li>✓ 256-bit local encryption</li>
        </ul>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '15px' }}>Connected Accounts</h3>
        
        {accounts.map((acc, i) => (
          <div key={i} style={{ marginBottom: '10px', position: 'relative' }}>
            <select 
              className="stash-input" 
              value={acc} 
              onChange={(e) => updateAccount(i, e.target.value)}
              style={{ appearance: 'none', paddingRight: '30px' }}
            >
              <option value="" disabled>Select Bank / Wallet</option>
              {banks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown size={20} color="white" style={{ position: 'absolute', right: '10px', top: '12px', pointerEvents: 'none', opacity: 0.5 }} />
          </div>
        ))}
        
        <button onClick={addAccount} style={{ background: 'transparent', border: 'none', color: '#C9A84C', fontWeight: 'bold', cursor: 'pointer', padding: '5px 0' }}>
          + Add Another Account
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button className="stash-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Bell size={20} />
          Allow Notification Access
        </button>
        
        <button className="stash-btn" disabled style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'not-allowed' }}>
          <CreditCard size={20} />
          Connect Banking App <span style={{ fontSize: '0.7rem', background: '#C9A84C', color: 'black', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px' }}>Soon</span>
        </button>
      </div>
    </div>
  );
};

export default Banking;
