<!-- Banner (upload a nice banner to ./assets/banner.png) -->
<p align="center">
  <img src="./assets/banner.png" alt="Crypto & Banking Simulation — Daniel Atu" width="100%" style="max-width:1100px; border-radius:12px;" />
</p>

# 🏦 Crypto & Banking Simulation - Safe-Pass
**Fun · Educational · Local-only**  
A realistic-looking banking & crypto wallet simulation that mimics deposits, withdrawals, transfers, and support requests — **no real money involved**.



<p align="center">
  <a href="#features">Features</a> ·
  <a href="#demo">Demo</a> ·
  <a href="#tech-stack">Tech</a> ·
  <a href="#setup">Setup</a> ·
  <a href="#disclaimer">Disclaimer</a> ·
  <a href="#contact">Contact</a>
</p>



## 🚀 Features
- Simulated user balances, deposits, withdrawals, and peer-to-peer transfers  
- Transaction history per user (local / demo data only)  
- Support ticket flow (request-based, not realtime)  
- Clean responsive UI to mimic a real fintech product  
  local-only mode — safe for demos and interviews



## 📷 Demo
> Replace `./public/demo.gif` with your actual demo GIF.

![App Demo](./public/demo.gif)



## 🛠 Tech Stack
React • Tailwind CSS • Node.js • Express (optional demo server) • Context API / Redux


## 📦 Quick setup (developer)
```bash
# clone & install
git clone https://github.com/Dalu-Atu/safe-pass.git
cd safe-pass
npm install

# dev
npm run dev

# build
npm run build
Notes


This project is intentionally local/demo-only. Do not connect production payment providers or real wallets.
⚠️ Disclaimer
This is a simulation. No real money, blockchain, or financial services are connected. All balances and transactions are fake and stored locally (or in a test DB) for demonstration and learning purposes only. Do not use this repository to handle real funds or real user data.
