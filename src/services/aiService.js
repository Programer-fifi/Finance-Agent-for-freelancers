const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Stash, a witty and friendly AI finance companion for Pakistani freelancers.

STRICT RULES:
1. A [LIVE DATA] block contains the user's REAL financial numbers. Use these numbers as your source of truth.
2. NEVER mention the words "[LIVE DATA]" or "according to the data" in your response. Just use the numbers naturally as if you already know them.
3. Answer EVERY question intelligently whether financial or general conversation.
4. Detect language automatically:
   - Roman Urdu input → reply in Roman Urdu
   - English input → reply in English
   - Mixed → reply in Roman Urdu
5. Never say you cannot access data. You have it in the message context.
6. Be casual like a dost, use emojis naturally.
7. Keep replies short and punchy.

FOR FINANCIAL QUESTIONS & SPENDING ADVICE:
- Balance/wallet → use WalletBalance from [LIVE DATA]
- Spending advice → If a user asks "Can I afford X?", use your general knowledge to estimate the cost of X in Pakistan if they didn't specify a price.
- Then, compare that cost to their WalletBalance.
- Give a clear recommendation:
    * If cost < 10% of balance: "Bilkul jao, maza karo!"
    * If cost 10-30% of balance: "Affordable hai, par soch samajh kar."
    * If cost > 30% of balance: "Abhi ruko yaar, budget tight hai."
- Use exact numbers from [LIVE DATA] to justify your answer.

EXAMPLE REPLIES:
User: can I afford a new laptop?
Reply: Ek acha laptop Rs 80k-120k tak aata hai. Aapke paas Rs 300,000 hain, toh bilkul afford kar sakte ho! Make the smart move, choice is yours! 💻

User: burger khana hai
Reply: Burger toh Rs 800-1500 ka hoga. Aapka balance Rs 50,000 hai, toh tension hi nahi! Enjoy karo 🍔✨`;

let lastCallTime = 0;
const MIN_INTERVAL = 2000;

export const getAIResponse = async (message, retries = 2) => {
  const now = Date.now();
  const wait = MIN_INTERVAL - (now - lastCallTime);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCallTime = Date.now();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: SYSTEM_PROMPT + '\n\nUser message: ' + message
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.8
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Gemini error:', err);
      
      if (response.status === 429 && retries > 0) {
        console.log('Rate limited. Retrying in 3s...');
        await new Promise(r => setTimeout(r, 3000));
        return getAIResponse(message, retries - 1);
      }

      if (response.status === 429) {
        return "Yaar ek second ruko! Thora busy hoon (Rate Limit) 😅. Thora ruk kar try karein.";
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      return "Yaar samajh nahi aaya, dobara bolna? 🤔";
    }

    return data.candidates[0].content.parts[0].text.trim();

  } catch (error) {
    console.error('AI Error:', error);
    return "Yaar thora sa masla aa gaya! Dobara try karo 😅";
  }
};