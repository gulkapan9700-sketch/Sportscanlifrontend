import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getF1Races, getF1Standings } from '../services/api';
import '../pages/FootballPage.css';
import './Formula1Page.css';

const TABS = [
  { id: 'races', label: '🏁 Yarışlar' },
  { id: 'standings', label: '🏆 Şampiyona' },
];

function RaceCard({ race, index }) {
  const date = race.date ? new Date(race.date) : null;
  const isPast = date && date < new Date();

  return (
    <div className="race-card fade-in-up" style={{ animationDelay: `${index * 0.04}s` }}>
      <div className="race-card__round">TUR {race.id || index + 1}</div>
      <div className="race-card__info">
        <h3 className="race-card__name">{race.competition?.name || race.name || 'Grand Prix'}</h3>
        <div className="race-card__details">
          <span>📍 {race.circuit?.name || '—'}</span>
          <span>🌍 {race.competition?.location?.country || '—'}</span>
        </div>
      </div>
      <div className="race-card__date">
        {date ? (
          <>
            <span className="race-card__day">{date.getDate()}</span>
            <span className="race-card__month">
              {date.toLocaleString('tr-TR', { month: 'short' }).toUpperCase()}
            </span>
          </>
        ) : <span>—</span>}
        {isPast && <span className="race-card__done">✓</span>}
      </div>
    </div>
  );
}

export default function Formula1Page() {
  const [tab, setTab] = useState('races');

  const racesQuery = useQuery({
    queryKey: ['f1-races'],
    queryFn: getF1Races,
    staleTime: 3600000,
    enabled: tab === 'races',
  });

  const standingsQuery = useQuery({
    queryKey: ['f1-standings'],
    queryFn: getF1Standings,
    staleTime: 3600000,
    enabled: tab === 'standings',
  });

  const races = racesQuery.data?.response || [];
  const standings = standingsQuery.data?.response || [];

  return (
    <div className="football-page">
      <div className="page-header">
        <div className="page-header__left">
          <span className="page-header__sport-icon">🏎️</span>
          <div>
            <h1 className="page-header__title">FORMULA 1</h1>
            <p className="page-header__sub">{new Date().getFullYear()} Sezonu</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'races' && (
        racesQuery.isLoading ? (
          <div className="match-list">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 76, borderRadius: 10 }} />
            ))}
          </div>
        ) : races.length === 0 ? (
          <div className="empty-state">Yarış takvimi bulunamadı.</div>
        ) : (
          <div className="match-list">
            {races.map((race, i) => <RaceCard key={race.id || i} race={race} index={i} />)}
          </div>
        )
      )}

      {tab === 'standings' && (
        standingsQuery.isLoading ? (
          <div className="match-list">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 52, borderRadius: 10 }} />
            ))}
          </div>
        ) : standings.length === 0 ? (
          <div className="empty-state">Sıralama bulunamadı.</div>
        ) : (
          <div className="f1-standings">
            <div className="f1-standings__header">
              <span>#</span>
              <span>Pilot</span>
              <span>Takım</span>
              <span>Puan</span>
            </div>
            {standings.map((driver, i) => (
              <div key={driver.driver?.id || i} className="f1-driver fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <span className={`f1-driver__pos ${i < 3 ? `f1-driver__pos--top${i + 1}` : ''}`}>
                  {driver.position || i + 1}
                </span>
                <div className="f1-driver__name">
                  {driver.driver?.name || '—'}
                  <span className="f1-driver__nationality">{driver.driver?.nationality}</span>
                </div>
                <span className="f1-driver__team">{driver.team?.name || '—'}</span>
                <span className="f1-driver__points">{driver.points ?? '—'}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
