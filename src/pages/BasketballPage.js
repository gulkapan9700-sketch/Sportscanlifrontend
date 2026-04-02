import React, { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';

const API = 'https://sportscanli-backend.onrender.com/api/basketball/live';

export default function BasketballPage() {
  const [games, setGames] = useState([]);

  const fetchData = async () => {
    const r = await fetch(API);
    const d = await r.json();
    setGames(d.response || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>🏀 Canlı Basketbol</h2>
      <button onClick={fetchData}>Yenile</button>

      {games.length === 0
        ? <p>Canlı maç yok</p>
        : games.map(g => (
            <MatchCard
              key={g.id}
              fixture={g}
              sport="basketball"
              showLeague
            />
          ))
      }
    </div>
  );
}
``
