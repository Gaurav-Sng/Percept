// src/components/AnalyzeButton.jsx
import React from 'react';
import './AnalyzeButton.css';

export default function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <button
      className={`analyze-btn ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      <span className="analyze-btn-shimmer" aria-hidden="true" />
      {loading ? (
        <span className="btn-loading-inner">
          <span className="btn-dots">
            <span /><span /><span />
          </span>
          Analysing…
        </span>
      ) : (
        <span className="btn-idle-inner">
          <span className="btn-star">✦</span>
          Analyse for Me
        </span>
      )}
    </button>
  );
}
