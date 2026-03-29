// src/components/PersonaSelector.jsx
import React from 'react';
import './PersonaSelector.css';

const PERSONAS = [
  { id: 'Student',                       icon: '🎓', label: 'Student',       desc: 'Learning & career' },
  { id: 'Salaried Professional',          icon: '💼', label: 'Professional',  desc: 'Job & income' },
  { id: 'Business Owner / Entrepreneur',  icon: '🏢', label: 'Entrepreneur',  desc: 'Business & ops' },
  { id: 'Retail Investor',                icon: '📈', label: 'Investor',      desc: 'Stocks & wealth' },
  { id: 'Homemaker / Family Manager',     icon: '🏠', label: 'Homemaker',     desc: 'Family & budgets' },
  { id: 'Retiree',                        icon: '🧘', label: 'Retiree',       desc: 'Savings & health' },
];

export default function PersonaSelector({ selected, onSelect, customCtx, onCustomCtxChange }) {
  return (
    <div className="card persona-card-wrapper">
      <div className="card-label">
        <span className="dot" />
        Step 2 — Your Persona
      </div>

      <div className="persona-grid">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            className={`persona-tile ${selected === p.id ? 'selected' : ''}`}
            onClick={() => onSelect(p.id)}
            aria-pressed={selected === p.id}
          >
            <span className="persona-icon">{p.icon}</span>
            <span className="persona-name">{p.label}</span>
            <span className="persona-desc">{p.desc}</span>
            {selected === p.id && <span className="persona-check">✓</span>}
          </button>
        ))}
      </div>

      <div className="custom-ctx">
        <label htmlFor="customCtx" className="custom-ctx-label">
          Add more context about yourself <span>(optional)</span>
        </label>
        <input
          id="customCtx"
          className="custom-ctx-input"
          type="text"
          placeholder="e.g. Software engineer in Bangalore, interested in tech stocks, mid-30s…"
          value={customCtx}
          onChange={(e) => onCustomCtxChange(e.target.value)}
        />
      </div>
    </div>
  );
}
