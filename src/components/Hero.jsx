// src/components/Hero.jsx
import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <p className="hero-eyebrow">AI · Personalised · Intelligence</p>
        <h1 className="hero-title">
          News that <em>knows</em><br />who you are
        </h1>
        <p className="hero-sub">
          Paste any article or drop a link, tell us your world — Percept turns
          headlines into intelligence written just for you.
        </p>
      </div>
    </section>
  );
}
