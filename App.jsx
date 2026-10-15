import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [resData, setResData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/stock/${ticker}`);
      const data = await res.json();
      setResData(data);
    } catch (err) {
      alert('Error fetching data');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', color: '#00eeff', fontFamily: 'monospace', background: '#000408', minHeight: '100vh' }}>
      <h1>⚡ AI STOCK TERMINAL</h1>
      <form onSubmit={handleSearch} style={{ margin: '20px 0' }}>
        <input 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)} 
          style={{ padding: '10px', background: '#010a10', color: '#fff', border: '1px solid #00eeff' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#00eeff', color: '#000', fontWeight: 'bold', marginLeft: '10px' }}>
          {loading ? 'SCANNING...' : 'SCAN'}
        </button>
      </form>

      {resData && (
        <div style={{ background: '#010e16', border: '1px solid #124b66', padding: '20px', borderRadius: '6px', maxWidth: '600px' }}>
          <h2>{resData.ticker} — ${resData.price}</h2>
          <p style={{ fontWeight: 'bold', color: resData.signal.includes('BULLISH') ? '#00ffaa' : '#ff3366' }}>
            {resData.signal}
          </p>
          <h3>Headlines:</h3>
          <ul>
            {resData.headlines.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);