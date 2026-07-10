import { useCallback, useEffect, useRef, useState } from 'react';
import { get, put } from '../util/request';
import { URL } from '../util/api';


const AVATAR_COLORS = ['#4927EF', '#EC4899', '#F59E0B', '#16A34A', '#3B82F6', '#8B5CF6', '#EF4444', '#0EA5E9'];

function getAuthToken() {
  return localStorage.getItem('scholarhub-auth-token') || localStorage.getItem('token') || '';
}

function getAuthRole(token) {
  if (!token) return '';

  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return '';

    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(paddedBase64));
    return String(payload?.role || '').toLowerCase();
  } catch (error) {
    return '';
  }
}

function cleanValue(value, fallback = 'N/A') {
  if (value === undefined || value === null) return fallback;
  const nextValue = String(value).trim();
  return nextValue ? nextValue : fallback;
}

function getMongoCreatedAt(rawId) {
  const mongoId = typeof rawId === 'string' ? rawId.trim() : '';
  if (!/^[a-f\d]{24}$/i.test(mongoId)) return null;

  const timestampMs = parseInt(mongoId.slice(0, 8), 16) * 1000;
  const createdAt = new Date(timestampMs);
  return Number.isNaN(createdAt.getTime()) ? null : createdAt;
}

function getRecordCreatedAt(record) {
  const createdAt = record?.createdAt ? new Date(record.createdAt) : null;
  if (createdAt && !Number.isNaN(createdAt.getTime())) return createdAt;

  const updatedAt = record?.updatedAt ? new Date(record.updatedAt) : null;
  if (updatedAt && !Number.isNaN(updatedAt.getTime())) return updatedAt;

  return getMongoCreatedAt(record?._id || record?.id);
}

function getInitialsFromUser(name, email) {
  const words = String(name || email || 'User').trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return String(words[0] || 'U').slice(0, 2).toUpperCase();
}

function normalizeDashboardUser(record, index) {
  const mongoId = cleanValue(record._id || record.id);
  const rawRole = cleanValue(record.role);
  const normalizedRole = rawRole === 'N/A' ? '' : rawRole.toLowerCase();
  const fallbackApprovalStatus = normalizedRole === 'admin' ? 'accepted' : 'pending';
  const rawApprovalStatus = cleanValue(record.approvalStatus, fallbackApprovalStatus);
  const normalizedApprovalStatus = ['accepted', 'rejected', 'pending'].includes(rawApprovalStatus.toLowerCase())
    ? rawApprovalStatus.toLowerCase()
    : fallbackApprovalStatus;
  const dateObj = getRecordCreatedAt(record) || new Date(0);
  const name = cleanValue(record.name, record.email || 'N/A');
  const role = normalizedRole ? normalizedRole[0].toUpperCase() + normalizedRole.slice(1) : 'N/A';
  const roleClass = normalizedRole === 'admin' ? 'admin' : normalizedRole === 'user' ? 'user' : 'neutral';
  const approvalStatusLabel =
    normalizedApprovalStatus[0].toUpperCase() + normalizedApprovalStatus.slice(1);

  return {
    id: mongoId,
    name,
    email: cleanValue(record.email),
    mobile: cleanValue(record.mobile),
    studentType: cleanValue(record.studentType),
    educationLevel: cleanValue(record.educationLevel),
    gender: cleanValue(record.gender),
    collegeName: cleanValue(record.collegeName),
    cgpa: cleanValue(record.cgpa),
    category: cleanValue(record.category),
    dateObj,
    role,
    roleClass,
    approvalStatus: normalizedApprovalStatus,
    approvalStatusLabel,
    approvalStatusClass: normalizedApprovalStatus,
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
    initials: getInitialsFromUser(name, record.email),
  };
}

function getResponseUsers(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.users)) return payload.data.users;
  return [];
}

function getResponseStats(payload) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) return payload;
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data;
  return {};
}

function countNewUsersThisWeek(users) {
  const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return users.reduce((count, user) => (user.dateObj?.getTime() >= threshold ? count + 1 : count), 0);
}

const EMPTY_STATS = { totalUsers: null, totalApplications: null, totalScholarships: null, newUsersThisWeek: 0 };

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [statusMessage, setStatusMessage] = useState('Loading registered users...');
  const [loading, setLoading] = useState(true);
  const requestInFlightRef = useRef(null);

  const load = useCallback(() => {
    if (requestInFlightRef.current) return requestInFlightRef.current;

    const token = getAuthToken();
    if (!token) {
      setUsers([]);
      setStats(EMPTY_STATS);
      setStatusMessage('Login as admin to load registered users.');
      setLoading(false);
      return;
    }
    if (getAuthRole(token) !== 'admin') {
      setUsers([]);
      setStats(EMPTY_STATS);
      setStatusMessage('Admin access is required to load registered users.');
      setLoading(false);
      return;
    }

    setLoading(true);
    requestInFlightRef.current = (async () => {
      try {
        const payload = await get(URL.Users, { headers: { Authorization: token } });
        const registeredUsers = getResponseUsers(payload).map(normalizeDashboardUser);

        let statsPayload = {};
        try {
          statsPayload = getResponseStats(await get(URL.Stats, { headers: { Authorization: token } }));
        } catch (error) {
          statsPayload = {};
        }

        setUsers(registeredUsers);
        setStats({
          totalUsers:
            typeof statsPayload.totalUsers === 'number' ? statsPayload.totalUsers : registeredUsers.length,
          totalApplications:
            typeof statsPayload.totalApplications === 'number' ? statsPayload.totalApplications : null,
          totalScholarships:
            typeof statsPayload.totalScholarships === 'number' ? statsPayload.totalScholarships : null,
          newUsersThisWeek: countNewUsersThisWeek(registeredUsers),
        });
        setStatusMessage('');
      } catch (error) {
        setUsers([]);
        setStats(EMPTY_STATS);
        setStatusMessage(error.message || 'Unable to load registered users.');
      } finally {
        setLoading(false);
        requestInFlightRef.current = null;
      }
    })();

    return requestInFlightRef.current;
  }, []);

  const updateUserApproval = useCallback(async (userId, approvalStatus) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Login as admin to review users.');
    }

    if (getAuthRole(token) !== 'admin') {
      throw new Error('Admin access is required to review users.');
    }

    const payload = await put(
      URL.UserApproval(userId),
      { approvalStatus },
      { headers: { Authorization: token } }
    );

    const updatedUser = payload?.user;
    if (updatedUser) {
      setUsers((current) =>
        current.map((user, index) =>
          user.id === userId ? normalizeDashboardUser(updatedUser, index) : user
        )
      );
    }

    return payload;
  }, []);

  useEffect(() => {
    load();

    const refresh = () => load();
    const handleStorage = (event) => {
      if (event.key === 'scholarhub-users-updated-at') refresh();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const handleInterval = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('scholarhub:users-updated', refresh);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const intervalId = window.setInterval(handleInterval, 15000);

    return () => {
      window.removeEventListener('scholarhub:users-updated', refresh);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [load]);

  return { users, stats, statusMessage, loading, refresh: load, updateUserApproval };
}
