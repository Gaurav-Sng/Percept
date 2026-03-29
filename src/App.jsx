// src/App.jsx
import React, { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import NewsInput from './components/NewsInput.jsx';
import PersonaSelector from './components/PersonaSelector.jsx';
import AnalyzeButton from './components/AnalyzeButton.jsx';
import LoadingState from './components/LoadingState.jsx';
import ResultCard from './components/ResultCard.jsx';
import { analyzeNews } from './hooks/useGemini.js';
import './App.css';

const SENTIMENT_CONFIG = {
  positive: { label: 'Positive outlook', color: '#1A4D3C', bg: '#E8F4EF', arrow: '↑' },
  negative: { label: 'Negative outlook', color: '#8B1A1A', bg: '#FFECEC', arrow: '↓' },
  neutral:  { label: 'Neutral outlook',  color: '#4A4440', bg: '#F0EDEA', arrow: '→' },
  mixed:    { label: 'Mixed signals',    color: '#7C4A00', bg: '#FFF5DC', arrow: '↕' },
};

const PERSONA_ICONS = {
  'Student': '🎓',
  'Salaried Professional': '💼',
  'Business Owner / Entrepreneur': '🏢',
  'Retail Investor': '📈',
  'Homemaker / Family Manager': '🏠',
  'Retiree': '🧘',
};

export default function App() {
  // Input state
  const [newsText, setNewsText]   = useState('');
  const [newsUrl, setNewsUrl]     = useState('');
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url'
  const [persona, setPersona]     = useState('');
  const [customCtx, setCustomCtx] = useState('');

  // Async state
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [result, setResult]     = useState(null);

  const resultsRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNewsText('');
    setNewsUrl('');
  };

  const validate = () => {
    const input = activeTab === 'text' ? newsText.trim() : newsUrl.trim();
    if (!input) return activeTab === 'text' ? 'Please paste the article text.' : 'Please enter a valid article URL.';
    if (!persona) return 'Please select your persona.';
    return null;
  };

  const handleAnalyze = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setError('');
    setResult(null);
    setLoading(true);

    const rawInput = activeTab === 'text'
      ? newsText.trim()
      : `Article URL: ${newsUrl.trim()}\n(Fetch and interpret this article's content based on the URL.)`;

    try {
      const data = await analyzeNews(rawInput, persona, customCtx);
      setResult(data);
      // Scroll to results after a tick
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setNewsText('');
    setNewsUrl('');
    setPersona('');
    setCustomCtx('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sentiment = result?.sentiment
    ? SENTIMENT_CONFIG[result.sentiment] || SENTIMENT_CONFIG.neutral
    : null;

  return (
    <div className="app">
      {/* Ambient background orbs */}
      <div className="orb orb--1" aria-hidden="true" />
      <div className="orb orb--2" aria-hidden="true" />

      <Header />
      <Hero />

      <main className="main">
        {/* ── Input section ── */}
        {!result && (
          <div className="input-section">
            <NewsInput
              value={newsText}
              onChange={setNewsText}
              urlValue={newsUrl}
              onUrlChange={setNewsUrl}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <PersonaSelector
              selected={persona}
              onSelect={setPersona}
              customCtx={customCtx}
              onCustomCtxChange={setCustomCtx}
            />

            {error && (
              <div className="error-banner" role="alert">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <AnalyzeButton
              onClick={handleAnalyze}
              loading={loading}
              disabled={loading}
            />
          </div>
        )}

        {/* ── Loading ── */}
        <LoadingState visible={loading} />

        {/* ── Results ── */}
        {result && !loading && (
          <div className="results-section" ref={resultsRef}>

            {/* Results header */}
            <div className="results-header">
              <div className="results-title-row">
                <h2 className="results-title">Your Intelligence Brief</h2>
                {sentiment && (
                  <span
                    className="sentiment-badge"
                    style={{ color: sentiment.color, background: sentiment.bg }}
                  >
                    {sentiment.arrow} {sentiment.label}
                  </span>
                )}
              </div>

              <div className="results-meta">
                <span className="persona-badge">
                  {PERSONA_ICONS[persona] || '👤'} {persona}
                </span>
                {result.headline && (
                  <p className="result-headline">"{result.headline}"</p>
                )}
              </div>
            </div>

            {/* Result cards */}
            <div className="result-cards">
              <ResultCard
                type="summary"
                content={result.summary}
                delay={0}
              />
              <ResultCard
                type="impact"
                content={result.impact}
                delay={80}
              />
              <ResultCard
                type="implications"
                content={result.implications}
                delay={160}
              />
              <ResultCard
                type="suggestions"
                content={result.suggestions}
                delay={240}
              />
            </div>

            {/* Reset */}
            <div className="results-footer">
              <button className="btn-reset" onClick={handleReset}>
                ← Analyse another article
              </button>
              <p className="powered-by">Powered by Gemini 2.0 Flash · Percept MVP</p>
            </div>
          </div>
        )}
      </main>

      <footer className="site-footer">
        Built for <strong>Economic Times GenAI Hackathon</strong> · Team mysteryofpride
      </footer>
    </div>
  );
}
