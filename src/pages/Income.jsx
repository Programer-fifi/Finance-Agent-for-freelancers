import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getLiveRates } from '../services/currencyService';

const Income = ({ incomeList, addIncome }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [description, setDescription] = useState('');
  const [rates, setRates] = useState({ USD: 278, EUR: 302 });

  useEffect(() => {
    getLiveRates().then(r => setRates(r));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    let amountPKR = parseFloat(amount);
    if (currency === 'USD') amountPKR = amountPKR * rates.USD;
    if (currency === 'EUR') amountPKR = amountPKR * rates.EUR;

    addIncome({ amount: parseFloat(amount), currency, amountPKR, description });
    setAmount('');
    setDescription('');
  };

  // Group by month for chart
  const monthlyData = incomeList.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.PKR += curr.amountPKR;
    } else {
      acc.push({ name: month, PKR: curr.amountPKR });
    }
    return acc;
  }, []).slice(-6); // last 6 months

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="number" 
            placeholder="Amount" 
            className="stash-input" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            style={{ flex: 2 }}
            required
          />
          <select 
            className="stash-input" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="PKR">PKR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <input 
          type="text" 
          placeholder="Description (e.g. Upwork Client)" 
          className="stash-input" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
        <button type="submit" className="stash-btn">Add Income</button>
      </form>

      <h3 style={{ marginBottom: '15px' }}>Earnings (Last 6 Months)</h3>
      <div style={{ height: '200px', width: '100%', marginBottom: '30px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="white" tick={{fill: 'white', fontSize: 12}} />
            <Tooltip contentStyle={{ background: '#1a1e24', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="PKR" fill="#C9A84C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginBottom: '15px' }}>Recent Entries</h3>
      <div>
        {incomeList.slice().reverse().map(item => (
          <div key={item.id} className="list-item">
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.description}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(item.date).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#C9A84C', fontWeight: 'bold' }}>+{item.currency} {item.amount.toLocaleString()}</div>
              {item.currency !== 'PKR' && <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>≈ PKR {Math.round(item.amountPKR).toLocaleString()}</div>}
            </div>
          </div>
        ))}
        {incomeList.length === 0 && <p style={{ opacity: 0.5, textAlign: 'center' }}>No income logged yet.</p>}
      </div>
    </div>
  );
};

export default Income;
