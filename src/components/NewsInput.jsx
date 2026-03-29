// src/components/NewsInput.jsx
import React from 'react';
import './NewsInput.css';

export default function NewsInput({ value, onChange, urlValue, onUrlChange, activeTab, onTabChange }) {
  return (
    <div className="card news-input-card">
      <div className="card-label">
        <span className="dot" />
        Step 1 — The News
      </div>

      <div className="tabs-row">
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => onTabChange('text')}
        >
          <span className="tab-icon">📄</span> Paste Article
        </button>
        <button
          className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`}
          onClick={() => onTabChange('url')}
        >
          <span className="tab-icon">🔗</span> Article URL
        </button>
      </div>

      {activeTab === 'text' ? (
        <textarea
          className="news-textarea"
          placeholder="Paste the full news article text here…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
        />
      ) : (
        <div className="url-wrapper">
          <input
            className="news-url"
            type="url"
            placeholder="https://economictimes.indiatimes.com/…"
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
          />
          <p className="url-hint">
            ℹ️ Paste a publicly accessible article URL — Gemini will interpret its contents.
          </p>
        </div>
      )}
    </div>
  );
}
