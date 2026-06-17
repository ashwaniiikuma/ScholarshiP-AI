import { useState } from 'react';
import { PortalPage, SectionCard, StatusPill } from '../components/PortalChrome';
import { useAppContext } from '../context/AppContext';

const filters = ['all', 'unread', 'deadline', 'application', 'profile', 'assistant'];

export default function NotificationsPage() {
  const { markAllNotificationsRead, markNotificationRead, state, unreadNotifications } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visibleNotifications = state.notifications.filter((notification) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'unread' ? !notification.read : notification.category === activeFilter);
    const matchesQuery =
      !query ||
      `${notification.title} ${notification.description}`
        .toLowerCase()
        .includes(query.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  return (
    <PortalPage
      actions={
        <button className="button button--ghost" onClick={markAllNotificationsRead} type="button">
          Mark all as read
        </button>
      }
      eyebrow="Alert center"
      subtitle="This route combines notification filtering, read state, and lightweight inbox behavior using shared React state."
      title="Notifications"
    >
      <div className="two-column-layout">
        <div className="stack-column">
          <SectionCard subtitle={`${unreadNotifications} unread items`} title="Inbox">
            <div className="filter-toolbar">
              <input
                className="input"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notifications"
                type="text"
                value={query}
              />
              <div className="chip-row">
                {filters.map((item) => (
                  <button
                    className={`chip-button${activeFilter === item ? ' is-active' : ''}`}
                    key={item}
                    onClick={() => setActiveFilter(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="stack-list">
              {visibleNotifications.length ? (
                visibleNotifications.map((notification) => (
                  <button
                    className={`notification-card${notification.read ? '' : ' is-unread'}`}
                    key={notification.id}
                    onClick={() => markNotificationRead(notification.id)}
                    type="button"
                  >
                    <div>
                      <strong>{notification.title}</strong>
                      <p>{notification.description}</p>
                      <small>{notification.time}</small>
                    </div>
                    <StatusPill tone={notification.read ? 'neutral' : 'positive'}>
                      {notification.read ? notification.category : 'new'}
                    </StatusPill>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <strong>No notifications match the current filter.</strong>
                  <p>Try another category or clear the search text.</p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="stack-column">
          <SectionCard subtitle="Operational guidance" title="How to use this inbox">
            <ul className="bullet-list">
              <li>Read items stay in the list so a user can still revisit deadlines and status changes.</li>
              <li>The dashboard and assistant both react to the same underlying application state.</li>
              <li>Unread status helps identify blockers before a deadline window gets too small.</li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </PortalPage>
  );
}
