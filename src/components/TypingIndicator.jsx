import React from 'react';

function TypingIndicator() {
  return (
    <div className="typing-indicator-wrap">
      <div className="typing-bubble">
        <div className="typing-avatar bot-avatar-small">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            <path
              d="M8 14s1.5 2 4 2 4-2 4-2"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="9"
              y1="9"
              x2="9.01"
              y2="9"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="15"
              y1="9"
              x2="15.01"
              y2="9"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
