import React from 'react';

function HistoryPanel({ history, onItemClick, onClear }) {
  return (
    <div className="history-panel">
      <div className="history-header-row">
        <div className="sidebar-section-label history-title">History</div>
        <button className="history-clear-btn" onClick={onClear} disabled={history.length === 0}>
          Clear History
        </button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="history-empty">No actions yet.</p>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              className="history-item"
              onClick={() => onItemClick(item)}
              title="Click to reuse"
            >
              <div className="history-item-top">
                <span className="history-type">{item.type}</span>
                <span className="history-time">{item.time}</span>
              </div>
              <div className="history-label">{item.label}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default HistoryPanel;
