import React from 'react';
import Avatar from './Avatar';

function UserSelectionScreen({ users, activeUserId, getMessageCount, onOpenChat }) {
  return (
    <div id="screen-users" className={`screen ${activeUserId ? '' : 'active'}`}>
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header className="app-header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">NexusChat</span>
        </div>
        <div className="header-badge">AI Powered</div>
      </header>

      <main className="user-selection-main">
        <div className="selection-hero">
          <div className="hero-tag">Multi-User Platform</div>
          <h1 className="hero-title">
            <span className="line-1">Who's chatting</span>
            <span className="line-2">today? 👋</span>
          </h1>
          <p className="hero-subtitle">
            Each account has its own private AI session. Your conversations are saved just for you
            - warm, personal, and always ready.
          </p>
        </div>

        <div className="users-grid">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              role="button"
              tabIndex={0}
              aria-label={`Open chat as ${user.name}`}
              onClick={() => onOpenChat(user.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onOpenChat(user.id);
                }
              }}
            >
              <div className="user-avatar-wrap">
                <Avatar user={user} className="user-avatar" />
              </div>

              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-handle">{user.handle}</div>
              </div>

              <div className="user-meta">
                <div className="user-chat-count">
                  <span className="dot"></span>
                  <span>
                    {getMessageCount(user.id)} message{getMessageCount(user.id) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <button className="open-chat-btn" type="button">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Start Chatting
              </button>
            </div>
          ))}
        </div>

        <p className="footer-note">🔒 All conversations are stored locally and isolated per user.</p>
      </main>
    </div>
  );
}

export default UserSelectionScreen;
