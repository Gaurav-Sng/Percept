// src/components/Header.jsx
import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon" aria-hidden="true">
          <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="4.5" fill="white" />
            <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.6" strokeDasharray="3.5 2.2" />
          </svg>
        </div>
        <span className="logo-text">
          Per<span className="logo-accent">cept</span>
        </span>
      </div>
      <span className="header-pill">ET GenAI Hackathon · Team mysteryofpride</span>
    </header>
  );
}
