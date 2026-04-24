import React from 'react';
import Avatar from './Avatar';

function MessageItem({ message, activeUser }) {
  const isUser = message.role === 'user';
  const senderLabel = isUser ? activeUser.name : 'NexusBot';

  return (
    <div className={`msg-row ${isUser ? 'user-row' : 'bot-row'}`}>
      {isUser ? (
        <Avatar user={activeUser} className="msg-avatar" />
      ) : (
        <div className="msg-avatar bot">
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
      )}

      <div className="msg-content">
        <div className="msg-sender-name">{senderLabel}</div>
        <div className="msg-bubble">{message.text}</div>
        <div className="msg-timestamp">{message.time}</div>
      </div>
    </div>
  );
}

export default MessageItem;
