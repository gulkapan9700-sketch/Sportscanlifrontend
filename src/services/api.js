import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

// ── Football ──────────────────────────────────────────────────
export const getFootballLive = () =>
  api.get('/api/football/live').then(r => r.data);

export const getFootballToday = () =>
  api.get('/api/football/today').then(r => r.data);

export const getFootballFixture = (id) =>
  api.get(`/api/football/fixture/${id}`).then(r => r.data);

export const getFootballLeagues = (country) =>
  api.get('/api/football/leagues', { params: country ? { country } : {} }).then(r => r.data);

export const getFootballStandings = (leagueId, season) =>
  api.get(`/api/football/standings/${leagueId}`, { params: season ? { season } : {} }).then(r => r.data);

// ── Basketball ────────────────────────────────────────────────
export const getBasketballLive = () =>
  api.get('/api/basketball/live').then(r => r.data);

export const getBasketballToday = () =>
  api.get('/api/basketball/today').then(r => r.data);

// ── Tennis ────────────────────────────────────────────────────
export const getTennisLive = () =>
  api.get('/api/tennis/live').then(r => r.data);

// ── MMA ───────────────────────────────────────────────────────
export const getMMAUpcoming = () =>
  api.get('/api/mma/upcoming').then(r => r.data);

// ── Formula 1 ─────────────────────────────────────────────────
export const getF1Races = () =>
  api.get('/api/formula1/races').then(r => r.data);

export const getF1Standings = () =>
  api.get('/api/formula1/standings').then(r => r.data);

// ── Status ────────────────────────────────────────────────────
export const getApiStatus = () =>
  api.get('/api/status').then(r => r.data);
