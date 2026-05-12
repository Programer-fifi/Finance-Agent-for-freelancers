import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TaxZakat = ({ totalIncome, estimatedTax, savings, isZakatDue, zakatAmount, zakatThreshold }) => {
  const pieData = [
    { name: 'Tax', value: estimatedTax },
    { name: 'Zakat', value: isZakatDue ? zakatAmount : 0 },
    { name: 'Expenses', value: Math.max(0, totalIncome - savings) },
    { name: 'Savings', value: Math.max(0, savings - (isZakatDue ? zakatAmount : 0) - estimatedTax) }
  ].filter(d => d.value > 0);

  const COLORS = ['#ef4444', '#C9A84C', '#3b82f6', '#4ade80'];

  return (
    <div>
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
        <h3 style={{ color: '#C9A84C', marginBottom: '10px' }}>FBR Tax Estimate</h3>
        <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '15px' }}>1% of foreign remittances (Upwork, Fiverr, etc.). Local PKR income is not included.</p>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>PKR {Math.round(estimatedTax).toLocaleString()}</div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
        <h3 style={{ color: '#C9A84C', marginBottom: '10px' }}>Zakat Calculator</h3>
        <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Current Savings Checked:</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>PKR {savings.toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '4px' }}>Nisab Threshold: PKR {zakatThreshold?.toLocaleString() || '120,000'}</div>
        </div>
        
        {isZakatDue ? (
          <>
            <div style={{ color: '#4ade80', marginBottom: '5px', fontWeight: 'bold' }}>✅ Zakat is Due (2.5%)</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>PKR {Math.round(zakatAmount).toLocaleString()}</div>
            <p style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.7 }}>Lunar year tracker: Active 🌙</p>
          </>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.5)' }}>Savings below Nisab. No Zakat due yet.</div>
        )}
      </div>

      {totalIncome > 0 && (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Income Breakdown</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value" label={false} stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1e24', border: 'none', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxZakat;
