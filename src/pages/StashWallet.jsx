import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const StashWallet = ({ walletBalance, walletTransactions, addWalletTransaction, onBotReact }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('deposit');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    
    const numAmount = parseFloat(amount);
    
    // Prevent overdrawing if withdrawal
    if (type === 'withdraw' && numAmount > walletBalance) {
      alert('Insufficient funds in Stash Wallet!');
      return;
    }

    addWalletTransaction(type, numAmount, description || (type === 'deposit' ? 'Deposit' : 'Withdrawal'));
    
    // Trigger bot reaction
    if (type === 'deposit') {
      onBotReact('Aye aye! Paisa aa gaya! 💰', 'happy');
    } else {
      onBotReact('Kharcha ho gaya! Budget check karo 👀', 'worried');
    }

    setAmount('');
    setDescription('');
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2), rgba(0,0,0,0.4))', padding: '30px 20px', borderRadius: '20px', marginBottom: '25px', textAlign: 'center', border: '1px solid rgba(201, 168, 76, 0.3)' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '10px' }}>Stash Wallet Balance</h3>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#C9A84C' }}>
          <span style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '5px' }}>PKR</span>
          {walletBalance.toLocaleString()}
        </div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button 
            onClick={() => setType('deposit')}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: type === 'deposit' ? '#4ade80' : 'rgba(255,255,255,0.1)', color: type === 'deposit' ? '#1a1e24' : 'white' }}
          >
            Deposit
          </button>
          <button 
            onClick={() => setType('withdraw')}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', background: type === 'withdraw' ? '#ef4444' : 'rgba(255,255,255,0.1)', color: type === 'withdraw' ? '#1a1e24' : 'white' }}
          >
            Withdraw
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="number" 
            placeholder="Amount (PKR)" 
            className="stash-input" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required
          />
          <input 
            type="text" 
            placeholder="Description (Optional)" 
            className="stash-input" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <button type="submit" className="stash-btn" style={{ background: type === 'deposit' ? '#4ade80' : '#ef4444' }}>
            {type === 'deposit' ? 'Add Fake Money' : 'Remove Fake Money'}
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: '15px' }}>Transaction History</h3>
      <div>
        {walletTransactions.map(tx => (
          <div key={tx.id} className="list-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {tx.type === 'deposit' ? <ArrowDownCircle color="#4ade80" /> : <ArrowUpCircle color="#ef4444" />}
              <div>
                <div style={{ fontWeight: 'bold' }}>{tx.description}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(tx.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{ color: tx.type === 'deposit' ? '#4ade80' : '#ef4444', fontWeight: 'bold' }}>
              {tx.type === 'deposit' ? '+' : '-'}PKR {tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
        {walletTransactions.length === 0 && (
          <p style={{ opacity: 0.5, textAlign: 'center', marginTop: '20px' }}>No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default StashWallet;
