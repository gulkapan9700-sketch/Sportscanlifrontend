import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { getTennisLive } from '../services/api';
import '../pages/FootballPage.css';
import './TennisPage.css';

export default function TennisPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['tennis-live'],
    queryFn: getTennisLive,
    refetchInterval: 60000,
  });

  const games = data?.response || [];

  return (
    <div className="football-page">
      <div className="page-header">
        <div className="page-header__left">
          <span className="page-header__sport-icon">🎾</span>
          <div>
            <h1 className="page-header__title">TENİS</h1>
            <p className="page-header__sub">{games.length} maç</p>
          </div>
        </div>
        <button className="refresh-btn" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw size={14} className={isFetching ? 'spinning' : ''} />
          Yenile
        </button>
      </div>

      {isLoading ? (
        <div className="match-list">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }} />
          ))}
        </div>
      ) : games.length === 0 ? (
        <div className="empty-state">Bugün tenis maçı bulunamadı.</div>
      ) : (
        <div className="tennis-list">
          {games.map((g, i) => (
            <div key={g.id || i} className="tennis-card fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="tennis-card__header">
                <span className="tennis-card__tournament">{g.tournament?.name || 'Turnuva'}</span>
                <span className={`tennis-card__status ${g.status?.short === 'INPROGRESS' ? 'live' : ''}`}>
                  {g.status?.short === 'INPROGRESS'
                    ? <><span className="live-dot" style={{width:6,height:6}}/> CANLI</>
                    : g.status?.short === 'FT' ? 'BİTTİ' : 'BEKL.'}
                </span>
              </div>
              <div className="tennis-card__match">
                <div className="tennis-card__player">
                  <span>{g.players?.home?.name || '—'}</span>
                  <div className="tennis-card__sets">
                    {(g.scores?.home?.sets || []).map((s, si) => (
                      <span key={si} className="tennis-card__set">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="tennis-card__vs">VS</div>
                <div className="tennis-card__player">
                  <span>{g.players?.away?.name || '—'}</span>
                  <div className="tennis-card__sets">
                    {(g.scores?.away?.sets || []).map((s, si) => (
                      <span key={si} className="tennis-card__set">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
