import React, { useEffect, useState } from 'react';
import MatchCard from '../components/MatchCard';

const LIVE_API =
  'https://sportscanli-backend.onrender.com/api/basketball/live';
const TODAY_API =
  'https://sportscanli-backend.onrender.com/api/basketball/today';

// ----- Yardımcı Fonksiyonlar -----

// Maçları saate göre sırala (erken → geç)
function sortByGameTime(games) {
  return [...games].sort((a, b) => {
    const tA = a.date ? new Date(a.date).getTime() : Infinity;
    const tB = b.date ? new Date(b.date).getTime() : Infinity;
    return tA - tB;
  });
}

// Maç 1 saat içinde mi?
function isSoon(game) {
  if (!game.date) return false;
  const diff = new Date(game.date).getTime() - Date.now();
  return diff > 0 && diff <= 60 * 60 * 1000;
}

export default function BasketballPage() {
  const [games, setGames] = useState([]);
  const [mode, setMode] = useState('loading'); 
  // loading | live | today

  const fetchData = async () => {
    try {
      // 1️⃣ Önce LIVE dene
      const liveRes = await fetch(LIVE_API);
      const liveData = await liveRes.json();

      if (liveData.response && liveData.response.length > 0) {
        setGames(liveData.response);
        setMode('live');
        return;
      }

      // 2️⃣ LIVE yoksa TODAY
      const todayRes = await fetch(TODAY_API);
      const todayData = await todayRes.json();

      const sortedToday = sortByGameTime(todayData.response || []);
      setGames(sortedToday);
      setMode('today');
    } catch (e) {
      console.error(e);
      setMode('today');
    }
  };

  // Sayfa açılınca 1 kere
  useEffect(() => {
    fetchData();
  }, []);

  // Akşam canlı hatırlatması
  const nowHour = new Date().getHours();
  const showEveningHint = mode === 'today' && games.length > 0 && nowHour < 18;

  return (
    <div className="basketball-page">
      <h2>🏀 Basketbol</h2>

      <button onClick={fetchData}>Yenile</button>

      {/* DURUM MESAJLARI */}
      {mode === 'live' && (
        <p style={{ color: '#ff4d4f', fontWeight: 500 }}>
          🔴 Şu anda oynanan canlı basketbol maçları
        </p>
      )}

      {mode === 'today' && (
        <p style={{ color: '#999' }}>
          ℹ️ Şu an canlı maç yok, bugünkü basketbol maçları gösteriliyor
        </p>
      )}

      {showEveningHint && (
        <p style={{ color: '#00c896' }}>
          ⏳ Akşam saatlerinde canlı basketbol maçları başlayacaktır
        </p>
      )}

      {/* MAÇ LİSTESİ */}
      {games.length === 0 ? (
        <p>Bugün basketbol maçı bulunamadı.</p>
      ) : (
        games.map(g => (
          <div key={g.id} style={{ position: 'relative' }}>
            {/* ⏰ Yaklaşan Maç */}
            {mode === 'today' && isSoon(g) && (
              <span
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  fontSize: 11,
                  color: '#ffa940'
                }}
              >
                ⏰ Yaklaşıyor
              </span>
            )}

            <MatchCard
              fixture={g}
              sport="basketball"
              showLeague
            />
          </div>
        ))
      )}
    </div>
  );
}
