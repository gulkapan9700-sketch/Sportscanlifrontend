import React, { useEffect, useState } from 'react';

const API = 'https://sportscanli-backend.onrender.com/api/tennis/live';

export default function TennisPage() {
  const [matches, setMatches] = useState([]);

  const fetchData = async () => {
    const r = await fetch(API);
    const d = await r.json();
    setMatches(d.response || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>🎾 Canlı Tenis</h2>
      <button onClick={fetchData}>Yenile</button>

      {matches.length === 0
        ? <p>Canlı maç yok</p>
        : matches.map(m => (
            <div key={m.id}>
              {m.players?.home?.name} vs {m.players?.away?.name}
            </div>
          ))
      }
    </div>
  );
}
