import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Budget = ({ budget, setBudget, expenses, addExpense, totalExpenses, budgetSpentPercent }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [budgetInput, setBudgetInput] = useState('');

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!budgetInput || isNaN(budgetInput)) return;
    setBudget(parseFloat(budgetInput));
    setBudgetInput('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    addExpense({ amount: parseFloat(amount), description });
    setAmount('');
    setDescription('');
  };

  const remaining = Math.max(budget - totalExpenses, 0);
  const pieData = [
    { name: 'Spent', value: totalExpenses },
    { name: 'Remaining', value: remaining }
  ];

  let color = '#4ade80'; // green
  if (budgetSpentPercent >= 70) color = '#C9A84C'; // gold
  if (budgetSpentPercent >= 90) color = '#ef4444'; // red

  const COLORS = [color, 'rgba(255,255,255,0.1)'];

  // Daily spending data
  const dailyData = expenses.reduce((acc, curr) => {
    const day = new Date(curr.date).getDate().toString();
    const existing = acc.find(item => item.name === day);
    if (existing) existing.amount += curr.amount;
    else acc.push({ name: day, amount: curr.amount });
    return acc;
  }, []).slice(-7);

  return (
    <div>
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <h3>Monthly Budget</h3>
        {budget === 0 ? (
          <p style={{ marginTop: '15px', opacity: 0.7 }}>Add some income first to set your budget!</p>
        ) : (
          <div style={{ position: 'relative', height: '150px', marginTop: '15px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold' }}>
              {Math.round(budgetSpentPercent)}%
            </div>
            <p style={{ marginTop: '10px' }}>PKR {remaining.toLocaleString()} left</p>
          </div>
        )}
      </div>

      <form onSubmit={handleAddExpense} style={{ marginBottom: '30px' }}>
        <input 
          type="number" 
          placeholder="Expense Amount (PKR)" 
          className="stash-input" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          required
        />
        <input 
          type="text" 
          placeholder="Description (e.g. Groceries)" 
          className="stash-input" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
        <button type="submit" className="stash-btn" style={{ background: 'transparent', border: '1px solid #C9A84C', color: '#C9A84C' }}>Add Expense</button>
      </form>

      {expenses.length > 0 && (
        <>
          <h3 style={{ marginBottom: '15px' }}>Daily Spending</h3>
          <div style={{ height: '150px', width: '100%', marginBottom: '30px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="name" stroke="white" tick={{fill: 'white', fontSize: 12}} />
                <Tooltip contentStyle={{ background: '#1a1e24', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3 style={{ marginBottom: '15px' }}>Recent Expenses</h3>
          <div>
            {expenses.slice().reverse().map(item => (
              <div key={item.id} className="list-item">
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.description}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date(item.date).toLocaleDateString()}</div>
                </div>
                <div style={{ color: '#ef4444', fontWeight: 'bold' }}>-PKR {item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Budget;
