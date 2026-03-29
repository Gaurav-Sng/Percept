// src/components/LoadingState.jsx
import React, { useState, useEffect } from 'react';
import './LoadingState.css';

const MESSAGES = [
  'Reading the article…',
  'Understanding the context…',
  'Calibrating your persona lens…',
  'Crafting personalised insights…',
  'Connecting the dots…',
  'Almost ready…',
];

export default function LoadingState({ visible }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (!visible) { setMsgIdx(0); return; }
    const t = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="loading-state">
      <div className="loading-orb-ring">
        <div className="loading-orb" />
      </div>
      <p key={msgIdx} className="loading-msg">{MESSAGES[msgIdx]}</p>
      <p className="loading-sub">Percept is thinking just for you…</p>
    </div>
  );
}
