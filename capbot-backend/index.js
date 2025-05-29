// capbot-backend/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getGatePrices() {
  const res = await fetch('https://api.gate.io/api2/1/tickers');
  const data = await res.json();
  const prices = {};
  for (const key in data) {
    if (key.endsWith('_usdt')) {
      const symbol = key.replace('_usdt', '').toUpperCase() + 'USDT';
      prices[symbol] = parseFloat(data[key].last);
    }
  }
  return prices;
}

async function getMexcPrices() {
  const res = await fetch('https://contract.mexc.com/api/v1/contract/ticker');
  const json = await res.json();
  const prices = {};
  for (const item of json.data) {
    const symbol = item.symbol;
    prices[symbol] = parseFloat(item.lastPrice);
  }
  return prices;
}

app.get('/arbitrage-opportunities', async (req, res) => {
  try {
    const gate = await getGatePrices();
    const mexc = await getMexcPrices();

    const opportunities = [];
    for (const symbol in gate) {
      if (mexc[symbol]) {
        const buy = gate[symbol];
        const sell = mexc[symbol];
        const profit = ((sell - buy) / buy) * 100;

        if (profit > 0) {
          opportunities.push({
            symbol,
            buyExchange: 'Gate.io',
            sellExchange: 'MEXC',
            buyPrice: buy,
            sellPrice: sell,
            profit: profit.toFixed(2) + '%'
          });
        }
      }
    }

    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(port, () => {
  console.log(`Capbot backend rodando em http://localhost:${port}`);
});
