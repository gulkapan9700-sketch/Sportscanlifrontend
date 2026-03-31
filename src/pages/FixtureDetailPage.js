import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { getFootballFixture } from '../services/api';
import './FixtureDetailPage.css';

const EVENT_ICONS = {
  Goal: '⚽',
  Card: { Yellow: '🟨', Red: '🟥' },
  subst: '🔄',
  Var: '📺',
};

function getEventIcon(event) {
  if (event.type === 'Goal') return '⚽';
  if (event.type === 'Card') return event.detail === 'Yellow Card' ? '🟨' : '🟥';
  if (event.type === 'subst') return '🔄';
  if (event.type === 'Var') return '📺';
  return '•';
}

function StatBar({ label, home, away }) {
  const total = (home || 0) + (away || 0);
  const homePct = total === 0 ? 50 : Math.round((home / total) * 100);
  const awayPct = 100 - homePct;

  return (
    <div className="stat-bar">
      <span className="stat-bar__num stat-bar__num--home">{home ?? '—'}</span>
      <div className="stat-bar__info">
        <span className="stat-bar__label">{label}</span>
        <div className="stat-bar__track">
          <div className="stat-bar__fill stat-bar__fill--home" style={{ width: `${homePct}%` }} />
          <div className="stat-bar__fill stat-bar__fill--away" style={{ width: `${awayPct}%` }} />
        </div>
      </div>
      <span className="stat-bar__num stat-bar__num--away">{away ?? '—'}</span>
    </div>
  );
}

export default function FixtureDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState('events');

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['fixture-detail', id],
    queryFn: () => getFootballFixture(id),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="detail-loading">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: i === 0 ? 120 : 52, borderRadius: 10 }} />
        ))}
      </div>
    );
  }

  const fixture = data?.fixture?.response?.[0];
  const events = data?.events?.response || [];
  const stats = data?.stats?.response || [];

  if (!fixture) return <div className="empty-state">Maç bulunamadı.</div>;

  const { teams, goals, fixture: fix, league } = fixture;
  const isLive = ['1H','2H','ET','P','HT','BT'].includes(fix?.status?.short);
  const homeStats = stats.find(s => s.team?.id === teams?.home?.id)?.statistics || [];
  const awayStats = stats.find(s => s.team?.id === teams?.away?.id)?.statistics || [];

  const statPairs = homeStats.map((hs, i) => ({
    label: hs.type,
    home: hs.value,
    away: awayStats[i]?.value,
  })).filter(s => s.home !== null || s.away !== null);

  return (
    <div className="detail-page">
      <div className="detail-back">
        <Link to="/futbol" className="back-btn">
          <ArrowLeft size={14} /> Geri
        </Link>
        <span className="detail-league">
          {league?.flag && <img src={league.flag} alt="" style={{ width: 16, height: 12, borderRadius: 2, objectFit: 'cover' }} />}
          {league?.name} · {league?.country}
        </span>
        <button className="refresh-btn" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw size={13} className={isFetching ? 'spinning' : ''} />
        </button>
      </div>

      {/* Scoreboard */}
      <div className={`scoreboard ${isLive ? 'scoreboard--live' : ''}`}>
        <div className="scoreboard__team scoreboard__team--home">
          {teams?.home?.logo && <img src={teams.home.logo} alt={teams.home.name} className="scoreboard__logo" />}
          <span className="scoreboard__team-name">{teams?.home?.name}</span>
        </div>

        <div className="scoreboard__center">
          <div className={`scoreboard__status ${isLive ? 'scoreboard__status--live' : ''}`}>
            {isLive && <span className="live-dot" />}
            {fix?.status?.long || fix?.status?.short}
            {fix?.status?.elapsed && ` ${fix.status.elapsed}'`}
          </div>
          <div className="scoreboard__score">
            <span>{goals?.home ?? '—'}</span>
            <span className="scoreboard__score-sep">:</span>
            <span>{goals?.away ?? '—'}</span>
          </div>
          <div className="scoreboard__date">
            {fix?.date && new Date(fix.date).toLocaleDateString('tr-TR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>

        <div className="scoreboard__team scoreboard__team--away">
          <span className="scoreboard__team-name">{teams?.away?.name}</span>
          {teams?.away?.logo && <img src={teams.away.logo} alt={teams.away.name} className="scoreboard__logo" />}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'events', label: '📋 Olaylar' },
          { id: 'stats', label: '📊 İstatistik' },
        ].map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Events */}
      {tab === 'events' && (
        events.length === 0 ? (
          <div className="empty-state">Henüz olay kaydedilmedi.</div>
        ) : (
          <div className="events-list">
            {events.map((ev, i) => {
              const isHome = ev.team?.id === teams?.home?.id;
              return (
                <div key={i} className={`event-row ${isHome ? 'event-row--home' : 'event-row--away'}`}>
                  <span className="event-row__time">{ev.time?.elapsed}'</span>
                  <span className="event-row__icon">{getEventIcon(ev)}</span>
                  <div className="event-row__info">
                    <span className="event-row__player">{ev.player?.name || '—'}</span>
                    {ev.assist?.name && <span className="event-row__assist">↳ {ev.assist.name}</span>}
                  </div>
                  <span className="event-row__team">{ev.team?.name}</span>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Stats */}
      {tab === 'stats' && (
        statPairs.length === 0 ? (
          <div className="empty-state">İstatistik henüz mevcut değil.</div>
        ) : (
          <div className="stats-section">
            <div className="stats-section__teams">
              <span>{teams?.home?.name}</span>
              <span>{teams?.away?.name}</span>
            </div>
            {statPairs.map((s, i) => (
              <StatBar key={i} label={s.label} home={s.home} away={s.away} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
