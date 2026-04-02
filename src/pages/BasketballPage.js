import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { getBasketballLive, getBasketballToday } from '../services/api';
import MatchCard from '../components/MatchCard';
import '../pages/FootballPage.css';

const TABS = [
  { id: 'live', label: '🔴 Canlı' },
  { id: 'today', label: '📅 Bugün' },
];

export default function BasketballPage() {
  const [tab, setTab] = useState('live');

  // ✅ CANLI BASKETBOL
  const liveQuery = useQuery({
    queryKey: ['basketball-live'],
    queryFn: getBasketballLive,
    enabled: tab === 'live',
    refetchInterval: (data) => {
      const count = data?.response?.length || 0;
      return count > 0 ? 15000 : 60000; // 🔥 AKILLI POLLING
    },
    refetchIntervalInBackground: false, // 🔥 ARKA PLANDA DUR
    staleTime: 0,
  });

  // ✅ BUGÜNKÜ MAÇLAR
  const todayQuery = useQuery({
    queryKey: ['basketball-today'],
    queryFn: getBasketballToday,
    enabled: tab === 'today',
    refetchInterval: 120000, // 2 dakika
    refetchIntervalInBackground: false,
    staleTime: 60000,
  });

  const activeQuery = tab === 'live' ? liveQuery : todayQuery;
  const games = activeQuery.data?.response || [];
  const liveCount = liveQuery.data?.response?.length || 0;

  return (
    <div className="football-page">
      <div className="page-header">
        <div className="page-header__left">
          <span className="page-header__sport-icon">🏀</span>
          <div>
            <h1 className="page-header__title">BASKETBOL</h1>
            <p className="page-header__sub">{games.length} maç</p>
          </div>
        </div>

        <button
          className="refresh-btn"
          onClick={() => activeQuery.refetch()}
          disabled={activeQuery.isFetching}
        >
          <RefreshCw
            size={14}
            className={activeQuery.isFetching ? 'spinning' : ''}
          />
          Yenile
        </button>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'live' && liveCount > 0 && (
              <span className="tab__count">{liveCount}</span>
            )}
          </button>
        ))}
      </div>

      {activeQuery.isLoading ? (
        <div className="match-list">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 68, borderRadius: 10 }}
            />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          {tab === 'live'
            ? 'Şu an canlı basketbol maçı yok.'
            : 'Bugün maç bulunamadı.'}
        </div>
      ) : (
        <div className="match-list">
          {games.map((g, i) => (
            <div
              key={g.id || i}
              className="fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <MatchCard
                fixture={g}
                sport="basketball"
                showLeague
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
