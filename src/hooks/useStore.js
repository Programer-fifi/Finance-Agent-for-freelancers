import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const useStore = () => {
  const [welcomeDone, setWelcomeDone] = useState(() => dataService.get('welcomeDone', false));
  const [onboardingDone, setOnboardingDone] = useState(() => dataService.get('onboardingDone', false));
  const [incomeList, setIncomeList] = useState(() => dataService.get('incomeList', []));
  const [expenses, setExpenses] = useState(() => dataService.get('expenses', []));
  const [walletTransactions, setWalletTransactions] = useState(() => dataService.get('walletTransactions', []));
  const [autonomousLogs, setAutonomousLogs] = useState(() => dataService.get('autonomousLogs', []));
  const [scheduledPayments, setScheduledPayments] = useState(() => dataService.get('scheduledPayments', []));

  useEffect(() => { dataService.set('welcomeDone', welcomeDone); }, [welcomeDone]);
  useEffect(() => { dataService.set('onboardingDone', onboardingDone); }, [onboardingDone]);
  useEffect(() => { dataService.set('incomeList', incomeList, 395); }, [incomeList]);
  useEffect(() => { dataService.set('expenses', expenses, 395); }, [expenses]);
  useEffect(() => { dataService.set('walletTransactions', walletTransactions, 395); }, [walletTransactions]);
  useEffect(() => { dataService.set('autonomousLogs', autonomousLogs, 30); }, [autonomousLogs]);
  useEffect(() => { dataService.set('scheduledPayments', scheduledPayments, 395); }, [scheduledPayments]);

  // ALL derived values calculated from single source of truth
  const totalIncome = incomeList.reduce((acc, curr) => acc + Number(curr.amountPKR || curr.amount || 0), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const walletBalance = totalIncome - totalExpenses;
  const budget = totalIncome;
  const budgetSpentPercent = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const totalForeignIncome = incomeList
    .filter(i => i.currency !== 'PKR')
    .reduce((acc, curr) => acc + Number(curr.amountPKR || 0), 0);
  const estimatedTax = totalForeignIncome * 0.01;
  const savings = walletBalance;
  
  const ZAKAT_THRESHOLD = 120000;
  const isZakatDue = savings >= ZAKAT_THRESHOLD;
  const zakatAmount = isZakatDue ? savings * 0.025 : 0;

  const addIncome = (item) => {
    const newItem = {
      id: Date.now(),
      amount: item.amountPKR || item.amount || 0,
      amountPKR: item.amountPKR || item.amount || 0,
      currency: item.currency || 'PKR',
      description: item.description || 'Income',
      date: item.date || new Date().toISOString()
    };
    setIncomeList(prev => [...prev, newItem]);
  };

  const addExpense = (item) => {
    const newItem = {
      id: Date.now(),
      amount: item.amount || 0,
      description: item.description || 'Expense',
      date: item.date || new Date().toISOString()
    };
    setExpenses(prev => [...prev, newItem]);
  };

  const addAutoLog = (actionType, description) => {
    const log = {
      id: Date.now(),
      actionType,
      description,
      time: new Date().toLocaleTimeString()
    };
    setAutonomousLogs(prev => [log, ...prev].slice(0, 50));
  };

  const addWalletTransaction = (type, amount, description) => {
    const tx = {
      id: Date.now(),
      type,
      amount,
      description,
      date: new Date().toISOString()
    };
    setWalletTransactions(prev => [tx, ...prev]);
    if (type === 'deposit') {
      addIncome({
        amount,
        amountPKR: amount,
        currency: 'PKR',
        description: `Wallet Deposit: ${description}`
      });
      addAutoLog('wallet_deposit', `Deposited Rs ${amount.toLocaleString()} - ${description}`);
    } else if (type === 'withdraw') {
      addExpense({
        amount,
        description: `Wallet Withdraw: ${description}`
      });
      addAutoLog('wallet_withdraw', `Withdrew Rs ${amount.toLocaleString()} - ${description}`);
    }
  };

  const addScheduledPayment = (payment) => {
    setScheduledPayments(prev => [...prev, {
      id: Date.now(),
      ...payment,
      active: true
    }]);
  };

  const removeScheduledPayment = (id) => {
    setScheduledPayments(prev => prev.filter(p => p.id !== id));
  };

  const loadMockData = () => {
    const now = new Date();
    const daysAgo = (days) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

    setIncomeList([
      { id: 1, amount: 45000, currency: 'PKR', amountPKR: 45000, description: 'Upwork Client', date: daysAgo(2) },
      { id: 2, amount: 28500, currency: 'PKR', amountPKR: 28500, description: 'Fiverr Project', date: daysAgo(7) },
      { id: 3, amount: 72000, currency: 'PKR', amountPKR: 72000, description: 'Direct Client', date: daysAgo(14) },
      { id: 4, amount: 38000, currency: 'PKR', amountPKR: 38000, description: 'Upwork Client', date: daysAgo(30) },
      { id: 5, amount: 55000, currency: 'PKR', amountPKR: 55000, description: 'Freelance Project', date: daysAgo(35) }
    ]);

    setExpenses([
      { id: 1, amount: 25000, description: 'Rent', date: daysAgo(1) },
      { id: 2, amount: 8500, description: 'Groceries', date: daysAgo(3) },
      { id: 3, amount: 3200, description: 'Transport', date: daysAgo(5) },
      { id: 4, amount: 2100, description: 'Utilities', date: daysAgo(10) },
      { id: 5, amount: 1800, description: 'Internet', date: daysAgo(12) }
    ]);

    setWalletTransactions([]);
    setAutonomousLogs([]);
    setScheduledPayments([
      { id: 1, name: 'Internet Bill', amount: 2500, dayOfMonth: 15, active: true },
      { id: 2, name: 'Electricity Bill', amount: 3500, dayOfMonth: 20, active: true },
      { id: 3, name: 'House Rent', amount: 25000, dayOfMonth: 1, active: true }
    ]);
  };

  const clearMockData = () => {
    setWelcomeDone(false);
    setOnboardingDone(false);
    setIncomeList([]);
    setExpenses([]);
    setWalletTransactions([]);
    setAutonomousLogs([]);
    setScheduledPayments([]);
  };

  return {
    welcomeDone, setWelcomeDone,
    onboardingDone, setOnboardingDone,
    incomeList, addIncome,
    expenses, addExpense,
    budget,
    totalIncome, totalExpenses,
    walletBalance, walletTransactions, addWalletTransaction,
    budgetSpentPercent,
    estimatedTax, savings,
    isZakatDue, zakatAmount,
    autonomousLogs, addAutoLog,
    scheduledPayments, addScheduledPayment, removeScheduledPayment,
    loadMockData, clearMockData
  };
};