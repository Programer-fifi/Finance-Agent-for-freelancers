import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './Bot.css';
import { getAIResponse } from '../services/aiService';
import { getRatesHistory } from '../services/currencyService';

const PRIVACY_TIPS = [
  "Your data never leaves your phone 🔒",
  "No bank login needed, ever 😎",
  "Apka data apke phone mein safe hai 🛡️",
  "We don't track your spending 🙅",
  "PECA 2016 protects your data ⚖️",
  "FIA Cyber Crime: 0800-FIA-FIA 🚨"
];

const getBubbleDuration = (text) => {
  if (!text || typeof text !== 'string') return 8000;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.min(60000, Math.max(5000, wordCount * 1200));
};

const Bot = forwardRef(({ store, navigate, isShrunk }, ref) => {
  const [expression, setExpression] = useState('greeting');
  const [message, setMessage] = useState("Assalam o Alaikum! Main Stash hoon, tumhara finance dost! 🤖");
  const [isSubtle, setIsSubtle] = useState(false);
  const [inputText, setInputText] = useState('');
  const messageTimeoutRef = useRef(null);

  const showTemporaryMessage = (msg, exp = 'idle', duration = null, subtle = false) => {
    if (!duration) {
      const text = typeof msg === 'string' ? msg : 'short message';
      const wordCount = text.split(' ').length;
      if (wordCount <= 10) duration = 4000;
      else if (wordCount <= 20) duration = 7000;
      else if (wordCount <= 35) duration = 12000;
      else if (wordCount <= 50) duration = 20000;
      else duration = 60000;
    }
    setMessage(msg);
    setExpression(exp);
    setIsSubtle(subtle);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
      setExpression('idle');
      setIsSubtle(false);
    }, duration);
  };

  useImperativeHandle(ref, () => ({
    triggerReaction: (msg, exp) => {
      showTemporaryMessage(msg, exp, 4000);
    }
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpression('idle');
      setMessage('');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isShrunk) return;
    const interval = setInterval(() => {
      if (message && !isSubtle) return;
      const hist = getRatesHistory();
      let usdSpike = false;
      if (hist && hist.length > 1) {
        const today = hist[hist.length - 1];
        const yesterday = hist[hist.length - 2];
        if (yesterday.USD && Math.abs((today.USD - yesterday.USD) / yesterday.USD) * 100 > 2) usdSpike = true;
      }
      if (store.budgetSpentPercent >= 90) {
        showTemporaryMessage("BHAI RUKO! Budget almost khatam! 🚨", "worried");
      } else if (store.budgetSpentPercent >= 70) {
        showTemporaryMessage("Yaar budget ka 70% kharcha ho gaya! Thora ruko 👀", "worried");
      } else if (store.isZakatDue && Math.random() > 0.5) {
        showTemporaryMessage("Zakat ka waqt aa gaya yaar! 🌙", "thinking");
      } else if (usdSpike && Math.random() > 0.5) {
        showTemporaryMessage("USD rate upar gaya! Convert karein? 📈", "happy");
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [store, message, isSubtle, isShrunk]);

  useEffect(() => {
    if (isShrunk) return;
    const interval = setInterval(() => {
      if (!message || isSubtle) {
        const tip = PRIVACY_TIPS[Math.floor(Math.random() * PRIVACY_TIPS.length)];
        showTemporaryMessage(tip, "idle", 5000, true);
      }
    }, 120000);
    return () => clearInterval(interval);
  }, [message, isSubtle, isShrunk]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMessage = inputText;
    setInputText('');
    const lowerMsg = userMessage.toLowerCase();

    const isIncomeEntry = /\b(kama|earn\w*|income\w*|received|mila|mili|client|payment|milay|aaye)\b/i.test(lowerMsg);
    const isExpenseEntry = /\b(kharch|spend|spent|expense|paid|diya|buy|bought|purchase|nikal\w*)\b/i.test(lowerMsg);
    const amountMatch = lowerMsg.match(/(\d+\.?\d*)\s*(k|lakh|lac|m)?/i);

    if (amountMatch && (isIncomeEntry || isExpenseEntry)) {
      let amount = parseFloat(amountMatch[1]);
      const mult = amountMatch[2];
      if (mult === 'k') amount *= 1000;
      else if (mult === 'lakh' || mult === 'lac') amount *= 100000;
      else if (mult === 'm') amount *= 1000000;

      if (isIncomeEntry) {
        const hist = getRatesHistory();
        const rate = hist && hist.length > 0 ? hist[hist.length - 1].USD : 278;
        
        const isForeign = /\b(upwork|fiverr|client|dollar|usd|\$|foreign|overseas|abroad)\b/i.test(lowerMsg);
        const isUSD = /\b(dollar|usd|\$)\b/i.test(lowerMsg);
        
        let currency = 'PKR';
        let amountPKR = amount;
        let originalAmount = amount;

        if (isForeign || isUSD) {
          currency = 'USD'; // Default foreign to USD for simplicity in tracking
          if (isUSD) {
            amountPKR = amount * rate;
          } else {
            // It's a foreign platform but amount might be PKR or USD. 
            // If they didn't say PKR, assume it's USD or they want it taxed as foreign.
            if (!lowerMsg.includes('pkr')) {
              amountPKR = amount * rate;
              currency = 'USD';
            } else {
              currency = 'PKR'; // They said "50k PKR from Upwork"
              amountPKR = amount;
            }
          }
        }

        store.addIncome({ amount: originalAmount, currency, amountPKR, description: userMessage });
        
        // Use a slight timeout to let the store update its derived values
        setTimeout(() => {
          showTemporaryMessage(
            `✅ Income recorded!\n💰 Wallet: Rs ${store.walletBalance.toLocaleString()}\n📈 Total Tax: Rs ${Math.round(store.estimatedTax).toLocaleString()}`,
            "happy", 8000
          );
        }, 100);
      } else {
        store.addExpense({ amount, description: userMessage });
        setTimeout(() => {
          showTemporaryMessage(
            `📝 Expense logged!\n💰 Wallet: Rs ${store.walletBalance.toLocaleString()}\n📊 Budget: ${Math.round(store.budgetSpentPercent)}% used`,
            store.budgetSpentPercent >= 70 ? "worried" : "thinking", 8000
          );
        }, 100);
      }
      return;
    }

    const isNavCommand = /\b(open|show|go to|jao|kholo|dikha|le jao|navigate)\b/i.test(lowerMsg);
    if (isNavCommand) {
      if (/income|earning/i.test(lowerMsg)) { navigate('income'); showTemporaryMessage("Opening income tracker! 📊", "happy"); return; }
      if (/budget|expense/i.test(lowerMsg)) { navigate('budget'); showTemporaryMessage("Here's your budget! 💸", "happy"); return; }
      if (/tax|zakat|fbr/i.test(lowerMsg)) { navigate('tax'); showTemporaryMessage("Tax and Zakat details! 🧾", "thinking"); return; }
      if (/currency|usd|rate|dollar/i.test(lowerMsg)) { navigate('currency'); showTemporaryMessage("Live currency rates! 💱", "idle"); return; }
      if (/wallet|bank/i.test(lowerMsg)) { navigate('wallet'); showTemporaryMessage("Opening Stash Wallet! 💼", "happy"); return; }
      if (/report|log/i.test(lowerMsg)) { navigate('report'); showTemporaryMessage("Here's my activity log! 🤖", "idle"); return; }
    }

    console.log("Bot: Starting AI conversation for:", userMessage);
    setExpression('thinking');
    setMessage('Soch raha hoon... 🤔');
    setIsSubtle(false);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    try {
      const hist = getRatesHistory();
      const currentRate = hist && hist.length > 0 ? hist[hist.length - 1].USD : 278;

      const walletBalance = store.walletBalance || 0;
      const totalIncome = store.totalIncome || 0;
      const totalExpenses = store.totalExpenses || 0;
      const budgetPct = store.budgetSpentPercent || 0;
      const taxEstimate = store.estimatedTax || 0;
      const zakatDue = store.isZakatDue || false;
      const zakatAmount = store.zakatAmount || 0;

      const contextStr = `[LIVE DATA]
- Wallet Balance: Rs ${walletBalance.toLocaleString()}
- Total Income this period: Rs ${totalIncome.toLocaleString()}
- Total Expenses this period: Rs ${totalExpenses.toLocaleString()}
- Budget Used: ${Math.round(budgetPct)}%
- FBR Tax Estimate: Rs ${Math.round(taxEstimate).toLocaleString()}
- Zakat Due: ${zakatDue ? 'Yes, amount is Rs ' + Math.round(zakatAmount).toLocaleString() : 'No, savings below Nisab threshold'}
- Live USD Rate: ${currentRate} PKR per dollar

User message: ${userMessage}`;

      console.log("Bot: Requesting AI response...");
      const response = await getAIResponse(contextStr);
      console.log("Bot: Received AI response:", response);

      setMessage(response);

      const lowerResponse = response.toLowerCase();
      if (lowerResponse.includes('sorry') || lowerResponse.includes('ruko') || lowerResponse.includes('careful') || lowerResponse.includes('zyada')) {
        setExpression('worried');
      } else if (lowerResponse.includes('great') || lowerResponse.includes('maza') || response.includes('!') || lowerResponse.includes('mashallah')) {
        setExpression('happy');
      } else {
        setExpression('idle');
      }

      const duration = getBubbleDuration(response);
      console.log(`Bot: Bubble will show for ${duration}ms`);
      messageTimeoutRef.current = setTimeout(() => {
        setMessage('');
        setExpression('idle');
      }, duration);

    } catch (error) {
      console.error("Bot: AI Error:", error);
      showTemporaryMessage("Server thora busy hai! Dobara try karo 🙏", "worried", 5000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
      <div className={`bot-container robot ${expression}`}>
        {message && (
          <div className={`thought-bubble ${isSubtle ? 'subtle-tip' : ''}`} style={{ left: isShrunk ? '100px' : undefined }}>
            {typeof message === 'string'
              ? message.split('\n').map((line, i) => <div key={i}>{line}</div>)
              : message}
          </div>
        )}
        <div className="head-container">
          <div className="ear left"></div>
          <div className="head">
            <div className="screen">
              <div className="eyes">
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
              {expression === 'thinking' && <div className="gear">⚙️</div>}
            </div>
          </div>
          <div className="ear right"></div>
        </div>
        <div className="body-container">
          <div className="arm left"></div>
          <div className="body">
            <div className="chest-circle"></div>
          </div>
          <div className="arm right"></div>
        </div>
        {expression === 'happy' && (
          <div className="sparkles">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div>
        )}
      </div>
      <div className="input-container" style={{ opacity: isShrunk ? 0 : 1, pointerEvents: isShrunk ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
        />
        <button onClick={handleSend}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
});

export default Bot;