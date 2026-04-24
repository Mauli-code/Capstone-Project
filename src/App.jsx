import React, { useEffect, useMemo, useRef, useState } from 'react';
import ChatScreen from './components/ChatScreen';
import ProfileModal from './components/ProfileModal';
import UserSelectionScreen from './components/UserSelectionScreen';
import { USERS } from './data/users';

const WEBHOOK_URL =
  'https://enhancement-theorem-full-opinions.trycloudflare.com/webhook/aec610eb-2235-4668-939d-94bb922ea91c';
const HISTORY_STORAGE_KEY = 'nexuschat_action_history_v1';
const CHAT_STORAGE_KEY = 'nexuschat_chat_histories_v1';
const MAX_HISTORY_ITEMS = 40;

function getUserById(id) {
  return USERS.find((user) => user.id === id) || null;
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function safeLoadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function createEmptyChatHistories() {
  const initial = {};
  USERS.forEach((user) => {
    initial[user.id] = [];
  });
  return initial;
}

function safeLoadChatHistories() {
  try {
    const initial = createEmptyChatHistories();
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return initial;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return initial;

    USERS.forEach((user) => {
      const messages = parsed[user.id];
      initial[user.id] = Array.isArray(messages) ? messages : [];
    });

    return initial;
  } catch {
    return createEmptyChatHistories();
  }
}

function App() {
  const [activeUserId, setActiveUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClearChatConfirmOpen, setIsClearChatConfirmOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  const [chatHistories, setChatHistories] = useState(() => safeLoadChatHistories());

  const [actionHistory, setActionHistory] = useState(() => safeLoadHistory());

  const messagesAreaRef = useRef(null);
  const messageInputRef = useRef(null);

  const activeUser = useMemo(() => getUserById(activeUserId), [activeUserId]);
  const activeMessages = activeUserId ? chatHistories[activeUserId] || [] : [];

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(actionHistory));
  }, [actionHistory]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistories));
  }, [chatHistories]);

  useEffect(() => {
    function onEscKey(event) {
      if (event.key !== 'Escape') return;

      if (isClearChatConfirmOpen) {
        setIsClearChatConfirmOpen(false);
        return;
      }

      if (isProfileOpen) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('keydown', onEscKey);
    return () => document.removeEventListener('keydown', onEscKey);
  }, [isProfileOpen, isClearChatConfirmOpen]);

  useEffect(() => {
    if (!messagesAreaRef.current) return;
    messagesAreaRef.current.scrollTo({
      top: messagesAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeMessages, isTyping]);

  useEffect(() => {
    if (activeUserId && messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [activeUserId]);

  useEffect(() => {
    if (!messageInputRef.current) return;
    messageInputRef.current.style.height = 'auto';
    messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 140)}px`;
  }, [messageInput]);

  function addAction(type, label, payload = {}) {
    const nextItem = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      type,
      label,
      time: formatTime(),
      payload,
    };

    setActionHistory((prev) => [nextItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
  }

  function appendMessage(userId, message) {
    setChatHistories((prev) => {
      const next = { ...prev };
      next[userId] = [...(next[userId] || []), message];
      return next;
    });
  }

  async function sendToWebhook(user, text) {
    const payload = {
      userId: user.id,
      userName: user.name,
      handle: user.handle,
      message: text,
      timestamp: new Date().toISOString(),
    };

    let response;

    try {
      // Keep same request style as original app (no Content-Type header)
      response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (networkErr) {
      return `⚠️ Could not reach webhook.\n\nError: ${networkErr.message}\n\nMake sure:\n1. n8n is running at localhost:5678\n2. You clicked \"Listen for Test Event\" in n8n\n3. The workflow is active`;
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      return `⚠️ Webhook returned HTTP ${response.status}.\n${errBody || 'No details provided.'}`;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return data.output ?? data.reply ?? data.text ?? data.message ?? JSON.stringify(data);
    }

    const raw = await response.text();
    return raw.trim() || '✅ Webhook received the message (no text returned).';
  }

  async function handleSendMessage() {
    const text = messageInput.trim();
    if (!text || !activeUserId || !activeUser) return;

    const userMessage = {
      role: 'user',
      text,
      time: formatTime(),
    };

    appendMessage(activeUserId, userMessage);
    addAction('message', `${activeUser.name}: ${text.slice(0, 60)}`, {
      action: 'prefill_message',
      userId: activeUserId,
      text,
    });

    setMessageInput('');
    setIsTyping(true);

    try {
      const botText = await sendToWebhook(activeUser, text);
      const botMessage = {
        role: 'bot',
        text: botText,
        time: formatTime(),
      };
      appendMessage(activeUserId, botMessage);
      addAction('response', `NexusBot to ${activeUser.name}: ${botText.slice(0, 60)}`, {
        action: 'switch_user',
        userId: activeUserId,
      });
    } finally {
      setIsTyping(false);
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }
  }

  function handleOpenChat(userId) {
    setActiveUserId(userId);
    setSidebarOpen(true);

    const user = getUserById(userId);
    if (user) {
      addAction('switch', `Opened chat as ${user.name}`, {
        action: 'switch_user',
        userId,
      });
    }
  }

  function handleSwitchUser(userId) {
    if (userId === activeUserId) return;

    setActiveUserId(userId);

    const user = getUserById(userId);
    if (user) {
      addAction('switch', `Switched to ${user.name}`, {
        action: 'switch_user',
        userId,
      });
    }
  }

  function handleGoHome() {
    setActiveUserId(null);
    setSidebarOpen(true);
    setIsClearChatConfirmOpen(false);
  }

  function handleClearChat() {
    if (!activeUserId || !activeUser) return;

    setIsClearChatConfirmOpen(true);
  }

  function confirmClearChat() {
    if (!activeUserId || !activeUser) {
      setIsClearChatConfirmOpen(false);
      return;
    }

    setChatHistories((prev) => ({
      ...prev,
      [activeUserId]: [],
    }));

    addAction('clear', `Cleared chat for ${activeUser.name}`, {
      action: 'switch_user',
      userId: activeUserId,
    });

    setIsClearChatConfirmOpen(false);
  }

  function handleHistoryItemClick(item) {
    if (!item || !item.payload) return;

    if (item.payload.action === 'prefill_message') {
      if (item.payload.userId && item.payload.userId !== activeUserId) {
        setActiveUserId(item.payload.userId);
      }
      setMessageInput(item.payload.text || '');
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 0);
      return;
    }

    if (item.payload.action === 'switch_user' && item.payload.userId) {
      setActiveUserId(item.payload.userId);
    }
  }

  function getMessageCount(userId) {
    return chatHistories[userId]?.length || 0;
  }

  function handleMessageInputChange(event) {
    setMessageInput(event.target.value);
  }

  return (
    <>
      <UserSelectionScreen
        users={USERS}
        activeUserId={activeUserId}
        getMessageCount={getMessageCount}
        onOpenChat={handleOpenChat}
      />

      <ChatScreen
        users={USERS}
        activeUserId={activeUserId}
        activeUser={activeUser}
        activeMessages={activeMessages}
        sidebarOpen={sidebarOpen}
        isTyping={isTyping}
        messageInput={messageInput}
        actionHistory={actionHistory}
        messagesAreaRef={messagesAreaRef}
        messageInputRef={messageInputRef}
        getMessageCount={getMessageCount}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onSwitchUser={handleSwitchUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onClearChat={handleClearChat}
        onHistoryItemClick={handleHistoryItemClick}
        onClearHistory={() => setActionHistory([])}
        onGoHome={handleGoHome}
        onMessageInputChange={handleMessageInputChange}
        onSendMessage={handleSendMessage}
      />

      <ProfileModal
        user={activeUser}
        messageCount={activeUserId ? getMessageCount(activeUserId) : 0}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <div
        className={`confirm-modal-overlay ${isClearChatConfirmOpen ? 'open' : ''}`}
        onClick={() => setIsClearChatConfirmOpen(false)}
      >
        <div
          className="confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-clear-title"
          onClick={(event) => event.stopPropagation()}
        >
          <h3 id="confirm-clear-title" className="confirm-modal-title">
            Clear chat?
          </h3>
          <p className="confirm-modal-text">
            {activeUser
              ? `Clear all messages for ${activeUser.name}? This cannot be undone.`
              : 'Clear all messages in this conversation? This cannot be undone.'}
          </p>
          <div className="confirm-modal-actions">
            <button
              type="button"
              className="confirm-modal-btn confirm-modal-btn-cancel"
              onClick={() => setIsClearChatConfirmOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="confirm-modal-btn confirm-modal-btn-danger"
              onClick={confirmClearChat}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
