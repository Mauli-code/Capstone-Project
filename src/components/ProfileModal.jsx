import React from 'react';
import Avatar from './Avatar';

function ProfileModal({ user, messageCount, isOpen, onClose }) {
  if (!user) return null;

  return (
    <div
      className={`profile-modal-overlay ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-name">
        <button className="profile-close-btn" title="Close Profile" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="profile-avatar-wrap">
          <Avatar user={user} className="profile-avatar" />
        </div>

        <h2 id="profile-modal-name">{user.name}</h2>
        <p className="profile-handle">{user.handle}</p>
        <p className="profile-meta">
          {messageCount} message{messageCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

export default ProfileModal;
