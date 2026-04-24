import React from 'react';

function EmptyState({ firstName }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="#fdba74"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3>Hey {firstName}! 👋</h3>
      <p>
        Drop your first message below - your AI friend is ready &amp; waiting.
        <br />
        <span style={{ color: '#6b6490', fontSize: '0.8rem' }}>
          Conversations are private and saved per user.
        </span>
      </p>
    </div>
  );
}

export default EmptyState;
