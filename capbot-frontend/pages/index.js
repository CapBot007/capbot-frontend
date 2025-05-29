import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3001/arbitrage-opportunities');
      const json = await res.json();
      setData(json);
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Capbot - Oportunidades de Arbitragem</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3">Token</th>
            <th className="p-3">Compra</th>
            <th className="p-3">Venda</th>
            <th className="p-3">Lucro (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-900 border-b border-gray-700">
              <td className="p-3">{item.symbol}</td>
              <td className="p-3">{item.buyExchange}: ${item.buyPrice}</td>
              <td className="p-3">{item.sellExchange}: ${item.sellPrice}</td>
              <td className="p-3 text-green-400 font-semibold">{item.profit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
