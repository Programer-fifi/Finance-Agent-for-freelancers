import React, { useState, useRef } from 'react';
import Bot from './components/Bot';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Income from './pages/Income';
import Budget from './pages/Budget';
import TaxZakat from './pages/TaxZakat';
import Currency from './pages/Currency';
import Banking from './pages/Banking';
import StashWallet from './pages/StashWallet';
import { useStore } from './hooks/useStore';
import './components/Navigation.css';

function App() {
  const store = useStore();
  const [currentPage, setCurrentPage] = useState('home');
  const botRef = useRef(null);

  if (!store.welcomeDone) {
    return (
      <Welcome 
        onExplore={() => {
          store.loadMockData();
          store.setWelcomeDone(true);
        }}
        onConnectBank={() => {
          store.setWelcomeDone(true);
          setCurrentPage('banking');
        }}
      />
    );
  }

  if (!store.onboardingDone) {
    return <Onboarding onComplete={() => store.setOnboardingDone(true)} />;
  }

  const handleBotReact = (msg, exp) => {
    if (botRef.current) {
      botRef.current.triggerReaction(msg, exp);
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'income': return <Income incomeList={store.incomeList} addIncome={store.addIncome} />;
      case 'budget': return <Budget budget={store.budget} expenses={store.expenses} addExpense={store.addExpense} totalExpenses={store.totalExpenses} budgetSpentPercent={store.budgetSpentPercent} />;
      case 'tax': return <TaxZakat totalIncome={store.totalIncome} estimatedTax={store.estimatedTax} savings={store.savings} isZakatDue={store.isZakatDue} zakatAmount={store.zakatAmount} zakatThreshold={store.ZAKAT_THRESHOLD} />;
      case 'currency': return <Currency />;
      case 'banking': return <Banking />;
      case 'wallet': return <StashWallet walletBalance={store.walletBalance} walletTransactions={store.walletTransactions} addWalletTransaction={store.addWalletTransaction} onBotReact={handleBotReact} />;
      default: return null;
    }
  };

  const getPageTitle = () => {
    switch(currentPage) {
      case 'income': return 'Income Tracker';
      case 'budget': return 'Budget & Expenses';
      case 'tax': return 'Tax & Zakat';
      case 'currency': return 'Live Currency';
      case 'banking': return 'Bank Connection';
      case 'wallet': return 'Stash Wallet';
      default: return '';
    }
  };

  return (
    <>
      {store.welcomeDone && (
        <button 
          onClick={() => {
            store.clearMockData();
            setCurrentPage('home');
          }}
          style={{ position: 'fixed', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '5px 10px', borderRadius: '8px', zIndex: 1000, fontSize: '0.8rem', cursor: 'pointer', backdropFilter: 'blur(5px)' }}
        >
          Exit Demo 🚪
        </button>
      )}
      <div className={`nav-container ${currentPage !== 'home' ? 'active' : ''}`}>
        <div className={currentPage !== 'home' ? 'bot-shrink' : ''} style={{ height: '100vh', pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot ref={botRef} store={store} navigate={setCurrentPage} isShrunk={currentPage !== 'home'} />
        </div>
      </div>

      <div className={`page-container ${currentPage !== 'home' ? 'active' : ''}`}>
        {currentPage !== 'home' && (
          <>
            <div className="page-header">
              <h2>{getPageTitle()}</h2>
              <button className="close-btn" onClick={() => setCurrentPage('home')}>&times;</button>
            </div>
            <div className="page-content">
              {renderPage()}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
