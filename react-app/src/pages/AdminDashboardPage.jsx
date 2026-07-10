import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminUsers } from '../hooks/useAdminUsers';
import './AdminDashboardPage.css';

const PER_PAGE = 8;
const SORTABLE_STRING_KEYS = ['name', 'studentType', 'educationLevel', 'gender', 'collegeName', 'role'];
const ROLE_CHIPS = [
  { value: 'all', label: 'All' },
  { value: 'Admin', label: 'Admin' },
  { value: 'User', label: 'User' },
];
const DATE_CHIPS = [
  { value: 'all', label: 'All time' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];
const TABLE_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'studentType', label: 'Student Type' },
  { key: 'educationLevel', label: 'Education Level' },
  { key: 'gender', label: 'Gender' },
  { key: 'collegeName', label: 'College Name' },
  { key: 'cgpa', label: 'CGPA' },
  { key: 'role', label: 'Role' },
];
const STAT_CARDS = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    background: '#EEEEFD',
    icon: (
      <svg fill="none" height="22" viewBox="0 0 22 22" width="22">
        <circle cx="9" cy="7.5" r="3.3" stroke="#4927EF" strokeWidth="1.7" />
        <path d="M3 18c0-3.3 2.7-5.8 6-5.8s6 2.5 6 5.8" stroke="#4927EF" strokeLinecap="round" strokeWidth="1.7" />
        <circle cx="15.5" cy="8.5" r="2.2" stroke="#4927EF" strokeWidth="1.5" />
        <path d="M13.5 18c0-2.3 1.2-4 3.5-4.3" stroke="#4927EF" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'totalApplications',
    label: 'Total Applications',
    background: '#E9FBF1',
    icon: (
      <svg fill="none" height="22" viewBox="0 0 22 22" width="22">
        <rect height="16" rx="2" stroke="#16A34A" strokeWidth="1.6" width="12" x="5" y="3" />
        <path d="M8 8h6M8 11h6M8 14h4" stroke="#16A34A" strokeLinecap="round" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'totalScholarships',
    label: 'Active Scholarships',
    background: '#FEF3E2',
    icon: (
      <svg fill="none" height="22" viewBox="0 0 22 22" width="22">
        <path d="M11 4L19 8L11 12L3 8L11 4Z" stroke="#F59E0B" strokeLinejoin="round" strokeWidth="1.6" />
        <path d="M6.5 10v3.5c0 2 2 3.5 4.5 3.5s4.5-1.5 4.5-3.5V10" stroke="#F59E0B" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    key: 'totalDisbursed',
    label: 'Total Disbursed',
    background: '#FDEAF1',
    icon: (
      <svg fill="none" height="22" viewBox="0 0 22 22" width="22">
        <rect height="12" rx="2.5" stroke="#EC4899" strokeWidth="1.6" width="16" x="3" y="5" />
        <path d="M3 9h16" stroke="#EC4899" strokeWidth="1.6" />
        <circle cx="15" cy="13" fill="#EC4899" r="1.3" />
      </svg>
    ),
  },
  {
    key: 'newUsersThisWeek',
    label: 'New Users (This Week)',
    background: '#EAF1FE',
    icon: (
      <svg fill="none" height="22" viewBox="0 0 22 22" width="22">
        <circle cx="9" cy="8" r="3.3" stroke="#3B82F6" strokeWidth="1.7" />
        <path d="M3 18c0-3.3 2.7-5.8 6-5.8s6 2.5 6 5.8" stroke="#3B82F6" strokeLinecap="round" strokeWidth="1.7" />
        <path d="M16.5 7v4M14.5 9h4" stroke="#3B82F6" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    ),
  },
];

function compareUsers(a, b, sortKey, sortDir) {
  let av;
  let bv;

  if (sortKey === 'cgpa') {
    av = Number.parseFloat(a.cgpa);
    bv = Number.parseFloat(b.cgpa);
    if (Number.isNaN(av)) av = Number.NEGATIVE_INFINITY;
    if (Number.isNaN(bv)) bv = Number.NEGATIVE_INFINITY;
  } else if (SORTABLE_STRING_KEYS.includes(sortKey)) {
    av = String(a[sortKey]).toLowerCase();
    bv = String(b[sortKey]).toLowerCase();
  } else {
    return 0;
  }

  if (av < bv) return sortDir === 'asc' ? -1 : 1;
  if (av > bv) return sortDir === 'asc' ? 1 : -1;
  return 0;
}

function exportUsersAsCsv(users) {
  const header = [
    'User ID',
    'Name',
    'Email',
    'Mobile',
    'Student Type',
    'Education Level',
    'Gender',
    'College Name',
    'CGPA',
    'Role',
  ];
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.mobile,
    user.studentType,
    user.educationLevel,
    user.gender,
    user.collegeName,
    user.cgpa,
    user.role,
  ]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'scholarhub-users.csv';
  link.click();
}

function formatStatValue(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-IN') : 'N/A';
}

function getPageList(totalPages) {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  return [1, 2, 3, '...', totalPages];
}

function SortIcon() {
  return (
    <svg className="sort-icon" fill="none" height="11" viewBox="0 0 11 11" width="11">
      <path d="M2 4l3.5-3 3.5 3M2 7l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { users, stats, statusMessage, updateUserApproval } = useAdminUsers();

  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [roleFilter, setRoleFilter] = useState(() => searchParams.get('role') || 'all');
  const [dateRange, setDateRange] = useState(() => searchParams.get('dateRange') || 'all');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [reviewingUserId, setReviewingUserId] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState('all');
  const [pendingDateRange, setPendingDateRange] = useState('all');
  const filtersRef = useRef(null);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) setFiltersOpen(false);
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) setAdminMenuOpen(false);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const filteredSortedUsers = useMemo(() => {
    let result = users;

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((user) =>
        [
          user.name,
          user.studentType,
          user.educationLevel,
          user.gender,
          user.collegeName,
          String(user.cgpa),
          user.role,
          user.email,
          user.mobile,
          user.id,
        ].some((field) => field.toLowerCase().includes(query))
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (dateRange !== 'all') {
      const cutoffMs = Date.now() - Number.parseInt(dateRange, 10) * 24 * 60 * 60 * 1000;
      result = result.filter((user) => user.dateObj?.getTime() >= cutoffMs);
    }

    if (sortKey) {
      result = [...result].sort((a, b) => compareUsers(a, b, sortKey, sortDir));
    }

    return result;
  }, [users, search, roleFilter, dateRange, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedUsers.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageUsers = filteredSortedUsers.slice(start, start + PER_PAGE);
  const allOnPageSelected = pageUsers.length > 0 && pageUsers.every((user) => selectedIds.has(user.id));
  const activeFilterCount = (roleFilter !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openFilters = () => {
    setPendingRole(roleFilter);
    setPendingDateRange(dateRange);
    setFiltersOpen((open) => !open);
  };

  const applyFilters = () => {
    setRoleFilter(pendingRole);
    setDateRange(pendingDateRange);
    setPage(1);
    setFiltersOpen(false);
  };

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (checked) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      pageUsers.forEach((user) => {
        if (checked) next.add(user.id);
        else next.delete(user.id);
      });
      return next;
    });
  };

  const handleExport = () => {
    exportUsersAsCsv(filteredSortedUsers);
    setToastMessage('CSV exported successfully');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('scholarhub-auth-token');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('scholarhub-react-state-v1');
    navigate('/login');
  };

  const handleReviewAction = async (event, user, approvalStatus) => {
    event.stopPropagation();
    if (user.approvalStatus === approvalStatus) return;

    try {
      setReviewingUserId(user.id);
      await updateUserApproval(user.id, approvalStatus);
      setToastMessage(`${user.name} ${approvalStatus} successfully`);
    } catch (error) {
      setToastMessage(error.message || `Unable to mark ${user.name} as ${approvalStatus}.`);
    } finally {
      setReviewingUserId('');
    }
  };

  const openUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <main className="admin-dashboard-shell">
      
      <div className="admin-dashboard-page">
        
        {/* ══════════ TOPBAR ══════════ */}
        <div className="topbar">
          <div className="search-wrap">
           
            <span className="search-icon">
              <svg fill="none" height="17" viewBox="0 0 17 17" width="17">
                <circle cx="7.5" cy="7.5" r="5.2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M11.7 11.7L15 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
              </svg>
            </span>
            <input
              className="search-input"
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, mobile or user ID..."
              type="text"
              value={search}
            />
          </div>

          <div ref={filtersRef} style={{ position: 'relative' }}>
            <button className={`filter-btn${activeFilterCount > 0 ? ' active' : ''}`} onClick={openFilters} type="button">
              <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
                <path d="M2 3h12l-4.5 5.5V13L7 11.5V8.5L2 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              Filters
              {activeFilterCount > 0 ? (
                <span
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '99px',
                    marginLeft: '2px',
                  }}
                >
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            <div className={`filters-panel${filtersOpen ? ' open' : ''}`}>
              <div className="filters-panel-title">Status</div>
              <div className="filter-chip-row">
                {ROLE_CHIPS.map((chip) => (
                  <button
                    className={`filter-chip${pendingRole === chip.value ? ' selected' : ''}`}
                    key={chip.value}
                    onClick={() => setPendingRole(chip.value)}
                    type="button"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <div className="filters-panel-title">Registered</div>
              <div className="filter-chip-row">
                {DATE_CHIPS.map((chip) => (
                  <button
                    className={`filter-chip${pendingDateRange === chip.value ? ' selected' : ''}`}
                    key={chip.value}
                    onClick={() => setPendingDateRange(chip.value)}
                    type="button"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <button className="filters-apply" onClick={applyFilters} type="button">
                Apply Filters
              </button>
            </div>
          </div>

          <div className="topbar-right">
            <button className="bell-btn" onClick={() => setToastMessage('You have 5 new notifications')} type="button">
              <svg fill="none" height="21" viewBox="0 0 21 21" width="21">
                <path
                  d="M10.5 2.5c-2.5 0-4.5 2-4.5 4.5v3l-1.8 3h12.6l-1.8-3v-3c0-2.5-2-4.5-4.5-4.5Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path d="M8.7 16c.3 1 1 1.5 1.8 1.5s1.5-.5 1.8-1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="bell-badge">5</span>
            </button>

            <div ref={adminMenuRef} style={{ position: 'relative' }}>
              <div className="admin-chip" onClick={() => setAdminMenuOpen((open) => !open)}>
                <div className="admin-avatar">A</div>
                <div className="admin-info">
                  <span className="admin-name">Admin</span>
                  <span className="admin-role">Super Admin</span>
                </div>
                <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
                  <path
                    d="M3.5 5.5L7 9l3.5-3.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>
              <div className={`admin-dropdown${adminMenuOpen ? ' open' : ''}`}>
                <button className="dd-item" type="button">
                  My Profile
                </button>
                <button className="dd-item" type="button">
                  Account Settings
                </button>
                <button className="dd-item" type="button">
                  Notification Prefs
                </button>
                <button className="dd-item danger" onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {statusMessage ? (
          <div className="admin-guard-message">{statusMessage}</div>
        ) : (
          <>
            {/* ══════════ STAT CARDS ══════════ */}
            <div className="stats-row">
              {STAT_CARDS.map((card) => (
                <div className="stat-card" key={card.key}>
                  <div className="stat-top">
                    <div className="stat-icon" style={{ background: card.background }}>
                      {card.icon}
                    </div>
                    <span className="stat-label">{card.label}</span>
                  </div>
                  <div className="stat-value">{formatStatValue(stats[card.key])}</div>
                  <div className="stat-growth">
                    <span className="stat-growth-muted">N/A</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ══════════ USERS TABLE ══════════ */}
            <div className="table-card">
              <div className="table-card-head">
                <span className="table-title">All Registered Users</span>
                <button className="export-btn" onClick={handleExport} type="button">
                  <svg fill="none" height="15" viewBox="0 0 15 15" width="15">
                    <path
                      d="M7.5 1.5v8M4.5 6.5l3 3 3-3"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 11v1.5A1.5 1.5 0 003.5 14h8a1.5 1.5 0 001.5-1.5V11"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Export
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '42px' }}>
                        <input
                          checked={allOnPageSelected}
                          className="cb"
                          onChange={(event) => handleToggleSelectAll(event.target.checked)}
                          type="checkbox"
                        />
                      </th>
                      {TABLE_COLUMNS.map((column) => (
                        <th
                          className={`sortable${sortKey === column.key ? ` sorted${sortDir === 'desc' ? ' desc' : ''}` : ''}`}
                          key={column.key}
                          onClick={() => handleSortChange(column.key)}
                        >
                          <span className="th-flex">
                            {column.label} <SortIcon />
                          </span>
                        </th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageUsers.length === 0 ? (
                      <tr>
                        <td colSpan={TABLE_COLUMNS.length + 2}>
                          <div className="empty-state">
                            <svg fill="none" height="48" viewBox="0 0 48 48" width="48">
                              <circle cx="22" cy="22" r="14" stroke="#9498B3" strokeWidth="2.5" />
                              <path d="M32 32l8 8" stroke="#9498B3" strokeLinecap="round" strokeWidth="2.5" />
                            </svg>
                            <p>No users found matching your search/filters.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pageUsers.map((user) => (
                        <tr
                          className="clickable-row"
                          key={user.id}
                          onClick={() => openUserDetails(user.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              openUserDetails(user.id);
                            }
                          }}
                          tabIndex={0}
                        >
                          <td>
                            <input
                              checked={selectedIds.has(user.id)}
                              className="cb"
                              onClick={(event) => event.stopPropagation()}
                              onChange={() => handleToggleSelect(user.id)}
                              type="checkbox"
                            />
                          </td>
                          <td>
                            <div className="user-cell user-cell-link">
                              <div className="avatar" style={{ background: user.color }}>
                                {user.initials}
                              </div>
                              <span className="user-name">{user.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--subtitle)' }}>{user.studentType}</td>
                          <td style={{ color: 'var(--subtitle)' }}>{user.educationLevel}</td>
                          <td style={{ color: 'var(--subtitle)' }}>{user.gender}</td>
                          <td style={{ color: 'var(--subtitle)' }}>{user.collegeName}</td>
                          <td style={{ color: 'var(--subtitle)' }}>{user.cgpa}</td>
                          <td>
                            <span className={`status-pill ${user.roleClass || 'neutral'}`}>{user.role}</span>
                          </td>
                          <td>
                            <div className="review-cell">
                              <span className={`status-pill ${user.approvalStatusClass}`}>{user.approvalStatusLabel}</span>
                              <div className="decision-actions">
                                <button
                                  className={`decision-btn decision-btn--accept${user.approvalStatus === 'accepted' ? ' active' : ''}`}
                                  disabled={reviewingUserId === user.id}
                                  onClick={(event) => handleReviewAction(event, user, 'accepted')}
                                  type="button"
                                >
                                  Accept
                                </button>
                                <button
                                  className={`decision-btn decision-btn--reject${user.approvalStatus === 'rejected' ? ' active' : ''}`}
                                  disabled={reviewingUserId === user.id}
                                  onClick={(event) => handleReviewAction(event, user, 'rejected')}
                                  type="button"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <span className="showing-text">
                  {filteredSortedUsers.length === 0
                    ? 'No users found'
                    : `Showing ${start + 1} to ${Math.min(start + PER_PAGE, filteredSortedUsers.length)} of ${filteredSortedUsers.length.toLocaleString()} users`}
                </span>
                <div className="pagination">
                  <button
                    aria-label="Previous page"
                    className="page-btn"
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}
                    type="button"
                  >
                    <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
                      <path d="M9 11L5 7l4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </button>

                  {getPageList(totalPages).map((entry, index) =>
                    entry === '...' ? (
                      <span className="page-dots" key={`dots-${index}`}>
                        …
                      </span>
                    ) : (
                      <button
                        className={`page-btn${entry === safePage ? ' active' : ''}`}
                        key={entry}
                        onClick={() => setPage(entry)}
                        type="button"
                      >
                        {entry}
                      </button>
                    )
                  )}

                  <button
                    aria-label="Next page"
                    className="page-btn"
                    disabled={safePage === totalPages}
                    onClick={() => setPage(safePage + 1)}
                    type="button"
                  >
                    <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={`toast${toastMessage ? ' show' : ''}`}>{toastMessage}</div>
    </main>
  );
}

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload();
  });
}
