import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';

const ICON_MAP = {
  booking: '🎫',
  payment: '💳',
  refund: '💰',
  reminder: '⏰',
  community: '💬',
  promotional: '🎁',
  security: '🔒',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'এখনই';
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  return `${days} দিন আগে`;
}

export default function NotificationBell() {
  const { user } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications(user?.id);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead([notification.id]);
    }
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Button */}
      <button
        id="notification-bell"
        onClick={handleOpen}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          padding: '8px',
          borderRadius: '50%',
          transition: 'background 0.2s',
        }}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#EF4444',
              color: '#fff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '8px',
            width: '360px',
            maxHeight: '480px',
            overflowY: 'auto',
            background: 'var(--surface-color, #fff)',
            border: '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-color, #e5e7eb)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>নোটিফিকেশন</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                সব পড়া হয়েছে
              </button>
            )}
          </div>

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
              কোনো নোটিফিকেশন নেই
            </div>
          ) : (
            notifications.slice(0, 20).map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  background: n.read ? 'transparent' : 'rgba(37,99,235,0.04)',
                  borderBottom: '1px solid var(--border-color, #f3f4f6)',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>
                  {ICON_MAP[n.type] || '📢'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 400 : 600, fontSize: '0.9rem' }}>
                    {n.title}
                  </div>
                  {n.body && (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>
                      {n.body}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                    {timeAgo(n.created_at)}
                  </div>
                </div>
                {!n.read && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#2563EB',
                      flexShrink: 0,
                      marginTop: '6px',
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
