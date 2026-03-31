import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMMAUpcoming } from '../services/api';
import '../pages/FootballPage.css';
import './MMAPage.css';

export default function MMAPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['mma-upcoming'],
    queryFn: getMMAUpcoming,
    staleTime: 3600000,
  });

  const fights = data?.response || [];

  return (
    <div className="football-page">
      <div className="page-header">
        <div className="page-header__left">
          <span className="page-header__sport-icon">🥊</span>
          <div>
            <h1 className="page-header__title">MMA</h1>
            <p className="page-header__sub">Yaklaşan dövüşler</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="match-list">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 10 }} />
          ))}
        </div>
      ) : fights.length === 0 ? (
        <div className="empty-state">Yaklaşan MMA dövüşü bulunamadı.</div>
      ) : (
        <div className="mma-list">
          {fights.map((fight, i) => {
            const date = fight.date ? new Date(fight.date) : null;
            return (
              <div key={fight.id || i} className="mma-card fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="mma-card__event">
                  <span className="mma-card__org">{fight.league?.name || 'MMA'}</span>
                  {date && (
                    <span className="mma-card__date">
                      {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="mma-card__fight">
                  <div className="mma-card__fighter mma-card__fighter--home">
                    {fight.fighters?.home?.image && (
                      <img src={fight.fighters.home.image} alt="" className="mma-card__fighter-img" />
                    )}
                    <div className="mma-card__fighter-info">
                      <span className="mma-card__fighter-name">{fight.fighters?.home?.name || '—'}</span>
                      <span className="mma-card__fighter-record">{fight.fighters?.home?.record || ''}</span>
                    </div>
                  </div>
                  <div className="mma-card__vs">
                    <span>VS</span>
                    <span className="mma-card__weight">{fight.weight_class || ''}</span>
                  </div>
                  <div className="mma-card__fighter mma-card__fighter--away">
                    <div className="mma-card__fighter-info" style={{ alignItems: 'flex-end', textAlign: 'right' }}>
                      <span className="mma-card__fighter-name">{fight.fighters?.away?.name || '—'}</span>
                      <span className="mma-card__fighter-record">{fight.fighters?.away?.record || ''}</span>
                    </div>
                    {fight.fighters?.away?.image && (
                      <img src={fight.fighters.away.image} alt="" className="mma-card__fighter-img" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
