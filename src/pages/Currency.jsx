import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getLiveRates, getRatesHistory } from '../services/currencyService';

const Currency = () => {
  const [rates, setRates] = useState({ USD: 0, EUR: 0, date: '' });
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState('');

  useEffect(() => {
    getLiveRates().then(r => {
      setRates(r);
      const hist = getRatesHistory();
      setHistory(hist);
      
      // Check if rate changed more than 2% compared to yesterday
      if (hist.length > 1) {
        const yesterday = hist[hist.length - 2];
        const change = Math.abs((r.USD - yesterday.USD) / yesterday.USD) * 100;
        if (change > 2) {
          setAlert(`USD rate changed by ${change.toFixed(1)}% today!`);
        }
      }
    });
  }, []);

  return (
    <div>
      {alert && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ {alert}
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <div style={{ opacity: 0.7, marginBottom: '5px' }}>PKR / USD</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#C9A84C' }}>{rates.USD ? rates.USD.toFixed(2) : '...'}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
          <div style={{ opacity: 0.7, marginBottom: '5px' }}>PKR / EUR</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#C9A84C' }}>{rates.EUR ? rates.EUR.toFixed(2) : '...'}</div>
        </div>
      </div>

      <h3 style={{ marginBottom: '15px' }}>USD Rate (Last 7 Days)</h3>
      <div style={{ height: '250px', width: '100%', marginBottom: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="white" tick={{fill: 'white', fontSize: 10}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
            <YAxis domain={['auto', 'auto']} stroke="white" tick={{fill: 'white', fontSize: 10}} width={40} />
            <Tooltip contentStyle={{ background: '#1a1e24', border: 'none', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="USD" stroke="#C9A84C" strokeWidth={3} dot={{ fill: '#C9A84C', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        Last updated: {rates.date}
      </div>
    </div>
  );
};

export default Currency;
