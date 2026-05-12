import { dataService } from './dataService';

const API_KEY = '847141e569ec48c8e1c914cd';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
const API_URL_EUR = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/EUR`;

export const getLiveRates = async () => {
  const today = new Date().toISOString().split('T')[0];
  const cacheKey = `rates_${today}`;
  
  // Try to get today's cached rates to avoid hitting API limits
  let cached = dataService.get(cacheKey, null);
  if (cached) return cached;

  try {
    const [resUSD, resEUR] = await Promise.all([
      fetch(API_URL),
      fetch(API_URL_EUR)
    ]);
    
    if (!resUSD.ok || !resEUR.ok) throw new Error('Failed to fetch rates');
    
    const dataUSD = await resUSD.json();
    const dataEUR = await resEUR.json();
    
    const rates = {
      USD: dataUSD.conversion_rates.PKR,
      EUR: dataEUR.conversion_rates.PKR,
      date: today
    };
    
    // Save today's rates (cache for 7 days)
    dataService.set(cacheKey, rates, 7);
    
    // Build history
    const history = dataService.get('rates_history', []);
    // Remove if already has today
    const updatedHistory = history.filter(h => h.date !== today);
    updatedHistory.push(rates);
    // Keep only last 7 days
    if (updatedHistory.length > 7) updatedHistory.shift();
    
    dataService.set('rates_history', updatedHistory, 30);
    
    return rates;
  } catch (err) {
    console.error(err);
    // Fallback to latest available history if offline
    const history = dataService.get('rates_history', []);
    if (history.length > 0) return history[history.length - 1];
    return { USD: 278.5, EUR: 302.1, date: today }; // Safe fallback
  }
};

export const getRatesHistory = () => {
  return dataService.get('rates_history', []);
};
