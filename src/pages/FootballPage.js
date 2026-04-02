import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { getFootballLive, getFootballToday } from '../services/api';
import MatchCard from '../components/MatchCard';
import './FootballPage.css';

const TABS = [
  { id: 'live', label: '🔴 Canlı' },
  { id: 'today', label: '📅 Bugün' },
];

function groupByLeague(fixtures) {
  const groups = {};
  fixtures.forEach(f => {
    const key = `${f.league?.id}`;
    if (!groups[key]) {
      groups[key] = {
        league: f.league,
        country: f.league?.country,
        flag: f.league?.flag,
        fixtures: [],
      };
    }
    groups[key].fixtures.push(f);
  });
  return Object.values(groups);
}

export default function FootballPage() {
  const [tab, setTab] = useState('live');

  // ✅ CANLI
  const liveQuery = useQuery({
    queryKey: ['football-live'],
    queryFn: getFootballLive,
    enabled: tab === 'live',
    refetchInterval: (data) => {
      const count = data?.response?.length || 0;
      return count > 0 ? 15000 : 60000; // 🔥 AKILLI POLLING
    },
    refetchIntervalInBackground: false, // 🔥 ARKA PLANDA DUR
    staleTime: 0,
  });

  // ✅ BUGÜN
  const todayQuery = useQuery({
    queryKey: ['football-today'],
    queryFn: getFootballToday,
    enabled: tab === 'today',
    refetchInterval: 120000, // 2 dk
    refetchIntervalInBackground: false,
    staleTime: 60000,
  });

  const activeQuery = tab === 'live' ? liveQuery : todayQuery;
  const fixtures = activeQuery.data?.response || [];
  const groups = groupByLeague(fixtures);
  const liveCount = liveQuery.data?.response?.length || 0;

  return (
    <div className="football-page">
      <div className="page-header">
        <div className="page-header__left">
          <span className="page-header__sport-icon">⚽</span>
          <div>
            <h1 className="page-header__title">FUTBOL</h1>
            <p className="page-header__sub">{fixtures.length} maç</p>
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
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 68, borderRadius: 10 }}
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          {tab === 'live'
            ? 'Şu an canlı maç yok.'
            : 'Bugün maç bulunamadı.'}
        </div>
      ) : (
        <div className="league-groups">
          {groups.map((group, gi) => (
            <div
              key={gi}
              className="league-group fade-in-up"
              style={{ animationDelay: `${gi * 0.05}s` }}
            >
              <div className="league-group__header">
                {group.flag && (
                  <img
                    src={group.flag}
                    alt={group.country}
                    className="league-group__flag"
                  />
                )}
                {group.league?.logo && (
                  <img
                    src={group.league.logo}
                    alt={group.league.name}
                    className="league-group__logo"
                  />
                )}
                <div className="league-group__info">
                  <span className="league-group__name">
                    {group.league?.name}
                  </span>
                  <span className="league-group__country">
                    {group.country}
                  </span>
                </div>
                <span className="league-group__count">
                  {group.fixtures.length}
                </span>
              </div>

              <div className="league-group__matches">
                {group.fixtures.map((f, fi) => (
                  <MatchCard
                    key={f.fixture?.id || fi}
                    fixture={f}
                    sport="football"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
