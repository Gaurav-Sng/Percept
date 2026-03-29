// src/components/ResultCard.jsx
import React, { useEffect, useRef } from 'react';
import './ResultCard.css';

const SECTION_CONFIG = {
  summary: {
    icon: '📰',
    label: 'What happened',
    theme: 'orange',
  },
  impact: {
    icon: '🎯',
    label: 'What this means for you',
    theme: 'blue',
  },
  implications: {
    icon: '🔭',
    label: 'Broader implications',
    theme: 'green',
  },
  suggestions: {
    icon: '💡',
    label: 'Suggested actions',
    theme: 'purple',
  },
};

export default function ResultCard({ type, content, delay = 0 }) {
  const ref = useRef(null);
  const config = SECTION_CONFIG[type];

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.animationDelay = `${delay}ms`;
  }, [delay]);

  const renderContent = () => {
    if (typeof content === 'string') {
      return <p className="result-para">{content}</p>;
    }
    if (Array.isArray(content)) {
      return (
        <ul className="result-list">
          {content.map((item, i) => (
            <li key={i} className="result-list-item">
              <span className="result-arrow">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <div ref={ref} className={`result-card result-card--${config.theme}`}>
      <div className="result-card-head">
        <span className="result-card-icon">{config.icon}</span>
        <span className="result-card-label">{config.label}</span>
      </div>
      <div className="result-card-body">{renderContent()}</div>
    </div>
  );
}
