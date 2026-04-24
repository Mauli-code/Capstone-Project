import React from 'react';
import Avatar from './Avatar';
import EmptyState from './EmptyState';
import HistoryPanel from './HistoryPanel';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';

function ChatScreen({
  users,
  activeUserId,
  activeUser,
  activeMessages,
  sidebarOpen,
  isTyping,
  messageInput,
  actionHistory,
  messagesAreaRef,
  messageInputRef,
  getMessageCount,
  onToggleSidebar,
  onSwitchUser,
  onOpenProfile,
  onClearChat,
  onHistoryItemClick,
  onClearHistory,
  onGoHome,
  onMessageInputChange,
  onSendMessage,
}) {
  return (
    <div id="screen-chat" className={`screen ${activeUserId ? 'active' : ''}`}>
      <div className="chat-layout">
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
          <div className="sidebar-header">
            <div className="logo small">
              <div className="logo-icon small">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

            <button className="sidebar-close-btn" title="Close Sidebar" onClick={onToggleSidebar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="sidebar-section-label">Conversations</div>
          <div className="sidebar-user-list">
            {users.map((user) => {
              const count = getMessageCount(user.id);
              return (
                <div
                  key={user.id}
                  className={`sidebar-user-item ${user.id === activeUserId ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Switch to ${user.name}`}
                  onClick={() => onSwitchUser(user.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') onSwitchUser(user.id);
                  }}
                >
                  <Avatar user={user} className="sidebar-avatar" />

                  <div className="sidebar-user-details">
                    <div className="sidebar-user-name">{user.name}</div>
                    <div className="sidebar-msg-count">
                      {count} message{count !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {count > 0 ? <div className="sidebar-unread">{count > 9 ? '9+' : count}</div> : null}
                </div>
              );
            })}
          </div>

          <HistoryPanel history={actionHistory} onItemClick={onHistoryItemClick} onClear={onClearHistory} />

          <div className="sidebar-footer">
            <button className="back-home-btn" onClick={onGoHome}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M5 12l7-7M5 12l7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Switch User
            </button>
          </div>
        </aside>

        <div className="chat-main">
          <div className="chat-topbar">
            <div className="topbar-left">
              <button className="sidebar-toggle-btn" title="Toggle Sidebar" onClick={onToggleSidebar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12h18M3 6h18M3 18h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {activeUser ? (
                <div className="active-user-info">
                  <Avatar user={activeUser} className="active-avatar" />
                  <div className="active-details">
                    <div className="active-name">{activeUser.name}</div>
                    <div className="active-status">
                      <span className="status-dot"></span>
                      Online now
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="topbar-actions">
              <button className="topbar-btn profile-btn" title="Open Profile" onClick={onOpenProfile}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button className="topbar-btn clear-chat-btn" title="Clear Chat" onClick={onClearChat}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="messages-area" ref={messagesAreaRef}>
            <div className="messages-container">
              {!activeUser ? null : activeMessages.length === 0 ? (
                <EmptyState firstName={activeUser.name.split(' ')[0]} />
              ) : (
                <>
                  <div className="date-divider">Today</div>
                  {activeMessages.map((message, index) => (
                    <MessageItem
                      key={`${message.role}_${message.time}_${index}`}
                      message={message}
                      activeUser={activeUser}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {isTyping ? <TypingIndicator /> : null}

          <div className="input-bar">
            <div className="input-wrap">
              {activeUser ? (
                <div className="user-chip">
                  <Avatar user={activeUser} className="chip-avatar" />
                  <span>{activeUser.name.split(' ')[0]}</span>
                </div>
              ) : null}

              <textarea
                ref={messageInputRef}
                className="message-input"
                placeholder="Say something friendly..."
                rows="1"
                autoComplete="off"
                value={messageInput}
                onChange={onMessageInputChange}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    onSendMessage();
                  }
                }}
              ></textarea>

              <button
                className="send-btn"
                title="Send Message"
                onClick={onSendMessage}
                disabled={!messageInput.trim() || isTyping}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
