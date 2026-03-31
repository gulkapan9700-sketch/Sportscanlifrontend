import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Activity, TrendingUp, Zap } from 'lucide-react';
import { getFootballLive, getBasketballLive } from '../services/api';
import MatchCard from '../components/MatchCard';
import './HomePage.css';

function SectionHeader({ icon, title, count, linkTo, linkLabel }) {
  return (
    <div className="section-header">
      <div className="section-header__left">
        <span className="section-header__icon">{icon}</span>
        <h2 className="section-header__title">{title}</h2>
        {count > 0 && (
          <span className="section-header__badge">{count}</span>
        )}
      </div>
      {linkTo && (
        <Link to={linkTo} className="section-header__link">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

function MatchList({ matches, sport, emptyMsg }) {
  if (!matches?.length) {
    return <div className="empty-state">{emptyMsg}</div>;
  }
  return (
    <div className="match-list">
      {matches.slice(0, 8).map((m, i) => (
        <div key={m.fixture?.id || m.id || i} className="fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
          <MatchCard fixture={m} sport={sport} showLeague />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: footballData, isLoading: fbLoading } = useQuery({
    queryKey: ['football-live'],
    queryFn: getFootballLive,
    refetchInterval: 30000,
  });

  const { data: basketData, isLoading: bkLoading } = useQuery({
    queryKey: ['basketball-live'],
    queryFn: getBasketballLive,
    refetchInterval: 30000,
  });

  const liveFootball = footballData?.response || [];
  const liveBasket = basketData?.response || [];
  const totalLive = liveFootball.length + liveBasket.length;

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero__bg" />
        <div className="home-hero__content">
          <div className="home-hero__live-count">
            <span className="live-dot" />
            <span>{totalLive} CANLI MAÇ</span>
          </div>
          <h1 className="home-hero__title">
            CANLI<br />
            <span>SONUÇLAR</span>
          </h1>
          <p className="home-hero__subtitle">
            Tüm sporlardan anlık skorlar, istatistikler ve daha fazlası
          </p>
        </div>

        {/* Sport shortcuts */}
        <div className="sport-shortcuts">
          {[
            { to: '/futbol', icon: '⚽', label: 'Futbol' },
            { to: '/basketbol', icon: '🏀', label: 'Basketbol' },
            { to: '/tenis', icon: '🎾', label: 'Tenis' },
            { to: '/formula1', icon: '🏎️', label: 'F1' },
            { to: '/mma', icon: '🥊', label: 'MMA' },
          ].map(s => (
            <Link key={s.to} to={s.to} className="sport-shortcut">
              <span className="sport-shortcut__icon">{s.icon}</span>
              <span className="sport-shortcut__label">{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stats-bar__item">
          <Activity size={14} color="var(--accent)" />
          <span>{liveFootball.length} Canlı Futbol</span>
        </div>
        <div className="stats-bar__sep" />
        <div className="stats-bar__item">
          <Zap size={14} color="var(--yellow)" />
          <span>{liveBasket.length} Canlı Basketbol</span>
        </div>
        <div className="stats-bar__sep" />
        <div className="stats-bar__item">
          <TrendingUp size={14} color="var(--blue)" />
          <span>Anlık Güncellemeler</span>
        </div>
      </div>

      {/* Live Football */}
      <section className="home-section">
        <SectionHeader
          icon="⚽"
          title="Canlı Futbol Maçları"
          count={liveFootball.length}
          linkTo="/futbol"
          linkLabel="Tümünü Gör"
        />
        {fbLoading ? (
          <div className="match-list">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 68, borderRadius: 10 }} />
            ))}
          </div>
        ) : (
          <MatchList
            matches={liveFootball}
            sport="football"
            emptyMsg="Şu an canlı futbol maçı bulunmuyor."
          />
        )}
      </section>

      {/* Live Basketball */}
      <section className="home-section">
        <SectionHeader
          icon="🏀"
          title="Canlı Basketbol"
          count={liveBasket.length}
          linkTo="/basketbol"
          linkLabel="Tümünü Gör"
        />
        {bkLoading ? (
          <div className="match-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 68, borderRadius: 10 }} />
            ))}
          </div>
        ) : (
          <MatchList
            matches={liveBasket}
            sport="basketball"
            emptyMsg="Şu an canlı basketbol maçı bulunmuyor."
          />
        )}
      </section>
    </div>
  );
}
