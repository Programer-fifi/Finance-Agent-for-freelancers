# Finance-Agent-for-freelancers
# 💰 Stash: AI Finance Friend for Freelancers

**Stash** is a privacy-first finance app built for Pakistani freelancers. It combines automated financial tracking with a bilingual AI companion (English + Roman Urdu) to help you manage earnings, budgets, taxes, and Zakat — effortlessly.

![Stash AI Companion](https://img.shields.io/badge/AI-Gemini%202.5-blue)
![React](https://img.shields.io/badge/Frontend-React%2019-teal)
![Vite](https://img.shields.io/badge/Build-Vite-purple)
![Privacy](https://img.shields.io/badge/Data-Local--First-green)

> ⚠️ **Prototype:** This demo uses a fictional wallet so you can experience the full feature set. In the production version, you'll connect your real bank accounts — Stash will then track live transactions, flag tax obligations automatically, and help you stay debt-free and compliant with FBR year-round.

---

## ✨ Features

- **🤖 AI Companion** — Stash Bot speaks English and Roman Urdu. Ask *"Kya main ye afford kar sakta hoon?"* and it checks your actual balance before answering.
- **💼 Stash Wallet** — Simulated bank account with auto currency conversion (USD/EUR → PKR using live rates).
- **🧾 Tax & Zakat** — Real-time FBR 1% foreign income tax estimate + Zakat alerts based on current Nisab thresholds.
- **💱 Live Rates** — Live tracking for major currencies.
- **📊 Budget Charts** — Visual spending vs. income breakdown via Recharts.
- **🔒 Local-Only Storage** — Your data never leaves your device. No cloud, no tracking, no account needed.

---

## 🔒 Privacy & Your Rights

Stash is built **local-first** — all data lives in your browser's local storage only.

- No data is collected, uploaded, or shared with any server
- No login or account required — nothing to breach
- You can wipe all data anytime by clearing your browser/app storage
- Pakistan's **PECA 2016** protects you against unauthorized access to personal data
- Under Pakistan's **Personal Data Protection Bill**, you have the right to access, correct, and erase your data
- The developer has no access to your financial information — ever

---

## 🛠️ Tech Stack

React 19 + Vite · Vanilla CSS (Dark Mode) · Recharts · Google Gemini 2.5 Flash · Browser LocalStorage

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Programer-fifi/Finance-Agent-for-freelancers.git
cd Finance-Agent-for-freelancers
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your API Key
The AI features require a Gemini API key.

1. Create a `.env` file in the root directory
2. Copy the contents of `.env.example` into it
3. Add your key:
```text
VITE_GEMINI_KEY=your_actual_key_here
```
Get a free key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

## 👩‍⚖️ Note for Judges

This project uses environment variables for API key security — a professional standard practice. Please follow Step 3 above before running. All tax and Zakat logic reflects Pakistani financial regulations as of 2026.

---

## ⚖️ Disclaimer
Stash is a tracking tool, not a licensed tax advisor. For official FBR filings, consult a certified tax professional.

*Built with ❤️ for the Pakistani Freelance Community · Hackathon Submission 2026*
